package br.com.synergia.libs.utilsEntities.jpa.account

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
interface AccountRepository : JpaRepository<Account, Long> {
    /** Apaga só se for da instituição. Devolve quantas linhas apagou (0 ou 1). Uma consulta só. */
    @Modifying
    @Transactional
    @Query("DELETE FROM Account a WHERE a.id = :id AND a.idTenant = :idTenant")
    fun apagarDaInstituicao(id: Long, idTenant: Long): Int
}