# 💻 Guia de Desenvolvimento Local

Este guia mostra como configurar e rodar o projeto localmente com acesso ao banco de dados Neon.

## 📋 Pré-requisitos

- ✅ Node.js instalado (v18 ou superior)
- ✅ Yarn instalado
- ✅ Conta no Neon criada
- ✅ Connection string do Neon

## 🚀 Passo 1: Instalar Dependências

Se ainda não instalou as dependências:

```powershell
yarn install
```

## 🔧 Passo 2: Configurar Variáveis de Ambiente Locais

### Opção A: Arquivo `.env.local` (Recomendado)

1. **Crie um arquivo `.env.local`** na raiz do projeto (mesmo nível do `package.json`)

2. **Adicione sua connection string**:

```env
POSTGRES_URL=postgresql://neondb_owner:npg_0hXHFwDPV5Qe@ep-muddy-river-ahhos7ep-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**⚠️ IMPORTANTE:**
- Substitua pela sua connection string real do Neon
- Sem aspas ao redor da URL
- O arquivo `.env.local` já está no `.gitignore`, então não será commitado

### Opção B: Variável de Ambiente do Sistema (Windows PowerShell)

Para a sessão atual do PowerShell:

```powershell
$env:POSTGRES_URL = "postgresql://neondb_owner:npg_0hXHFwDPV5Qe@ep-muddy-river-ahhos7ep-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Nota**: Essa variável só dura enquanto o terminal estiver aberto. Use a Opção A para persistência.

### Opção C: Variável de Ambiente do Sistema (Windows - Permanente)

Para definir permanentemente (não recomendado se você usa múltiplos projetos):

1. **Abra as Variáveis de Ambiente do Windows**:
   - Pressione `Win + R`
   - Digite `sysdm.cpl` e pressione Enter
   - Vá em "Avançado" → "Variáveis de Ambiente"

2. **Adicione**:
   - Nome: `POSTGRES_URL`
   - Valor: Sua connection string

3. **Reinicie o terminal** para aplicar as mudanças

## 🗄️ Passo 3: Inicializar o Banco de Dados (Opcional)

Se você ainda não inicializou o schema no Neon, você pode fazer isso de duas formas:

### Opção 1: Via API Local (Recomendado)

1. **Inicie o servidor de desenvolvimento**:
```powershell
yarn dev
```

2. **Em outro terminal**, execute:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/db/init" -Method POST
```

### Opção 2: Via Neon SQL Editor

1. Acesse o [Neon Dashboard](https://console.neon.tech)
2. Vá em "SQL Editor"
3. Abra o arquivo `lib/db/schema.sql` do projeto
4. Copie e cole o conteúdo
5. Execute

## ▶️ Passo 4: Rodar o Projeto Localmente

```powershell
yarn dev
```

O projeto estará disponível em: [http://localhost:3000](http://localhost:3000)

## 🧪 Passo 5: Testar a Conexão

### Teste 1: Verificar se o banco está conectado

Abra o navegador e acesse:
```
http://localhost:3000/api/players
```

Se retornar `[]` (array vazio) ou dados, a conexão está funcionando!

### Teste 2: Inicializar via API (se não fez antes)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/db/init" -Method POST
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Banco de dados inicializado com sucesso."
}
```

### Teste 3: Criar um jogador de teste

```powershell
$body = @{
    name = "Jogador Teste"
    email = "teste@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/players" -Method POST -Body $body -ContentType "application/json"
```

## 📝 Estrutura do Arquivo `.env.local`

Crie o arquivo na raiz do projeto com este conteúdo:

```env
# Database Connection (Neon PostgreSQL)
POSTGRES_URL=postgresql://seu-usuario:sua-senha@seu-host.neon.tech/neondb?sslmode=require

# Exemplo (substitua pela sua connection string real):
# POSTGRES_URL=postgresql://neondb_owner:npg_0hXHFwDPV5Qe@ep-muddy-river-ahhos7ep-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🔍 Verificar se a Variável está Configurada

Para verificar se o Next.js está lendo a variável (apenas para debug):

1. Crie um arquivo temporário `app/api/test-env/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const hasUrl = !!process.env.POSTGRES_URL;
  return NextResponse.json({
    hasPostgresUrl: hasUrl,
    // NÃO mostre a URL completa em produção por segurança!
    urlPreview: hasUrl 
      ? process.env.POSTGRES_URL?.substring(0, 30) + '...'
      : 'não configurada'
  });
}
```

2. Acesse: `http://localhost:3000/api/test-env`

3. **Remova o arquivo** após verificar (não commite variáveis de ambiente!)

## ⚠️ Troubleshooting

### Erro: "POSTGRES_URL environment variable is not set"

**Causa**: O arquivo `.env.local` não existe ou a variável não está configurada.

**Solução**:
1. Verifique se o arquivo `.env.local` existe na raiz do projeto
2. Verifique se não tem aspas ao redor da URL
3. Reinicie o servidor (`yarn dev`)

### Erro: "Connection timeout" ou "Connection refused"

**Causa**: Connection string incorreta ou problema de rede.

**Solução**:
1. Verifique se copiou a connection string completa do Neon
2. Verifique se o projeto Neon está ativo
3. Teste a connection string diretamente no Neon SQL Editor

### Erro: "ENOTFOUND" ou "getaddrinfo ENOTFOUND"

**Causa**: Connection string com aspas ou formato incorreto.

**Solução**:
1. Remova todas as aspas da connection string
2. Verifique se não copiou o comando `psql` junto

### O servidor não detecta mudanças no `.env.local`

**Solução**: Reinicie o servidor (`Ctrl+C` e depois `yarn dev` novamente)

## 📚 Comandos Úteis

```powershell
# Iniciar servidor de desenvolvimento
yarn dev

# Build de produção (para testar)
yarn build

# Rodar build de produção localmente
yarn start

# Verificar variáveis de ambiente (PowerShell)
$env:POSTGRES_URL

# Testar inicialização do banco
Invoke-RestMethod -Uri "http://localhost:3000/api/db/init" -Method POST

# Listar jogadores
Invoke-RestMethod -Uri "http://localhost:3000/api/players" | ConvertTo-Json
```

## 🔐 Segurança

- ✅ O arquivo `.env.local` já está no `.gitignore` (não será commitado)
- ❌ **NUNCA** commite arquivos `.env` ou `.env.local`
- ❌ **NUNCA** compartilhe sua connection string publicamente
- ✅ Use diferentes connection strings para desenvolvimento e produção

## 🎯 Próximos Passos

Após configurar o ambiente local:

1. ✅ Teste criar jogadores
2. ✅ Teste criar decks
3. ✅ Teste criar partidas
4. ✅ Verifique se os dados aparecem no Neon Dashboard

## 💡 Dica: Usar Banco Local (PostgreSQL)

Se preferir usar um banco PostgreSQL local ao invés do Neon para desenvolvimento:

1. **Instale PostgreSQL** localmente
2. **Crie um banco**:
   ```sql
   CREATE DATABASE mtg_tournament;
   ```
3. **Configure `.env.local`**:
   ```env
   POSTGRES_URL=postgresql://usuario:senha@localhost:5432/mtg_tournament
   ```
4. **Execute o schema**: Use o arquivo `lib/db/schema.sql` ou a API `/api/db/init`

