@Entity
@Table(
    name = "project_tag_relationship",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_project_tag_relationship_id_project_id_tag",
            columnNames = ["id_project", "id_tag"]
        )
    ])
class ProjectTagRelationshipEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null

    @Column(name = "id_project", nullable = false)
    var idProject: Long? = null

    @Column(name = "id_tag", nullable = false)
    var idTag: Long? = null
}