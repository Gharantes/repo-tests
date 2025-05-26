package com.example.synergia.services

import com.example.synergia.repositories.pageListarTags.DeleteTagSql
import com.example.synergia.repositories.pageListarTags.InsertTagSql
import com.example.synergia.repositories.pageListarTags.ListarTagsAllSql
import com.example.synergia.rest.pageListarTags.dto.input.FiltroListarTagsAllDto
import com.example.synergia.rest.pageListarTags.dto.input.InsertTagDto
import com.example.synergia.rest.pageListarTags.dto.output.ListarTagDto
import com.example.synergia.utils.extensions.cleanString
import org.springframework.dao.DuplicateKeyException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarTagsService (private val template: JdbcTemplate) {

    fun listarTagsAll(params: FiltroListarTagsAllDto): List<ListarTagDto> {
        return ListarTagsAllSql(params).query(template)
    }

    fun insertTag(params: InsertTagDto) {
        require(params.name.length < 254) { "Nome inválido: Limite de 254 carácteres." }
        try {
            InsertTagSql(params).executeStatement(template)
        } catch (e: DuplicateKeyException) {
            throw Exception("Já existe uma tag com esse nome!")
        }
    }

    fun deleteTag(id: Long) {
        DeleteTagSql(id).executeStatement(template)
    }
}