# Notas gerais

## 16-05-2025

Hoje foi o dia da apresentação do TechLab 2025.

Colaboradores da Tech4Humans se apresentaram, juntamente com a empresa e os projetos principais de seu portfólio.

Logo em seguida, foram apresentados os desafios.

**São 3 desafios, cada um com um pódio:**

1. WebApp
2. Process Automation
3. AI Agent

Escolhi participar do desafio WebApp.

### Sobre o desafio

O desafio WebApp, de um ponto de vista estratégico - isto é, competindo pelo primeiro lugar no pódio - pode ser
classificado como o mais trabalhoso - tendo em vista a _stack_ exigida bem definida, com exigência de uma aplicação front-end
e outra back-end, além de documentação extensiva, boa cobertura de testes e expectativa de entrega do código fonte seguindo
os fundamentos do _Clean Code_ e do _Clean Architecture_.

Apesar de ser o mais trabalhoso dentre os três, acredito que seja também o que permite mais facilmente que uma pessoa se destaque com sua entrega.
Isso porque, devido ao tamanho da sua entrega e da exigência de qualidade no código, entregas realmente boas facilmente aparecem dentre as demais. 

## 17-05-2025

### Sobre o desafio (continuação)

O desafio WebApp, como disse anteriormente, possui os seguintes critérios de avaliação:

- Deve ser uma aplicação com o front-end escrito em ReactJS e Typescript
- A estilização do front-end deve ser feita com TailwindCSS
- Deve ter um back-end escrito em Express e Typescript
- Deve utilizar um banco de dados SQL (SQLite é o suficiente) e deve utilizar TypeORM para interação com o banco
- Deve possuir boa cobertura de testes de unidade (entendo que isso não significa 100% de _code coverage_, mas uma cobertura de testes que faça sentido)
- Deve possuir documentação a respeito de todas as decisões de design e arquitetura, como fazer a execução do projeto, etc. (entendo que quanto mais documentação, melhor)
- O código deve seguir boas práticas de programação orientada a objetos, _Clean Code_ e _Clean Architecture_ (entendo que os conceitos fundamentais
são exigidos, não a estrutura exatamente como descrita nessas fontes)
- Deve-se utilizar um sistema de controle de versão, no caso o Git

Além disso, possui o seguinte enunciado:

Deve ser elaborada uma aplicação de controle financeiro. Deve ser possível fazer o cadastro e gerenciamento de contas bancárias. 
São esperadas operações de transferência entre contas, débito e cŕedito.

Ou seja, o enunciado dá certa liberdade sobre a aplicação que será desenvolvida, desde que possua as ideias gerais de contas bancárias, operações de crédito e débito e transferência entre contas.

### Minha proposta de aplicação

Considerando o enunciado do desafio, a aplicação que irei desenvolver é uma aplicação financeira, que simula Open Finance, com as seguintes funcionalidades:

- Cadastro de usuário (CPF)
- Um usuário pode cadastrar uma ou mais contas bancárias no mesmo CPF
- Um usuário pode visualizar os saldos de suas contas bancárias
- Um usuário pode fazer operações de crédito e débito em suas contas bancárias cadastradas
- Um usuário pode transferir valores de uma de suas contas para outra
- Um usuário pode transferir valores de uma de suas contas bancárias para outra conta bancária sob outro CPF
- Um usuário pode receber valores de uma conta bancária sob outro CPF em uma de suas contas bancárias

Para isso, primeiro seram desenvolvidas as funcionalidades no contexto de um único CPF, pois isso já cumpre os requisitos do desafio.
Feito isso, adicionar a possibilidade de transferência entre CPFs diferentes é trivial.

### Meus objetivos no desafio

Meu principal objetivo no desafio é fazer a entrega completa do desafio WebApp. Como disse anteriormente, é o desafio que considero mais trabalhoso dentre os 3 propostos, mas também é 
o que mais se encaixa com o meu perfil de desenvolvedor, o que me permite aplicar muito do meu conhecimento.

A entrega é bastante extensa, exigindo documentação abrangente, boa cobertura de testes e boas práticas de programação em todas as partes do projeto, o que faz a entrega completa uma excelente conquista.

Conhecendo meu objetivo principal, busco alcançá-lo competindo de maneira estratégica. Isso tem sido feito desde a escolha do desafio, visando aquele no qual tenho maiores chances de me destacar.

Os resultados, em ordem de importância, que espero conseguir são:

