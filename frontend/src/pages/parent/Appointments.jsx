import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, MapPin, AlertCircle } from "lucide-react";
import { parentService } from "@/services/parentService";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await parentService.getAppointments();
      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await parentService.deleteAppointment(appointmentId);
      fetchAppointments();
    } catch (err) {
      alert("Error deleting appointment: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading appointments...</div>
      </div>
    );
  }

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date());
  const past = appointments.filter(a => new Date(a.date) < new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage doctor visits and checkups</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Appointment
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
          <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {upcoming.length > 0 ? (
              upcoming.map((appointment) => (
                <div key={appointment.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{appointment.title}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.childName}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{appointment.time || 'No time set'}</span>
                      </div>
                      {appointment.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{appointment.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming appointments</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Past Appointments</h3>
          <div className="space-y-3">
            {past.length > 0 ? (
              past.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="border border-border rounded-lg p-4 opacity-60">
                  <h4 className="font-semibold">{appointment.title}</h4>
                  <p className="text-sm text-muted-foreground">{appointment.childName}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No past appointments</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;
