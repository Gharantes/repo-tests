- **Modelo (ExtraRouteFacadeService):**
    Armazena e manipula o estado do contador, oferecendo métodos para incrementar (addToCount) e resetar
(resetCount) o valor. Isso é típico de um modelo no MVC.

- **Visão (ExtraViewComponent):**
  - A Visão apenas exibe o valor do contador e dispara eventos para incrementar ou resetar, sem especificar a 
  quantidade de incremento. Isso é porque a Visão deve ser responsável apenas pela exibição e
  captura de ações do usuário, sem incluir lógica de negócio.

- **Controlador (ExtraRouteComponent):**
  - Como controlador, ele define o valor pelo qual o contador será incrementado, mantendo a lógica de 
  negócio (a quantidade de incremento) fora da Visão. 
  Isso segue o papel do controlador, que atua na intermediação e coordenação entre a Visão
  e o Modelo.
