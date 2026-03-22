import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Plus, AlertCircle, X } from "lucide-react";
import { parentService } from "@/services/parentService";

const Nutrition = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [children, setChildren] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    childId: "",
    type: "feeding",
    title: "",
    details: "",
    timestamp: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    fetchLogs();
    fetchChildren();
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

  const fetchChildren = async () => {
    try {
      const data = await parentService.getChildren();
      setChildren(data.children || []);
      if (data.children && data.children.length > 0) {
        setFormData(prev => ({ ...prev, childId: data.children[0]._id }));
      }
    } catch (err) {
      console.error("Error fetching children:", err);
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

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNutrition = async () => {
    if (!formData.childId || !formData.type) {
      alert("Please select a child and log type");
      return;
    }

    try {
      setSubmitting(true);
      await parentService.addNutritionLog({
        childId: formData.childId,
        type: formData.type,
        title: formData.title || formData.type,
        details: formData.details,
        timestamp: new Date(formData.timestamp).toISOString()
      });

      setFormData({
        childId: children.length > 0 ? children[0]._id : "",
        type: "feeding",
        title: "",
        details: "",
        timestamp: new Date().toISOString().slice(0, 16)
      });
      setShowModal(false);
      fetchLogs();
    } catch (err) {
      alert("Error adding nutrition log: " + err.message);
    } finally {
      setSubmitting(false);
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
        <Button className="gap-2" onClick={() => setShowModal(true)}>
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
                      log.type === 'feeding' ? 'bg-orange-100' :
                      log.type === 'water' ? 'bg-blue-100' :
                      log.type === 'snack' ? 'bg-yellow-100' :
                      log.type === 'meal' ? 'bg-green-100' :
                      'bg-purple-100'
                    } flex items-center justify-center`}>
                      <Utensils className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{log.title || log.type}</h3>
                        <span className="text-xs px-2 py-1 rounded bg-muted">
                          {log.type}
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

      {/* Add Log Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Add Nutrition Log</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Child Select */}
              <div>
                <label className="block text-sm font-medium mb-2">Child *</label>
                <select
                  name="childId"
                  value={formData.childId}
                  onChange={handleModalInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select a child</option>
                  {children.map(child => (
                    <option key={child._id} value={child._id}>{child.name}</option>
                  ))}
                </select>
              </div>

              {/* Type Select */}
              <div>
                <label className="block text-sm font-medium mb-2">Log Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleModalInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="feeding">Feeding</option>
                  <option value="water">Water</option>
                  <option value="snack">Snack</option>
                  <option value="meal">Meal</option>
                  <option value="supplement">Supplement</option>
                </select>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleModalInputChange}
                  placeholder={`e.g., ${formData.type}`}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              {/* Details Textarea */}
              <div>
                <label className="block text-sm font-medium mb-2">Details</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleModalInputChange}
                  placeholder="e.g., breast milk, formula, how much, reactions..."
                  rows="3"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                />
              </div>

              {/* Timestamp */}
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="datetime-local"
                  name="timestamp"
                  value={formData.timestamp}
                  onChange={handleModalInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>
            </div>

            <div className="flex gap-2 p-6 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddNutrition}
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add Log"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Nutrition;
