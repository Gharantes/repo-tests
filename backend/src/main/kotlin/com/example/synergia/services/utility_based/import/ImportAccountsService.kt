package com.example.synergia.services.utility_based.import

import com.example.synergia.domain.Account
import com.example.synergia.repositories.AccountRepository
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.util.*

@Service
class ImportAccountsService(private val accountRepository: AccountRepository) {
    fun createAccountsFromFile(
        idTenant: Long,
        multipart: MultipartFile,
        useDecoder: Boolean
    ) {
        val tempFile = File.createTempFile("temp", null)
        tempFile.writeBytes(
            if (useDecoder) Base64.getDecoder().decode(multipart.bytes)
            else multipart.bytes
        )


        val workbook = WorkbookFactory.create(tempFile.inputStream())
        val sheet = workbook.getSheetAt(0)
        val iterator = sheet.rowIterator()

        while (iterator.hasNext()) {
            val row = iterator.next()

            val login = row.getCell(0).stringCellValue
            val password = row.getCell(1).stringCellValue

            val account = Account()
            account.idTenant = idTenant
            account.login = login
            account.password = password
            accountRepository.save(account)
        }
    }
}