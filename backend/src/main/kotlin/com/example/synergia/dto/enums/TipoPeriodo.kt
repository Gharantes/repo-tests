package com.example.synergia.dto.enums

enum class TipoPeriodo {
    /**
     * Aconte EM SOMENTE UM DIA. Exemplo: em 03/05/2024.
     *
     * Caso um período seja "UNIQUE", ele deve preencher "dataUnica"
     */
    UNIQUE,

    /**
     * Acontece ENTRE DUAS DATAS.
     * Exemplo: de 02/05/2024 até 04/05/2024.
     * Este evento ocorre nos dias 02, 03 e 04,
     * - NOS MESMOS HORÁRIOS
     *
     * Caso um período seja "BETWEEN", ele deve preencher "dataInicio" e "dataFim",
     */
    BETWEEN
}