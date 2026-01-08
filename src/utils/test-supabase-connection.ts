/**
 * Script de teste para verificar a conexão com o Supabase
 * Execute este arquivo no console do navegador para testar a conexão
 */

import { supabase } from "@/integrations/supabase/client";

export async function testSupabaseConnection() {
  console.log("🔍 Testando conexão com Supabase...\n");

  // Teste 1: Verificar se as variáveis de ambiente estão configuradas
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  console.log("1️⃣ Variáveis de ambiente:");
  console.log("   URL:", url ? "✅ Configurada" : "❌ Não encontrada");
  console.log("   Key:", key ? "✅ Configurada" : "❌ Não encontrada");
  console.log("");

  if (!url || !key) {
    console.error("❌ Erro: Variáveis de ambiente não configuradas!");
    console.log("   Crie um arquivo .env na raiz do projeto com:");
    console.log("   VITE_SUPABASE_URL=https://seu-projeto.supabase.co");
    console.log("   VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-aqui");
    return false;
  }

  // Teste 2: Verificar conexão com Supabase
  try {
    console.log("2️⃣ Testando conexão com Supabase...");
    const { data, error } = await supabase.from("clients").select("count").limit(1);
    
    if (error) {
      console.error("❌ Erro na conexão:", error.message);
      console.log("\n💡 Possíveis soluções:");
      console.log("   - Verifique se a URL está correta");
      console.log("   - Verifique se a chave está correta");
      console.log("   - Verifique se o projeto Supabase está ativo");
      return false;
    }

    console.log("✅ Conexão estabelecida com sucesso!");
    console.log("");

    // Teste 3: Verificar tabelas
    console.log("3️⃣ Verificando tabelas...");
    const tables = ["clients", "chips", "openai_accounts", "client_reports"];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase.from(table).select("count").limit(1);
        if (tableError) {
          console.log(`   ❌ Tabela '${table}': Não encontrada ou sem acesso`);
        } else {
          console.log(`   ✅ Tabela '${table}': OK`);
        }
      } catch (err) {
        console.log(`   ❌ Tabela '${table}': Erro ao verificar`);
      }
    }

    console.log("\n✅ Todos os testes concluídos!");
    return true;
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
    return false;
  }
}

// Para usar no console do navegador:
// import { testSupabaseConnection } from '@/utils/test-supabase-connection';
// await testSupabaseConnection();
