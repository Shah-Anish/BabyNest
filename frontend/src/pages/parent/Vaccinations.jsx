import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Syringe, Plus, Check, Clock, AlertCircle } from "lucide-react";
import { parentService } from "@/services/parentService";

const Vaccinations = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVaccinations();
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
        <Button className="gap-2">
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
              <div key={vaccination.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full ${vaccination.completed ? 'bg-success/10' : 'bg-yellow-500/10'} flex items-center justify-center`}>
                      {vaccination.completed ? (
                        <Check className="w-6 h-6 text-success" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{vaccination.name}</h3>
                      <p className="text-sm text-muted-foreground">{vaccination.childName}</p>
                      <p className="text-sm text-muted-foreground">
                        {vaccination.completed ? 'Completed on' : 'Due on'}: {vaccination.date ? new Date(vaccination.date).toLocaleDateString() : 'N/A'}
                      </p>
                      {vaccination.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{vaccination.notes}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(vaccination.id)}
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
    </div>
  );
};

export default Vaccinations;
