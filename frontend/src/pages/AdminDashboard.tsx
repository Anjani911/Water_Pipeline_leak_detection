import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RetrainModel from "@/components/admin/RetrainModel";
import ManualTransaction from "@/components/admin/ManualTransaction";
import ViewLedger from "@/components/admin/ViewLedger";
import ViewLogs from "@/components/admin/ViewLogs";
import { FileText, RefreshCw, ScrollText, Wallet } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("retrain");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage datasets, retrain models, and monitor system operations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 gap-4 h-auto p-1 bg-muted/50">
            <TabsTrigger value="retrain" className="gap-2 py-3">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Retrain Model</span>
            </TabsTrigger>
            <TabsTrigger value="ledger" className="gap-2 py-3">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">View Ledger</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2 py-3">
              <ScrollText className="w-4 h-4" />
              <span className="hidden sm:inline">View Logs</span>
            </TabsTrigger>
            <TabsTrigger value="transaction" className="gap-2 py-3">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="retrain">
            <RetrainModel />
          </TabsContent>

          <TabsContent value="ledger">
            <ViewLedger />
          </TabsContent>

          <TabsContent value="logs">
            <ViewLogs />
          </TabsContent>

          <TabsContent value="transaction">
            <ManualTransaction />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
