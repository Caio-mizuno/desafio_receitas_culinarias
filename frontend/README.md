# Frontend - Sistema de Receitas Culinárias

Interface web moderna desenvolvida com Vue 3 e Vuetify para navegação e gerenciamento de receitas culinárias.

## Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Superset tipado do JavaScript
- **Vuetify 3** - Framework de componentes Material Design
- **Pinia** - Gerenciamento de estado oficial do Vue
- **Vue Router** - Roteamento oficial do Vue
- **Vite** - Build tool e dev server ultrarrápido
- **Axios** - Cliente HTTP
- **Vitest** - Framework de testes unitários
- **Cypress** - Framework de testes E2E

## Pré-requisitos

- Docker e Docker Compose (recomendado)
- Node.js >= 20.19.0 ou >= 22.12.0 (apenas se rodar localmente)

## Configuração

### Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure a URL da API:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:9561
```

## Executando o Projeto

### Com Docker (Recomendado)

```bash
# Iniciar o serviço frontend
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar o serviço
docker-compose down
```

**A aplicação estará disponível em:** `http://localhost:5173`

### Localmente (Alternativo)

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

**A aplicação estará disponível em:** `http://localhost:5173`

## Build

```bash
# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Type checking
npm run type-check
```

O build é gerado em `dist/` e pode ser servido por qualquer servidor web estático.

## Testes

### Testes Unitários

```bash
# Executar testes unitários
npm run test:unit

# Executar em modo watch
npm run test:unit -- --watch

# Gerar relatório de cobertura
npm run test:unit -- --coverage
```

### Testes E2E (End-to-End)

```bash
# Executar testes E2E em modo headless (CI)
npm run test:e2e

# Abrir Cypress em modo interativo
npm run test:e2e:dev
```

**Nota**: Os testes E2E requerem que a aplicação esteja rodando.

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── assets/           # Recursos estáticos (imagens, estilos)
│   ├── components/       # Componentes Vue reutilizáveis
│   ├── router/           # Configuração de rotas
│   ├── stores/           # Stores Pinia (estado global)
│   ├── types/            # Definições TypeScript
│   ├── views/            # Páginas/Views da aplicação
│   │   ├── public/      # Views públicas (sem autenticação)
│   │   └── private/     # Views privadas (requerem autenticação)
│   ├── plugins/          # Plugins Vue (Vuetify, etc)
│   └── main.ts           # Entrada da aplicação
├── cypress/              # Testes E2E
└── public/               # Arquivos públicos estáticos
```

## Funcionalidades

### Páginas Públicas
- **Home** - Listagem de receitas com busca e filtros
- **Detalhes da Receita** - Visualização completa da receita
- **Categorias** - Navegação por categorias
- **Login/Registro** - Autenticação de usuários

### Páginas Privadas (Autenticadas)
- **Perfil** - Visualização e edição do perfil do usuário
- **Minhas Receitas** - Gerenciamento das receitas do usuário
- **Nova Receita** - Criação de novas receitas
- **Editar Receita** - Edição de receitas existentes

## Gerenciamento de Estado

O projeto utiliza Pinia com as seguintes stores:
- **authStore** - Autenticação e dados do usuário
- **recipeStore** - Receitas e operações relacionadas
- **categoryStore** - Categorias de receitas

## Troubleshooting

### Erro ao conectar com a API

Verifique se:
1. O backend está rodando em `http://localhost:9561`
2. A variável `VITE_API_BASE_URL` está correta no `.env`
3. CORS está configurado no backend

### Erro com Cypress

Reinstalar o Cypress:

```bash
npm run prepare
# ou
npx cypress install
```

### Problemas com tipos TypeScript

```bash
npm run type-check
```

### Porta já em uso

O Vite automaticamente usará a próxima porta disponível (5174, 5175, etc).

Para forçar uma porta específica:

```bash
npm run dev -- --port 3000
```

## Qualidade de Código

```bash
# Executar linters
npm run lint

# Formatar código
npm run format
```
