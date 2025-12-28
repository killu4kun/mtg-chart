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

Este projeto está pronto para deploy na Vercel com banco de dados PostgreSQL persistente.

### Passos para Deploy:

1. **Conecte seu repositório à Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório Git
   - A Vercel detectará automaticamente que é um projeto Next.js

2. **Configure o Banco de Dados PostgreSQL**:
   - No dashboard da Vercel, vá em **Storage**
   - Clique em **Create Database** → **Postgres**
   - Escolha um nome para o banco (ex: `mtg-db`)
   - Selecione uma região próxima a você
   - Clique em **Create**

3. **Configure as Variáveis de Ambiente**:
   - Na Vercel, vá em **Settings** → **Environment Variables**
   - A Vercel cria automaticamente as variáveis quando você conecta um banco Postgres
   - As variáveis incluem:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`
   - **Importante**: Não é necessário configurar manualmente, a Vercel faz isso automaticamente!

4. **Inicialize o Banco de Dados**:
   - Após o deploy, acesse: `https://seu-app.vercel.app/api/db/init`
   - Ou faça uma requisição POST para `/api/db/init` (opcional, será inicializado automaticamente no primeiro uso)
   - Para dados de exemplo, faça POST para `/api/init`

5. **Configurações Recomendadas**:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Build Command**: `yarn build` (ou `npm run build`)
   - **Output Directory**: `.next` (padrão do Next.js)
   - **Install Command**: `yarn install` (ou `npm install`)

6. **Deploy**:
   - Clique em "Deploy"
   - Aguarde o build e deploy
   - Sua aplicação estará disponível em uma URL da Vercel

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

O projeto usa **Vercel Postgres** para persistência de dados. Os dados são armazenados de forma permanente e não são perdidos quando o servidor reinicia.

### Estrutura do Banco:

- **players**: Armazena informações dos jogadores
- **decks**: Armazena os decks de cada jogador
- **matches**: Armazena as partidas realizadas
- **match_participants**: Relaciona jogadores e decks com partidas

### Inicialização:

O banco de dados é inicializado automaticamente na primeira requisição. Se precisar reinicializar:

```bash
# Via API
curl -X POST https://seu-app.vercel.app/api/db/init

# Ou adicione dados de exemplo
curl -X POST https://seu-app.vercel.app/api/init
```

### Desenvolvimento Local:

Para desenvolvimento local, você pode usar:

1. **Vercel CLI** (recomendado):
   ```bash
   npm i -g vercel
   vercel link
   vercel env pull .env.local
   ```

2. **PostgreSQL local**:
   - Instale PostgreSQL localmente
   - Crie um arquivo `.env.local`:
     ```
     POSTGRES_URL="postgresql://user:password@localhost:5432/mtg"
     ```

### Migrações:

O schema é criado automaticamente na primeira inicialização. Para alterar o schema, edite `lib/db/index.ts` e faça uma nova requisição para `/api/db/init`.

## 📝 Licença

MIT

