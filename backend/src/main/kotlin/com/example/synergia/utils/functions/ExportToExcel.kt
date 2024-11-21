package com.example.synergia.utils.functions

import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.xssf.usermodel.XSSFWorkbook

fun exportToExcel(
    columns: Map<String, Int>
) {
    createWorkbook().let { workbook ->
        createSheet(workbook).let { sheet ->
            createHeader(sheet, columns)
        }
    }
}
fun createWorkbook(): XSSFWorkbook {
    return XSSFWorkbook()
}
fun createSheet(
    workbook: Workbook,
    sheetName: String? = null
): Sheet {
    return workbook.createSheet(sheetName)
}
fun createHeader(
    sheet: Sheet,
    columns: Map<String, Int>
) {
    val row = sheet.createRow(0)
    columns.entries.forEachIndexed { i, col ->
        row.createCell(i).apply {
            setCellValue(col.key)
            sheet.setColumnWidth(i, col.value)
        }
    }
}