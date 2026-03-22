import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Baby, Plus, Edit, Trash2, AlertCircle, Calendar, X } from "lucide-react";
import { parentService } from "@/services/parentService";

const Children = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await parentService.getChildren();
      setChildren(data.children || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (childId) => {
    if (!confirm("Are you sure you want to delete this child's record?")) return;
    try {
      await parentService.deleteChild(childId);
      fetchChildren();
    } catch (err) {
      alert("Error deleting child: " + err.message);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setFormError("Child's name is required");
      return;
    }
    if (!formData.dateOfBirth) {
      setFormError("Date of birth is required");
      return;
    }
    if (!formData.gender) {
      setFormError("Gender is required");
      return;
    }

    try {
      setSubmitting(true);
      await parentService.addChild(formData);
      setFormData({ name: "", dateOfBirth: "", gender: "" });
      setShowAddModal(false);
      fetchChildren();
    } catch (err) {
      setFormError(err.message || "Failed to add child");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading children...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Children</h1>
          <p className="text-muted-foreground mt-1">Manage your children's profiles</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Child
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/10 rounded">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.length > 0 ? (
          children.map((child) => (
            <Card key={child.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Baby className="w-8 h-8 text-primary" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(child.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1">{child.name}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Born: {child.birthDate ? new Date(child.birthDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <p>Gender: {child.gender ? child.gender.charAt(0).toUpperCase() + child.gender.slice(1) : 'N/A'}</p>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Baby className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No children added yet</p>
            <Button className="mt-4" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Child
            </Button>
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Add Child</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddChild} className="p-6 space-y-5">
              {formError && (
                <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/10 rounded text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Child's Name *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter child's name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth *</label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleFormChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-card text-foreground"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Add Child"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Children;
