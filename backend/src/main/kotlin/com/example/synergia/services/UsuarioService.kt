package com.example.synergia.services

import com.example.synergia.domain.Pessoa
import com.example.synergia.dto.entity_mirror.UsuarioDto
import com.example.synergia.repositories.PersonRepository
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileInputStream
import java.util.Base64
import org.apache.poi.xssf.usermodel.XSSFWorkbook


@Service
class UsuarioService (
    private val personRepository: PersonRepository
) {
    fun getById(idUsuario: Long): UsuarioDto? {
        return null
    }
    fun getAll(): List<UsuarioDto> {
        return personRepository.findAll().map {
            UsuarioDto(name = it.name ?: "", email = it.surname ?: "", idUsuario = it.id ?: 1, permissoes = listOf())
        }
    }
    fun createUsersFromFile(
        multipart: MultipartFile,
        useDecoder: Boolean
    ) {
        val tempFile = File.createTempFile("temp", null)
        tempFile.writeBytes(
            if (useDecoder) Base64.getDecoder().decode(multipart.bytes)
            else multipart.bytes
        )

        val workbook = createWorkbook(tempFile)
        val sheet = workbook.getSheetAt(0)
        val iterator = sheet.rowIterator()

        while (iterator.hasNext()) {
            val row = iterator.next()

            val name = row.getCell(0).stringCellValue
            val email = row.getCell(1).stringCellValue

            val person = Pessoa()
            person.name = name
            person.surname = email
            personRepository.save(person)
        }
    }

    private fun createWorkbook(file: File): XSSFWorkbook {
        val workbook: XSSFWorkbook
        FileInputStream(file).use { fis ->
            workbook = XSSFWorkbook(fis)
        }
        return workbook
    }

    fun exportUsersAsExcel() {
        TODO("Not yet implemented")
    }
}
