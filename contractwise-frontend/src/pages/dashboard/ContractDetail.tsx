import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, FileText, AlertTriangle, Lightbulb, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contractDetail, setContractDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token"); // ⬅️ Assuming token stored here
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/contracts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch contract: ${res.statusText}`);
        }

        const data = await res.json();
        setContractDetail(data);
      } catch (err) {
        console.error(err);
        setContractDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
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
          <h3 className="text-lg font-medium text-foreground mb-2">
            Contract not found
          </h3>
          <Button onClick={() => navigate("/dashboard/contracts")}>
            Back to Contracts
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const contract = contractDetail; // backend gives full contract row

  const getStatusClassName = (status?: string) => {
    switch (status) {
      case "Active": return "status-active";
      case "Renewal Due": return "status-renewal";
      case "Expired": return "status-expired";
      default: return "";
    }
  };

  const getRiskClassName = (risk?: string) => {
    switch (risk) {
      case "Low": return "risk-low";
      case "Medium": return "risk-medium";
      case "High": return "risk-high";
      default: return "";
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
              <h1 className="text-2xl font-semibold text-foreground">
                {contract.filename}
              </h1>
              <p className="text-muted-foreground">
                Contract details
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
                <p className="text-sm text-muted-foreground">Uploaded On</p>
                <p className="font-medium">
                  {new Date(contract.uploaded_on).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className="font-medium">
                  {contract.expiry_date
                    ? new Date(contract.expiry_date).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={getStatusClassName(contract.status)}>
                  {contract.status || "—"}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <span className={getRiskClassName(contract.risk_score)}>
                  {contract.risk_score || "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
