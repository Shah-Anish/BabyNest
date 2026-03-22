import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Plus, FileText, AlertCircle } from "lucide-react";
import { parentService } from "@/services/parentService";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await parentService.getMedicalRecords();
      setRecords(data.records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!confirm("Are you sure you want to delete this medical record?")) return;
    try {
      await parentService.deleteMedicalRecord(recordId);
      fetchRecords();
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
        <Button className="gap-2">
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

      <Card className="p-6">
        <div className="space-y-4">
          {records.length > 0 ? (
            records.map((record) => (
              <div key={record.id} className="border border-border rounded-lg p-4 hover:bg-muted/50">
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
                          <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                        </p>
                      )}
                      {record.treatment && (
                        <p className="text-sm">
                          <span className="font-medium">Treatment:</span> {record.treatment}
                        </p>
                      )}
                      {record.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{record.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDelete(record.id)}
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
