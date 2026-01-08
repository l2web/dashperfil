# Script PowerShell para fazer redeploy

Write-Host "🚀 Iniciando processo de redeploy..." -ForegroundColor Cyan
Write-Host ""

# Verificar Vercel CLI
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Write-Host "✅ Vercel CLI encontrado" -ForegroundColor Green
    Write-Host "📦 Fazendo deploy na Vercel..." -ForegroundColor Yellow
    vercel --prod
}
# Verificar Netlify CLI
elseif (Get-Command netlify -ErrorAction SilentlyContinue) {
    Write-Host "✅ Netlify CLI encontrado" -ForegroundColor Green
    Write-Host "📦 Fazendo deploy na Netlify..." -ForegroundColor Yellow
    netlify deploy --prod
}
# Verificar GitHub Actions
elseif (Test-Path ".github/workflows") {
    Write-Host "✅ GitHub Actions detectado" -ForegroundColor Green
    Write-Host "📦 Criando commit vazio para disparar deploy..." -ForegroundColor Yellow
    git commit --allow-empty -m "chore: trigger redeploy"
    git push origin main
}
else {
    Write-Host "⚠️  Nenhuma plataforma detectada automaticamente" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opções disponíveis:" -ForegroundColor Cyan
    Write-Host "1. Vercel: vercel --prod"
    Write-Host "2. Netlify: netlify deploy --prod"
    Write-Host "3. GitHub Pages: git commit --allow-empty -m 'redeploy' && git push"
    Write-Host ""
    Write-Host "Certifique-se de que as variáveis de ambiente estão configuradas na plataforma!" -ForegroundColor Red
}
