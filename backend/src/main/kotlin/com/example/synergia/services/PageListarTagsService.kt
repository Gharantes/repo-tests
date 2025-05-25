package com.example.synergia.services

import com.example.synergia.repositories.pageListarTags.InsertTagSql
import com.example.synergia.repositories.pageListarTags.ListarTagsAllSql
import com.example.synergia.rest.pageListarTags.dto.input.FiltroListarTagsAllDto
import com.example.synergia.rest.pageListarTags.dto.input.InsertTagDto
import com.example.synergia.rest.pageListarTags.dto.output.ListarTagDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarTagsService (private val template: JdbcTemplate) {

    fun listarTagsAll(params: FiltroListarTagsAllDto): List<ListarTagDto> {
        return ListarTagsAllSql(params).query(template)
    }

    fun insertTag(params: InsertTagDto) {
        InsertTagSql(params).executeStatement(template)
    }
}