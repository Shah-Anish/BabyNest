import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Syringe, Plus, Check, Clock, AlertCircle, X } from "lucide-react";
import { parentService } from "@/services/parentService";

const Vaccinations = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    childId: "",
    name: "",
    recommendedAge: "",
    status: "pending",
    administeredDate: "",
  });

  useEffect(() => {
    fetchVaccinations();
    fetchChildren();
  }, []);

  const fetchVaccinations = async () => {
    try {
      setLoading(true);
      const data = await parentService.getVaccinations();
      setVaccinations(data.vaccinations || []);
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
    } catch {
      setChildren([]);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleAddVaccination = async (e) => {
    e.preventDefault();

    if (!formData.childId) return setFormError("Please select a child");
    if (!formData.name.trim()) return setFormError("Vaccination name is required");

    try {
      setSubmitting(true);
      await parentService.addVaccination({
        ...formData,
        recommendedAge: formData.recommendedAge ? Number(formData.recommendedAge) : undefined,
        administeredDate: formData.administeredDate || undefined,
      });
      setFormData({ childId: "", name: "", recommendedAge: "", status: "pending", administeredDate: "" });
      setShowAddModal(false);
      fetchVaccinations();
    } catch (err) {
      setFormError(err.message || "Failed to add vaccination");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (vaccinationId) => {
    if (!confirm("Are you sure you want to delete this vaccination record?")) return;
    try {
      await parentService.deleteVaccination(vaccinationId);
      fetchVaccinations();
    } catch (err) {
      alert("Error deleting vaccination: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading vaccinations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Vaccinations</h1>
          <p className="text-muted-foreground mt-1">Track immunization records</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Vaccination
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
          {vaccinations.length > 0 ? (
            vaccinations.map((vaccination) => (
              <div key={vaccination._id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full ${vaccination.status === 'completed' ? 'bg-success/10' : 'bg-yellow-500/10'} flex items-center justify-center`}>
                      {vaccination.status === 'completed' ? (
                        <Check className="w-6 h-6 text-success" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{vaccination.name}</h3>
                      <p className="text-sm text-muted-foreground">{vaccination.childId?.name || 'Unknown child'}</p>
                      <p className="text-sm text-muted-foreground">
                        {vaccination.status === 'completed' ? 'Completed on' : 'Administered on'}: {vaccination.administeredDate ? new Date(vaccination.administeredDate).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">Status: {vaccination.status}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(vaccination._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Syringe className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No vaccination records</p>
            </div>
          )}
        </div>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Add Vaccination</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVaccination} className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/10 rounded text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Child *</label>
                <select
                  name="childId"
                  value={formData.childId}
                  onChange={handleFormChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-card text-foreground"
                >
                  <option value="">Select child</option>
                  {children.map((child) => (
                    <option key={child._id} value={child._id}>{child.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vaccination Name *</label>
                <Input name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g., MMR" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Recommended Age (months)</label>
                <Input type="number" min="0" name="recommendedAge" value={formData.recommendedAge} onChange={handleFormChange} placeholder="e.g., 12" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-card text-foreground"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Administered Date</label>
                <Input type="date" name="administeredDate" value={formData.administeredDate} onChange={handleFormChange} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Vaccination"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Vaccinations;
