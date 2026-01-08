#!/bin/bash

# Script para fazer redeploy em diferentes plataformas

echo "🚀 Iniciando processo de redeploy..."
echo ""

# Verificar qual plataforma está sendo usada
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI encontrado"
    echo "📦 Fazendo deploy na Vercel..."
    vercel --prod
elif [ -f "netlify.toml" ]; then
    echo "✅ Netlify detectado"
    echo "📦 Fazendo deploy na Netlify..."
    netlify deploy --prod
elif [ -d ".github/workflows" ]; then
    echo "✅ GitHub Actions detectado"
    echo "📦 Criando commit vazio para disparar deploy..."
    git commit --allow-empty -m "chore: trigger redeploy"
    git push origin main
else
    echo "⚠️  Nenhuma plataforma detectada automaticamente"
    echo ""
    echo "Opções disponíveis:"
    echo "1. Vercel: vercel --prod"
    echo "2. Netlify: netlify deploy --prod"
    echo "3. GitHub Pages: git commit --allow-empty -m 'redeploy' && git push"
    echo ""
    echo "Certifique-se de que as variáveis de ambiente estão configuradas na plataforma!"
fi
