import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Plus, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import { parentService } from "@/services/parentService";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    childId: "",
    type: "vaccine",
    message: "",
    remindAt: ""
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [remindersData, childrenData] = await Promise.all([
        parentService.getReminders(),
        parentService.getChildren()
      ]);
      setReminders(remindersData.reminders || []);
      setChildren(childrenData.children || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError(null);
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.childId.trim()) {
      setFormError("Please select a child");
      return;
    }
    if (!formData.type.trim()) {
      setFormError("Please select a reminder type");
      return;
    }
    if (!formData.message.trim()) {
      setFormError("Please enter a reminder message");
      return;
    }
    if (!formData.remindAt.trim()) {
      setFormError("Please select a reminder date/time");
      return;
    }

    try {
      setSubmitting(true);
      await parentService.addReminder({
        childId: formData.childId,
        type: formData.type,
        message: formData.message,
        remindAt: formData.remindAt
      });
      setShowAddModal(false);
      setFormData({
        childId: "",
        type: "vaccine",
        message: "",
        remindAt: ""
      });
      await fetchInitialData();
    } catch (err) {
      setFormError(err.message || "Failed to add reminder");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (reminderId) => {
    try {
      await parentService.markReminderComplete(reminderId);
      await fetchInitialData();
    } catch (err) {
      alert("Error completing reminder: " + err.message);
    }
  };

  const handleDelete = async (reminderId) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;
    try {
      await parentService.deleteReminder(reminderId);
      await fetchInitialData();
    } catch (err) {
      alert("Error deleting reminder: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading reminders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Reminders</h1>
          <p className="text-muted-foreground mt-1">Never miss important tasks</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Reminder
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/10 rounded">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Reminder</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Child *</label>
                <select
                  name="childId"
                  value={formData.childId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm"
                >
                  <option value="">Select a child</option>
                  {children.map(child => (
                    <option key={child._id} value={child._id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm"
                >
                  <option value="vaccine">Vaccination</option>
                  <option value="appointment">Appointment</option>
                  <option value="medication">Medication</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Enter reminder details..."
                  className="w-full px-3 py-2 border border-border rounded-md text-sm min-h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Remind At *</label>
                <input
                  type="datetime-local"
                  name="remindAt"
                  value={formData.remindAt}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? "Adding..." : "Add Reminder"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Active Reminders</h3>
          <div className="space-y-3">
            {reminders.filter(r => !r.isSent).length > 0 ? (
              reminders.filter(r => !r.isSent).map((reminder) => (
                <div key={reminder._id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium capitalize">{reminder.type}</h4>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {reminder.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{reminder.message}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {reminder.remindAt 
                              ? new Date(reminder.remindAt).toLocaleString() 
                              : 'No due date'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(reminder._id)}
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(reminder._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active reminders</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Completed</h3>
          <div className="space-y-3">
            {reminders.filter(r => r.isSent).length > 0 ? (
              reminders.filter(r => r.isSent).map((reminder) => (
                <div key={reminder._id} className="border border-border rounded-lg p-4 opacity-60">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-through capitalize">{reminder.type}</h4>
                      <p className="text-sm text-muted-foreground line-through">{reminder.message}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed reminders</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reminders;
