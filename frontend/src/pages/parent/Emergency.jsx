import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Plus, Phone, Mail, MapPin, AlertCircle } from "lucide-react";
import { parentService } from "@/services/parentService";

const Emergency = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await parentService.getEmergencyContacts();
      setContacts(data.contacts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    try {
      await parentService.deleteEmergencyContact(contactId);
      fetchContacts();
    } catch (err) {
      alert("Error deleting contact: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading emergency contacts...</div>
      </div>
    );
  }

  const emergencyNumbers = [
    { name: "Emergency Services", number: "911", description: "Police, Fire, Ambulance" },
    { name: "Poison Control", number: "1-800-222-1222", description: "24/7 Poison Help" },
    { name: "Crisis Hotline", number: "988", description: "Mental Health Crisis" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Emergency Information</h1>
          <p className="text-muted-foreground mt-1">Important contacts and resources</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/10 rounded">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      )}

      <Card className="p-6 bg-destructive/5 border-destructive/20">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-destructive" />
          <h3 className="text-lg font-semibold">Emergency Numbers</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyNumbers.map((emergency, index) => (
            <div key={index} className="bg-background border border-border rounded-lg p-4">
              <p className="font-semibold">{emergency.name}</p>
              <p className="text-2xl font-display font-bold text-destructive my-2">{emergency.number}</p>
              <p className="text-xs text-muted-foreground">{emergency.description}</p>
              <Button variant="destructive" className="w-full mt-3" size="sm" asChild>
                <a href={`tel:${emergency.number}`}>Call Now</a>
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Emergency Contacts</h3>
        <div className="space-y-4">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div key={contact.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                    <div className="mt-3 space-y-2">
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                        </div>
                      )}
                      {contact.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{contact.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDelete(contact.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No emergency contacts added</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Emergency;
