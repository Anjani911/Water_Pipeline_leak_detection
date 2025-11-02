import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import api from "@/api/api";
import Loader from "@/components/Loader";
import { LedgerEntry } from "@/types";
import { FileText, RefreshCw } from "lucide-react";

const ViewLedger = () => {
  const [loading, setLoading] = useState(false);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const response = await api.get("/ledger");
      setLedger(response.data.chain || []);
      toast.success("Ledger loaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch ledger");
      console.error("Ledger error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="dashboard-section">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg water-gradient flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Blockchain Ledger</h2>
              <p className="text-sm text-muted-foreground">
                View all blockchain transactions
              </p>
            </div>
          </div>
          <Button
            onClick={fetchLedger}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <Loader message="Loading ledger..." />
        ) : ledger.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions in the blockchain</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Index</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Previous Hash</TableHead>
                  <TableHead>Current Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledger.map((entry) => (
                  <TableRow key={entry.index}>
                    <TableCell className="font-medium">{entry.index}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(entry.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{entry.username}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      {entry.reward} tokens
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground max-w-[120px] truncate">
                      {entry.previous_hash}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground max-w-[120px] truncate">
                      {entry.hash}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {ledger.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Total Blocks:</span> {ledger.length}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Total Rewards:</span>{" "}
              {ledger.reduce((sum, entry) => sum + entry.reward, 0)} tokens
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ViewLedger;
