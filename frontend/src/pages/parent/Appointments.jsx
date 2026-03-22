import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, MapPin, AlertCircle } from "lucide-react";
import { parentService } from "@/services/parentService";
import { X } from "lucide-react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [children, setChildren] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    childId: "",
    title: "",
    date: "",
    time: "",
    location: "",
    doctorName: "",
    notes: ""
  });

  useEffect(() => {
    fetchAppointments();
    fetchChildren();
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

  const fetchChildren = async () => {
    try {
      const data = await parentService.getChildren();
      setChildren(data.children || []);
      if (data.children && data.children.length > 0 && !formData.childId) {
        setFormData(prev => ({ ...prev, childId: data.children[0]._id }));
      }
    } catch (err) {
      console.error("Error fetching children:", err);
    }
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (appointment = null) => {
    if (appointment) {
      setEditingId(appointment.id);
      const appointmentDate = new Date(appointment.date);
      setFormData({
        childId: appointment.childId,
        title: appointment.title,
        date: appointmentDate.toISOString().slice(0, 10),
        time: appointment.time || "",
        location: appointment.location || "",
        doctorName: appointment.doctorName || "",
        notes: appointment.notes || ""
      });
    } else {
      setEditingId(null);
      setFormData({
        childId: children.length > 0 ? children[0]._id : "",
        title: "",
        date: "",
        time: "",
        location: "",
        doctorName: "",
        notes: ""
      });
    }
    setShowModal(true);
  };

  const handleSaveAppointment = async () => {
    if (!formData.childId || !formData.title || !formData.date) {
      alert("Please fill in required fields: child, title, and date");
      return;
    }

    try {
      setSubmitting(true);
      const appointmentData = {
        childId: formData.childId,
        title: formData.title,
        date: new Date(formData.date).toISOString(),
        time: formData.time || null,
        location: formData.location || null,
        doctorName: formData.doctorName || null,
        notes: formData.notes || null
      };

      if (editingId) {
        await parentService.updateAppointment(editingId, appointmentData);
      } else {
        await parentService.addAppointment(appointmentData);
      }

      setFormData({
        childId: children.length > 0 ? children[0]._id : "",
        title: "",
        date: "",
        time: "",
        location: "",
        doctorName: "",
        notes: ""
      });
      setShowModal(false);
      fetchAppointments();
    } catch (err) {
      alert("Error saving appointment: " + err.message);
    } finally {
      setSubmitting(false);
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
        <Button className="gap-2" onClick={() => handleOpenModal()}>
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
                      <Button size="sm" variant="outline" onClick={() => handleOpenModal(appointment)}>Edit</Button>
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

      {/* Add/Edit Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{editingId ? "Edit Appointment" : "Add Appointment"}</h2>
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

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Appointment Type *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleModalInputChange}
                  placeholder="e.g., Doctor Checkup, Vaccination, Dental"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleModalInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              {/* Time Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleModalInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              {/* Doctor Name Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Doctor/Provider Name</label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleModalInputChange}
                  placeholder="e.g., Dr. Smith"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleModalInputChange}
                  placeholder="e.g., City Hospital, Dr. Smith's Clinic"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              {/* Notes Textarea */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleModalInputChange}
                  placeholder="e.g., Bring insurance card, Bring vaccination records..."
                  rows="2"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
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
                onClick={handleSaveAppointment}
                disabled={submitting}
              >
                {submitting ? "Saving..." : editingId ? "Update" : "Add Appointment"}
              </Button>
            </div>
          </Card>
        </div>
      )}

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
