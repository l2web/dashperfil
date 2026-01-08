# AutoControl - Dashboard de Gestão

Sistema de gestão para controle de chips, contas OpenAI e relatórios de clientes.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Supabase** - Backend (Database, Auth, Edge Functions)
- **TanStack Query** - Gerenciamento de estado do servidor

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou bun
- Conta no [Supabase](https://supabase.com)

## 🔧 Configuração do Supabase

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Anote a **Project URL** e a **anon key** (em Settings > API)

### 2. Criar as tabelas no banco de dados

Execute o seguinte SQL no SQL Editor do Supabase:

```sql
-- Tabela de clientes
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  chips UUID[] DEFAULT '{}'::uuid[],
  apis UUID[] DEFAULT '{}'::uuid[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de chips
CREATE TABLE public.chips (
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
CREATE TABLE public.openai_accounts (
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
CREATE TABLE public.client_reports (
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
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chips_updated_at
  BEFORE UPDATE ON public.chips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.openai_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_reports ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (ajuste conforme necessidade)
CREATE POLICY "Allow all for clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for chips" ON public.chips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for openai_accounts" ON public.openai_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for client_reports" ON public.client_reports FOR ALL USING (true) WITH CHECK (true);
```

### 3. Configurar variáveis de ambiente

#### Para Desenvolvimento Local:

1. Crie um arquivo `.env` na raiz do projeto:
   ```bash
   # Windows PowerShell
   New-Item -Path .env -ItemType File
   
   # Linux/Mac
   touch .env
   ```

2. Preencha as variáveis com suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sua-anon-key
   VITE_SUPABASE_PROJECT_ID=seu-project-id
   ```

#### Para Produção (Deploy):

⚠️ **IMPORTANTE**: O arquivo `.env` no GitHub **NÃO funciona em produção**!

Para deploy em produção (Vercel, Netlify, etc.), você precisa configurar as variáveis de ambiente na plataforma de hospedagem.

📖 **Veja o guia completo**: [`GUIA_DEPLOY_PRODUCAO.md`](./GUIA_DEPLOY_PRODUCAO.md)

## 🏃 Executando o projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── layout/          # Componentes de layout (Sidebar, DashboardLayout)
│   └── ui/              # Componentes UI (shadcn/ui)
├── hooks/               # Custom hooks (useChips, useClients, etc.)
├── integrations/
│   └── supabase/        # Cliente e tipos do Supabase
├── lib/                 # Utilitários
└── pages/               # Páginas da aplicação
```

## 📊 Funcionalidades

- **Dashboard** - Visão geral com métricas
- **Chips** - Gerenciamento de chips/números
- **OpenAI** - Controle de contas e gastos com APIs
- **Clientes** - Cadastro e gestão de clientes
- **Relatórios** - Relatórios mensais por cliente

## 🔐 Segurança

As políticas RLS atuais permitem acesso total. Para produção, configure políticas mais restritivas baseadas em autenticação:

```sql
-- Exemplo: apenas usuários autenticados
CREATE POLICY "Authenticated users only" ON public.clients
  FOR ALL USING (auth.uid() IS NOT NULL);
```

## 📝 Licença

MIT
