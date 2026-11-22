package br.com.synergia.libs.utilsEntities.jpa.projectJoinRequest

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Pedido de [idAccount] para entrar no projeto [idProject]. Só existe enquanto está pendente:
 * aceitar (vira membro), recusar ou cancelar apaga a linha. Uma conta tem no máximo um pedido
 * pendente por projeto.
 */
@Entity
@Table(
    name = "project_join_request",
    uniqueConstraints = [UniqueConstraint(name = "uq_project_join_request", columnNames = ["id_project", "id_account"])]
)
class ProjectJoinRequest(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_tenant", nullable = false)
    val idTenant: Long = 0L,

    @Column(name = "id_project", nullable = false)
    val idProject: Long = 0L,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
