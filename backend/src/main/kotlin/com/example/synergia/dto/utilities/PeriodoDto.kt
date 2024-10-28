package com.example.synergia.dto.utilities

import com.example.synergia.dto.enums.TipoPeriodo
import java.time.LocalDate

data class Periodo(
    /**
     * Uma descrição básica do que estará acontecendo
     * no dia em que a data está marcada.
     */
    var descricao: String,
    var tipoPeriodo: TipoPeriodo,

    var dataUnica: LocalDate?,
    var dataInicio: LocalDate?,
    var dataFim: LocalDate?,
)

fun Periodo.isValid(): Boolean {
    return when (tipoPeriodo) {
        TipoPeriodo.UNIQUE -> {
            if (dataInicio !== null || dataFim !== null) { false }
            else if ( dataUnica == null ) { false }
            else { true }
        }
        TipoPeriodo.BETWEEN -> {
            if (dataUnica != null) { false }
            else if (dataInicio == null || dataFim == null) { false }
            else { true }
        }
        else -> false
    }
}