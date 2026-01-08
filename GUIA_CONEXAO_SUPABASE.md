# 🔌 Guia de Conexão ao Supabase

Este guia vai te ajudar a conectar seu projeto ao Supabase passo a passo.

## 📋 Passo 1: Obter Credenciais do Supabase

### Se você ainda não tem um projeto:

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: Nome do seu projeto (ex: "internal-control-hub")
   - **Database Password**: Escolha uma senha forte (guarde bem!)
   - **Region**: Escolha a região mais próxima
4. Aguarde alguns minutos enquanto o projeto é criado

### Obter as credenciais:

1. No dashboard do Supabase, vá em **Settings** (⚙️) no menu lateral
2. Clique em **API** no menu de configurações
3. Você encontrará:
   - **Project URL**: Algo como `https://xxxxx.supabase.co`
   - **anon public key**: Uma chave longa que começa com `eyJ...`
   - **Project ID**: O ID do projeto (parte da URL antes de `.supabase.co`)

## 📝 Passo 2: Criar o Arquivo `.env`

Na raiz do projeto (mesma pasta onde está o `package.json`), crie um arquivo chamado `.env`:

**Windows (PowerShell):**
```powershell
New-Item -Path .env -ItemType File
```

**Linux/Mac:**
```bash
touch .env
```

## ✏️ Passo 3: Configurar as Variáveis de Ambiente

Abra o arquivo `.env` e adicione o seguinte conteúdo:

```env
# Configuração do Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-anon-key-aqui
VITE_SUPABASE_PROJECT_ID=seu-project-id
```

**⚠️ IMPORTANTE**: Substitua os valores pelos seus dados reais do Supabase!

### Exemplo de arquivo `.env` preenchido:

```env
VITE_SUPABASE_URL=https://kzegnwfciiisibmhctcc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6ZWdud2ZjaWlpc2libWhjdGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTU3NTk5OX0.exemplo
VITE_SUPABASE_PROJECT_ID=kzegnwfciiisibmhctcc
```

## 🗄️ Passo 4: Configurar o Banco de Dados

O projeto precisa das seguintes tabelas no Supabase. Execute o SQL abaixo no **SQL Editor** do Supabase:

1. No dashboard do Supabase, vá em **SQL Editor** no menu lateral
2. Clique em **New Query**
3. Cole o SQL abaixo e execute:

```sql
-- Tabela de clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  chips UUID[] DEFAULT '{}'::uuid[],
  apis UUID[] DEFAULT '{}'::uuid[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de chips
CREATE TABLE IF NOT EXISTS public.chips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL,
  api_usada TEXT NOT NULL,
  ultima_recarga DATE NOT NULL,
  data_limite DATE,
  url TEXT,
  token TEXT,
  client_id UUID REFERENCES public.clients(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de contas OpenAI
CREATE TABLE IF NOT EXISTS public.openai_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  api_key TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'individual',
  endpoint TEXT DEFAULT 'https://api.openai.com/v1',
  gasto_atual NUMERIC DEFAULT 0,
  client_id UUID REFERENCES public.clients(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de relatórios
CREATE TABLE IF NOT EXISTS public.client_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  total_chips NUMERIC DEFAULT 0,
  total_api NUMERIC DEFAULT 0,
  total_geral NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_chips_updated_at ON public.chips;
CREATE TRIGGER update_chips_updated_at
  BEFORE UPDATE ON public.chips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.openai_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_reports ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (permitem acesso total - ajuste conforme necessidade)
DROP POLICY IF EXISTS "Allow all for clients" ON public.clients;
CREATE POLICY "Allow all for clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for chips" ON public.chips;
CREATE POLICY "Allow all for chips" ON public.chips FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for openai_accounts" ON public.openai_accounts;
CREATE POLICY "Allow all for openai_accounts" ON public.openai_accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for client_reports" ON public.client_reports;
CREATE POLICY "Allow all for client_reports" ON public.client_reports FOR ALL USING (true) WITH CHECK (true);
```

## ✅ Passo 5: Verificar a Conexão

1. **Reinicie o servidor de desenvolvimento** (se estiver rodando):
   ```bash
   # Pare o servidor (Ctrl+C) e inicie novamente
   npm run dev
   ```

2. Abra o navegador em `http://localhost:8080`

3. Se tudo estiver correto:
   - O projeto deve iniciar sem erros
   - Você verá o dashboard funcionando
   - As tabelas estarão vazias inicialmente (normal!)

## 🔍 Verificação de Problemas

### Erro: "Variável de ambiente VITE_SUPABASE_URL não encontrada"

**Soluções:**
- ✅ Verifique se o arquivo `.env` existe na raiz do projeto
- ✅ Confirme que as variáveis começam com `VITE_`
- ✅ Certifique-se de que não há espaços extras ou aspas nas variáveis
- ✅ Reinicie o servidor de desenvolvimento completamente

### Erro de conexão com o Supabase

**Soluções:**
- ✅ Verifique se a URL está correta (sem espaços extras, sem barra no final)
- ✅ Confirme que a chave pública está completa (é uma string muito longa)
- ✅ Verifique se o projeto Supabase está ativo (não pausado)
- ✅ Verifique o console do navegador para erros específicos

### Dados não aparecem na aplicação

**Soluções:**
- ✅ Verifique se as tabelas foram criadas no Supabase (Table Editor)
- ✅ Confirme as políticas RLS (Row Level Security) no Supabase
- ✅ Verifique o console do navegador para erros específicos
- ✅ Teste fazer uma inserção manual no Table Editor do Supabase

## 🧪 Teste Rápido de Conexão

Você pode testar a conexão abrindo o console do navegador (F12) e executando:

```javascript
// No console do navegador
import { supabase } from '/src/integrations/supabase/client.ts';
const { data, error } = await supabase.from('clients').select('*');
console.log('Dados:', data);
console.log('Erro:', error);
```

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de Variáveis de Ambiente no Vite](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Dashboard](https://app.supabase.com)

## 🔒 Segurança

- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- ✅ O arquivo `.env` já está no `.gitignore` para sua proteção
- ✅ A chave `anon public` é segura para uso no frontend, mas não compartilhe publicamente
- ⚠️ Para produção, ajuste as políticas RLS para serem mais restritivas

---

**Pronto!** Seu projeto deve estar conectado ao Supabase agora. 🎉
