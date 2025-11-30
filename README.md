# Sistema de Receitas Culinárias

Sistema completo de gerenciamento de receitas culinárias com frontend em Vue 3 e backend em NestJS.

## Visão Geral

Este projeto é uma aplicação full-stack que permite aos usuários:
- Navegar e buscar receitas culinárias
- Filtrar receitas por categorias
- Criar conta e autenticar-se
- Criar, editar e gerenciar suas próprias receitas
- Visualizar receitas de outros usuários

## Tecnologias Principais

### Frontend
- Vue 3 + TypeScript
- Vuetify 3 (Material Design)
- Pinia (Gerenciamento de Estado)
- Vite

### Backend
- NestJS + TypeScript
- TypeORM
- MySQL
- JWT Authentication
- Swagger (Documentação da API)

## Pré-requisitos

- **Docker** e **Docker Compose** (recomendado)
- **Node.js** >= 20.19.0 (apenas se rodar localmente sem Docker)

## Início Rápido

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd desafio_receitas_culinarias
```

### 2. Configure as Variáveis de Ambiente

#### Backend

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `backend/.env` com suas configurações. Para Docker, use:

```env
DB_HOST=backend-backend-nest-mysql-1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=123123
DB_DATABASE=teste_receitas_rg_sistemas
NODE_ENV=development
APP_PORT=3000
JWT_SECRET=secretKey
JWT_EXPIRES_IN=1800s
CORS_ORIGINS=http://localhost:5173
CORS_CREDENTIALS=true
```

#### Frontend

```bash
cd ../frontend
cp .env.example .env
```

Edite o arquivo `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:9561
```

### 3. Executar com Docker (Recomendado)

#### Opção A: Iniciar Backend e Frontend Separadamente

**Backend:**
```bash
cd backend
docker-compose up -d --build
```

**Frontend:**
```bash
cd frontend
docker-compose up -d --build
```

#### Opção B: Rodar Localmente (Alternativa)

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:9561
- **Documentação Swagger**: http://localhost:9561/api/

## Estrutura do Projeto

```
desafio_receitas_culinarias/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── modules/     # Módulos da aplicação (auth, users, recipes, categories)
│   │   ├── common/      # Código compartilhado
│   │   ├── cli/         # Comandos CLI
│   │   └── seeds/       # Seeds do banco de dados
│   ├── docker/          # Configurações Docker
│   ├── .env.example     # Exemplo de variáveis de ambiente
│   └── README.md        # Documentação detalhada do backend
│
└── frontend/            # Interface Vue 3
    ├── src/
    │   ├── components/  # Componentes reutilizáveis
    │   ├── views/       # Páginas da aplicação
    │   ├── stores/      # Stores Pinia
    │   └── router/      # Rotas da aplicação
    ├── .env.example     # Exemplo de variáveis de ambiente
    └── README.md        # Documentação detalhada do frontend
```

## Documentação Detalhada

Para informações mais detalhadas sobre cada parte do projeto:

- **[Backend README](./backend/README.md)** - Informações sobre API, testes, seeds, e troubleshooting
- **[Frontend README](./frontend/README.md)** - Informações sobre componentes, testes, e funcionalidades

## Funcionalidades Principais

### Públicas (Sem Autenticação)
- Visualizar lista de receitas
- Buscar receitas por nome
- Filtrar receitas por categoria
- Visualizar detalhes de uma receita
- Criar conta e fazer login

### Privadas (Requer Autenticação)
- Criar novas receitas
- Editar receitas próprias
- Excluir receitas próprias
- Visualizar e editar perfil
- Gerenciar suas receitas

## Seed de Dados (Opcional)

Para popular o banco de dados com receitas de exemplo:

```bash
cd backend
npm run cli -- seed:recipes -c 100
```

## Parar os Serviços

```bash
# Backend
cd backend
docker-compose down

# Frontend
cd frontend
docker-compose down
```

Para remover também os volumes (limpar banco de dados):

```bash
cd backend
docker-compose down -v
```

## Testes

### Backend
```bash
cd backend
npm test                # Testes unitários
npm run test:e2e       # Testes E2E
npm run test:cov       # Cobertura de testes
```

### Frontend
```bash
cd frontend
npm run test:unit      # Testes unitários
npm run test:e2e       # Testes E2E com Cypress
```

## Troubleshooting

### Backend não conecta ao banco de dados
- Verifique se o `DB_HOST` no `.env` está correto
- Com Docker: `DB_HOST=backend-backend-nest-mysql-1`
- Localmente: `DB_HOST=localhost`

### Frontend não consegue acessar a API
- Verifique se o backend está rodando em `http://localhost:9561`
- Verifique a variável `VITE_API_BASE_URL` no `frontend/.env`
- Verifique as configurações de CORS no backend

### Porta já em uso
- Modifique as portas nos arquivos `docker-compose.yml` de cada projeto
- Ou modifique as variáveis de ambiente nos arquivos `.env`

### Resetar banco de dados
```bash
cd backend
docker-compose down -v
docker-compose up -d --build
npm run seed:recipes
```

## Suporte

Para mais detalhes sobre configurações específicas, consulte os READMEs de cada projeto:
- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)
