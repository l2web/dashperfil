# 🔄 Guia Rápido de Redeploy

## ✅ Commit de Redeploy Criado

Um commit vazio foi criado e enviado para o GitHub para disparar o deploy automático (se você tiver GitHub Actions configurado).

## 🚀 Como Fazer Redeploy Manualmente

### Se você está usando **Vercel**:

1. **Via Dashboard:**
   - Acesse: https://vercel.com/dashboard
   - Encontre seu projeto
   - Clique nos **3 pontos** → **Redeploy**

2. **Via CLI:**
   ```bash
   vercel --prod
   ```

### Se você está usando **Netlify**:

1. **Via Dashboard:**
   - Acesse: https://app.netlify.com
   - Encontre seu site
   - Vá em **Deploys** → **Trigger deploy** → **Deploy site**

2. **Via CLI:**
   ```bash
   netlify deploy --prod
   ```

### Se você está usando **GitHub Pages**:

O deploy automático já foi disparado pelo commit. Verifique em:
- **Actions** tab no GitHub: https://github.com/l2web/dashperfil/actions

### Se você está usando **Render**:

1. Acesse: https://dashboard.render.com
2. Encontre seu serviço
3. Clique em **Manual Deploy** → **Deploy latest commit**

## ⚠️ IMPORTANTE: Variáveis de Ambiente

**Antes de fazer o redeploy, certifique-se de que as variáveis de ambiente estão configuradas na plataforma:**

### Variáveis necessárias:

```
VITE_SUPABASE_URL=https://ldkincjowaokcismhnqz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxka2luY2pvd2Fva2Npc21obnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzA4NzYsImV4cCI6MjA3MjA0Njg3Nn0.FmJQZZ_sv_9e30eZgtPNTvLAHqv1FOdCXTzvZ3ypwRA
VITE_SUPABASE_PROJECT_ID=ldkincjowaokcismhnqz
```

### Como configurar:

📖 **Veja o guia completo**: [`GUIA_DEPLOY_PRODUCAO.md`](./GUIA_DEPLOY_PRODUCAO.md)

## 🔍 Verificar se o Deploy Funcionou

1. **Aguarde alguns minutos** para o build completar
2. **Acesse sua aplicação** em produção
3. **Teste a conexão**: Acesse `/test-connection` na sua aplicação
4. **Verifique o console** do navegador (F12) para erros

## 📝 Scripts de Redeploy

Scripts auxiliares foram criados em `scripts/`:

- **Linux/Mac**: `bash scripts/redeploy.sh`
- **Windows**: `powershell scripts/redeploy.ps1`

---

**Status atual**: ✅ Commit criado e enviado para GitHub
**Próximo passo**: Configure as variáveis de ambiente na sua plataforma de hospedagem (se ainda não fez) e aguarde o deploy completar.