1. Entrega completa do desafio WebApp
2. Pódio no desafio WebApp e prêmio em dinheiro
3. Oferta de emprego CLT ou estágio na empresa

Não é necessário estar no pódio para receber a oferta de emprego, não são mutualmente exclusivos. Caso eu não fique no pódio, a oferta de emprego ainda me geraria grande satisfação como validação do meu trabalho para a entrega do desafio.

Alcançando minha primeira prioridade, ao fazer a entrega completa do desafio, terei material para a publicação de um _write up_ sobre o desafio no meu blog e nas redes sociais (LinkedIn), o que pode servir como portfólio e para estimular a participação de mais pessoas em desafios como esse.

### Desenvolvimento da aplicação

Começarei o desenvolvimento da aplicação me organizando.

Decisões técnicas tomadas a respeito da organização:

- Não utilizarei Kanban, Scrum, etc., visto que sou uma pessoa só e não há necessidade de métodos elaborados para organização das tarefas
- O progresso no código e na execução das tarefas será rastreado puramente pelo versionamento do código com Git, Tags, SemVer e Change Log
- As tarefas serão acompanhadas com TODO lists simples em um arquivo markdown no repositório, haverá também um roadmap das funcionalidades que serão implementadas
(novamente, porque sou uma pessoa só)
- O modelo de branching do repositório seguirá o padrão Trunk Based, visto que é simples e direto, o que é tudo que eu preciso

#### Design e arquitetura

O design da aplicação será feito seguindo as ideias do Domain-Driven Design, isto é, a aplicação será divida em módulos, chamados de
contextos delimitados, que viverão isolados uns dos outros se comunicando por meio de eventos de domínio.

Essa abordagem de design remete muito para uma arquitetura baseada em eventos, mas não é esse padrão que seguirei. Os eventos de domínio na modelagem serão implementados
como chamadas de um módulo para outro por meio de interfaces expostas. Esse método garante desacoplamento, comunicação síncrona, e coesão na aplicação. Em resumo, a aplicação será
um **monólito modular**.

Módulos (contextos delimitados, no design) isolados são coesos e independentes. Um módulo não precisa saber da existência de outro, apenas precisa conhecer suas interfaces.

Para garantir que os módulos sejam desacoplados, seguirei o padrão _consumer-defined interfaces_, isto é, um módulo X,
que depende de uma classe num módulo Y, declara a interface que representa essa dependência no seu lado da aplicação (consumidor), em vez do lado produtor (módulo Y).

Isso fere o princípio DRY (_Don't Repeat Yourself_), porque, no TypeScript, a implementação de uma interface é explícita e, assim, haverá duplicação do código da interface
no lado do consumidor e do produtor. Considero isso uma decisão arquitetural válida, porque permite uma evolução futura da estrutura monolítica da aplicação de maneira direta.

Cada contexto delimitado do modelo da aplicação será traduzido em um módulo no código fonte. Dentro de cada módulo vive uma estrutura que remete à _Clean Architecture_, ou à Arquitetura Hexagonal (Portas e Adaptadores).

As dependências serão gerenciadas por meio de um container de injeção de dependências no top-level da aplicação, utilizando a biblioteca InversifyJS. O container conhece todos os módulos da aplicação mas os módulos não conhecem o container, novamente, garantindo o desacoplamento.

Boas práticas fomentadas nesse projeto:

- Programação defensiva: por se tratar de uma aplicação financeira e os testes de unidade serem um critério de avaliação, faz muito sentido aqui
- Princípios SOLID, YAGNI, KISS e DRY
- Clean Code e Clean Architecture (arquitetura baseada em camadas)
- DDD

### Tarefas iniciais

- [ ] Fazer o scallfolding das aplicações front-end e back-end em um monorepo, utilizando NPM Workspaces
- [ ] Começar pelo contexto delimitado de autenticação, fazendo um sistema básico de autenticação com token JWT
- [ ] Ligar o front-end ao módulo de autenticação do back-end
  - [ ] Utilizar uma biblioteca de UI no front-end, provavelmente shadcn/ui pela conveniẽncia
- [ ] Escrever testes e documentar o que foi feito, incluindo diagramas

### Considerações para próximos passos

- Documentar requisitos funcionais e não funcionais
- Criar user stories
- Fazer diagramas
- Definir melhor o critério de pronto (atualmente eu diria que uma feature está pronta quando existe no front-end e no back-end, está testada e documentada)
- Fazer roadmap
- Elaborar documentação sobre o plano de testes
