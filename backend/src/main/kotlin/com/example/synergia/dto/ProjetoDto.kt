package com.example.synergia.dto

data class ProjetoDto(
    var idProjeto: Long,
    var titulo: String,
    // Lista contendo os Ids dos Eventos nos quais o Projeto está incrito.
    var eventosNoQualParticipa: List<Long>,
    // Lista contendo os Ids dos Usuários quais compoem a equipe do Projeto
    var membrosProjeto: List<Long>,
)
