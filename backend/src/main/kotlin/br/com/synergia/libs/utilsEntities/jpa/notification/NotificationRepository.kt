package br.com.synergia.libs.utilsEntities.jpa.notification

import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface NotificationRepository : JpaRepository<Notification, Long> {
    fun countByIdAccountAndReadAtIsNull(idAccount: Long): Long

    @Transactional
    @Modifying
    @Query("UPDATE Notification n SET n.readAt = :now WHERE n.idAccount = :idAccount AND n.readAt IS NULL")
    fun markAllAsRead(idAccount: Long, now: LocalDateTime): Int

    @Transactional
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.type IN :types AND n.referenceId = :referenceId")
    fun deleteByReference(types: Collection<ActivityTypeEnum>, referenceId: Long): Int
}
