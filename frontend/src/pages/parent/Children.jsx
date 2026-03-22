import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Baby, Plus, Edit, Trash2, AlertCircle, Calendar } from "lucide-react";
import { parentService } from "@/services/parentService";

const Children = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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
                  <span>Born: {child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                </div>
                <p>Age: {child.age || 'N/A'}</p>
                <p>Gender: {child.gender || 'N/A'}</p>
                <p>Blood Type: {child.bloodType || 'N/A'}</p>
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
    </div>
  );
};

export default Children;
