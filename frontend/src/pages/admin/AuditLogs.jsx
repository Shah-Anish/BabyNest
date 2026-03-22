import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter, AlertCircle, Clock } from "lucide-react";
import { adminService } from "@/services/adminService";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, searchTerm, actionFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAuditLogs({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        action: actionFilter !== "all" ? actionFilter : undefined
      });
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await adminService.exportAuditLogs({
        search: searchTerm,
        action: actionFilter !== "all" ? actionFilter : undefined
      });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString()}.json`;
      a.click();
    } catch (err) {
      alert("Error exporting logs: " + err.message);
    }
  };

  const getActionColor = (action) => {
    const colors = {
      create: 'bg-success/10 text-success',
      update: 'bg-blue-500/10 text-blue-700',
      delete: 'bg-destructive/10 text-destructive',
      login: 'bg-accent/10 text-accent',
      logout: 'bg-muted text-muted-foreground'
    };
    return colors[action?.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading audit logs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Track all system activities and changes</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs by user or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive mb-4 p-3 bg-destructive/10 rounded">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">User</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Resource</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">IP Address</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleString()
                            : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {log.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{log.user?.name || 'System'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${getActionColor(log.action)}`}>
                        {log.action || 'unknown'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{log.resource || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                      {log.ipAddress || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {log.details || 'No details'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-muted-foreground">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuditLogs;
