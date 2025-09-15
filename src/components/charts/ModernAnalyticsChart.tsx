import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

interface AnalyticsData {
  categories: Array<{
    name: string;
    count: number;
    resolved: number;
  }>;
  departments: Array<{
    name: string;
    assigned: number;
    resolved: number;
  }>;
}

interface ModernAnalyticsChartProps {
  data: AnalyticsData;
}

const CHART_COLORS = [
  'hsl(212, 83%, 45%)', // civic-blue
  'hsl(142, 71%, 45%)', // civic-green  
  'hsl(43, 96%, 56%)',  // civic-amber
  'hsl(0, 84%, 60%)',   // civic-red
  'hsl(260, 100%, 80%)', // purple
  'hsl(180, 100%, 70%)', // cyan
];

const monthlyData = [
  { month: '2017', reports: 25, resolved: 20 },
  { month: '2018', reports: 38, resolved: 32 },
  { month: '2019', reports: 42, resolved: 38 },
  { month: '2020', reports: 48, resolved: 45 },
  { month: '2021', reports: 38, resolved: 35 },
  { month: '2022', reports: 55, resolved: 52 },
  { month: '2023', reports: 70, resolved: 68 },
];

export const ModernAnalyticsChart = ({ data }: ModernAnalyticsChartProps) => {
  // Transform category data for charts
  const categoryChartData = data.categories
    .filter(cat => cat.count > 0)
    .map(cat => ({
      name: cat.name.replace(' ', '\n'),
      total: cat.count,
      resolved: cat.resolved,
      pending: cat.count - cat.resolved,
      resolutionRate: cat.count > 0 ? ((cat.resolved / cat.count) * 100).toFixed(1) : '0'
    }));

  const departmentChartData = data.departments
    .filter(dept => dept.assigned > 0)
    .map(dept => ({
      name: dept.name.replace(' ', '\n'),
      assigned: dept.assigned,
      resolved: dept.resolved,
      pending: dept.assigned - dept.resolved,
      resolutionRate: dept.assigned > 0 ? ((dept.resolved / dept.assigned) * 100).toFixed(1) : '0'
    }));

  const pieData = categoryChartData.map((item, index) => ({
    name: item.name,
    value: item.total,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Trend Line Chart */}
      <Card className="shadow-card lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <p className="text-sm text-muted-foreground">Report submission and resolution over time</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(212, 83%, 45%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(212, 83%, 45%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="reports"
                stroke="hsl(212, 83%, 45%)"
                fillOpacity={1}
                fill="url(#colorReports)"
                strokeWidth={3}
                dot={{ r: 6, fill: "hsl(212, 83%, 45%)" }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={3}
                dot={{ r: 6, fill: "hsl(142, 71%, 45%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Performance Bar Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
          <p className="text-sm text-muted-foreground">Resolution rates across different categories</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="resolved" fill="hsl(142, 71%, 45%)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="pending" fill="hsl(43, 96%, 56%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {data.categories
              .filter(cat => cat.count > 0)
              .sort((a, b) => b.count - a.count)
              .map((category) => {
                const resolutionRate = category.count > 0 ? Math.round((category.resolved / category.count) * 100) : 0;
                return (
                  <div key={category.name} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{category.count} total</Badge>
                      <Badge variant={resolutionRate >= 80 ? "resolved" : resolutionRate >= 50 ? "progress" : "submitted"}>
                        {resolutionRate}% resolved
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Department Workload */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Department Workload</CardTitle>
          <p className="text-sm text-muted-foreground">Current assignments and performance</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={departmentChartData}>
              <defs>
                <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(212, 83%, 45%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(212, 83%, 45%)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="assigned"
                stroke="hsl(212, 83%, 45%)"
                fillOpacity={1}
                fill="url(#colorAssigned)"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="hsl(142, 71%, 45%)"
                fill="hsl(142, 71%, 45%)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {data.departments
              .filter(dept => dept.assigned > 0)
              .sort((a, b) => b.assigned - a.assigned)
              .map((department) => {
                const resolutionRate = department.assigned > 0 ? Math.round((department.resolved / department.assigned) * 100) : 0;
                return (
                  <div key={department.name} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{department.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{department.assigned} assigned</Badge>
                      <Badge variant={resolutionRate >= 80 ? "resolved" : resolutionRate >= 50 ? "progress" : "submitted"}>
                        {resolutionRate}% resolved
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution Pie Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Issue Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">Breakdown by category</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, name]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value) => value.replace('\n', ' ')}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <p className="text-sm text-muted-foreground">Key performance indicators</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-civic-blue-light rounded-lg">
              <div className="text-2xl font-bold text-civic-blue">
                {data.categories.reduce((sum, cat) => sum + cat.count, 0)}
              </div>
              <div className="text-sm text-civic-blue">Total Reports</div>
            </div>
            
            <div className="p-4 bg-civic-green-light rounded-lg">
              <div className="text-2xl font-bold text-civic-green">
                {Math.round((data.categories.reduce((sum, cat) => sum + cat.resolved, 0) / Math.max(data.categories.reduce((sum, cat) => sum + cat.count, 0), 1)) * 100)}%
              </div>
              <div className="text-sm text-civic-green">Resolution Rate</div>
            </div>
            
            <div className="p-4 bg-civic-amber-light rounded-lg">
              <div className="text-2xl font-bold text-civic-amber">
                {data.categories.reduce((sum, cat) => sum + (cat.count - cat.resolved), 0)}
              </div>
              <div className="text-sm text-civic-amber">Pending Issues</div>
            </div>
            
            <div className="p-4 bg-gradient-card rounded-lg border">
              <div className="text-2xl font-bold text-foreground">2.3</div>
              <div className="text-sm text-muted-foreground">Avg Resolution Days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};