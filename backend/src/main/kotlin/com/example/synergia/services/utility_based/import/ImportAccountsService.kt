package com.example.synergia.services.utility_based.import

import com.example.synergia.domain.Person
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.util.*

@Service
class ImportAccountsService {
    fun createAccountsFromFile(
        multipart: MultipartFile,
        useDecoder: Boolean
    ) {
//        val tempFile = File.createTempFile("temp", null)
//        tempFile.writeBytes(
//            if (useDecoder) Base64.getDecoder().decode(multipart.bytes)
//            else multipart.bytes
//        )
//
//        val workbook = createWorkbook(tempFile)
//        val sheet = workbook.getSheetAt(0)
//        val iterator = sheet.rowIterator()
//
//        while (iterator.hasNext()) {
//            val row = iterator.next()
//
//            val name = row.getCell(0).stringCellValue
//            val email = row.getCell(1).stringCellValue
//
//            val person = Person()
//            person.name = name
//            person.surname = email
//            personRepository.save(person)
//        }
    }
}