package br.com.synergia.libs.utilsCommons.enums

/**
 * Tipos de conversa da tela Mensagens.
 * - PROJECT: grupo do projeto. Membros = membros do projeto (sempre atualizado, não é gravado à parte).
 * - PROJECT_EVENT: grupo de um projeto com um evento em que ele está registrado. Membros = membros do
 *   projeto + pessoas do evento que eles adicionaram (ex.: o Organizador).
 * - DIRECT: conversa privada entre duas pessoas.
 */
enum class ConversationTypeEnum {
    PROJECT,
    PROJECT_EVENT,
    DIRECT
}
