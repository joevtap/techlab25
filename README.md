# 💸 Jovi's Bank - Techlab 2025

Minha entrega para o desafio WebApp do TechLab 2025, desafio de programação, IA e automação organizado pela Tech4Humans em parceria com o CEU UNIFEI

![Demo](./docs/demo.gif)

## 📜 Índice

- [🚀 Como rodar o projeto](#-como-rodar-o-projeto)
- [❓ Sobre](#-sobre)
- [⚛️ Tecnologias utilizadas](#️-tecnologias-utilizadas)
- [🏗️ Estrutura do projeto](#️-estrutura-do-projeto)
- [🤓 Principais decisões arquiteturais](#-principais-decisões-arquiteturais)
- [🧠 Lógica de Desenvolvimento](#-lógica-de-desenvolvimento)
- [🧪 Testes](#-testes)

## 🚀 Como rodar o projeto

Primeiro, clone o repositório por meio do comando:

```sh
git clone https://github.com/joevtap/techlab25.git && cd techlab25
```

O projeto consiste em um _monorepo_ utilizando npm, para instalar as dependências de todos os pacotes do monorepo, utilize o comando na raíz do repositório:

```sh
npm i
```

Você pode rodar os testes por meio do comando:

```sh
npm run test
```

> Rodará os testes unitários presentes no pacote `@techlab25/backend` em `./packages`

Em uma sessão do shell, rode as migrations do banco SQLite por meio do comando:

```sh
npm run migrations -w @techlab25/backend
```

E então, rode o backend em modo de desenvolvimento com:

```sh
npm run dev:backend
```

> Rodará o backend em modo de desenvolvimento utilizando as variáveis de ambiente definidas em `./packages/backend/.env.development`

Em outra sessão do shell, rode o frontend em modo de desenvolvimento com:

```sh
npm run dev:frontend
```

> Rodará o frontend em modo de desenvolvimento utilizando as variáveis de ambiente definidas em `./packages/frontend/.env.development`

Se não modificou nenhuma variável de ambiente, o frontend estará rodando em http://localhost:5173.

Acesse a referência da API do backend em http://localhost:8080/reference.

## ❓ Sobre

> O enunciado do desafio se encontra [Aqui](<https://github.com/tech4humans-brasil/techlab-ceu/blob/main/Finan%C3%A7as%20(Webapp)/Desafio%20WebApp.pdf>)

O projeto consiste em uma pequena aplicação financeira em que é possível criar, listar, editar e deletar contas bancárias, além de realizar operações financeiras entre elas.

Além do proposto no enunciado do desafio, minha implementação inclui uma funcionalidade de cadastro e autenticação do usuário. Fiz essa adição porque senti que era algo que faltava para dar mais sentido à aplicação: contas bancárias terem donos e um usuário poder se identificar para operar apenas em cima de suas contas.

A implementação consiste em um backend e um frontend, os dois utilizando a linguagem typescript e se comunicando por meio de uma API HTTP. Toda a lógica de negócios se encontra no backend, mas a validação das entradas do usuário é feita em ambas as pontas.

Mais detalhes sobre o backend e o frontend podem ser encontrados em suas respectivas pastas:

- [Backend](./packages/backend/README.md)
- [Frontend](./packages/frontend/README.md)

## ⚛️ Tecnologias utilizadas

### Backend

- **Node.js** (v22.15.1) - Runtime JavaScript server-side
- **TypeScript** - Linguagem principal para type safety e produtividade
- **Express** - Framework web minimalista para APIs REST
- **TypeORM** - ORM para TypeScript, escolhido por sua excelente integração com TypeScript e recursos avançados de mapeamento objeto-relacional
- **SQLite** - Banco de dados relacional embarcado, ideal para desenvolvimento e prototipagem
- **Inversify** - Container de injeção de dependências para implementar inversão de controle
- **Jest** - Framework de testes unitários
- **Zod** - Biblioteca de validação de esquemas TypeScript-first
- **bcrypt** - Para hash de senhas
- **nanoid** - Geração de IDs únicos
- **JOSE** - Implementação de JWT para autenticação
- **Scalar UI** - Interface para documentação OpenAPI

### Frontend

- **React** (v19) - Biblioteca para construção de interfaces de usuário
- **TypeScript** - Type safety no frontend
- **Vite** - Build tool moderna e rápida
- **TailwindCSS** (v4) - Framework CSS utility-first para estilização rápida
- **shadcn/ui** - Sistema de componentes baseado em Radix UI e TailwindCSS, escolhido pela qualidade dos componentes, acessibilidade nativa e facilidade de customização
- **React Hook Form** - Gerenciamento de formulários performático
- **Zod** - Validação de esquemas compartilhada entre frontend e backend
- **Sonner** - Biblioteca para toasts/notificações
- **next-themes** - Suporte a temas dark/light
- **Lucide React** - Ícones SVG
- **@dicebear/core** - Geração de avatars

### Ferramentas e Customização

- **tweakcn.com** - Ferramenta utilizada para personalização do tema do shadcn/ui, permitindo gerar paletas de cores customizadas e configurações de design system específicas para o projeto
- **Modo Dark/Light** - Implementado usando next-themes, permitindo alternância entre temas claro e escuro com persistência da preferência do usuário

## 🏗️ Estrutura do projeto

O projeto está organizado como um monorepo utilizando npm workspaces, facilitando o compartilhamento de dependências e scripts entre os pacotes.

```
techlab25/
├── packages/
│   ├── backend/          # API REST em Node.js/TypeScript
│   │   ├── src/
│   │   │   ├── controllers/    # Controladores HTTP
│   │   │   ├── services/       # Regras de negócio
│   │   │   ├── entities/       # Entidades de domínio
│   │   │   ├── repositories/   # Interfaces e implementações de repositórios
│   │   │   ├── infrastructure/ # Configurações de infraestrutura (ORM, DI)
│   │   │   ├── dtos/          # Data Transfer Objects
│   │   │   ├── errors/        # Classes de erro personalizadas
│   │   │   └── middleware/    # Middlewares Express
│   │   └── public/        # Documentação OpenAPI
│   └── frontend/         # Interface de usuário em React
│       ├── src/
│       │   ├── components/    # Componentes React reutilizáveis
│       │   ├── pages/        # Páginas da aplicação
│       │   ├── context/      # Context API para gerenciamento de estado
│       │   ├── hooks/        # Custom hooks
│       │   ├── types/        # Definições de tipos TypeScript
│       │   └── lib/          # Utilitários e configurações
│       └── public/       # Assets estáticos
├── docs/                 # Documentação e diagramas
└── package.json         # Configuração do monorepo
```

### Arquitetura do Backend

O backend segue os princípios da **Clean Architecture** e **Domain-Driven Design (DDD)**, organizando o código em camadas bem definidas:

```mermaid
graph TB
    subgraph "🌐 Interfaces Externas"
        Controller[Controllers]
        Middleware[Middleware]
        HTTP[HTTP/Express]
    end

    subgraph "📋 Aplicação"
        Services[Services/Use Cases]
        DTOs[DTOs]
    end

    subgraph "🎯 Domínio"
        Entities[Entities]
        BusinessRules[Business Rules]
        DomainServices[Domain Services]
    end

    subgraph "🔧 Infraestrutura"
        Repositories[Repository Implementations]
        ORM[TypeORM]
        Database[(SQLite)]
        DI[Dependency Injection - Inversify]
    end

    HTTP --> Controller
    Controller --> Services
    Services --> Entities
    Services --> Repositories
    Repositories --> ORM
    ORM --> Database
    DI -.-> Services
    DI -.-> Repositories
```

### Contextos Delimitados (DDD)

A aplicação é dividida em contextos delimitados seguindo os princípios do DDD:

```mermaid
graph LR
    subgraph "🔐 Contexto de Autenticação"
        AuthUser[User]
        AuthService[AuthService]
        JWT[JWT Tokens]
    end

    subgraph "🏦 Contexto de Contas"
        Account[Account]
        AccountService[AccountService]
        AccountRepo[AccountRepository]
    end

    subgraph "💸 Contexto de Transações"
        Transaction[Transaction]
        TransactionService[TransactionService]
        TransactionRepo[TransactionRepository]
    end

    AuthService -.->|Autorização| AccountService
    AuthService -.->|Autorização| TransactionService
    TransactionService -->|Operações| Account
```

### Padrão Unit of Work

O backend implementa o padrão **Unit of Work** para gerenciar transações de banco de dados de forma consistente:

```mermaid
sequenceDiagram
    participant C as Controller
    participant S as Service
    participant UoW as UnitOfWork
    participant R as Repository
    participant DB as Database

    C->>S: Chama operação
    S->>UoW: start()
    UoW->>DB: BEGIN TRANSACTION
    S->>R: Operação 1
    R->>DB: SQL Query 1
    S->>R: Operação 2
    R->>DB: SQL Query 2
    S->>UoW: commit()
    UoW->>DB: COMMIT
    S->>C: Retorna resultado

    Note over S,DB: Em caso de erro, UoW.rollback() é chamado
```

### Arquitetura do Frontend

O frontend utiliza React com Context API para gerenciamento de estado e componentes organizados por domínio:

```mermaid
graph TB
    subgraph "🎨 Camada de Apresentação"
        Pages[Pages]
        Components[Components]
        UI[shadcn/ui Components]
    end

    subgraph "🔄 Gerenciamento de Estado"
        Context[React Context]
        Reducers[Reducers]
        Hooks[Custom Hooks]
    end

    subgraph "🌐 Comunicação"
        API[API Calls]
        Auth[Auth Handler]
        Types[TypeScript Types]
    end

    Pages --> Components
    Components --> UI
    Components --> Hooks
    Hooks --> Context
    Context --> Reducers
    Hooks --> API
    API --> Auth
```

## 🤓 Principais decisões arquiteturais

### 1. **Monorepo com NPM Workspaces**

**Decisão**: Organizar o projeto como um monorepo utilizando NPM Workspaces
**Justificativa**:

- Facilita o compartilhamento de dependências e configurações entre frontend e backend
- Permite versionamento unificado e deploy coordenado
- Simplifica o desenvolvimento local com scripts centralizados
- Reduz a complexidade de gerenciamento de múltiplos repositórios

### 2. **Clean Architecture + DDD no Backend**

**Decisão**: Implementar Clean Architecture combinada com Domain-Driven Design
**Justificativa**:

- **Separation of Concerns**: Cada camada tem responsabilidades bem definidas
- **Testabilidade**: Regras de negócio independentes de frameworks e infraestrutura
- **Flexibilidade**: Facilita mudanças de tecnologia sem afetar regras de negócio
- **Manutenibilidade**: Código mais legível e organizadamente estruturado
- **Domínio Central**: Regras de negócio ficam no centro, protegidas de mudanças externas

### 3. **Inversão de Dependência com Inversify**

**Decisão**: Utilizar container de injeção de dependências
**Justificativa**:

- **Desacoplamento**: Módulos dependem apenas de abstrações (interfaces)
- **Testabilidade**: Facilita criação de mocks e stubs para testes
- **Configuração Centralizada**: Todas as dependências configuradas em um local
- **Princípio da Inversão de Dependência**: Implementa o "D" do SOLID

### 4. **Padrão Unit of Work**

**Decisão**: Implementar Unit of Work para gerenciamento de transações
**Justificativa**:

- **Consistência de Dados**: Garante que operações sejam atômicas
- **Performance**: Agrupa múltiplas operações em uma única transação
- **Controle de Concorrência**: Evita problemas de estado inconsistente
- **Rollback Automático**: Em caso de erro, todas as operações são desfeitas

### 5. **Validação Dupla (Frontend + Backend)**

**Decisão**: Implementar validação tanto no frontend quanto no backend usando Zod
**Justificativa**:

- **Segurança**: Backend valida independente do que vem do frontend
- **UX**: Frontend fornece feedback imediato ao usuário
- **Consistência**: Mesmo schema de validação compartilhado (Zod)
- **Programação Defensiva**: Múltiplas camadas de proteção contra dados inválidos

### 6. **SQLite para Desenvolvimento**

**Decisão**: Usar SQLite como banco de dados embarcado
**Justificativa**:

- **Simplicidade**: Zero configuração para desenvolvimento
- **Portabilidade**: Banco de dados em arquivo único
- **Desenvolvimento Rápido**: Ideal para prototipagem e testes
- **Compatibilidade**: Pode ser migrado para PostgreSQL/MySQL em produção

### 7. **Context API no Frontend**

**Decisão**: Usar React Context API ao invés de Redux/Zustand
**Justificativa**:

- **Simplicidade**: Para escopo do projeto, Context API é suficiente
- **Zero Dependencies**: Nativo do React, não adiciona complexidade
- **Type Safety**: Integração natural com TypeScript
- **Padrão Reducer**: Organiza state updates de forma previsível

### 8. **Autenticação JWT Stateless**

**Decisão**: Implementar autenticação stateless com JWT
**Justificativa**:

- **Scalabilidade**: Não requer armazenamento de sessão no servidor
- **Simplicidade**: Token contém todas as informações necessárias
- **Interoperabilidade**: Padrão amplamente aceito para APIs REST
- **Segurança**: Tokens podem ser configurados com expiração automática

## 🧠 Lógica de Desenvolvimento

### Funcionalidades Principais

#### 1. **Sistema de Autenticação**

- **Cadastro de Usuários**: Hash seguro de senhas com bcrypt
- **Login**: Validação de credenciais e geração de JWT
- **Middleware de Autenticação**: Verificação automática de tokens em rotas protegidas
- **Context de Autenticação**: Gerenciamento de estado de login no frontend

#### 2. **Gestão de Contas Bancárias**

- **Criação de Contas**: Validação de dados, geração de número único, definição de saldo inicial
- **Tipos de Conta**: Conta Corrente, Poupança e Investimentos
- **Operações CRUD**: Criar, listar, editar e deletar contas
- **Validações de Negócio**:
  - Saldo mínimo de R$ 1,00
  - Saldo máximo de R$ 10.000,00
  - Usuário só pode operar suas próprias contas

#### 3. **Sistema de Transações**

- **Transferências**: Entre contas do mesmo usuário com validação de saldo
- **Depósitos (Adicionar Fundos)**: Crédito direto na conta
- **Saques (Retirar Fundos)**: Débito com validação de saldo suficiente
- **Histórico**: Listagem com filtros por período (7 dias, 30 dias, 90 dias, 1 ano, todos)
- **Atomicidade**: Todas as operações são transacionais (Unit of Work)

### Fluxo de Dados

#### Backend (API Request Flow)

```
HTTP Request → Middleware → Controller → Service → Repository → Database
              ↓            ↓          ↓        ↓           ↓
         Auth Check → Validation → Business Logic → Data Access → SQLite
```

#### Frontend (State Management Flow)

```
User Action → Component → Hook → Context → API Call → State Update → Re-render
            ↓          ↓     ↓        ↓         ↓            ↓
        Event Handler → Custom Hook → Reducer → HTTP Request → UI Update
```

### Padrões de Validação

#### Entidades de Domínio

- **Account**: Validação de tipo, saldo mínimo/máximo, nome da conta
- **Transaction**: Validação de valor, contas origem/destino, tipos de transação
- **User**: Validação de email único, senha forte, username

#### Builder Pattern para Transações

- **TransferBuilder**: Constrói transações de transferência
- **CreditBuilder**: Constrói transações de crédito
- **DebitBuilder**: Constrói transações de débito
- Validações específicas para cada tipo de transação

### Tratamento de Erros

#### Hierarquia de Erros Personalizados

- **DomainError**: Classe base para erros de domínio
- **BusinessRuleViolationError**: Violações de regras de negócio
- **NotFoundError**: Recursos não encontrados
- **InvalidCredentialsError**: Credenciais inválidas
- **InsufficientFundsError**: Saldo insuficiente
- **UserAlreadyExistsError**: Usuário já existe

#### Middleware de Tratamento Global

- Captura e padroniza respostas de erro
- Log de erros para debugging
- Retorna mensagens user-friendly

## 🧪 Testes

### Estratégia de Testes

O projeto implementa uma **estratégia de testes abrangente** focada em **testes unitários** para garantir a qualidade e confiabilidade do código, especialmente crucial em uma aplicação financeira.

### Cobertura de Testes

**Cobertura Atual**: `100% de statements`, `89.17% de branches`, `100% de funções`

```
--------------------------------|---------|----------|---------|---------|
File                            | % Stmts | % Branch | % Funcs | % Lines |
--------------------------------|---------|----------|---------|---------|
All files                       |     100 |    89.17 |     100 |     100 |
 entities                       |     100 |      100 |     100 |     100 |
 errors                         |     100 |    85.71 |     100 |     100 |
 infrastructure                 |     100 |      100 |     100 |     100 |
 repositories                   |     100 |      100 |     100 |     100 |
 services                       |     100 |    84.31 |     100 |     100 |
```

### Estrutura de Testes

#### 1. **Testes de Entidades** (`entities/`)

- **Account.test.ts**: Validações de criação de conta, types, saldos
- **Transaction.test.ts**: Builders de transação, validações de negócio
- **User.test.ts**: Criação de usuário, validações de dados

#### 2. **Testes de Serviços** (`services/`)

- **AccountService.test.ts**:

  - Criação, listagem, atualização e exclusão de contas
  - Validações de propriedade (usuário só opera suas contas)
  - Validações de saldo mínimo/máximo
  - Transações atômicas com Unit of Work

- **TransactionService.test.ts**:

  - Transferências entre contas
  - Adição e retirada de fundos
  - Validações de saldo suficiente
  - Listagem com filtros de período

- **UserService.test.ts**:
  - Cadastro de usuários
  - Autenticação e geração de tokens
  - Validações de email único
  - Hash de senhas

#### 3. **Sistema de Mocks** (`__tests__/mocks/`)

- **UnitOfWorkMock**: Simula transações de banco de dados
- **AccountRepositoryMock**: Mock do repositório de contas
- **UserRepositoryMock**: Mock do repositório de usuários
- **TransactionRepositoryMock**: Mock do repositório de transações
- **IdGeneratorMock**: Mock para geração de IDs determinísticos
- **PasswordHasherMock**: Mock para hash de senhas
- **TokenServiceMock**: Mock para geração de tokens

### Ferramentas e Configuração

#### Jest Configuration

- **Test Environment**: Node.js
- **Coverage Provider**: V8 (mais rápido e preciso)
- **TypeScript**: Integração com ts-jest
- **Coverage Directory**: `./coverage/`
- **Reports**: HTML, LCOV, JSON, XML (Clover)

#### Comandos de Teste

```bash
# Executar todos os testes
npm run test

# Executar testes no backend
npm run test -w @techlab25/backend

# Executar testes com watch mode
npm run test:watch -w @techlab25/backend
```

### Testes de Integração (Planejado)

Para futuras iterações, estão planejados:

- **Testes de API**: Validação completa dos endpoints
- **Testes de Banco de Dados**: Operações reais com SQLite
- **Testes End-to-End**: Automação completa frontend + backend

### Qualidade dos Testes

#### Características dos Testes Implementados:

- **Isolamento**: Cada teste é independente usando mocks
- **Determinismo**: Resultados previsíveis com dados controlados
- **Cobertura de Cenários**: Testes para casos de sucesso e falha
- **Validação de Regras de Negócio**: Foco em lógica financeira crítica
- **Programação Defensiva**: Validação de entradas e estados inválidos

#### Cenários Críticos Testados:

- ✅ Transações atômicas (rollback em caso de erro)
- ✅ Validações de saldo suficiente
- ✅ Autorização (usuário só acessa suas contas)
- ✅ Regras de negócio financeiras (valores mínimos/máximos)
- ✅ Hash seguro de senhas
- ✅ Geração e validação de tokens JWT
- ✅ Builders de transação com validações específicas
