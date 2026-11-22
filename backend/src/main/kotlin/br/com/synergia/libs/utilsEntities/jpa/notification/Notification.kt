package br.com.synergia.libs.utilsEntities.jpa.notification

import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Aviso para [idAccount] de que [idActor] publicou algo (postagem, nota ou lista) num evento/projeto.
 * [referenceId] aponta para o post ou a note; os títulos são lidos na listagem, não copiados aqui.
 */
@Entity
@Table(
    name = "notification",
    indexes = [Index(name = "ix_notification_id_account", columnList = "id_account, created_at")]
)
class Notification(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_tenant", nullable = false)
    val idTenant: Long = 0L,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Column(name = "id_actor", nullable = false)
    val idActor: Long = 0L,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 10)
    val type: ActivityTypeEnum = ActivityTypeEnum.POST,

    @Enumerated(EnumType.STRING)
    @Column(name = "parent_entity", nullable = false, length = 10)
    val parentEntity: NoteParentEnum = NoteParentEnum.EVENT,

    @Column(name = "parent_id", nullable = false)
    val parentId: Long = 0L,

    @Column(name = "reference_id", nullable = false)
    val referenceId: Long = 0L,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "read_at")
    var readAt: LocalDateTime? = null
)
