import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react";

export default function Insights() {
  const riskDistribution = [
    { level: 'High Risk', count: 3, percentage: 20, color: 'text-risk-high' },
    { level: 'Medium Risk', count: 5, percentage: 33, color: 'text-risk-medium' },
    { level: 'Low Risk', count: 7, percentage: 47, color: 'text-risk-low' }
  ];

  const expiringContracts = [
    { name: 'Service Agreement - CloudHost', daysLeft: 15, status: 'Renewal Due' },
    { name: 'Consulting Agreement - DataAnalytics Pro', daysLeft: 30, status: 'Renewal Due' },
    { name: 'Software License Agreement - Adobe', daysLeft: 75, status: 'Active' }
  ];

  const topRisks = [
    {
      title: 'Short Termination Notices',
      description: '40% of contracts have termination periods under 30 days',
      severity: 'Medium',
      affected: 6
    },
    {
      title: 'Liability Cap Inconsistencies',
      description: 'Liability limitations vary significantly across contracts',
      severity: 'High',
      affected: 3
    },
    {
      title: 'Payment Terms Variance',
      description: 'Payment periods range from 15-45 days affecting cash flow',
      severity: 'Medium',
      affected: 8
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-risk-high';
      case 'Medium': return 'text-risk-medium';
      case 'Low': return 'text-risk-low';
      default: return '';
    }
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Renewal Due': return 'status-renewal';
      case 'Expired': return 'status-expired';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Contract Insights</h1>
          <p className="text-muted-foreground">
            AI-powered analytics and risk assessment across your portfolio
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-elegant border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Contracts</p>
                  <p className="text-2xl font-semibold">15</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-semibold text-risk-medium">3</p>
                </div>
                <Clock className="h-8 w-8 text-risk-medium" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-semibold text-risk-high">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-risk-high" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-card-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                  <p className="text-2xl font-semibold text-risk-low">85%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-risk-low" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <Card className="shadow-elegant border-card-border">
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>
                Portfolio risk levels across all contracts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {riskDistribution.map((item) => (
                <div key={item.level} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.level}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{item.count} contracts</span>
                      <span className={`text-sm font-medium ${item.color}`}>
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Expiring Contracts */}
          <Card className="shadow-elegant border-card-border">
            <CardHeader>
              <CardTitle>Contracts Requiring Attention</CardTitle>
              <CardDescription>
                Contracts expiring or needing renewal soon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {expiringContracts.map((contract, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-card-border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{contract.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contract.daysLeft} days remaining
                    </p>
                  </div>
                  <span className={getStatusClassName(contract.status)}>
                    {contract.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Risks */}
        <Card className="shadow-elegant border-card-border">
          <CardHeader>
            <CardTitle>Top Portfolio Risks</CardTitle>
            <CardDescription>
              Key risks identified across your contract portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topRisks.map((risk, index) => (
              <div key={index} className="p-4 border border-card-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{risk.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSeverityColor(risk.severity)}`}
                      >
                        {risk.severity} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{risk.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Affects</p>
                    <p className="font-medium">{risk.affected} contracts</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card className="shadow-elegant border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Portfolio Trends
            </CardTitle>
            <CardDescription>
              Key metrics and trends over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-semibold text-risk-low mb-1">+23%</p>
                <p className="text-sm text-muted-foreground">Contract Volume Growth</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-risk-medium mb-1">-15%</p>
                <p className="text-sm text-muted-foreground">Risk Score Improvement</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-primary mb-1">92%</p>
                <p className="text-sm text-muted-foreground">Renewal Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}