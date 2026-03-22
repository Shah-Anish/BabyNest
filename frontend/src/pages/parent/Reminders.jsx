import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { parentService } from "@/services/parentService";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await parentService.getReminders();
      setReminders(data.reminders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (reminderId) => {
    try {
      await parentService.markReminderComplete(reminderId);
      fetchReminders();
    } catch (err) {
      alert("Error completing reminder: " + err.message);
    }
  };

  const handleDelete = async (reminderId) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;
    try {
      await parentService.deleteReminder(reminderId);
      fetchReminders();
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
        <Button className="gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Active Reminders</h3>
          <div className="space-y-3">
            {reminders.filter(r => !r.completed).length > 0 ? (
              reminders.filter(r => !r.completed).map((reminder) => (
                <div key={reminder.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full ${reminder.priority === 'high' ? 'bg-destructive/10' : 'bg-yellow-500/10'} flex items-center justify-center`}>
                        <Bell className={`w-5 h-5 ${reminder.priority === 'high' ? 'text-destructive' : 'text-yellow-700'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{reminder.title}</h4>
                        <p className="text-sm text-muted-foreground">{reminder.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{reminder.dueDate ? new Date(reminder.dueDate).toLocaleDateString() : 'No due date'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(reminder.id)}
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(reminder.id)}
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
            {reminders.filter(r => r.completed).length > 0 ? (
              reminders.filter(r => r.completed).map((reminder) => (
                <div key={reminder.id} className="border border-border rounded-lg p-4 opacity-60">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-through">{reminder.title}</h4>
                      <p className="text-sm text-muted-foreground">{reminder.description}</p>
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
