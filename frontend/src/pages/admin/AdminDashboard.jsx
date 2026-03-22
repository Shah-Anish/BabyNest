import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, FileText, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { adminService } from "@/services/adminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      change: stats?.userGrowth || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Total Content",
      value: stats?.totalContent || 0,
      change: stats?.contentGrowth || 0,
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Active Sessions",
      value: stats?.activeSessions || 0,
      change: stats?.sessionChange || 0,
      icon: Activity,
      color: "text-info",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "System Uptime",
      value: stats?.uptime || "0%",
      change: null,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-green-500/10"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-display font-bold mt-2">{stat.value}</h3>
                {stat.change !== null && (
                  <p className={`text-xs mt-1 ${stat.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change}% from last month
                  </p>
                )}
              </div>
              <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.recentActivity?.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold mb-4">System Status</h3>
          <div className="space-y-4">
            {stats?.systemStatus?.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.service}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.status === 'healthy'
                      ? 'bg-green-500/10 text-green-700'
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.usage > 80 ? 'bg-destructive' : 'bg-success'
                    }`}
                    style={{ width: `${item.usage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{item.usage}% usage</p>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground text-center py-8">No system data available</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
