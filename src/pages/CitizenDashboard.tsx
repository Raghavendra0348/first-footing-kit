import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { mockReports } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Calendar, MapPin, FileText, Eye, TrendingUp } from "lucide-react";

const CitizenDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  // Filter reports based on selected tab
  const filteredReports = mockReports.filter(report => {
    switch (selectedTab) {
      case "submitted":
        return report.status === "submitted";
      case "progress":
        return report.status === "acknowledged" || report.status === "in-progress";
      case "resolved":
        return report.status === "resolved";
      default:
        return true;
    }
  });

  const getStatusCounts = () => {
    return {
      total: mockReports.length,
      submitted: mockReports.filter(r => r.status === "submitted").length,
      progress: mockReports.filter(r => r.status === "acknowledged" || r.status === "in-progress").length,
      resolved: mockReports.filter(r => r.status === "resolved").length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Reports Dashboard</h1>
            <p className="text-muted-foreground">
              Track the progress of your submitted civic issues
            </p>
          </div>
          <Button asChild variant="civic" className="mt-4 md:mt-0">
            <Link to="/report">Report New Issue</Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-civic-blue mr-3" />
                <div>
                  <p className="text-2xl font-bold">{counts.total}</p>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-status-progress rounded-full mr-3 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{counts.progress}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-status-resolved rounded-full mr-3 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{counts.resolved}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-civic-blue rounded-full mr-3 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.5</p>
                  <p className="text-sm text-muted-foreground">Avg Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Reports ({counts.total})</TabsTrigger>
                <TabsTrigger value="submitted">Submitted ({counts.submitted})</TabsTrigger>
                <TabsTrigger value="progress">In Progress ({counts.progress})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({counts.resolved})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <ReportsList reports={filteredReports} />
              </TabsContent>
              <TabsContent value="submitted" className="space-y-4">
                <ReportsList reports={filteredReports} />
              </TabsContent>
              <TabsContent value="progress" className="space-y-4">
                <ReportsList reports={filteredReports} />
              </TabsContent>
              <TabsContent value="resolved" className="space-y-4">
                <ReportsList reports={filteredReports} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ReportsList = ({ reports }: { reports: any[] }) => {
  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No reports found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="border shadow-sm hover:shadow-card transition-smooth">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  <StatusBadge status={report.status} />
                  <PriorityBadge priority={report.priority} />
                </div>
                <p className="text-muted-foreground mb-2">{report.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {report.id}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(report.dateSubmitted).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {report.location.address}
                  </span>
                  <Badge variant="outline">{report.category}</Badge>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to={`/report/${report.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CitizenDashboard;