package com.example.synergia.utils.functions

fun nullOnEmptyStringElseWildcard(str: String?): String? {
    return if(str.isNullOrBlank()) null else "%$str%"
}