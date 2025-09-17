import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, FileSpreadsheet, FileText, PieChart, TrendingUp } from "lucide-react";
import { useEffect } from "react";

export default function Reports() {
  const availableReports = [
    {
      id: 'portfolio-summary',
      title: 'Portfolio Summary Report',
      description: 'Comprehensive overview of all contracts, risk levels, and key metrics',
      type: 'Executive Summary',
      lastGenerated: '2024-09-15',
      format: 'PDF',
      icon: PieChart
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment Report',
      description: 'Detailed analysis of contract risks and mitigation recommendations',
      type: 'Risk Analysis',
      lastGenerated: '2024-09-14',
      format: 'PDF',
      icon: TrendingUp
    },
    {
      id: 'expiry-forecast',
      title: 'Contract Expiry Forecast',
      description: 'Upcoming expirations and renewal timeline planning',
      type: 'Planning',
      lastGenerated: '2024-09-13',
      format: 'Excel',
      icon: Calendar
    },
    {
      id: 'compliance-audit',
      title: 'Compliance Audit Report',
      description: 'Contract compliance status and regulatory requirements review',
      type: 'Compliance',
      lastGenerated: '2024-09-12',
      format: 'PDF',
      icon: FileText
    }
  ];

  const scheduledReports = [
    {
      name: 'Weekly Portfolio Summary',
      frequency: 'Weekly',
      nextRun: '2024-09-22',
      recipients: ['john@example.com', 'legal@company.com']
    },
    {
      name: 'Monthly Risk Assessment',
      frequency: 'Monthly',
      nextRun: '2024-10-01',
      recipients: ['john@example.com', 'cfo@company.com']
    },
    {
      name: 'Quarterly Compliance Review',
      frequency: 'Quarterly',
      nextRun: '2024-12-01',
      recipients: ['compliance@company.com']
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Executive Summary': return 'bg-primary/10 text-primary';
      case 'Risk Analysis': return 'bg-risk-high/10 text-risk-high';
      case 'Planning': return 'bg-risk-medium/10 text-risk-medium';
      case 'Compliance': return 'bg-risk-low/10 text-risk-low';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleGenerateReport = (reportId: string) => {
    console.log('Generating report:', reportId);
    // In a real app, this would trigger report generation
  };

  const handleDownloadReport = (reportId: string) => {
    console.log('Downloading report:', reportId);
    // In a real app, this would download the report file
  };

  useEffect(() => {
    const tk = localStorage.getItem("token");
    if (!tk) {
      window.location.href = "/login";
      return;
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
            <p className="text-muted-foreground">
              Generate and manage contract analysis reports
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="executive">Executive Summary</SelectItem>
                <SelectItem value="risk">Risk Analysis</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Available Reports */}
        <Card className="shadow-elegant border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Available Reports
            </CardTitle>
            <CardDescription>
              Generate reports on-demand or download recent versions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableReports.map((report) => {
              const IconComponent = report.icon;
              return (
                <div key={report.id} className="p-4 border border-card-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-foreground">{report.title}</h3>
                          <Badge variant="outline" className={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {report.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                          <span>Format: {report.format}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleGenerateReport(report.id)}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Scheduled Reports */}
        <Card className="shadow-elegant border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Scheduled Reports
              </div>
              <Button variant="outline" size="sm">
                Add Schedule
              </Button>
            </CardTitle>
            <CardDescription>
              Automated report generation and distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduledReports.map((schedule, index) => (
              <div key={index} className="p-4 border border-card-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{schedule.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Frequency: {schedule.frequency}</span>
                      <span>Next run: {new Date(schedule.nextRun).toLocaleDateString()}</span>
                      <span>Recipients: {schedule.recipients.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Run Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Report Customization */}
        <Card className="shadow-elegant border-card-border">
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
            <CardDescription>
              Create customized reports with specific data and filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-card-border rounded-lg text-center">
                <PieChart className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h4 className="font-medium mb-1">Risk Dashboard</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Interactive risk visualization and metrics
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Create Dashboard
                </Button>
              </div>

              <div className="p-4 border border-card-border rounded-lg text-center">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h4 className="font-medium mb-1">Custom Analysis</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Build reports with custom filters and metrics
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Build Report
                </Button>
              </div>

              <div className="p-4 border border-card-border rounded-lg text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h4 className="font-medium mb-1">Trend Analysis</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Historical trends and predictive insights
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Analyze Trends
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}