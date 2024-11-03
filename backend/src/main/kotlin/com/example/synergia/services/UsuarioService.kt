package com.example.synergia.services

import com.example.synergia.dto.entity_mirror.UsuarioDto
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileInputStream
import java.util.Base64
import org.apache.poi.xssf.usermodel.XSSFSheet
import org.apache.poi.xssf.usermodel.XSSFWorkbook


@Service
class UsuarioService {
    fun getById(idUsuario: Long): UsuarioDto? {
        return null
    }
    fun getAll(): List<UsuarioDto> {
        return listOf()
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
