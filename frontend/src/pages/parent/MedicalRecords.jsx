import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Plus, FileText, AlertCircle, X } from "lucide-react";
import { parentService } from "@/services/parentService";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    childId: "",
    doctorName: "",
    visitDate: "",
    notes: ""
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [recordsData, childrenData] = await Promise.all([
        parentService.getMedicalRecords(),
        parentService.getChildren()
      ]);
      setRecords(recordsData.records || []);
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

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.childId.trim()) {
      setFormError("Please select a child");
      return;
    }
    if (!formData.doctorName.trim()) {
      setFormError("Please enter doctor's name");
      return;
    }
    if (!formData.visitDate.trim()) {
      setFormError("Please select a visit date");
      return;
    }

    try {
      setSubmitting(true);
      await parentService.addMedicalRecord({
        childId: formData.childId,
        doctorName: formData.doctorName,
        visitDate: formData.visitDate,
        notes: formData.notes
      });
      setShowAddModal(false);
      setFormData({
        childId: "",
        doctorName: "",
        visitDate: "",
        notes: ""
      });
      await fetchInitialData();
    } catch (err) {
      setFormError(err.message || "Failed to add medical record");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!confirm("Are you sure you want to delete this medical record?")) return;
    try {
      await parentService.deleteMedicalRecord(recordId);
      await fetchInitialData();
    } catch (err) {
      alert("Error deleting record: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading medical records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Medical Records</h1>
          <p className="text-muted-foreground mt-1">Health history and documents</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Record
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/10 rounded">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Add Medical Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Medical Record</h2>
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

            <form onSubmit={handleAddRecord} className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Doctor's Name *</label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleFormChange}
                  placeholder="Dr. Smith"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Visit Date *</label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder="Visit notes, diagnosis, treatment details..."
                  className="w-full px-3 py-2 border border-border rounded-md text-sm min-h-24 resize-none"
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
                  {submitting ? "Adding..." : "Add Record"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          {records.length > 0 ? (
            records.map((record) => (
              <div key={record._id} className="border border-border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{record.title || 'Medical Record'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {record.childName} • {record.recordType || 'General'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Date: {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                      </p>
                      {record.diagnosis && (
                        <p className="text-sm mt-2">
                          <span className="font-medium">Notes:</span> {record.diagnosis}
                        </p>
                      )}
                      {record.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{record.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDelete(record._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Stethoscope className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No medical records</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MedicalRecords;
