import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Mesmas regras de senha nova do backend (config/senha/PoliticaDeSenha.kt):
 * pelo menos 8 caracteres, com letras e números, e no máximo 72 bytes. O backend
 * é quem garante; aqui é só para avisar antes de enviar.
 */
export const SENHA_MINIMO = 8;
const SENHA_MAXIMO_BYTES = 72;

/** O motivo pelo qual a senha não serve, ou null se ela serve. */
export function problemaNaSenha(senha: string): string | null {
  if (senha.length < SENHA_MINIMO) return `A senha precisa ter pelo menos ${SENHA_MINIMO} caracteres.`;
  if (!/\p{L}/u.test(senha) || !/\p{N}/u.test(senha)) return 'A senha precisa ter letras e números.';
  if (new TextEncoder().encode(senha).length > SENHA_MAXIMO_BYTES) {
    return `A senha pode ter no máximo ${SENHA_MAXIMO_BYTES} bytes.`;
  }
  return null;
}

/** Validador de formulário. Campo vazio passa: obrigatoriedade é com o Validators.required. */
export function senhaForteValidator(control: AbstractControl<string>): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;
  const problema = problemaNaSenha(valor);
  return problema ? { senhaFraca: problema } : null;
}
