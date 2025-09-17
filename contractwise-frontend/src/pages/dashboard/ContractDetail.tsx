import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, FileText, AlertTriangle, Lightbulb, Eye } from "lucide-react";
import { getContractDetail, ContractDetail } from "@/data/contracts";
import { cn } from "@/lib/utils";

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contractDetail, setContractDetail] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Simulate loading
      setTimeout(() => {
        const detail = getContractDetail(id);
        setContractDetail(detail);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </DashboardLayout>
    );
  }

  if (!contractDetail) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Contract not found</h3>
          <Button onClick={() => navigate("/dashboard/contracts")}>
            Back to Contracts
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { contract, clauses, aiInsights, evidence } = contractDetail;

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Renewal Due': return 'status-renewal';
      case 'Expired': return 'status-expired';
      default: return '';
    }
  };

  const getRiskClassName = (risk: string) => {
    switch (risk) {
      case 'Low': return 'risk-low';
      case 'Medium': return 'risk-medium';
      case 'High': return 'risk-high';
      default: return '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-risk-low';
      case 'Medium': return 'text-risk-medium';
      case 'High': return 'text-risk-high';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/dashboard/contracts")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{contract.name}</h1>
              <p className="text-muted-foreground">
                Contract details and AI analysis
              </p>
            </div>
          </div>
        </div>

        {/* Contract Overview */}
        <Card className="shadow-elegant border-card-border">
          <CardHeader>
            <CardTitle>Contract Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Parties</p>
                <p className="font-medium">{contract.parties.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className="font-medium">{new Date(contract.expiryDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={getStatusClassName(contract.status)}>
                  {contract.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <span className={getRiskClassName(contract.riskScore)}>
                  {contract.riskScore}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Clauses */}
          <Card className="shadow-elegant border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Key Clauses
              </CardTitle>
              <CardDescription>
                Important contract provisions identified by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {clauses.map((clause) => (
                <div key={clause.id} className="p-4 border border-card-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{clause.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {clause.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {clause.snippet}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="shadow-elegant border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Risks and recommendations from contract analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risks */}
              <div>
                <h4 className="font-medium text-foreground mb-3 flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Identified Risks
                </h4>
                <div className="space-y-3">
                  {aiInsights.risks.map((risk) => (
                    <div key={risk.id} className="p-3 border border-card-border rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <h5 className="font-medium text-sm">{risk.title}</h5>
                        <span className={cn("text-xs font-medium", getSeverityColor(risk.severity))}>
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {risk.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-foreground mb-3 flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Recommendations
                </h4>
                <div className="space-y-3">
                  {aiInsights.recommendations.map((rec) => (
                    <div key={rec.id} className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">{rec.title}</h5>
                      <p className="text-xs text-muted-foreground">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evidence Drawer */}
        <Card className="shadow-elegant border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Supporting Evidence</CardTitle>
                <CardDescription>
                  Document snippets and references
                </CardDescription>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Evidence
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Evidence Details</SheetTitle>
                    <SheetDescription>
                      Extracted snippets with relevance scores and page references
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {evidence.map((item) => (
                      <div key={item.id} className="p-4 border border-card-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Page {item.pageNumber}</span>
                          <Badge variant="secondary" className="text-xs">
                            {(item.relevanceScore * 100).toFixed(0)}% relevant
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.snippet}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                          Context: {item.context}
                        </p>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidence.slice(0, 2).map((item) => (
                <div key={item.id} className="p-4 border border-card-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Page {item.pageNumber}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(item.relevanceScore * 100).toFixed(0)}% relevant
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.snippet}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}