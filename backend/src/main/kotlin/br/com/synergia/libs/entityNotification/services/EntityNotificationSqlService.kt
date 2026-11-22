package br.com.synergia.libs.entityNotification.services

import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.MembershipLabels
import br.com.synergia.libs.utilsEntities.jpa.notification.NotificationRepository
import br.com.synergia.libs.utilsEntities.models.NotificationDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Timestamp
import java.sql.Types
import java.time.LocalDateTime

@Service
class EntityNotificationSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val notificationRepository: NotificationRepository
) {
    fun listNotificationsOfAccount(idAccount: Long, limit: Int): List<NotificationDto> {
        val sql = SqlPath.EntityNotification.LIST_NOTIFICATIONS_OF_ACCOUNT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_account", idAccount, Types.BIGINT)
            .addValue("limit", limit, Types.INTEGER)
        return template.query(sql, paramMap, EntityRowMapper.notificationRowMapper)
    }

    fun countUnread(idAccount: Long): Long {
        return notificationRepository.countByIdAccountAndReadAtIsNull(idAccount)
    }

    /** Devolve quantas notificações foram gravadas (0 quando o autor não é Organizador). */
    fun notifyEventAudience(idEvent: Long, idActor: Long, type: ActivityTypeEnum, referenceId: Long): Int {
        val sql = SqlPath.EntityNotification.NOTIFY_EVENT_AUDIENCE.load()
        val paramMap = notifyParams(idActor, type, referenceId, MembershipLabels.EVENT_LEAD)
            .addValue("id_event", idEvent, Types.BIGINT)
        return template.update(sql, paramMap)
    }

    /** Devolve quantas notificações foram gravadas (0 quando o autor não é Líder). */
    fun notifyProjectAudience(idProject: Long, idActor: Long, type: ActivityTypeEnum, referenceId: Long): Int {
        val sql = SqlPath.EntityNotification.NOTIFY_PROJECT_AUDIENCE.load()
        val paramMap = notifyParams(idActor, type, referenceId, MembershipLabels.PROJECT_LEAD)
            .addValue("id_project", idProject, Types.BIGINT)
        return template.update(sql, paramMap)
    }

    private fun notifyParams(idActor: Long, type: ActivityTypeEnum, referenceId: Long, leadLabel: String) =
        MapSqlParameterSource()
            .addValue("id_actor", idActor, Types.BIGINT)
            .addValue("type", type.name, Types.VARCHAR)
            .addValue("reference_id", referenceId, Types.BIGINT)
            .addValue("lead_label", leadLabel, Types.VARCHAR)
            .addValue("now", Timestamp.valueOf(LocalDateTime.now()), Types.TIMESTAMP)

    /** Só marca se a notificação for da própria conta. */
    fun markAsRead(idNotification: Long, idAccount: Long) {
        val notification = notificationRepository.findById(idNotification)
            .orElseThrow { NoSuchElementException("Notificação $idNotification não existe.") }
        require(notification.idAccount == idAccount) { "Notificação pertence a outro usuário." }
        if (notification.readAt != null) return
        notification.readAt = LocalDateTime.now()
        notificationRepository.save(notification)
    }

    fun markAllAsRead(idAccount: Long) {
        notificationRepository.markAllAsRead(idAccount, LocalDateTime.now())
    }

    fun deleteOfPost(idPost: Long) {
        notificationRepository.deleteByReference(listOf(ActivityTypeEnum.POST), idPost)
    }

    fun deleteOfNote(idNote: Long) {
        notificationRepository.deleteByReference(listOf(ActivityTypeEnum.NOTE, ActivityTypeEnum.LIST), idNote)
    }
}
