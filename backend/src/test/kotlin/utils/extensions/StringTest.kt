package utils.extensions

import br.com.synergia.utilsCommons.extensions.cleanString
import io.kotest.core.spec.style.FunSpec

class StringTest : FunSpec({
    test("cleanString") {
        println("562-09skd)_+[])".cleanString())
    }
})