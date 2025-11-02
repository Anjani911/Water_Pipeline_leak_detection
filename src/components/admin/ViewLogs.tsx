import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/api/api";
import Loader from "@/components/Loader";
import { RefreshCw, ScrollText } from "lucide-react";

const ViewLogs = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/logs");
      setLogs(response.data.logs || []);
      toast.success("Logs loaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch logs");
      console.error("Logs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getLogColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "error":
        return "text-destructive";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-primary";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="dashboard-section">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg water-gradient flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">System Logs</h2>
              <p className="text-sm text-muted-foreground">
                Monitor server activity and errors
              </p>
            </div>
          </div>
          <Button
            onClick={fetchLogs}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <Loader message="Loading logs..." />
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ScrollText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No logs available</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-muted border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    {log.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    )}
                    <p className={`font-medium ${getLogColor(log.level)}`}>
                      {log.level && (
                        <span className="uppercase font-bold">[{log.level}]</span>
                      )}{" "}
                      {log.message || JSON.stringify(log)}
                    </p>
                    {log.details && (
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Total Log Entries:</span> {logs.length}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ViewLogs;
