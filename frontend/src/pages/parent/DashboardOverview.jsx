import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Baby, Syringe, Bell, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { parentService } from "@/services/parentService";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await parentService.getDashboardOverview();
      setOverview(data);
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

  const stats = [
    {
      title: "Total Children",
      value: overview?.totalChildren || 0,
      icon: Baby,
      color: "text-primary",
      bgColor: "bg-primary/10",
      link: "/dashboard/children"
    },
    {
      title: "Upcoming Vaccinations",
      value: overview?.upcomingVaccinations || 0,
      icon: Syringe,
      color: "text-blue-700",
      bgColor: "bg-blue-500/10",
      link: "/dashboard/vaccinations"
    },
    {
      title: "Active Reminders",
      value: overview?.activeReminders || 0,
      icon: Bell,
      color: "text-yellow-700",
      bgColor: "bg-yellow-500/10",
      link: "/dashboard/reminders"
    },
    {
      title: "Appointments",
      value: overview?.upcomingAppointments || 0,
      icon: Calendar,
      color: "text-accent",
      bgColor: "bg-accent/10",
      link: "/dashboard/appointments"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your family's health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className="p-6 hover:shadow-md transition-shadow animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-display font-bold mt-2">{stat.value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold mb-4">Upcoming Tasks</h3>
          <div className="space-y-3">
            {overview?.upcomingTasks?.length > 0 ? (
              overview.upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <div className={`w-8 h-8 rounded-full ${task.type === 'vaccination' ? 'bg-blue-500/10' : task.type === 'appointment' ? 'bg-accent/10' : 'bg-yellow-500/10'} flex items-center justify-center`}>
                    {task.type === 'vaccination' && <Syringe className="w-4 h-4 text-blue-700" />}
                    {task.type === 'appointment' && <Calendar className="w-4 h-4 text-accent" />}
                    {task.type === 'reminder' && <Bell className="w-4 h-4 text-yellow-700" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.childName}</p>
                    <p className="text-xs text-muted-foreground">{task.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming tasks</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {overview?.recentActivity?.length > 0 ? (
              overview.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.childName}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
