- O que faltou nas minhas anotações da parte 2 (slides 17~26):


- DEPLOY - não anotei nada e é metade da parte 2:
    - aplicação na Vercel, conectada no repositório do GitHub (não subir arquivo na mão)
    - banco no Supabase/PostgreSQL, com o esquema criado e documentado
    - o sistema publicado tem que persistir e consultar de verdade no banco remoto
    - se o TCC hoje usa outro banco/hospedagem, decidir cedo se migra

- Ambiente de desenvolvimento reproduzível e documentado (Docker/Compose).

- O fluxo, não só a proteção da branch:
    - issue/tarefa -> branch de trabalho -> commits -> pull request -> merge na main

- Proteção da main, configurações específicas:
    - exigir PR, pelo menos 1 aprovação, checks do CI concluídos, sem push direto
    - em repo pessoal, "1 aprovação" me impede de aprovar meu próprio PR - ver isso

- Testes: os slides falam unidade / integração / SISTEMA (meu "end-to-end" = sistema).
    - escolher quais testes pela tabela de rastreabilidade, não no improviso
    - poucos testes úteis > muitos testes inúteis

- Cliente real, o protocolo:
    - pessoa do público-alvo, que não participou do desenvolvimento
    - pedir pra executar a tarefa principal e NÃO guiar clique a clique
    - gravar em vídeo + coletar impressão final breve

- Adicional de nota (opcional): migrations versionadas com Supabase CLI aplicadas pelo CI.
  Só vale se o sistema já estiver funcionando bem.
