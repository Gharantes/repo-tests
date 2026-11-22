package br.com.synergia.libs.utilsEntities.jpa.projectJoinRequest

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProjectJoinRequestRepository : JpaRepository<ProjectJoinRequest, Long> {
    fun findByIdProjectAndIdAccount(idProject: Long, idAccount: Long): ProjectJoinRequest?
}
