package com.example.synergia.dto

import com.example.synergia.dto.for_display.InfoPessoaSimplesDto
import com.example.synergia.dto.utilities.Periodo

data class EventoDto(
    // ID único do Evento.
    var idEvento: Long,

    // Titúlo do Evento.
    // Não é necessário ser único, mas é recomendável para facilitar para alunos.
    var titulo: String,

    // Descrição do Evento.
    var descricao: String,

    // Datas Marcadas Para
    var periodos: List<Periodo>,

    // Lista com as informações básicas dos supervisores do Evento.
    // Dto Contém somente as informações que seram apresentadas para o usuário que está
    // visualizando o evento.
    var supervisores: List<InfoPessoaSimplesDto>,

    // Lista de Ids dos Projetos que estaram participando do Evento.
    var projetosParticipantes: List<Long>
)
