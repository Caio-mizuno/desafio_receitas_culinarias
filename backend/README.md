# Backend - Sistema de Receitas Culinárias

API REST desenvolvida com NestJS para gerenciamento de receitas culinárias, categorias e usuários.

## Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Superset tipado do JavaScript
- **TypeORM** - ORM para TypeScript e JavaScript
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **Swagger** - Documentação automática da API
- **Jest** - Framework de testes
- **Docker** - Containerização da aplicação

## Pré-requisitos

- Docker e Docker Compose
- Node.js >= 20.x (apenas se rodar localmente)
- MySQL 8.x (apenas se rodar localmente)

## Configuração

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

Para rodar com Docker, use estas configurações no `.env`:

```env
# Database Configuration
DB_HOST=backend-backend-nest-mysql-1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=123123
DB_DATABASE=teste_receitas_rg_sistemas

# Application
NODE_ENV=development
APP_PORT=3000

# JWT
JWT_SECRET=secretKey
JWT_EXPIRES_IN=1800s

# CORS
CORS_ORIGINS=http://localhost:5173
CORS_CREDENTIALS=true
```

## Executando o Projeto

### Com Docker (Recomendado)

O Docker Compose irá subir o backend, nginx e MySQL automaticamente:

```bash
# Iniciar todos os serviços
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar os serviços
docker-compose down

# Remover volumes (limpa banco de dados)
docker-compose down -v
```

**A API estará disponível em:** `http://localhost:9561`

### Localmente (Alternativo)

Certifique-se de ter o MySQL rodando e configure o `.env` com `DB_HOST=localhost`.

```bash
# Instalar dependências
npm install

# Modo desenvolvimento (com hot reload)
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

**A API estará disponível em:** `http://localhost:3000`

## Documentação da API

Acesse a documentação Swagger em:

```
http://localhost:9561/api/docs
```

## Build

```bash
# Build do projeto
npm run build

# Build é gerado em dist/
```

## Testes

```bash
# Executar todos os testes unitários
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:cov

# Executar testes e2e
npm run test:e2e
```

### Cobertura de Testes

O projeto possui requisitos mínimos de cobertura:
- **Branches**: 50%
- **Functions**: 58%
- **Lines**: 71%
- **Statements**: 71%

## Seed de Dados

Para popular o banco de dados com receitas de exemplo:

```bash
# Via script NPM
npm run seed:recipes

# Via CLI
npm run cli -- seed recipes
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── modules/           # Módulos da aplicação
│   │   ├── auth/         # Autenticação e autorização
│   │   ├── users/        # Gestão de usuários
│   │   ├── recipes/      # Gestão de receitas
│   │   └── categories/   # Gestão de categorias
│   ├── common/           # Código compartilhado
│   ├── config/           # Configurações
│   ├── cli/              # Comandos CLI
│   ├── seeds/            # Seeds do banco de dados
│   └── main.ts           # Entrada da aplicação
├── test/                 # Testes e2e
├── docker/               # Configurações Docker
└── docker-compose.yml    # Configuração Docker Compose
```

## Endpoints Principais

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login de usuário
- `GET /auth/profile` - Obter perfil do usuário autenticado

### Receitas
- `GET /recipes` - Listar receitas (com filtros e paginação)
- `GET /recipes/:id` - Obter receita por ID
- `POST /recipes` - Criar nova receita (autenticado)
- `PUT /recipes/:id` - Atualizar receita (autenticado)
- `DELETE /recipes/:id` - Deletar receita (autenticado)

### Categorias
- `GET /categories` - Listar categorias
- `GET /categories/:id` - Obter categoria por ID
- `POST /categories` - Criar categoria (autenticado)
- `PUT /categories/:id` - Atualizar categoria (autenticado)
- `DELETE /categories/:id` - Deletar categoria (autenticado)

## Troubleshooting

### Erro de conexão com o banco de dados

Certifique-se de que o `DB_HOST` no `.env` está correto:
- **Com Docker**: `DB_HOST=backend-backend-nest-mysql-1`
- **Localmente**: `DB_HOST=localhost`

### Porta já em uso

Se a porta estiver em uso:
- **Docker**: modifique a porta em `docker-compose.yml`
- **Local**: modifique `APP_PORT` no `.env`

### Resetar banco de dados

```bash
docker-compose down -v
docker-compose up -d --build
```
