package br.com.synergia.libs.utilsEntities.jpa.project

import br.com.synergia.libs.utilsCommons.enums.ColorsEnum
import jakarta.persistence.*

@Entity
@Table(name = "project")
class Project(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_tenant", nullable = false)
    val idTenant: Long = 0L,

    @Column(name = "title", nullable = false, length = 255)
    var title: String = "",

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    var description: String = "",

    @Column(name = "banner_url", length = 255)
    var bannerUrl: String? = null,

    @Column(name = "banner_color", nullable = false, length = 7)
    var bannerColor: String = ColorsEnum.randomHex()
)