import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Plus, AlertCircle, TrendingUp, X, Trash2 } from "lucide-react";
import { parentService } from "@/services/parentService";

const Growth = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [displayUnits, setDisplayUnits] = useState({
    height: "cm", // cm, m, inches, feet
    weight: "kg"  // kg, lbs
  });
  const [formData, setFormData] = useState({
    date: "",
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    headCircumference: "",
    headUnit: "cm"
  });

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchGrowthData(selectedChild);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await parentService.getChildren();
      const childrenList = data.children || [];
      setChildren(childrenList);
      if (childrenList.length > 0) {
        setSelectedChild(childrenList[0]._id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrowthData = async (childId) => {
    try {
      const data = await parentService.getGrowthData(childId);
      setGrowthData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Convert height to cm (standard unit for storage)
  const convertHeightToCm = (value, unit) => {
    switch (unit) {
      case "cm":
        return parseFloat(value);
      case "m":
        return parseFloat(value) * 100;
      case "inches":
        return parseFloat(value) * 2.54;
      case "feet":
        return parseFloat(value) * 30.48;
      default:
        return parseFloat(value);
    }
  };

  // Convert weight to kg (standard unit for storage)
  const convertWeightToKg = (value, unit) => {
    switch (unit) {
      case "kg":
        return parseFloat(value);
      case "lbs":
        return parseFloat(value) / 2.20462;
      default:
        return parseFloat(value);
    }
  };

  // Convert cm to display unit
  const convertCmToUnit = (cm, unit) => {
    if (!cm) return "N/A";
    switch (unit) {
      case "cm":
        return cm.toFixed(1);
      case "m":
        return (cm / 100).toFixed(2);
      case "inches":
        return (cm / 2.54).toFixed(1);
      case "feet":
        return (cm / 30.48).toFixed(2);
      default:
        return cm.toFixed(1);
    }
  };

  // Convert kg to display unit
  const convertKgToUnit = (kg, unit) => {
    if (!kg) return "N/A";
    switch (unit) {
      case "kg":
        return kg.toFixed(1);
      case "lbs":
        return (kg * 2.20462).toFixed(1);
      default:
        return kg.toFixed(1);
    }
  };

  const getDisplayLabel = (unit) => {
    switch (unit) {
      case "cm":
        return "cm";
      case "m":
        return "m";
      case "inches":
        return "in";
      case "feet":
        return "ft";
      case "kg":
        return "kg";
      case "lbs":
        return "lbs";
      default:
        return unit;
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

  const handleAddMeasurement = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.date.trim()) {
      setFormError("Please select a measurement date");
      return;
    }
    if (!formData.height.trim()) {
      setFormError("Please enter height");
      return;
    }
    if (!formData.weight.trim()) {
      setFormError("Please enter weight");
      return;
    }

    try {
      setSubmitting(true);
      // Convert input values to standard units (cm, kg)
      const heightInCm = convertHeightToCm(formData.height, formData.heightUnit);
      const weightInKg = convertWeightToKg(formData.weight, formData.weightUnit);
      const headInCm = formData.headCircumference
        ? convertHeightToCm(formData.headCircumference, formData.headUnit)
        : null;

      await parentService.addGrowthEntry(selectedChild, {
        date: formData.date,
        height: heightInCm,
        weight: weightInKg,
        headCircumference: headInCm
      });
      setShowAddModal(false);
      setFormData({
        date: "",
        height: "",
        heightUnit: "cm",
        weight: "",
        weightUnit: "kg",
        headCircumference: "",
        headUnit: "cm"
      });
      await fetchGrowthData(selectedChild);
    } catch (err) {
      setFormError(err.message || "Failed to add measurement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!confirm("Are you sure you want to delete this growth entry?")) return;
    try {
      await parentService.deleteGrowthEntry(entryId);
      await fetchGrowthData(selectedChild);
    } catch (err) {
      alert("Error deleting entry: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading growth data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Growth Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor your child's development</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2" disabled={!selectedChild}>
          <Plus className="w-4 h-4" />
          Add Measurement
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/10 rounded">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Add Measurement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Measurement</h2>
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

            <form onSubmit={handleAddMeasurement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Measurement Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Height *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleFormChange}
                    placeholder="0.0"
                    step="0.1"
                    className="flex-1 px-3 py-2 border border-border rounded-md text-sm"
                  />
                  <select
                    name="heightUnit"
                    value={formData.heightUnit}
                    onChange={handleFormChange}
                    className="px-3 py-2 border border-border rounded-md text-sm w-24"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="inches">inches</option>
                    <option value="feet">feet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Weight *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleFormChange}
                    placeholder="0.0"
                    step="0.1"
                    className="flex-1 px-3 py-2 border border-border rounded-md text-sm"
                  />
                  <select
                    name="weightUnit"
                    value={formData.weightUnit}
                    onChange={handleFormChange}
                    className="px-3 py-2 border border-border rounded-md text-sm w-24"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Head Circumference</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="headCircumference"
                    value={formData.headCircumference}
                    onChange={handleFormChange}
                    placeholder="0.0 (optional)"
                    step="0.1"
                    className="flex-1 px-3 py-2 border border-border rounded-md text-sm"
                  />
                  <select
                    name="headUnit"
                    value={formData.headUnit}
                    onChange={handleFormChange}
                    className="px-3 py-2 border border-border rounded-md text-sm w-24"
                  >
                    <option value="cm">cm</option>
                    <option value="inches">inches</option>
                  </select>
                </div>
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
                  {submitting ? "Adding..." : "Add Measurement"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {children.length > 0 ? (
        <>
          <div className="flex gap-2 flex-wrap">
            {children.map((child) => (
              <Button
                key={child._id}
                variant={selectedChild === child._id ? "default" : "outline"}
                onClick={() => setSelectedChild(child._id)}
              >
                {child.name}
              </Button>
            ))}
          </div>

          {/* Display Unit Selectors */}
          <Card className="p-4 bg-muted/50">
            <h3 className="text-sm font-semibold mb-3">Display Units</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Height</label>
                <select
                  value={displayUnits.height}
                  onChange={(e) => setDisplayUnits(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full px-2 py-1 border border-border rounded text-xs"
                >
                  <option value="cm">Centimeters (cm)</option>
                  <option value="m">Meters (m)</option>
                  <option value="inches">Inches (in)</option>
                  <option value="feet">Feet (ft)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Weight</label>
                <select
                  value={displayUnits.weight}
                  onChange={(e) => setDisplayUnits(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-2 py-1 border border-border rounded text-xs"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Height</h3>
              </div>
              <p className="text-3xl font-display font-bold">
                {convertCmToUnit(growthData?.latestHeight, displayUnits.height)}
              </p>
              <p className="text-sm text-muted-foreground">{getDisplayLabel(displayUnits.height)}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Weight</h3>
              </div>
              <p className="text-3xl font-display font-bold">
                {convertKgToUnit(growthData?.latestWeight, displayUnits.weight)}
              </p>
              <p className="text-sm text-muted-foreground">{getDisplayLabel(displayUnits.weight)}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-700" />
                <h3 className="font-semibold">Head Circumference</h3>
              </div>
              <p className="text-3xl font-display font-bold">
                {convertCmToUnit(growthData?.latestHeadCirc, displayUnits.height)}
              </p>
              <p className="text-sm text-muted-foreground">{getDisplayLabel(displayUnits.height)}</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Growth History</h3>
            <div className="space-y-3">
              {growthData?.history?.length > 0 ? (
                growthData.history.map((entry) => (
                  <div key={entry._id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-medium">
                        {entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Height: {convertCmToUnit(entry.height, displayUnits.height)}{getDisplayLabel(displayUnits.height)} • Weight: {convertKgToUnit(entry.weight, displayUnits.weight)}{getDisplayLabel(displayUnits.weight)}
                        {entry.headCircumference && ` • Head: ${convertCmToUnit(entry.headCircumference, displayUnits.height)}${getDisplayLabel(displayUnits.height)}`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDeleteEntry(entry._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No growth data recorded</p>
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Add a child first to track growth</p>
        </div>
      )}
    </div>
  );
};

export default Growth;
