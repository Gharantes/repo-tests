package br.com.synergia.libs.utilsEntities.jpa.sessao

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

/**
 * Sessão aberta por um login com senha. O token só existe no navegador; aqui fica
 * o hash SHA-256 dele, então quem lê a tabela não consegue se passar por ninguém.
 */
@Entity
@Table(name = "sessao")
class Sessao(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    val tokenHash: String = "",

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Column(name = "id_tenant", nullable = false)
    val idTenant: Long = 0L,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "expira_em", nullable = false)
    var expiraEm: LocalDateTime = LocalDateTime.now(),
)

@Repository
interface SessaoRepository : JpaRepository<Sessao, Long> {
    /** A sessão do token, só se a conta dela ainda existir na mesma instituição. Uma consulta só. */
    @Query(
        "SELECT s FROM Sessao s WHERE s.tokenHash = :tokenHash AND EXISTS " +
            "(SELECT 1 FROM Account a WHERE a.id = s.idAccount AND a.idTenant = s.idTenant)"
    )
    fun findValida(tokenHash: String): Sessao?

    @Modifying
    @Transactional
    @Query("DELETE FROM Sessao s WHERE s.tokenHash = :tokenHash")
    fun deleteByTokenHash(tokenHash: String): Int

    @Modifying
    @Transactional
    @Query("DELETE FROM Sessao s WHERE s.idAccount = :idAccount")
    fun deleteByIdAccount(idAccount: Long): Int

    @Modifying
    @Transactional
    @Query("DELETE FROM Sessao s WHERE s.expiraEm < :agora")
    fun apagarExpiradas(agora: LocalDateTime): Int
}
