import { useState } from "react";
import Navbar from "@/components/Navbar";
import RetrainModel from "@/components/admin/RetrainModel";
import ManualTransaction from "@/components/admin/ManualTransaction";
import ViewLedger from "@/components/admin/ViewLedger";
import ViewLogs from "@/components/admin/ViewLogs";
import Reports from "@/components/admin/Reports";
import { RefreshCw, BarChart2 } from "lucide-react";

const AdminDashboard = () => {
  const [screen, setScreen] = useState<"manage" | "reports">("manage");

  return (
    <div className="min-h-screen bg-background pb-20">{/* pb for bottom nav */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage datasets, retrain models, and monitor system operations
          </p>
        </div>

        {screen === "manage" ? (
          <div className="space-y-6">
            <RetrainModel />
            <ViewLedger />
            <ViewLogs />
            <ManualTransaction />
          </div>
        ) : (
          <Reports />
        )}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4">
        <div className="max-w-3xl w-full bg-background/90 backdrop-blur rounded-full shadow-lg p-2 flex items-center justify-between">
          <button onClick={() => setScreen("manage")} className={`flex-1 py-3 px-4 rounded-full text-center transition ${screen === "manage" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
            <RefreshCw className="mx-auto" />
            <div className="text-xs mt-1">Manage</div>
          </button>
          <button onClick={() => setScreen("reports")} className={`flex-1 py-3 px-4 rounded-full text-center transition ${screen === "reports" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
            <BarChart2 className="mx-auto" />
            <div className="text-xs mt-1">Reports</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
