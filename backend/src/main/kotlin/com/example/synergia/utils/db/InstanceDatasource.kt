package com.example.synergia.utils.db

import org.springframework.jdbc.datasource.DriverManagerDataSource

fun instanceDatasource(): DriverManagerDataSource {
    return DriverManagerDataSource().apply {
        setDriverClassName("org.postgresql.Driver")
        url = "jdbc:postgresql://localhost:5432/synergia_dev"
        username = "raindrop"
        password = "doorway"
    }
}