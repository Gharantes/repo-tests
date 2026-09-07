package br.com.synergia.unit

import br.com.synergia.libs.utilsCommons.enums.AuthPermissionsEnum
import br.com.synergia.libs.utilsCommons.enums.ColorsEnum
import io.kotest.assertions.withClue
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldMatch

/**
 * Testes de unidade dos enums que o resto do sistema trata como fonte da verdade.
 *
 * `ColorsEnum.randomHex()` é o valor gravado em `project.banner_color`, coluna
 * `VARCHAR(7) NOT NULL`. Se algum hex fosse escrito errado, a falha só apareceria
 * na hora de inserir no banco. `AuthPermissionsEnum` carrega os ids que existem
 * como linha na tabela `permission`, então id duplicado seria um bug silencioso.
 */
class EnumsTest : FunSpec({

    context("ColorsEnum") {
        test("todo hex tem o formato aceito pela coluna banner_color") {
            ColorsEnum.entries.forEach { cor ->
                cor.hex shouldMatch Regex("^#[0-9A-F]{6}$")
                cor.hex.length shouldBe 7
            }
        }

        test("não há cor repetida na paleta") {
            val hexes = ColorsEnum.entries.map { it.hex }
            hexes.toSet() shouldHaveSize hexes.size
        }

        test("randomHex sempre devolve uma cor da própria paleta") {
            val paleta = ColorsEnum.entries.map { it.hex }.toSet()
            repeat(200) {
                paleta shouldContain ColorsEnum.randomHex()
            }
        }

        test("random sempre devolve uma constante do enum") {
            repeat(200) {
                ColorsEnum.entries shouldContain ColorsEnum.random()
            }
        }
    }

    context("AuthPermissionsEnum") {
        test("não há id repetido entre as permissões") {
            val ids = AuthPermissionsEnum.entries.map { it.id }
            ids.toSet() shouldHaveSize ids.size
        }

        test("o label bate com o nome da constante") {
            AuthPermissionsEnum.entries.forEach { permissao ->
                permissao.label shouldBe permissao.name
            }
        }

        test("toda permissão tem descrição preenchida, que é o texto exibido na tela") {
            AuthPermissionsEnum.entries.forEach { permissao ->
                withClue(permissao.name) {
                    permissao.description.isNullOrBlank() shouldBe false
                }
            }
        }
    }
})
