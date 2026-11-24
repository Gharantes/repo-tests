package br.com.synergia.libs.utilsEntities.jpa.tag

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
interface TagRepository : JpaRepository<Tag, Long> {
    /** Apaga só se for da instituição. Devolve quantas linhas apagou (0 ou 1). Uma consulta só. */
    @Modifying
    @Transactional
    @Query("DELETE FROM Tag t WHERE t.id = :id AND t.idTenant = :idTenant")
    fun apagarDaInstituicao(id: Long, idTenant: Long): Int
}