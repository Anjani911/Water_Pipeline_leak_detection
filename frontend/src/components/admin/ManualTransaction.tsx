import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/api/api";
import Loader from "@/components/Loader";
import { ManualTransactionData } from "@/types";
import { CheckCircle2, Wallet } from "lucide-react";

const ManualTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [formState, setFormState] = useState({ receiver: "", amount: 0, reason: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: name === "amount" ? parseFloat(value as string) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
  const sender = user?.username || "admin";
  const payload = { sender, receiver: formState.receiver, amount: formState.amount };
  const response = await api.post("/add_transaction", payload);
      setResult(response.data);
      toast.success("Transaction added to blockchain");
  setFormState({ receiver: "", amount: 0, reason: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add transaction");
      console.error("Transaction error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="dashboard-section">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg water-gradient flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Add Manual Transaction
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manually add rewards to the blockchain ledger
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="receiver">Recipient Username</Label>
            <Input
              id="receiver"
              name="receiver"
              value={formState.receiver}
              onChange={handleChange}
              placeholder="Enter recipient username"
              required
            />
          </div>

          <div>
            <Label htmlFor="reward">Reward Amount (Tokens)</Label>
            <Input
              id="reward"
              name="amount"
              type="number"
              step="0.01"
              value={formState.amount}
              onChange={handleChange}
              placeholder="e.g., 10.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formState.reason}
              onChange={handleChange}
              placeholder="Reason for this transaction..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full water-gradient">
            {loading ? "Adding..." : "Add to Ledger"}
          </Button>
        </form>
      </Card>

      {loading && <Loader message="Adding transaction to blockchain..." />}

      {result && (
        <Card className="p-6 border-success">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 text-success flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Transaction Added</h3>
              <div className="space-y-2 text-sm">
                {result.block_index !== undefined && (
                  <p>
                    <span className="font-semibold">Block Index:</span>{" "}
                    {result.block_index}
                  </p>
                )}
                {result.hash && (
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    Hash: {result.hash}
                  </p>
                )}
                {result.message && (
                  <p className="text-muted-foreground">{result.message}</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ManualTransaction;
