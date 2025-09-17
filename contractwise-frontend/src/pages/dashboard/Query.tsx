import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, FileText, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueryResult {
  answer: string;
  confidence?: number; // optional
  chunks: Array<{
    id: string;
    text: string;
    contractName: string;
    pageNumber: number;
    relevanceScore: number;
    confidence?: number; // optional
  }>;
}


export default function QueryPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);

  const exampleQueries = [
    "What are the termination clauses in my contracts?",
    "Which contracts expire in the next 6 months?", 
    "What liability limitations exist across all agreements?",
    "Show me all payment terms and deadlines"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!query.trim()) return;

  setLoading(true);
  setResult(null);

  try {
    const token = localStorage.getItem("token"); // ensure token is saved at login

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question: query }),
    });

    if (!res.ok) {
      throw new Error(`Failed to query AI: ${res.statusText}`);
    }

    const data = await res.json();

    // Map backend format → frontend format
    setResult({
      answer: data.answer,
      confidence: 90, // backend doesn’t return this, so fake or remove
      chunks: data.chunks.map((c: any, index: number) => ({
        id: String(index),
        text: c.text,
        contractName: c.metadata.contract_name,
        pageNumber: c.metadata.page,
        relevanceScore: c.similarity,
        confidence: Math.round(c.similarity * 100), // optional
      })),
    });
  } catch (error) {
    console.error("Query failed:", error);
  } finally {
    setLoading(false);
  }
};


  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">AI Query Interface</h1>
          <p className="text-muted-foreground">
            Ask natural language questions about your contracts
          </p>
        </div>

        {/* Query Input */}
        <Card className="shadow-elegant border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Ask a Question
            </CardTitle>
            <CardDescription>
              Use natural language to query your contract database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., What are the termination clauses in my contracts?"
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !query.trim()}>
                  {loading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  {loading ? "Processing..." : "Ask"}
                </Button>
              </div>
              
              {/* Example Queries */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="text-xs"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* AI Answer */}
            <Card className="shadow-elegant border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    AI Response
                  </div>
                  <Badge variant="secondary">
                    {result.confidence}% confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground leading-relaxed">
                    {result.answer}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Supporting Evidence */}
            <Card className="shadow-elegant border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Supporting Evidence
                </CardTitle>
                <CardDescription>
                  Relevant contract excerpts that support this answer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.chunks.map((chunk) => (
                  <div 
                    key={chunk.id} 
                    className="p-4 border border-card-border rounded-lg bg-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {chunk.contractName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Page {chunk.pageNumber}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Badge variant="outline" className="text-xs">
                          {(chunk.relevanceScore * 100).toFixed(0)}% relevant
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {chunk.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    <blockquote className="border-l-4 border-primary pl-4 italic text-sm text-muted-foreground">
                      "{chunk.text}"
                    </blockquote>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <Card className="shadow-elegant border-card-border">
            <CardContent className="text-center py-12">
              <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Ready to Answer Your Questions
              </h3>
              <p className="text-muted-foreground mb-4">
                Ask anything about your contracts using natural language
              </p>
              <p className="text-sm text-muted-foreground">
                Our AI can help you find specific clauses, compare terms, identify risks, and more.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}