# Proteção da branch principal: Synergia

**Disciplina:** DevOps, Aula 05, Projeto Integrador (Parte 4)
**Autor:** Guilherme Harmatiuk Arantes
**Data:** 08/09/2026

---

## 1. O que foi entregue

A branch `main` tem regra de proteção, e o pipeline da parte 3 é condição para
o merge:

| Regra | Valor |
| --- | --- |
| Pull request obrigatório | sim |
| Aprovações exigidas | 1 |
| Aprovação descartada a cada novo commit | sim |
| Check obrigatório | **Resultado dos testes** |
| Branch atualizada com a `main` antes do merge | sim |
| Conversas resolvidas | sim |
| Force push e exclusão da branch | bloqueados |
| Vale para administradores | não (ver seção 3) |

Com isso, nada entra na `main` sem PR, sem aprovação e sem os 150 testes
passando.

A configuração foi aplicada pela API do GitHub:

```bash
gh api -X PUT repos/Gharantes/repo-tests/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["Resultado dos testes"] },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
JSON
```

---

## 2. Como testar

Para ver o bloqueio sem quebrar código, o pipeline tem um marcador:
**`[falhar-ci]`** na mensagem do commit ou no título do PR faz o job de unidade
falhar de propósito, e com ele o **Resultado dos testes**.

```bash
git checkout -b teste/protecao
git commit --allow-empty -m "Teste da proteção da main [falhar-ci]"
git push -u origin teste/protecao
gh pr create --title "Teste da proteção" --body "PR descartável."
```

Em cerca de um minuto o PR mostra o check vermelho e o merge indisponível. Para
ver o verde no mesmo PR:

```bash
git commit --allow-empty --amend -m "Teste da proteção da main"
git push --force-with-lease
```

No fim: `gh pr close teste/protecao --delete-branch`.

---

## 3. Aprovação num repositório de uma pessoa

O GitHub não permite aprovar o próprio PR. Com um único participante, exigir
aprovação para todos travaria a `main`. Por isso a regra vale para todos exceto
administradores (`enforce_admins: false`). Para aplicá-la também aos
administradores:

```bash
# liga
gh api -X POST repos/Gharantes/repo-tests/branches/main/protection/enforce_admins
# desliga
gh api -X DELETE repos/Gharantes/repo-tests/branches/main/protection/enforce_admins
```

Com ela ligada, um push direto na `main` é recusado com
"Changes must be made through a pull request".
