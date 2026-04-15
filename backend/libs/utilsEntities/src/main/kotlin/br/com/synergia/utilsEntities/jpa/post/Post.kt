package br.com.synergia.utilsEntities.jpa.post

import jakarta.persistence.*

@Entity
@Table(name = "post")
class Post(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_account", nullable = false)
    var idAccount: Long = 0L,

    @Column(name = "title", nullable = false)
    var title: String = "",

    @Column(name = "content", nullable = false)
    var content: String = ""
)