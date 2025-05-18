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
São esperadas operações de transferência entre contas, débito e crédito.

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

Para isso, primeiro serão desenvolvidas as funcionalidades no contexto de um único CPF, pois isso já cumpre os requisitos do desafio.
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

Para garantir que os módulos sejam desacoplados, definirei um pacote compartilhado entre as aplicações (front-end e back-end) chamado `contracts`. Esse pacote tem o papel somente de exportar interfaces que serão implementadas no módulo a qual pertence e referenciadas no módulo do qual é dependência.

Como é um pacote compartilhado no monorepo, o front-end também pode ter conhecimento dos contratos, o que pode ser útil para comunicação com o back-end.

Cada contexto delimitado do modelo da aplicação será traduzido em um módulo no código fonte. Dentro de cada módulo vive uma estrutura que remete à _Clean Architecture_, ou à Arquitetura Hexagonal (Portas e Adaptadores).

As dependências serão gerenciadas por meio de um container de injeção de dependências no top-level da aplicação, utilizando a biblioteca InversifyJS. O container conhece todos os módulos da aplicação mas os módulos não conhecem o container, novamente, garantindo o desacoplamento.

Boas práticas fomentadas nesse projeto:

- Programação defensiva: por se tratar de uma aplicação financeira e os testes de unidade serem um critério de avaliação, faz muito sentido aqui
- Princípios SOLID, YAGNI, KISS e DRY
- Clean Code e Clean Architecture (arquitetura baseada em camadas)
- DDD

### Tarefas iniciais

- [x] Fazer o scaffolding das aplicações front-end e back-end em um monorepo, utilizando NPM Workspaces
- [ ] Começar pelo contexto delimitado de autenticação, fazendo um sistema básico de autenticação com token JWT
- [ ] Ligar o front-end ao módulo de autenticação do back-end
  - [ ] Utilizar uma biblioteca de UI no front-end, provavelmente shadcn/ui pela conveniência
- [ ] Escrever testes e documentar o que foi feito, incluindo diagramas

### Considerações para próximos passos

- Documentar requisitos funcionais e não funcionais
- Criar user stories
- Fazer diagramas
- Definir melhor o critério de pronto (atualmente eu diria que uma feature está pronta quando existe no front-end e no back-end, está testada e documentada)
- Fazer roadmap
- Elaborar documentação sobre o plano de testes

### Iniciando o projeto

Para isso, comecei atualizando a versão do NodeJS para a LTS mais recente, no momento `v22.15.1`.

