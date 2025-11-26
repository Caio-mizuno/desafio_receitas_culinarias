## Objetivo

O desafio consiste em implementar o máximo de funcionalidades descritas abaixo e enviar o projeto dentro do prazo estabelecido pela empresa.

## Funcionalidades

* Cadastro de usuário no sistema.
* Login de usuário.
* Logoff de usuário.
* Cadastro de receitas pelo usuário.
* Pesquisa de receitas cadastradas pelo usuário.
* Edição de uma receita.
* Exclusão de uma receita.
* Impressão de uma receita.

## Banco de Dados

Nos arquivos enviados, há uma pasta chamada **banco**, que contém detalhes sobre a modelagem do banco de dados e scripts SQL para sua criação.

## Restrições

### Desenvolvedor Web - Full Stack / Tech Lead

* Utilize **Node.js** com **TypeScript** para construir uma **API RESTful** no backend.
* No frontend, utilize **Vue.js** para criar a interface que se comunicará com o backend.
* O banco de dados deve ser **MySQL**.
* Inclua um **guia detalhado** explicando como rodar o sistema.
* **Diferenciais:** Documentação de API (**Swagger**), uso de **Docker** e implementação de **testes unitários e de integração (E2E)**.  

### Tecnologias

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

### Descrição

RESTful API que permite o acesso de rotas privadas e públicas para aplicativo app-backend-nest.

### Passos para rodar o projeto:

#### Instale as dependencias

abra o terminal e rode os comandos:

```bash
npm install
```

#### Criando variaveis de ambiete

Crie um arquivo .env na raiz do projeto seguindo o template abaixo:

#### Email Configuration

- EMAIL_HOST=smtp.gmail.com
- EMAIL_USER=
- EMAIL_PASS=

#### Database Configuration

- DB_HOST=host.docker.internal
- DB_PORT=10000
- DB_USERNAME=root
- DB_PASSWORD=123123
- DB_DATABASE=local_db

#### Node Environment

- NODE_ENV=development
- APP_PORT=3000

#### JWT Secret

- JWT_SECRET=secretKey
- JWT_EXPIRES_IN=1800s

#### Comando para rodar testes

```bash
npx jest
```

#### Comandos para rodar o projeto

abra o terminal e rode esses comandos:

- subir container com banco de dados

```bash
docker compose up
```

- rodar aplicação nestjs

```bash
npm run start
```

#### Usuario padrão

- email: admin@email.com
- senha: admin

#### Documentação

Para vizualizar documentaçao das rotas acesse:

```
http://localhost:3000/api#/
```
