import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Server, Database, Cpu, HardDrive, Activity, RefreshCw,
  AlertCircle, CheckCircle, Trash2
} from "lucide-react";
import { adminService } from "@/services/adminService";

const SystemHealth = () => {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const [healthData, metricsData, infoData] = await Promise.all([
        adminService.getSystemHealth(),
        adminService.getSystemMetrics('24h'),
        adminService.getServerInfo()
      ]);
      setHealth(healthData);
      setMetrics(metricsData);
      setServerInfo(infoData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSystemData();
    setRefreshing(false);
  };

  const handleClearCache = async () => {
    if (!confirm("Are you sure you want to clear the system cache?")) return;
    try {
      await adminService.clearCache();
      alert("Cache cleared successfully");
    } catch (err) {
      alert("Error clearing cache: " + err.message);
    }
  };

  const handleRestartService = async (serviceName) => {
    if (!confirm(`Are you sure you want to restart ${serviceName}?`)) return;
    try {
      await adminService.restartService(serviceName);
      alert(`${serviceName} restarted successfully`);
      fetchSystemData();
    } catch (err) {
      alert(`Error restarting ${serviceName}: ` + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading system health...</div>
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

  const services = health?.services || [];
  const systemMetrics = metrics?.current || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">System Health</h1>
          <p className="text-muted-foreground mt-1">Monitor system performance and services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearCache} className="gap-2">
            <Trash2 className="w-4 h-4" />
            Clear Cache
          </Button>
          <Button onClick={handleRefresh} className="gap-2" disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-display font-bold">
                  {systemMetrics.cpu || 0}%
                </h3>
              </div>
            </div>
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                (systemMetrics.cpu || 0) > 80 ? 'bg-destructive' : 'bg-primary'
              }`}
              style={{ width: `${systemMetrics.cpu || 0}%` }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Memory Usage</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-display font-bold">
                  {systemMetrics.memory || 0}%
                </h3>
              </div>
            </div>
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                (systemMetrics.memory || 0) > 80 ? 'bg-destructive' : 'bg-accent'
              }`}
              style={{ width: `${systemMetrics.memory || 0}%` }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-blue-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Disk Usage</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-display font-bold">
                  {systemMetrics.disk || 0}%
                </h3>
              </div>
            </div>
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                (systemMetrics.disk || 0) > 80 ? 'bg-destructive' : 'bg-blue-500'
              }`}
              style={{ width: `${systemMetrics.disk || 0}%` }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Uptime</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-display font-bold">
                  {serverInfo?.uptime || '0d'}
                </h3>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5" />
            Services Status
          </h3>
          <div className="space-y-3">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    {service.status === 'running' ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      service.status === 'running'
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {service.status}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestartService(service.name)}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No service data available
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5" />
            Server Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Platform</span>
              <span className="text-sm font-medium">{serverInfo?.platform || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Node Version</span>
              <span className="text-sm font-medium">{serverInfo?.nodeVersion || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Environment</span>
              <span className="text-sm font-medium">{serverInfo?.environment || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Total Memory</span>
              <span className="text-sm font-medium">{serverInfo?.totalMemory || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Free Memory</span>
              <span className="text-sm font-medium">{serverInfo?.freeMemory || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">Load Average</span>
              <span className="text-sm font-medium">{serverInfo?.loadAverage || 'N/A'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemHealth;
