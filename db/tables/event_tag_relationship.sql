@Entity
@Table(
    name = "event_tag_relationship",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_event_tag_relationship_id_event_id_tag",
            columnNames = ["id_event", "id_tag"]
        )
    ])
class EventTagRelationshipEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null

    @Column(name = "id_event", nullable = false)
    var idEvent: Long? = null

    @Column(name = "id_tag", nullable = false)
    var idTag: Long? = null
}