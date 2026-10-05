package br.com.synergia.libs.utilsEntities.jpa.note

import br.com.synergia.libs.utilsCommons.enums.NoteTypeEnum
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "note")
class Note(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_tenant", nullable = false)
    val idTenant: Long = 0L,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 10)
    val type: NoteTypeEnum = NoteTypeEnum.TEXT,

    @Column(name = "title", nullable = false, length = 255)
    var title: String = "",

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    var content: String = "",

    // Itens da lista em JSON: [{"text": "...", "done": false}]
    @Column(name = "items", nullable = false, columnDefinition = "TEXT")
    var items: String = "[]",

    @Column(name = "color", nullable = false, length = 20)
    var color: String = "padrao",

    @Column(name = "pinned", nullable = false)
    var pinned: Boolean = false,

    @Column(name = "archived_at")
    var archivedAt: LocalDateTime? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
