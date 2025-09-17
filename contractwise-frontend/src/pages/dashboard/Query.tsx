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
  confidence: number;
  chunks: Array<{
    id: string;
    text: string;
    contractName: string;
    pageNumber: number;
    relevanceScore: number;
    confidence: number;
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
    
    // Simulate AI processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      setResult({
        answer: "Based on my analysis of your contracts, I found several key termination clauses. The Software License Agreement with Adobe allows for termination with 30 days written notice by either party. The Service Agreement with CloudHost includes a similar 30-day notice period but also includes provisions for immediate termination in case of breach. The Employment Contract with John Smith has a different structure with 2 weeks notice for the employee and 4 weeks for the employer.",
        confidence: 92,
        chunks: [
          {
            id: "1",
            text: "Either party may terminate this Agreement at any time upon thirty (30) days prior written notice to the other party...",
            contractName: "Software License Agreement - Adobe",
            pageNumber: 5,
            relevanceScore: 0.95,
            confidence: 88
          },
          {
            id: "2", 
            text: "This Agreement may be terminated immediately by either party upon material breach by the other party...",
            contractName: "Service Agreement - CloudHost",
            pageNumber: 8,
            relevanceScore: 0.89,
            confidence: 82
          },
          {
            id: "3",
            text: "Employee may terminate employment by providing two (2) weeks written notice. Employer may terminate with four (4) weeks notice...",
            contractName: "Employment Contract - John Smith",
            pageNumber: 3,
            relevanceScore: 0.76,
            confidence: 79
          }
        ]
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