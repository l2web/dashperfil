# 🚀 Guia de Deploy e Configuração de Variáveis de Ambiente em Produção

## ⚠️ IMPORTANTE: Por que o arquivo .env no GitHub não funciona?

O arquivo `.env` no GitHub **NÃO é usado em produção** porque:

1. **Segurança**: Arquivos `.env` contêm credenciais sensíveis e não devem ser commitados
2. **Build Time**: Aplicações Vite precisam das variáveis durante o **build**, não em runtime
3. **Plataformas de Hospedagem**: Cada plataforma tem sua própria forma de configurar variáveis

## 📋 Configuração por Plataforma

### 1. Vercel (Recomendado para Vite/React)

#### Passo a Passo:

1. **Acesse o Dashboard da Vercel**: https://vercel.com/dashboard
2. **Importe seu projeto** do GitHub (se ainda não fez)
3. **Vá em Settings** → **Environment Variables**
4. **Adicione as variáveis**:

   ```
   VITE_SUPABASE_URL = https://ldkincjowaokcismhnqz.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxka2luY2pvd2Fva2Npc21obnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzA4NzYsImV4cCI6MjA3MjA0Njg3Nn0.FmJQZZ_sv_9e30eZgtPNTvLAHqv1FOdCXTzvZ3ypwRA
   VITE_SUPABASE_PROJECT_ID = ldkincjowaokcismhnqz
   ```

5. **Selecione os ambientes**: Production, Preview, Development
6. **Clique em Save**
7. **Faça um novo deploy** ou aguarde o próximo deploy automático

#### Configuração via CLI (Alternativa):

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Adicionar variáveis
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
vercel env add VITE_SUPABASE_PROJECT_ID

# Fazer deploy
vercel --prod
```

---

### 2. Netlify

#### Passo a Passo:

1. **Acesse o Dashboard da Netlify**: https://app.netlify.com
2. **Vá em Site settings** → **Environment variables**
3. **Clique em Add a variable** e adicione:

   ```
   VITE_SUPABASE_URL = https://ldkincjowaokcismhnqz.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxka2luY2pvd2Fva2Npc21obnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzA4NzYsImV4cCI6MjA3MjA0Njg3Nn0.FmJQZZ_sv_9e30eZgtPNTvLAHqv1FOdCXTzvZ3ypwRA
   VITE_SUPABASE_PROJECT_ID = ldkincjowaokcismhnqz
   ```

4. **Selecione o contexto**: Production, Deploy previews, Branch deploys
5. **Clique em Save**
6. **Vá em Deploys** → **Trigger deploy** → **Deploy site**

#### Arquivo `netlify.toml` (Alternativa):

Crie um arquivo `netlify.toml` na raiz:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_SUPABASE_URL = "https://ldkincjowaokcismhnqz.supabase.co"
  VITE_SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxka2luY2pvd2Fva2Npc21obnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzA4NzYsImV4cCI6MjA3MjA0Njg3Nn0.FmJQZZ_sv_9e30eZgtPNTvLAHqv1FOdCXTzvZ3ypwRA"
  VITE_SUPABASE_PROJECT_ID = "ldkincjowaokcismhnqz"
```

⚠️ **ATENÇÃO**: Este método expõe as credenciais no código. Use apenas se necessário.

---

### 3. GitHub Pages (via GitHub Actions)

#### Passo a Passo:

1. **Vá em Settings** do seu repositório no GitHub
2. **Secrets and variables** → **Actions**
3. **New repository secret** e adicione:

   ```
   VITE_SUPABASE_URL = https://ldkincjowaokcismhnqz.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxka2luY2pvd2Fva2Npc21obnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzA4NzYsImV4cCI6MjA3MjA0Njg3Nn0.FmJQZZ_sv_9e30eZgtPNTvLAHqv1FOdCXTzvZ3ypwRA
   VITE_SUPABASE_PROJECT_ID = ldkincjowaokcismhnqz
   ```

4. **Crie o arquivo `.github/workflows/deploy.yml`**:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
        VITE_SUPABASE_PROJECT_ID: ${{ secrets.VITE_SUPABASE_PROJECT_ID }}
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

---

### 4. Render

#### Passo a Passo:

1. **Acesse o Dashboard do Render**: https://dashboard.render.com
2. **Vá em Environment** → **Environment Variables**
3. **Adicione as variáveis**:

   ```
   VITE_SUPABASE_URL = https://ldkincjowaokcismhnqz.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxka2luY2pvd2Fva2Npc21obnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzA4NzYsImV4cCI6MjA3MjA0Njg3Nn0.FmJQZZ_sv_9e30eZgtPNTvLAHqv1FOdCXTzvZ3ypwRA
   VITE_SUPABASE_PROJECT_ID = ldkincjowaokcismhnqz
   ```

4. **Salve e faça um novo deploy**

---

## 🔍 Como Verificar se Está Funcionando

### 1. Verifique o Build Log

Durante o build, as variáveis devem estar disponíveis. Procure por:

```
VITE_SUPABASE_URL=https://...
```

### 2. Teste no Console do Navegador

Abra o console (F12) e execute:

```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Configurada' : 'Não configurada');
```

### 3. Use a Página de Teste

Acesse `/test-connection` na sua aplicação em produção para verificar a conexão.

---

## ❓ Problemas Comuns

### Erro: "Variável de ambiente não encontrada"

**Causas possíveis:**
- Variáveis não foram adicionadas na plataforma de hospedagem
- Nome da variável está incorreto (deve começar com `VITE_`)
- Deploy foi feito antes de adicionar as variáveis

**Solução:**
1. Adicione as variáveis na plataforma
2. Faça um novo deploy

### Erro: "CORS" ou "Network Error"

**Causas possíveis:**
- URL do Supabase incorreta
- Projeto Supabase pausado
- Políticas RLS muito restritivas

**Solução:**
1. Verifique a URL no dashboard do Supabase
2. Verifique se o projeto está ativo
3. Verifique as políticas RLS no Supabase

### Variáveis aparecem como `undefined`

**Causa:**
- Variáveis não estão disponíveis durante o build

**Solução:**
1. Certifique-se de que as variáveis foram adicionadas na plataforma
2. Faça um novo build/deploy
3. Verifique se o nome começa com `VITE_`

---

## 📝 Checklist de Deploy

- [ ] Variáveis adicionadas na plataforma de hospedagem
- [ ] Nomes das variáveis começam com `VITE_`
- [ ] Valores estão corretos (sem aspas extras)
- [ ] Deploy realizado após adicionar variáveis
- [ ] Testado em produção usando `/test-connection`
- [ ] Console do navegador não mostra erros

---

## 🔒 Segurança

- ✅ **NUNCA** commite o arquivo `.env` no Git
- ✅ Use variáveis de ambiente da plataforma de hospedagem
- ✅ A chave `anon public` é segura para frontend, mas não compartilhe publicamente
- ✅ Para produção, considere usar políticas RLS mais restritivas no Supabase

---

## 📚 Recursos Adicionais

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