Iniciei um [npm workspace](https://docs.npmjs.com/cli/v8/using-npm/workspaces) com `npm init -y`, atualizei algumas informações no `package.json` e prossegui com `npm init -w ./packages/backend -y`.

Iniciei um projeto Vite com ReactJS e Typescript com o comando `npm create vite@latest` no diretório `packages/`, passando o nome do projeto como `frontend` e selecionando a opção desejada de ReactJS + Typescript. Adicionei o workspace `frontend` manualmente no `package.json` no top-level do repositório.

Rodei `npm i -w frontend` para instalar as dependências do projeto Vite no _package_ `frontend`.

Rodei `npm run dev -w frontend` de modo a assegurar que o projeto front-end estava configurado como o esperado.

Com o front-end configurado e a documentação feita, commitei o progresso.

Continuando o processo de configuração inicial, configurei o [Jest Test Runner](https://jestjs.io/) no _package_ `backend`.

Para isso rodei `npm i -w backend -D typescript jest ts-node ts-jest @types/jest @types/node`.

Também rodei `cd packages/backend && npx tsc --init && npx ts-jest config:init`

Adicionei configurações relacionadas a _test coverage_:

```js
// packages/backend/jest.config.js

// ...

module.exports = {
  testEnvironment: "node",

  // Coverage
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  // ...
};
```

Criei uma pasta `__tests__` com um arquivo de teste de exemplo `main.test.ts`.

Rodei, no top-level do repositório, `npm run test -w backend` para assegurar que a configuração estava correta.

Instalei outras dependências necessárias para começar o projeto com `npm i -w backend express inversify@alpha reflect-metadata` e `npm i -w backend -D @types/express`.

Me certifiquei que `experimentalDecorators` e `emitDecoratorMetadata` estavam marcados como `true` no `tsconfig.json` para o correto funcionamento do [InversifyJS](https://inversify.io/)

**Links úteis de documentação**

- https://inversify.io/docs/introduction/getting-started
- https://jestjs.io/docs/getting-started
- https://kulshekhar.github.io/ts-jest/docs/getting-started/installation
- https://vite.dev/guide
- https://docs.npmjs.com/cli/v8/using-npm/workspaces

Feito isso, já posso começar o desenvolvimento do back-end.

## 18-05-2025

Comecei o dia refinando o que fiz no dia anterior.

Primeiro, renomeei os pacotes (por meio do `package.json` de cada um) para incluir um _scope_: `techlab25`. Assim, no momento de declarar que um pacote depende de outro, conflitos de nome são evitados.

Para declarar, por exemplo, que o pacote `@techlab25/backend` depende do pacote `@techlab25/contracts` eu rodo `npm i @techlab25/contracts -w @techlab25/backend` e a dependência é mapeada corretamente.

A única alteração que faço na declaração de dependência é mudar a versão definida para `*`, só por uma questão semântica, significando que um pacote depende sempre da última versão do outro pacote.

```jsonc
{
  "name": "@techlab25/backend",
  // ...
  "dependencies": {
    "@techlab25/contracts": "*"
    // ...
  }

  // ...
}
```

Também configurei o Typescript para o monorepo (basicamente este projeto que utiliza NPM workspaces para seu gerenciamento).

Para isso, apaguei o `tsconfig.json` definido no pacote `backend` e criei um `tsconfig.base.json` na raiz do repositório.

```jsonc
{
  "compilerOptions": {
    "target": "ES2020", // Mesma versão usada no tsconfig.json do frontend, por conveniência
    "module": "commonjs",
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "incremental": true,
    "skipLibCheck": true,
    "noEmitOnError": true
  }
}
```

O `tsconfig.json` dos pacotes, então, herdam do `tsconfig.base.json`

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "references": [{ "path": "../contracts" }]
}
```

Observe a chave `references` no snippet acima. Isso também é utilizado em um arquivo `tsconfig.json` na raiz do projeto.

```jsonc
{
  "files": [],
  "references": [
    { "path": "./packages/backend" },
    { "path": "./packages/contracts" }
  ]
}
```

`"files": []` é um truque para evitar recompilação dos arquivos, como orientado na documentação do Typescript.

Esse `references` vai permitir o autocompletion dos imports, bem como a validação em tempo de compilação das referências que cada pacote faz.

Sempre que uma dependência de um pacote para outro é declarada, por meio do `npm i`, também é necessário referenciar o pacote no `tsconfig.json` do dependente.

Toda essa configuração permite o desacoplamento dos contratos (interfaces e tipos) das implementações.

No back-end, isso permite o seguinte:

```ts
// packages/contracts/producer/IProducer.ts

export interface IProducer {
  hello: (name: string) => string;
}
```

```ts
// packages/backend/src/modules/producer/index.ts

import { IProducer } from "@techlab25/contracts";
import { injectable } from "inversify";

@injectable()
export class Producer implements IProducer {
  public hello(name: string): string {
    return `Hello, ${name}!`;
  }
}
```

```ts
// packages/backend/src/modules/consumer/index.ts

import { IProducer } from "@techlab25/contracts";
import { inject, injectable } from "inversify";

@injectable()
export class Consumer {
  constructor(
    @inject(Symbol.for("producer")) private readonly producer: IProducer
  ) {}

  public consume(name: string) {
    console.log(this.producer.hello(name));
  }
}
```

```ts
// packages/backend/src/main.ts

import { Container } from "inversify";
import { Producer } from "./modules/producer";
import { Consumer } from "./modules/consumer";

const container: Container = new Container();

container.bind(Symbol.for("producer")).to(Producer);
container.bind(Symbol.for("consumer")).to(Consumer);

const consumer = container.get<Consumer>(Symbol.for("consumer"));

consumer.consume("World");
```

Assim, módulos ficam completamente desacoplados uns dos outros, apenas dependendo de interfaces.
