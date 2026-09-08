package br.com.synergia.unit

import br.com.synergia.libs.utilsCommons.extensions.cleanString
import br.com.synergia.libs.utilsCommons.extensions.nullIfBlank
import br.com.synergia.libs.utilsCommons.extensions.parseStringToWildCard
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

/**
 * Testes de unidade das extensões de String.
 *
 * Elas são pequenas, mas não são detalhe: `parseStringToWildCard` é a função que
 * transforma o texto digitado na busca no `ILIKE` que vai para o banco, então ela
 * está no caminho do RF05 (filtrar e buscar projetos). Um erro aqui vira busca
 * quebrada na tela inteira.
 */
class StringExtensionsTest : FunSpec({

    context("nullIfBlank") {
        test("devolve null para nulo, vazio e só espaços") {
            null.nullIfBlank() shouldBe null
            "".nullIfBlank() shouldBe null
            "   ".nullIfBlank() shouldBe null
            "\t\n ".nullIfBlank() shouldBe null
        }

        test("devolve o próprio texto quando há conteúdo, sem aparar as bordas") {
            "Synergia".nullIfBlank() shouldBe "Synergia"
            "  Synergia  ".nullIfBlank() shouldBe "  Synergia  "
        }
    }

    context("parseStringToWildCard") {
        test("envolve o texto em % para virar um ILIKE") {
            "Robótica".parseStringToWildCard() shouldBe "%Robótica%"
        }

        test("apara espaços das bordas antes de montar o wildcard") {
            "   Robótica   ".parseStringToWildCard() shouldBe "%Robótica%"
        }

        test("devolve null quando não há texto, para o SQL cair no ramo :text IS NULL") {
            null.parseStringToWildCard() shouldBe null
            "".parseStringToWildCard() shouldBe null
            "     ".parseStringToWildCard() shouldBe null
        }

        test("preserva espaços do meio, que fazem parte da busca") {
            "Feira de Ciências".parseStringToWildCard() shouldBe "%Feira de Ciências%"
        }
    }

    context("cleanString") {
        test("remove acentuação mantendo a letra base") {
            "Ação".cleanString() shouldBe "Acao"
            "coração".cleanString() shouldBe "coracao"
            "ÁÉÍÓÚáéíóú".cleanString() shouldBe "AEIOUaeiou"
            "ãõçÃÕÇ".cleanString() shouldBe "aocAOC"
        }

        test("remove tudo que não é letra ou número, inclusive espaços") {
            "562-09skd)_+[])".cleanString() shouldBe "56209skd"
            "Feira de Ciências 2026!".cleanString() shouldBe "FeiradeCiencias2026"
        }

        test("não mexe no que já é alfanumérico puro") {
            "Synergia2026".cleanString() shouldBe "Synergia2026"
        }

        test("devolve string vazia quando não sobra nada") {
            "".cleanString() shouldBe ""
            "!@#$%".cleanString() shouldBe ""
        }
    }
})
