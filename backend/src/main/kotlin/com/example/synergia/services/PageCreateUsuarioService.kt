package com.example.synergia.services

import com.example.synergia.domain.AccountEntity
import com.example.synergia.domain.PersonEntity
import com.example.synergia.domainRepositories.AccountRepository
import com.example.synergia.domainRepositories.PersonRepository
import com.example.synergia.rest.pageCreateUsuario.dto.input.CreateUsuarioDto
import com.example.synergia.rest.pageCreateUsuario.dto.input.UpdateUsuarioDto
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull
import kotlin.math.log

@Service
class PageCreateUsuarioService (
    private val accountRepository: AccountRepository,
    private val personRepository: PersonRepository
) {
    fun createUsuario(params: CreateUsuarioDto) {
        var accountEntity = AccountEntity()
        accountEntity.idTenant = params.idTenant
        accountEntity.createdAt = LocalDateTime.now()
        accountEntity.login = params.login
        accountEntity.password = params.password
        accountEntity = accountRepository.save(accountEntity)

        updatePerson(params.idTenant, accountEntity.id!!, params.firstName, params.lastName)
    }

    fun updateUser(params: UpdateUsuarioDto) {
        val accountEntity = accountRepository.findById(params.id).get()
        accountEntity.login = params.login
        accountEntity.password = params.password
        accountEntity.updatedAt = LocalDateTime.now()
        accountRepository.save(accountEntity)

        if (!params.firstName.isBlank()) {
            updatePerson(params.idTenant, params.id, params.firstName, params.lastName)
        }
    }
    private fun updatePerson(
        idTenant: Long,
        idAccount: Long,
        firstName: String,
        lastName: String
    ) {
        val personEntity = personRepository.findByIdAccount(idAccount).getOrNull() ?: PersonEntity()
        personEntity.idTenant = idTenant
        personEntity.firstName = firstName
        personEntity.lastName = lastName
        personEntity.idAccount = idAccount
        personRepository.save(personEntity)
    }

    fun getCreateUsuarioDtoById(id: Long): CreateUsuarioDto? {
        val accountEntity = accountRepository.findById(id).get()
        val personEntity = personRepository.findById(accountEntity.id!!).getOrNull()
        return CreateUsuarioDto(
            idTenant = accountEntity.idTenant!!,
            login = accountEntity.login ?: "",
            password = accountEntity.password ?: "",
            firstName = personEntity?.firstName ?: "",
            lastName = personEntity?.lastName ?: ""
        )
    }
}