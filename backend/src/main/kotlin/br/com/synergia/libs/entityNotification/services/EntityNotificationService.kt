package br.com.synergia.libs.entityNotification.services

import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.models.NotificationDto
import org.springframework.stereotype.Service

/**
 * Sino do topo. Quando o Organizador de um evento posta no feed ou vincula uma nota/lista à lousa
 * do evento, quem participa do evento é avisado. O mesmo vale para o Líder de um projeto e a lousa
 * do projeto. Data marcada no calendário avisa quem é de um projeto envolvido, seja quem marcou
 * Líder ou não (ver [notifyCalendarEntry]). O autor nunca recebe aviso do que ele mesmo fez.
 */
@Service
class EntityNotificationService (
    private val sqlService: EntityNotificationSqlService
) {
    fun listNotificationsOfAccount(idAccount: Long, limit: Int?): List<NotificationDto> {
        return sqlService.listNotificationsOfAccount(idAccount, (limit ?: DEFAULT_LIMIT).coerceIn(1, MAX_LIMIT))
    }

    fun countUnread(idAccount: Long): Long {
        return sqlService.countUnread(idAccount)
    }

    fun markAsRead(idNotification: Long, idAccount: Long) {
        sqlService.markAsRead(idNotification, idAccount)
    }

    fun markAllAsRead(idAccount: Long) {
        sqlService.markAllAsRead(idAccount)
    }

    fun notifyActivity(parentEntity: NoteParentEnum, parentId: Long, idActor: Long, type: ActivityTypeEnum, referenceId: Long) {
        when (parentEntity) {
            NoteParentEnum.EVENT -> sqlService.notifyEventAudience(parentId, idActor, type, referenceId)
            NoteParentEnum.PROJECT -> sqlService.notifyProjectAudience(parentId, idActor, type, referenceId)
        }
    }

    /**
     * Data no calendário de um projeto: avisa os membros do projeto. Data no calendário de um
     * evento: avisa os membros dos projetos registrados no evento (cada pessoa uma vez só).
     */
    fun notifyCalendarEntry(parentEntity: NoteParentEnum, parentId: Long, idActor: Long, idEntry: Long) {
        sqlService.notifyCalendarAudience(parentEntity, parentId, idActor, idEntry)
    }

    /** Pedido para participar: avisa todos os membros do projeto, que podem aceitar ou recusar. */
    fun notifyJoinRequest(idProject: Long, idRequester: Long, idRequest: Long) {
        sqlService.notifyJoinRequestAudience(idProject, idRequester, idRequest)
    }

    /** Pedido aceito: avisa só quem pediu. */
    fun notifyJoinAccepted(idTenant: Long, idProject: Long, idActor: Long, idRequester: Long) {
        sqlService.notifyJoinAccepted(idTenant, idProject, idActor, idRequester)
    }

    fun deleteOfPost(idPost: Long) = sqlService.deleteOfPost(idPost)
    fun deleteOfJoinRequest(idRequest: Long) = sqlService.deleteOfJoinRequest(idRequest)
    fun deleteOfCalendarEntry(idEntry: Long) = sqlService.deleteOfCalendarEntry(idEntry)
    fun deleteOfNote(idNote: Long) = sqlService.deleteOfNote(idNote)

    companion object {
        const val DEFAULT_LIMIT = 20
        const val MAX_LIMIT = 100
    }
}
