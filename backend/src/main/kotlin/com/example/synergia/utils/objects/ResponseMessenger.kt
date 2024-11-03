package com.example.synergia.utils.objects

import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import java.nio.charset.StandardCharsets

object ResponseMessenger {
    fun <T> buildResponse(successMsg: String?, function: () -> T?): ResponseEntity<T> {
        return try {
            if (successMsg == null) {
                ResponseEntity.ok(function())
            }
            else {
                successTemplate(successMsg, function())
            }
        } catch (e: Exception) {
            e.printStackTrace()
            errorTemplate(truncateForHeader(e.message ?: "Erro desconhecido."))
        }
    }

    fun <T> successTemplate(msg: String, body: T? = null): ResponseEntity<T> {
        val sanitizedMessage = msg.replace("\r", "").replace("\n", "")

        val headers = HttpHeaders()
        headers.set("x-success", sanitizedMessage)
        headers.add("Content-Type", "text/html; charset=utf-8")
        return ResponseEntity.ok().headers(headers).body(body)
    }

    fun <T> errorTemplate(msg: String, body: T? = null): ResponseEntity<T> {
        val sanitizedMessage = msg.replace("\r", "").replace("\n", "")

        val headers = HttpHeaders()
        headers.set("x-error", sanitizedMessage)
        // headers.contentType = MediaType.valueOf("text/plain;charset=UTF-8")
        headers.add("Content-Type", "text/html; charset=utf-8")
        return ResponseEntity.internalServerError().headers(headers).body(body)
    }

    fun truncateForHeader(input: String, maxBytes: Int = 8192): String {
        var truncatedString = input
        while (truncatedString.toByteArray(StandardCharsets.UTF_8).size > maxBytes) {
            truncatedString = truncatedString.dropLast(1)
        }
        return truncatedString
    }
}
