import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Plus, AlertCircle, TrendingUp } from "lucide-react";
import { parentService } from "@/services/parentService";

const Growth = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setSelectedChild(childrenList[0].id);
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
        <Button className="gap-2" disabled={!selectedChild}>
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

      {children.length > 0 ? (
        <>
          <div className="flex gap-2">
            {children.map((child) => (
              <Button
                key={child.id}
                variant={selectedChild === child.id ? "default" : "outline"}
                onClick={() => setSelectedChild(child.id)}
              >
                {child.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Height</h3>
              </div>
              <p className="text-3xl font-display font-bold">{growthData?.latestHeight || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">cm</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Weight</h3>
              </div>
              <p className="text-3xl font-display font-bold">{growthData?.latestWeight || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">kg</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-700" />
                <h3 className="font-semibold">Head Circumference</h3>
              </div>
              <p className="text-3xl font-display font-bold">{growthData?.latestHeadCirc || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">cm</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Growth History</h3>
            <div className="space-y-3">
              {growthData?.history?.length > 0 ? (
                growthData.history.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-medium">
                        {entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Height: {entry.height}cm • Weight: {entry.weight}kg
                        {entry.headCircumference && ` • Head: ${entry.headCircumference}cm`}
                      </p>
                    </div>
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
