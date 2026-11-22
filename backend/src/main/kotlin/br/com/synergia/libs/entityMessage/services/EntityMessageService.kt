package br.com.synergia.libs.entityMessage.services

import br.com.synergia.libs.entityMessage.models.SendMessageDto
import br.com.synergia.libs.utilsCommons.enums.ConversationTypeEnum
import br.com.synergia.libs.utilsCommons.enums.JoinRequestStatusEnum
import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.conversation.Conversation
import br.com.synergia.libs.utilsEntities.jpa.eventAccountRelationship.EventAccountRelationshipRepository
import br.com.synergia.libs.utilsEntities.jpa.project.ProjectRepository
import br.com.synergia.libs.utilsEntities.jpa.projectAccountRelationship.ProjectAccountRelationshipRepository
import br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship.ProjectEventRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.ConversationDto
import br.com.synergia.libs.utilsEntities.models.ConversationMemberDto
import br.com.synergia.libs.utilsEntities.models.MessageContactDto
import br.com.synergia.libs.utilsEntities.models.MessageDto
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Tela Mensagens. Três tipos de conversa (ver [ConversationTypeEnum]):
 * - grupo do projeto: todo membro do projeto participa, sem precisar ser adicionado;
 * - conversa privada: entre colegas de projeto, ou entre um membro de projeto e um membro de um
 *   evento em que o projeto está registrado;
 * - grupo projeto + evento: os membros do projeto e as pessoas do evento que eles adicionarem
 *   (ex.: o Organizador), para o projeto todo falar com quem cuida do evento.
 * Não há tempo real: a tela relê as mensagens novas de tempos em tempos.
 */
