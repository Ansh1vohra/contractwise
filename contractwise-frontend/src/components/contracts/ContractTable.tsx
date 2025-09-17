import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Contract {
  doc_id: string;
  filename: string;
  uploaded_on?: string | null;
  status?: string;
  risk_score?: string;
  uploadedOn?: string;
  parties?: string[]; // optional now
}

interface ContractTableProps {
  contracts: Contract[];
  loading?: boolean;
}

export function ContractTable({ contracts, loading }: ContractTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter contracts
  const filteredContracts = contracts.filter((contract) => {
  const contractName = contract.filename || "";   // use filename instead of name
  const matchesSearch =
    contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contract.parties || []).some((party) =>
      (party || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  const matchesStatus =
    statusFilter === "all" || contract.status === statusFilter;
  const matchesRisk =
    riskFilter === "all" || contract.risk_score === riskFilter;

  return matchesSearch && matchesStatus && matchesRisk;
});


  // Paginate contracts
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredContracts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusClassName = (status?: string) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Renewal Due":
        return "status-renewal";
      case "Expired":
        return "status-expired";
      default:
        return "";
    }
  };

  const getRiskClassName = (risk?: string) => {
    switch (risk) {
      case "Low":
        return "risk-low";
      case "Medium":
        return "risk-medium";
      case "High":
        return "risk-high";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Contracts...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Contracts</h1>
          <p className="text-muted-foreground">
            Manage and monitor your contract portfolio
          </p>
        </div>
        <Link to="/dashboard/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Contract
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="shadow-elegant border-card-border">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contracts or parties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Renewal Due">Renewal Due</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="Low">Low Risk</SelectItem>
                <SelectItem value="Medium">Medium Risk</SelectItem>
                <SelectItem value="High">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card className="shadow-elegant border-card-border">
        <CardContent className="p-0">
          {filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No contracts found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || riskFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Upload your first contract to get started"}
              </p>
              {!searchTerm &&
                statusFilter === "all" &&
                riskFilter === "all" && (
                  <Link to="/dashboard/upload">
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Contract
                    </Button>
                  </Link>
                )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract Name</TableHead>
                    <TableHead>Parties</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContracts.map((contract) => (
                    <TableRow
                      key={contract.doc_id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell>
                        <Link
                          to={`/dashboard/contracts/${contract.doc_id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {contract.filename}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {(contract.parties || []).length > 0
                            ? contract.parties.join(", ")
                            : "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {contract.uploaded_on
                          ? new Date(contract.uploaded_on).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <span className={getStatusClassName(contract.status)}>
                          {contract.status || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={getRiskClassName(contract.risk_score)}>
                          {contract.risk_score || "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-card-border">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, filteredContracts.length)}{" "}
                    of {filteredContracts.length} contracts
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
