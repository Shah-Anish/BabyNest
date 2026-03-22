import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Baby, Syringe, Bell, Stethoscope, BarChart3,
  Utensils, Calendar, AlertTriangle, Settings, Menu, X, LogOut
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const parentNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Children", icon: Baby, path: "/dashboard/children" },
  { label: "Vaccinations", icon: Syringe, path: "/dashboard/vaccinations" },
  { label: "Reminders", icon: Bell, path: "/dashboard/reminders" },
  { label: "Medical Records", icon: Stethoscope, path: "/dashboard/medical" },
  { label: "Growth", icon: BarChart3, path: "/dashboard/growth" },
  { label: "Nutrition & Care", icon: Utensils, path: "/dashboard/nutrition" },
  { label: "Appointments", icon: Calendar, path: "/dashboard/appointments" },
  { label: "Emergency", icon: AlertTriangle, path: "/dashboard/emergency" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const ParentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allNav = parentNav;

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display text-sm">B</span>
            </div>
            <span className="font-display text-lg">BabyNest</span>
          </Link>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {allNav.map(item => {
            const active = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path + "/"));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-4 lg:px-8 sticky top-0 z-30">
          <button className="lg:hidden mr-3" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-sans font-semibold text-sm text-muted-foreground">
            {allNav.find(n => location.pathname === n.path || location.pathname.startsWith(n.path + "/"))?.label || "Dashboard"}
          </h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name || 'Parent'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user?.name?.charAt(0).toUpperCase() || 'P'}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ParentDashboard;
