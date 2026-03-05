package br.com.synergia.pageUpsertUsuario.services

import kotlin.jvm.optionals.getOrNull

@Service
class PagUpsertUsuarioService (
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
        val personEntity = personRepository.findByIdAccount(accountEntity.id!!).getOrNull()
        return CreateUsuarioDto(
            idTenant = accountEntity.idTenant!!,
            login = accountEntity.login ?: "",
            password = accountEntity.password ?: "",
            firstName = personEntity?.firstName ?: "",
            lastName = personEntity?.lastName ?: ""
        )
    }
}