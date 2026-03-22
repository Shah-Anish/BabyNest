import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Plus, AlertCircle } from "lucide-react";
import { parentService } from "@/services/parentService";

const Nutrition = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await parentService.getNutritionLogs();
      setLogs(data.logs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (logId) => {
    if (!confirm("Are you sure you want to delete this log?")) return;
    try {
      await parentService.deleteNutritionLog(logId);
      fetchLogs();
    } catch (err) {
      alert("Error deleting log: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading nutrition logs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Nutrition & Care</h1>
          <p className="text-muted-foreground mt-1">Track feeding and daily care</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Log
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/10 rounded">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full ${
                      log.type === 'feeding' ? 'bg-primary/10' :
                      log.type === 'sleep' ? 'bg-blue-500/10' :
                      'bg-yellow-500/10'
                    } flex items-center justify-center`}>
                      <Utensils className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{log.title || log.type}</h3>
                        <span className="text-xs px-2 py-1 rounded bg-muted">
                          {log.type || 'general'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.childName}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                      </p>
                      {log.details && (
                        <p className="text-sm mt-2">{log.details}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(log.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No nutrition logs</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Nutrition;
