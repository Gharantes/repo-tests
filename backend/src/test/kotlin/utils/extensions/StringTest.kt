package utils.extensions

import com.example.synergia.utils.extensions.cleanString
import io.kotest.core.spec.style.FunSpec

class StringTest : FunSpec({
    test("cleanString") {
        println("562-09skd)_+[])".cleanString())
    }
})