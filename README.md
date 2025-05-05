# NestJS Tasks - CRUD with JWT Authentication

## Descrição do Projeto

Este projeto contém um CRUD de Tarefas com autenticação JWT. Foi desenvolvido utilizando **Nest.js**, **Prisma ORM** e **SQLite** como banco de dados.

## Table of Contents

- [Descrição do Projeto](#descrição-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Executando no ambiente local (sem Docker)](#executando-no-ambiente-local-sem-docker)
- [Executando no ambiente local com Docker](#executando-no-ambiente-local-com-docker)
- [Configuração do Arquivo `.env`](#configuração-do-arquivo-env)
- [Executando os testes](#executando-os-testes)
- [Documentação Swagger](#documentação-swagger)
- [Exemplos de Uso da API](#exemplos-de-uso-da-api)
- [Observações](#observações)
- [Postman](#postman)

## Pré-requisitos

- **Node.js** versão 22
- **Npm** (vem com o Node.js)
- **Docker** (opcional)
- **Docker-compose** (opcional)

## Executando no ambiente local (sem Docker)

1. Clone o repositório:

   ```bash
   git clone https://github.com/mickelangelopohren/nestjs-tasks.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd nestjs-tasks
   ```

3. Instale as dependências do Node.js:

   ```bash
   npm install
   ```

4. Crie um arquivo `.env`. Você pode usar o arquivo `.env.example` como base:

   ```bash
   cp .env.example .env
   ```

5. Execute o comando abaixo para gerar a primeira migração, popular o banco de dados e gerar os arquivos do Prisma:

   ```bash
   npm run prisma:dev
   ```

6. Inicie a aplicação em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```

## Executando no ambiente local com Docker

1. Clone o repositório:

   ```bash
   git clone https://github.com/mickelangelopohren/nestjs-tasks.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd nestjs-tasks
   ```

3. Execute o comando abaixo para construir e iniciar a aplicação:
   ```bash
   docker-compose up
   ```

## Configuração do Arquivo `.env`

O arquivo `.env` deve conter as seguintes variáveis:

- `DATABASE_URL`: URL de conexão com o banco de dados.
- `JWT_SECRET`: Chave secreta para geração de tokens JWT.
- `JWT_EXPIRATION`: Tempo de expiração do token JWT (exemplo: `600s` para 10 minutos).
- `PORT`: Porta onde a aplicação será executada (padrão: 3000).

## Executando os testes

- Para testes unitários:

  ```bash
  npm run test
  ```

- Para testes ponto-a-ponto (e2e):

  ```bash
  npm run test:e2e
  ```

- Para obter a cobertura dos testes:
  ```bash
  npm run test:cov
  ```

## Documentação Swagger

A documentação Swagger pode ser encontrada nos seguintes endpoints:

- **Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Documentação JSON**: [http://localhost:3000/docs/json](http://localhost:3000/docs/json)

> [!NOTE]
>
> **Nota**: A porta deve refletir a configurada no arquivo `.env`.

## Exemplos de Uso da API

### Criar uma Tarefa

```bash
curl --location 'http://localhost:3000/v1/tasks' \
--header 'Authorization: Bearer <TOKEN>' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Nova Tarefa",
    "description": "Descrição da tarefa"
}'
```

### Listar Tarefas

```bash
curl --location 'http://localhost:3000/v1/tasks' \
--header 'Authorization: Bearer <TOKEN>'
```

### Autenticação

```bash
curl --location 'http://localhost:3000/v1/auth/signin' \
--header 'Content-Type: application/json' \
--data '{
    "userName": "userAdmin",
    "password": "adminPass"
}'
```

## Observações

> [!IMPORTANT]
>
> 1.  **Prefixo de versão nas rotas**: Com exceção da documentação Swagger, todas as rotas estão versionadas. É necessário utilizar o prefixo `/v1/`.  
>     Exemplo: `http://localhost:3000/v1/tasks`

> [!IMPORTANT]
>
> 2. **Rotas protegidas**: As rotas de gerenciamento de tarefas estão protegidas. É necessário autenticar-se utilizando as credenciais abaixo:

```json
{
  "userName": "userAdmin",
  "password": "adminPass"
}
```

> [!NOTE]
>
> 3.  **Credenciais fixas**: As credenciais acima estão fixadas no banco e não podem ser alteradas via chamada.

## Postman

Os arquivos da coleção do Postman e do ambiente estão localizados na pasta `postman` no diretório raiz do projeto.

- **Caminho**: `postman/`
- **Arquivos disponíveis**:
  - `nestjs-tasks.postman_collection.json`: Contém as requisições configuradas para a API.
  - `nestjs-tasks.postman_environment.json`: Contém as variáveis de ambiente para facilitar os testes.

### Como importar no Postman

1. Abra o Postman.
2. Clique em **Import** no canto superior esquerdo.
3. Selecione os arquivos da pasta `postman/`:
   - Coleção: `nestjs-tasks.postman_collection.json`
   - Ambiente: `nestjs-tasks.postman_environment.json`
4. Após importar, selecione o ambiente no canto superior direito do Postman para utilizá-lo.
