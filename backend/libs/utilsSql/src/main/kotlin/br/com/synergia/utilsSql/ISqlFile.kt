package br.com.synergia.utilsSql

import org.apache.commons.io.IOUtils
import java.nio.charset.StandardCharsets
import java.util.*

interface ISqlFile {
    val path: String

    fun load(): String {
        return getSqlFromFile(path)
    }
    fun getSqlFromFile(caminhoArquivo: String): String {
        val arquivo =
            if (caminhoArquivo.startsWith("/")) caminhoArquivo.substring(1) else caminhoArquivo
        val sql =
            this::class.java.classLoader.getResourceAsStream(arquivo).use { `is` ->
                IOUtils.toString(Objects.requireNonNull(`is`), StandardCharsets.UTF_8)
            }
        return sql
    }
}