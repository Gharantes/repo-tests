package br.com.synergia.libs.utilsEntities.jpa.calendarEntry

import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * Data marcada no calendário de um projeto ou evento. Pertence a um só dono, que nunca muda.
 * As datas de um evento também aparecem nos projetos registrados nele; as do projeto ficam só nele.
 */
@Entity
@Table(
    name = "calendar_entry",
    indexes = [Index(name = "ix_calendar_entry_parent", columnList = "parent_entity, parent_id, date")]
)
class CalendarEntry(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_tenant", nullable = false)
    val idTenant: Long = 0L,

    /** Quem criou. Qualquer membro do dono pode editar ou apagar. */
    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Enumerated(EnumType.STRING)
    @Column(name = "parent_entity", nullable = false, length = 10)
    val parentEntity: NoteParentEnum = NoteParentEnum.EVENT,

    @Column(name = "parent_id", nullable = false)
    val parentId: Long = 0L,

    @Column(name = "date", nullable = false)
    var date: LocalDate = LocalDate.now(),

    @Column(name = "title", nullable = false, length = 255)
    var title: String = "",

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    var description: String = "",

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