@Service
class EntityMessageService (
    private val sqlService: EntityMessageSqlService,
    private val accountRepository: AccountRepository,
    private val projectRepository: ProjectRepository,
    private val projectMembers: ProjectAccountRelationshipRepository,
    private val eventMembers: EventAccountRelationshipRepository,
    private val projectEvents: ProjectEventRelationshipRepository
) {
    /** O grupo de cada projeto da conta é criado aqui na primeira vez em que ela abre a lista. */
    fun listConversations(idAccount: Long): List<ConversationDto> {
        ensureProjectConversations(idAccount)
        return sqlService.listConversations(idAccount)
    }

    fun countUnread(idAccount: Long): Int {
        return sqlService.listConversations(idAccount).sumOf { it.unreadCount }
    }

    fun listContacts(idAccount: Long): List<MessageContactDto> {
        return sqlService.listContacts(idAccount)
    }

    fun listMembers(idConversation: Long, idAccount: Long): List<ConversationMemberDto> {
        getConversationAsParticipant(idConversation, idAccount)
        return sqlService.listMembers(idConversation)
    }

    /**
     * Sem `afterId`/`beforeId`, as [limit] mais recentes. Com `afterId`, só as que chegaram depois
     * (releitura periódica). Com `beforeId`, as anteriores (rolar para cima).
     */
    fun listMessages(idConversation: Long, idAccount: Long, afterId: Long?, beforeId: Long?, limit: Int?): List<MessageDto> {
        getConversationAsParticipant(idConversation, idAccount)
        val size = (limit ?: DEFAULT_PAGE).coerceIn(1, MAX_PAGE)
        return sqlService.listMessages(idConversation, afterId, beforeId, size)
    }

    /** Envia e já marca como lida para quem enviou. */
    @Transactional(rollbackFor = [Exception::class])
    fun sendMessage(idConversation: Long, params: SendMessageDto): MessageDto {
        val content = requireMessageContent(params.content)
        getConversationAsParticipant(idConversation, params.idAccount)
        val author = accountRepository.findById(params.idAccount)
            .orElseThrow { NoSuchElementException("Conta ${params.idAccount} não existe.") }
        val message = sqlService.createMessage(idConversation, params.idAccount, content)
        sqlService.markAsRead(idConversation, params.idAccount)
        return MessageDto(
            id = message.id!!,
            idConversation = idConversation,
            idAccount = params.idAccount,
            authorName = "${author.firstName} ${author.lastName}",
            content = message.content,
            createdAt = message.createdAt
        )
    }

    fun markAsRead(idConversation: Long, idAccount: Long) {
        getConversationAsParticipant(idConversation, idAccount)
        sqlService.markAsRead(idConversation, idAccount)
    }

    /**
     * Abre (ou cria) a conversa privada com [idOther]. Só entre contatos (ver [listContacts]);
     * uma conversa que já existe continua aberta para as duas pessoas mesmo que deixem de ser contatos.
     */
    @Transactional(rollbackFor = [Exception::class])
    fun openDirectConversation(idAccount: Long, idOther: Long): Long {
        require(idAccount != idOther) { "Escolha outra pessoa para conversar." }
        val key = Conversation.directKey(idAccount, idOther)
        sqlService.findConversation(key)?.let { return it.id!! }
        require(sqlService.listContacts(idAccount).any { it.idAccount == idOther }) {
            "Conversa privada só com colegas de projeto ou com pessoas dos eventos dos seus projetos."
        }
        val account = accountRepository.findById(idAccount).orElseThrow { NoSuchElementException("Conta $idAccount não existe.") }
        val idConversation = sqlService.createConversation(account.idTenant, ConversationTypeEnum.DIRECT, key, idAccount).id!!
        sqlService.addMember(idConversation, idAccount, idAccount)
        sqlService.addMember(idConversation, idOther, idAccount)
        return idConversation
    }

    /** Abre (ou cria) o grupo do projeto com o evento. Qualquer membro do projeto pode. */
    fun openProjectEventConversation(idProject: Long, idEvent: Long, idAccount: Long): Long {
        requireProjectMember(idProject, idAccount, "Só membros do projeto abrem o grupo com o evento.")
        require(projectEvents.existsByIdProjectAndIdEvent(idProject, idEvent)) { "O projeto não está registrado neste evento." }
        val project = projectRepository.findById(idProject).orElseThrow { NoSuchElementException("Projeto $idProject não existe.") }
        val key = Conversation.projectEventKey(idProject, idEvent)
        return findOrCreate(key) {
            sqlService.createConversation(project.idTenant, ConversationTypeEnum.PROJECT_EVENT, key, idAccount, idProject, idEvent)
        }.id!!
    }

    /** Um membro do projeto adiciona ao grupo com o evento alguém que participa do evento. */
    @Transactional(rollbackFor = [Exception::class])
    fun addMember(idConversation: Long, idActor: Long, idMember: Long) {
        val conversation = getProjectEventConversation(idConversation)
        val idProject = conversation.idProject!!
        val idEvent = conversation.idEvent!!
        requireProjectMember(idProject, idActor, "Só membros do projeto adicionam pessoas ao grupo.")
        require(projectEvents.existsByIdProjectAndIdEvent(idProject, idEvent)) {
            "O projeto não está mais registrado neste evento."
        }
        require(eventMembers.existsByIdEventAndIdAccount(idEvent, idMember)) {
            "Só pessoas do evento podem ser adicionadas."
        }
        require(!projectMembers.existsByIdProjectAndIdAccount(idProject, idMember)) {
            "Essa pessoa já está no grupo por ser membro do projeto."
        }
        sqlService.addMember(idConversation, idMember, idActor)
    }

    /** Membros do projeto tiram pessoas do evento do grupo; a própria pessoa também pode sair. */
    @Transactional(rollbackFor = [Exception::class])
    fun removeMember(idConversation: Long, idActor: Long, idMember: Long) {
        val conversation = getProjectEventConversation(idConversation)
        if (idActor != idMember) {
            requireProjectMember(conversation.idProject!!, idActor, "Só membros do projeto tiram pessoas do grupo.")
        }
        sqlService.removeMember(idConversation, idMember)
    }

    /**
     * Apresentação de quem pediu para participar: vai para o grupo do projeto, mesmo a pessoa ainda
     * não sendo membro (ela não passa a ver o grupo por isso). Quem chama já validou o pedido.
     */
    fun postJoinRequest(idProject: Long, idRequester: Long, idRequest: Long, content: String) {
        val text = requireMessageContent(content)
        val project = projectRepository.findById(idProject).orElseThrow { NoSuchElementException("Projeto $idProject não existe.") }
        val conversation = projectConversation(project.idTenant, idProject, idRequester)
        sqlService.createMessage(conversation.id!!, idRequester, text, idRequest, JoinRequestStatusEnum.PENDING)
    }

    /** Pedido respondido: a apresentação fica no grupo, marcada como aceita ou recusada. */
    fun closeJoinRequest(idRequest: Long, status: JoinRequestStatusEnum) {
        sqlService.setJoinRequestStatus(idRequest, status)
    }

    /** Quem pediu desistiu: a apresentação sai do grupo. */
    fun withdrawJoinRequest(idRequest: Long) {
        sqlService.deleteJoinRequestMessage(idRequest)
    }

    private fun requireMessageContent(content: String): String {
        val text = content.trim()
        require(text.isNotEmpty()) { "A mensagem está vazia." }
        require(text.length <= MAX_LENGTH) { "A mensagem passa de $MAX_LENGTH caracteres." }
        return text
    }

    private fun projectConversation(idTenant: Long, idProject: Long, idCreator: Long): Conversation {
        val key = Conversation.projectKey(idProject)
        return findOrCreate(key) {
            sqlService.createConversation(idTenant, ConversationTypeEnum.PROJECT, key, idCreator, idProject)
        }
    }

    private fun ensureProjectConversations(idAccount: Long) {
        projectMembers.findAllByIdAccount(idAccount).forEach { membership ->
            if (sqlService.findConversation(Conversation.projectKey(membership.idProject)) != null) return@forEach
            val project = projectRepository.findById(membership.idProject).orElse(null) ?: return@forEach
            projectConversation(project.idTenant, membership.idProject, idAccount)
        }
    }

    /** Duas abas abrindo a mesma conversa ao mesmo tempo: a segunda esbarra na unique_key e relê. */
    private fun findOrCreate(key: String, create: () -> Conversation): Conversation {
        sqlService.findConversation(key)?.let { return it }
        return try {
            create()
        } catch (e: DataIntegrityViolationException) {
            sqlService.findConversation(key) ?: throw e
        }
    }

    private fun getConversationAsParticipant(idConversation: Long, idAccount: Long): Conversation {
        val conversation = sqlService.getConversation(idConversation)
        val canAccess = when (conversation.type) {
            ConversationTypeEnum.PROJECT ->
                projectMembers.existsByIdProjectAndIdAccount(conversation.idProject!!, idAccount)
            ConversationTypeEnum.PROJECT_EVENT ->
                projectMembers.existsByIdProjectAndIdAccount(conversation.idProject!!, idAccount) ||
                    sqlService.isMember(idConversation, idAccount)
            ConversationTypeEnum.DIRECT -> sqlService.isMember(idConversation, idAccount)
        }
        require(canAccess) { "Você não participa desta conversa." }
        return conversation
    }

    private fun getProjectEventConversation(idConversation: Long): Conversation {
        val conversation = sqlService.getConversation(idConversation)
        require(conversation.type == ConversationTypeEnum.PROJECT_EVENT) {
            "Só o grupo do projeto com um evento aceita pessoas adicionadas."
        }
        return conversation
    }

    private fun requireProjectMember(idProject: Long, idAccount: Long, message: String) {
        require(projectMembers.existsByIdProjectAndIdAccount(idProject, idAccount)) { message }
    }

    companion object {
        const val MAX_LENGTH = 4000
        const val DEFAULT_PAGE = 50
        const val MAX_PAGE = 200
    }
}
