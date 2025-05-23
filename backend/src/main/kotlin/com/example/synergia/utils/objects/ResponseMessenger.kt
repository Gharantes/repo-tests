package com.example.synergia.utils.objects

import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import java.nio.charset.StandardCharsets

object ResponseMessenger {
    fun responseWithoutReturn(function: () -> Unit): ResponseEntity<Void> {
        return try {
            function()
            ResponseEntity.ok((null))
        } catch (e: Exception) {
            e.printStackTrace()
            errorTemplate(truncateForHeader((e.message ?: "Erro desconhecido.")))
        }
    }
    fun <T> buildResponse(function: () -> T?): ResponseEntity<T> {
        return try {
            ResponseEntity.ok(function())
        } catch (e: Exception) {
            e.printStackTrace()
            errorTemplate(truncateForHeader(e.message ?: "Erro desconhecido."))
        }
    }

    private fun <T> errorTemplate(msg: String, body: T? = null): ResponseEntity<T> {
        val sanitizedMessage = msg.replace("\r", "").replace("\n", "")

        val headers = HttpHeaders()
        headers.set("x-error", sanitizedMessage)
        headers.add("Content-Type", "text/html; charset=utf-8")
        return ResponseEntity.internalServerError().headers(headers).body(body)
    }

    private fun truncateForHeader(input: String, maxBytes: Int = 8192): String {
        var truncatedString = input
        while (truncatedString.toByteArray(StandardCharsets.UTF_8).size > maxBytes) {
            truncatedString = truncatedString.dropLast(1)
        }
        return truncatedString
    }
}