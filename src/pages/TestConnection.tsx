import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, Database, Shield, Globe } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TestResult {
  name: string;
  status: "success" | "error" | "loading";
  message: string;
}

export default function TestConnection() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<"success" | "error" | "idle">("idle");

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setOverallStatus("idle");

    const testResults: TestResult[] = [];

    // Teste 1: Variáveis de ambiente
    testResults.push({
      name: "Variáveis de Ambiente",
      status: "loading",
      message: "Verificando...",
    });
    setResults([...testResults]);

    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

    if (!url || !key) {
      testResults[0] = {
        name: "Variáveis de Ambiente",
        status: "error",
        message: `URL: ${url ? "✅" : "❌"} | Key: ${key ? "✅" : "❌"}`,
      };
      setResults([...testResults]);
      setIsRunning(false);
      setOverallStatus("error");
      return;
    }

    testResults[0] = {
      name: "Variáveis de Ambiente",
      status: "success",
      message: `URL configurada | Project ID: ${projectId || "N/A"}`,
    };
    setResults([...testResults]);

    // Teste 2: Conexão com Supabase
    testResults.push({
      name: "Conexão com Supabase",
      status: "loading",
      message: "Testando conexão...",
    });
    setResults([...testResults]);

    try {
      const { data, error } = await supabase.from("clients").select("count").limit(1);

      if (error) {
        testResults[1] = {
          name: "Conexão com Supabase",
          status: "error",
          message: `Erro: ${error.message}`,
        };
        setResults([...testResults]);
        setIsRunning(false);
        setOverallStatus("error");
        return;
      }

      testResults[1] = {
        name: "Conexão com Supabase",
        status: "success",
        message: "Conexão estabelecida com sucesso!",
      };
      setResults([...testResults]);
    } catch (error: any) {
      testResults[1] = {
        name: "Conexão com Supabase",
        status: "error",
        message: `Erro: ${error.message || "Erro desconhecido"}`,
      };
      setResults([...testResults]);
      setIsRunning(false);
      setOverallStatus("error");
      return;
    }

    // Teste 3: Verificar tabelas
    const tables = [
      { name: "clients", display: "Clientes" },
      { name: "chips", display: "Chips" },
      { name: "openai_accounts", display: "Contas OpenAI" },
      { name: "client_reports", display: "Relatórios" },
    ];

    for (const table of tables) {
      testResults.push({
        name: `Tabela: ${table.display}`,
        status: "loading",
        message: "Verificando...",
      });
      setResults([...testResults]);

      try {
        const { data, error } = await supabase.from(table.name).select("count").limit(1);

        if (error) {
          testResults[testResults.length - 1] = {
            name: `Tabela: ${table.display}`,
            status: "error",
            message: `Erro: ${error.message}`,
          };
        } else {
          const { count } = await supabase.from(table.name).select("*", { count: "exact", head: true });
          testResults[testResults.length - 1] = {
            name: `Tabela: ${table.display}`,
            status: "success",
            message: `OK - Tabela acessível`,
          };
        }
        setResults([...testResults]);
      } catch (error: any) {
        testResults[testResults.length - 1] = {
          name: `Tabela: ${table.display}`,
          status: "error",
          message: `Erro: ${error.message || "Erro desconhecido"}`,
        };
        setResults([...testResults]);
      }
    }

    setIsRunning(false);
    const hasErrors = testResults.some((r) => r.status === "error");
    setOverallStatus(hasErrors ? "error" : "success");
  };

  useEffect(() => {
    // Executar testes automaticamente ao carregar a página
    runTests();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Teste de Conexão com Supabase</h1>
        <p className="text-muted-foreground">
          Esta página verifica se a conexão com o Supabase está funcionando corretamente.
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={runTests} disabled={isRunning} className="w-full sm:w-auto">
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executando testes...
            </>
          ) : (
            "Executar Testes Novamente"
          )}
        </Button>
      </div>

      {overallStatus === "success" && (
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">
            Conexão bem-sucedida!
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            Todos os testes passaram. Seu projeto está conectado ao Supabase corretamente.
          </AlertDescription>
        </Alert>
      )}

      {overallStatus === "error" && (
        <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-200">
            Erros encontrados
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300">
            Alguns testes falharam. Verifique os detalhes abaixo e consulte o guia de configuração.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {result.status === "loading" && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  )}
                  {result.status === "success" && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {result.status === "error" && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <CardTitle className="text-lg">{result.name}</CardTitle>
                </div>
                <Badge
                  variant={
                    result.status === "success"
                      ? "default"
                      : result.status === "error"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {result.status === "loading"
                    ? "Verificando..."
                    : result.status === "success"
                    ? "OK"
                    : "Erro"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{result.message}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && !isRunning && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Clique em "Executar Testes" para começar a verificação.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Informações da Conexão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || "Não configurada"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Project ID:</strong>{" "}
              {import.meta.env.VITE_SUPABASE_PROJECT_ID || "Não configurado"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Key:</strong>{" "}
              {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
                ? `${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY.substring(0, 20)}...`
                : "Não configurada"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
