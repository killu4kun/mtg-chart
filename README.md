# MTG Tournament Manager

Sistema de gerenciamento de torneios de Magic: The Gathering construído com Next.js 16, React 19 e TypeScript.

## 🚀 Funcionalidades

- **Gerenciamento de Jogadores**: Adicione e gerencie jogadores do torneio
- **Gerenciamento de Decks**: Associe decks aos jogadores
- **Partidas**: Crie partidas com no mínimo 4 jogadores
- **Estatísticas**: Acompanhe vitórias, derrotas e taxa de vitória de jogadores e decks
- **Dashboard**: Visão geral do torneio com métricas em tempo real

## 🛠️ Tecnologias

- **Next.js 16.1.1** (App Router)
- **React 19.2.3**
- **TypeScript 5.9.3**
- **Tailwind CSS 3.4.1**
- **Lucide React** (ícones)
- **date-fns** (formatação de datas)

## 📦 Instalação

```bash
# Instalar dependências
yarn install

# Executar em desenvolvimento
yarn dev

# Build para produção
yarn build

# Executar em produção
yarn start
```

## 🌐 Deploy na Vercel

Este projeto está pronto para deploy na Vercel com banco de dados PostgreSQL gratuito.

### 📖 Guia Completo de Deploy

Para um guia detalhado passo a passo, consulte [DEPLOY.md](./DEPLOY.md)

### Resumo Rápido:

1. **Crie o banco de dados no Neon (GRATUITO - RECOMENDADO)**:
   - Acesse [neon.tech](https://neon.tech) e crie uma conta
   - Crie um novo projeto
   - Copie a connection string (use "Pooled connection")

2. **Importe o projeto na Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório Git
   - **Integração Neon** (recomendado): Vá em Integrations → Browse Marketplace → Neon
   - **Ou manualmente**: Adicione `POSTGRES_URL` nas Environment Variables com a connection string

3. **Deploy e inicialize**:
   - Clique em "Deploy"
   - Execute: `POST https://seu-app.vercel.app/api/db/init` para criar as tabelas
   - (Opcional) Execute: `POST https://seu-app.vercel.app/api/init` para dados de exemplo

**Por que Neon?**
- ✅ Recomendado oficialmente pela Vercel
- ✅ 10GB gratuitos (muito mais que outras opções)
- ✅ Integração fácil via Marketplace
- ✅ PostgreSQL serverless otimizado

## 📁 Estrutura do Projeto

```
mtg/
├── app/                    # Next.js App Router
│   ├── api/               # Rotas API
│   │   ├── players/       # API de jogadores
│   │   ├── decks/         # API de decks
│   │   ├── matches/       # API de partidas
│   │   └── stats/         # API de estatísticas
│   ├── dashboard/         # Dashboard principal
│   ├── players/           # Página de jogadores
│   ├── matches/           # Página de partidas
│   └── stats/             # Página de estatísticas
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI base
│   └── ...               # Componentes específicos
├── lib/                  # Bibliotecas e utilitários
│   ├── data.ts          # Lógica de dados (backend)
│   ├── api.ts           # Cliente API (frontend)
│   └── types.ts         # Tipos TypeScript
└── public/              # Arquivos estáticos
```

## 🔌 API Routes

O projeto usa Next.js API Routes (App Router):

- `GET /api/players` - Listar todos os jogadores
- `POST /api/players` - Criar jogador
- `GET /api/players/[id]` - Buscar jogador por ID
- `DELETE /api/players/[id]` - Deletar jogador
- `GET /api/decks` - Listar decks (opcional: ?playerId=xxx)
- `POST /api/decks` - Criar deck
- `GET /api/decks/[id]` - Buscar deck por ID
- `DELETE /api/decks/[id]` - Deletar deck
- `GET /api/matches` - Listar todas as partidas
- `POST /api/matches` - Criar partida
- `GET /api/matches/[id]` - Buscar partida por ID
- `DELETE /api/matches/[id]` - Deletar partida
- `GET /api/stats` - Listar estatísticas (opcional: ?playerId=xxx)
- `GET /api/decks/stats/[id]` - Estatísticas de um deck
- `POST /api/init` - Inicializar dados de exemplo

## 💾 Banco de Dados

O projeto usa **PostgreSQL** com **Neon** (recomendado pela Vercel) ou **Supabase** (alternativa gratuita). Os dados são armazenados de forma permanente e não são perdidos quando o servidor reinicia.

### Estrutura do Banco:

- **players**: Armazena informações dos jogadores
- **decks**: Armazena os decks de cada jogador
- **matches**: Armazena as partidas realizadas
- **match_participants**: Relaciona jogadores e decks com partidas

### Por que Neon?

- ✅ **10GB gratuitos** (mais que outras opções)
- ✅ **Recomendado oficialmente pela Vercel**
- ✅ **Integração fácil via Marketplace**
- ✅ **PostgreSQL serverless otimizado**

### Inicialização:

Após o deploy na Vercel, inicialize o banco fazendo:

```bash
# Criar as tabelas
curl -X POST https://seu-app.vercel.app/api/db/init

# (Opcional) Adicionar dados de exemplo
curl -X POST https://seu-app.vercel.app/api/init
```

### Desenvolvimento Local:

Para desenvolvimento local, você pode usar:

1. **Vercel CLI** (recomendado):
   ```bash
   npm i -g vercel
   vercel link
   vercel env pull .env.local
   yarn dev
   ```

2. **PostgreSQL local ou Neon/Supabase local**:
   - Crie um arquivo `.env.local`:
     ```
     POSTGRES_URL="postgresql://user:password@host:5432/database"
     ```

### Migrações:

O schema é criado automaticamente quando você executa `/api/db/init`. Para alterar o schema, edite `lib/db/index.ts` e faça uma nova requisição para `/api/db/init`.

## 📝 Licença

MIT

