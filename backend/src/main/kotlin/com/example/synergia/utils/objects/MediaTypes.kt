package com.example.synergia.utils.objects

import org.springframework.http.MediaType

object MediaTypes {
    const val JSON = MediaType.APPLICATION_JSON_VALUE
    const val XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    const val FILE = "multipart/form-data"
}
