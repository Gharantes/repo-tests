package com.example.synergia.services

import com.example.synergia.domain.Person
import com.example.synergia.dto.entity_mirror.AccountDto
import com.example.synergia.mappers.AccountMapper
import com.example.synergia.repositories.AccountRepository
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileInputStream
import java.util.Base64
import org.apache.poi.xssf.usermodel.XSSFWorkbook


@Service
class AccountService (
    private val accountRepository: AccountRepository,
) {
    fun getById(idTenant: Long, id: Long): AccountDto? {
        return accountRepository.findByIdTenantAndId(
            idTenant,
            id
        )?.let {
            AccountMapper().entityToAccountDto(it)
        }
    }
    fun getAll(idTenant: Long): List<AccountDto> {
        return accountRepository.findAllByIdTenant(idTenant).map {
            AccountMapper().entityToAccountDto(it)
        }
    }
}
