package br.com.synergia.libs.entityJoinRequest.services

import br.com.synergia.libs.entityMessage.services.EntityMessageService
import br.com.synergia.libs.entityNotification.services.EntityNotificationService
import br.com.synergia.libs.entityProject.services.EntityProjectSqlService
import br.com.synergia.libs.utilsCommons.enums.JoinRequestStatusEnum
import br.com.synergia.libs.utilsCommons.enums.MembershipLabels
import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.project.ProjectRepository
import br.com.synergia.libs.utilsEntities.jpa.projectAccountRelationship.ProjectAccountRelationshipRepository
import br.com.synergia.libs.utilsEntities.jpa.projectJoinRequest.ProjectJoinRequest
import br.com.synergia.libs.utilsEntities.jpa.projectJoinRequest.ProjectJoinRequestRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Pedido para participar de um projeto, feito a partir do card do projeto em Explorar.
 * Quem pede escreve uma apresentação (o que quer fazer, o que sabe fazer), que vai como mensagem
 * para o grupo do projeto em Mensagens, marcada como de um futuro membro. Todos os membros também
 * recebem o aviso (sino e dashboard) e qualquer um deles pode aceitar ou recusar, pelo aviso ou pela
 * própria mensagem. Quando um responde, o aviso some para todos; aceitar avisa quem pediu.
 */
@Service
class EntityJoinRequestService (
    private val requestRepository: ProjectJoinRequestRepository,
    private val projectRepository: ProjectRepository,
    private val accountRepository: AccountRepository,
    private val membershipRepository: ProjectAccountRelationshipRepository,
    private val projectSqlService: EntityProjectSqlService,
    private val notificationService: EntityNotificationService,
    private val messageService: EntityMessageService
) {
    fun hasPendingRequest(idProject: Long, idAccount: Long): Boolean {
        return requestRepository.findByIdProjectAndIdAccount(idProject, idAccount) != null
    }

    /** Pedir de novo enquanto o primeiro está pendente não duplica, nem avisa ou posta outra vez. */
    @Transactional(rollbackFor = [Exception::class])
    fun requestToJoin(idProject: Long, idAccount: Long, message: String): Long {
        require(message.isNotBlank()) { "Conte aos membros o que você quer fazer no projeto." }
        val project = projectRepository.findById(idProject).orElseThrow { NoSuchElementException("Projeto $idProject não existe.") }
        val account = accountRepository.findById(idAccount).orElseThrow { NoSuchElementException("Conta $idAccount não existe.") }
        require(project.idTenant == account.idTenant) { "Projeto de outra instituição." }
        require(!membershipRepository.existsByIdProjectAndIdAccount(idProject, idAccount)) { "Você já participa deste projeto." }
        requestRepository.findByIdProjectAndIdAccount(idProject, idAccount)?.let { return it.id!! }
        val request = requestRepository.save(ProjectJoinRequest(idTenant = project.idTenant, idProject = idProject, idAccount = idAccount))
        notificationService.notifyJoinRequest(idProject, idAccount, request.id!!)
        messageService.postJoinRequest(idProject, idAccount, request.id!!, message)
        return request.id!!
    }

    /** Quem pediu desiste. Sem pedido pendente, não faz nada. */
    @Transactional(rollbackFor = [Exception::class])
    fun cancelRequest(idProject: Long, idAccount: Long) {
        val request = requestRepository.findByIdProjectAndIdAccount(idProject, idAccount) ?: return
        messageService.withdrawJoinRequest(request.id!!)
        close(request)
    }

    /** Qualquer membro do projeto aceita: quem pediu entra como Integrante e é avisado. */
    @Transactional(rollbackFor = [Exception::class])
    fun acceptRequest(idRequest: Long, idActor: Long) {
        val request = getRequestAsMember(idRequest, idActor)
        if (!membershipRepository.existsByIdProjectAndIdAccount(request.idProject, request.idAccount)) {
            projectSqlService.createProjectAccountRelationship(request.idAccount, request.idProject, MembershipLabels.PROJECT_MEMBER)
        }
        messageService.closeJoinRequest(request.id!!, JoinRequestStatusEnum.ACCEPTED)
        close(request)
        notificationService.notifyJoinAccepted(request.idTenant, request.idProject, idActor, request.idAccount)
    }

    @Transactional(rollbackFor = [Exception::class])
    fun declineRequest(idRequest: Long, idActor: Long) {
        val request = getRequestAsMember(idRequest, idActor)
        messageService.closeJoinRequest(request.id!!, JoinRequestStatusEnum.DECLINED)
        close(request)
    }

    private fun getRequestAsMember(idRequest: Long, idActor: Long): ProjectJoinRequest {
        val request = requestRepository.findById(idRequest)
            .orElseThrow { NoSuchElementException("Este pedido já foi respondido.") }
        require(membershipRepository.existsByIdProjectAndIdAccount(request.idProject, idActor)) {
            "Só quem participa do projeto pode responder ao pedido."
        }
        return request
    }

    private fun close(request: ProjectJoinRequest) {
        notificationService.deleteOfJoinRequest(request.id!!)
        requestRepository.delete(request)
    }
}
