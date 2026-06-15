package br.com.synergia.libs.utilsCommons.extensions

import java.text.Normalizer


fun String?.nullIfBlank(): String? =
    if (this.isNullOrBlank()) {
        null
    } else {
        this
    }

fun String?.parseStringToWildCard(): String? =
    this.nullIfBlank()?.let { "%${it.trim()}%" }

fun String.cleanString(): String {
    // Step 1: Normalize and remove accents
    val normalized = Normalizer
        .normalize(this, Normalizer.Form.NFD)
        .replace(Regex("\\p{InCombiningDiacriticalMarks}+"), "")

    // Step 2: Remove all non-alphanumeric characters (letters and numbers only)
    return normalized.replace(Regex("[^a-zA-Z0-9]"), "")
}