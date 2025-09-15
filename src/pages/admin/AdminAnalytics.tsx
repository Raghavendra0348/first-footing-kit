import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockReports, categories, departments } from "@/data/mockData";
import { BarChart3, TrendingUp, Clock, Target, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernAnalyticsChart } from "@/components/charts/ModernAnalyticsChart";

const AdminAnalytics = () => {
  const getAnalytics = () => {
    const total = mockReports.length;
    const resolved = mockReports.filter(r => r.status === "resolved").length;
    const inProgress = mockReports.filter(r => r.status === "acknowledged" || r.status === "in-progress").length;
    const submitted = mockReports.filter(r => r.status === "submitted").length;
    
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    
    // Category breakdown
    const categoryStats = categories.map(category => ({
      name: category,
      count: mockReports.filter(r => r.category === category).length,
      resolved: mockReports.filter(r => r.category === category && r.status === "resolved").length,
    }));

    // Department stats
    const departmentStats = departments.map(dept => ({
      name: dept,
      assigned: mockReports.filter(r => r.assignedDepartment === dept).length,
      resolved: mockReports.filter(r => r.assignedDepartment === dept && r.status === "resolved").length,
    }));

    // Priority distribution
    const priorityStats = [
      { level: "High", count: mockReports.filter(r => r.priority === "high").length },
      { level: "Medium", count: mockReports.filter(r => r.priority === "medium").length },
      { level: "Low", count: mockReports.filter(r => r.priority === "low").length },
    ];

    return {
      overview: { total, resolved, inProgress, submitted, resolutionRate },
      categories: categoryStats,
      departments: departmentStats,
      priorities: priorityStats,
    };
  };

  const analytics = getAnalytics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Insights into civic issue reporting and resolution performance
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-civic-blue mr-3" />
              <div>
                <p className="text-2xl font-bold">{analytics.overview.total}</p>
                <p className="text-sm text-muted-foreground">Total Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-civic-green mr-3" />
              <div>
                <p className="text-2xl font-bold">{analytics.overview.resolutionRate}%</p>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-civic-amber mr-3" />
              <div>
                <p className="text-2xl font-bold">{analytics.overview.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-civic-red mr-3" />
              <div>
                <p className="text-2xl font-bold">2.3</p>
                <p className="text-sm text-muted-foreground">Avg Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Analytics Charts */}
      <ModernAnalyticsChart data={{ categories: analytics.categories, departments: analytics.departments }} />
    </div>
  );
};

export default AdminAnalytics;