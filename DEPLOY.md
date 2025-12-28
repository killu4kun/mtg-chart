# 🚀 Guia de Deploy - MTG Tournament Manager

Este guia te ajudará a fazer o deploy completo do projeto na Vercel com banco de dados PostgreSQL gratuito usando **Neon** (recomendado pela Vercel).

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com) (gratuita)
2. Conta no [Neon](https://neon.tech) (gratuita)
3. Conta no [GitHub](https://github.com), [GitLab](https://gitlab.com) ou [Bitbucket](https://bitbucket.org)
4. Projeto commitado em um repositório Git

## 💾 Passo 1: Criar Banco de Dados no Neon (GRATUITO - RECOMENDADO)

### 1.1. Criar Conta e Projeto

1. Acesse [neon.tech](https://neon.tech)
2. Clique em **"Sign Up"** (pode usar GitHub para facilitar)
3. Após login, clique em **"Create a project"**
4. Configure:
   - **Name**: `mtg-tournament` (ou qualquer nome)
   - **Region**: Escolha a região mais próxima (ex: `AWS us-east-1` para EUA)
   - **PostgreSQL version**: Deixe o padrão (15 ou 16)
5. Clique em **"Create project"**
6. Aguarde ~30 segundos para o banco ser criado

### 1.2. Obter String de Conexão

1. No dashboard do Neon, você verá a **Connection string** na tela inicial
2. Selecione **"Pooled connection"** (recomendado para serverless)
3. Copie a string que aparece (algo como: `postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`)
4. **IMPORTANTE**: Guarde essa string, você precisará no próximo passo!

**Alternativa - Via Vercel Marketplace (MAIS FÁCIL)**:
- Continue no Passo 2 e use a integração direta do Vercel Marketplace

## 🌐 Passo 2: Deploy na Vercel

### 2.1. Importar Projeto

1. Acesse [vercel.com](https://vercel.com)
2. Faça login ou crie uma conta
3. Clique em **"Add New..."** → **"Project"**
4. Importe seu repositório Git
5. A Vercel detectará automaticamente que é um projeto Next.js

### 2.2. Adicionar Integração Neon (RECOMENDADO)

1. Na tela de configuração do projeto, role até **"Integrations"**
2. Clique em **"Browse Marketplace"**
3. Procure por **"Neon"**
4. Clique em **"Add Integration"** → **"Add"**
5. Siga as instruções:
   - Conecte sua conta Neon
   - Selecione o projeto que você criou
   - A Vercel criará automaticamente as variáveis de ambiente!

**Vantagem**: A integração cria automaticamente as variáveis `POSTGRES_URL` para você!

### 2.3. Ou Configurar Manualmente

Se preferir configurar manualmente:

1. Na tela de configuração, clique em **"Environment Variables"**
2. Adicione:
   - **Key**: `POSTGRES_URL`
   - **Value**: Cole a connection string que você copiou do Neon
   - **Environments**: Selecione todas (Production, Preview, Development)
3. Clique em **"Save"**

### 2.4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (pode levar alguns minutos)
3. Sua aplicação estará disponível em uma URL da Vercel

## 🗄️ Passo 3: Inicializar o Banco de Dados

Após o deploy, você precisa inicializar as tabelas no banco de dados.

### Opção 1: Via API (Recomendado)

Faça uma requisição POST:

```bash
# Substitua SEU_APP pela URL do seu projeto Vercel
curl -X POST https://seu-app.vercel.app/api/db/init
```

**Ou via navegador (JavaScript Console)**:
```javascript
fetch('https://seu-app.vercel.app/api/db/init', { method: 'POST' })
  .then(r => r.json())
  .then(console.log);
```

### Opção 2: Via Neon SQL Editor

1. No dashboard do Neon, vá em **"SQL Editor"** (menu lateral)
2. Clique em **"New Query"**
3. Cole o conteúdo do schema (veja `lib/db/index.ts` para as queries)
4. Clique em **"Run"**

## 🎯 Passo 4: Inicializar Dados de Exemplo (Opcional)

Se quiser ter dados de exemplo para testar:

```bash
curl -X POST https://seu-app.vercel.app/api/init
```

## ✅ Passo 5: Verificar se Está Funcionando

1. Acesse sua aplicação: `https://seu-app.vercel.app`
2. Teste criar um jogador
3. Verifique se os dados persistem após recarregar a página
4. Crie uma partida e verifique se tudo funciona

## 🔍 Verificando a Conexão

No Neon:
1. Vá em **"Tables"** no dashboard
2. Você deve ver as tabelas criadas: `players`, `decks`, `matches`, `match_participants`

## 🐛 Troubleshooting

### Erro: "Cannot find module 'pg'"

Certifique-se de que o pacote está instalado e commitado:

```bash
yarn add pg @types/pg
git add package.json yarn.lock
git commit -m "Add pg driver"
git push
```

### Erro: "password authentication failed"

- Verifique se a string de conexão está correta
- Se usou a integração do Marketplace, verifique se a conexão foi estabelecida

### Erro: "relation does not exist"

O banco ainda não foi inicializado. Execute:

```bash
curl -X POST https://seu-app.vercel.app/api/db/init
```

### Erro de conexão com banco

1. Verifique se a variável `POSTGRES_URL` está configurada na Vercel (Settings → Environment Variables)
2. Verifique se o projeto do Neon está ativo
3. Tente usar a connection string **"Pooled"** ao invés de "Direct"

### Como ver os logs

**Vercel:**
1. No dashboard da Vercel, vá em **Deployments**
2. Clique no deployment
3. Clique em **Functions** para ver logs

**Neon:**
1. No dashboard do Neon, vá em **"Metrics"** para ver estatísticas de conexão

## 📊 Limites do Plano Gratuito do Neon

- **10 GB** de storage
- **100 GB** de transferência de dados por mês
- **100 conexões simultâneas**
- Backups automáticos
- Branching de banco de dados (feature muito legal!)

Muito mais generoso que outras opções!

## 🔄 Alternativa: Supabase

Se preferir usar Supabase ao invés de Neon:

1. Crie conta em [supabase.com](https://supabase.com)
2. Crie um projeto
3. Vá em Settings → Database → Connection string
4. Copie a URI connection string
5. Adicione como `POSTGRES_URL` na Vercel
6. O resto do processo é igual!

**Limites Supabase Free**:
- 500 MB storage
- 2 GB bandwidth/mês

## 🚀 Por que Neon?

- ✅ **Recomendado oficialmente pela Vercel** (migração do Vercel Postgres)
- ✅ **10GB gratuitos** (muito mais que outras opções)
- ✅ **Integração fácil via Marketplace**
- ✅ **PostgreSQL serverless** (paga só pelo que usa)
- ✅ **Branching de banco de dados** (excelente para desenvolvimento)

## 📝 Notas Importantes

- Use a connection string **"Pooled"** do Neon (otimizada para serverless)
- O código já está atualizado para usar `pg` que funciona com qualquer PostgreSQL
- As queries são compatíveis com PostgreSQL padrão
- Você pode gerenciar o banco diretamente no dashboard do Neon

## 🎓 Resumo Visual do Fluxo

```
1. Criar projeto no Neon → Obter connection string
   OU
   Vercel Marketplace → Integração Neon (automático!)
   ↓
2. Git Push → GitHub/GitLab
   ↓
3. Vercel Import Project → Adicionar POSTGRES_URL (ou via integração)
   ↓
4. Deploy na Vercel
   ↓
5. POST /api/db/init (criar tabelas)
   ↓
6. ✅ App funcionando com DB persistente no Neon!
```
