import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadPhotoReport from "@/components/citizen/UploadPhotoReport";
import ViewLedger from "@/components/citizen/ViewLedger";
import { Camera, FileText } from "lucide-react";

const CitizenDashboard = () => {
  const [activeTab, setActiveTab] = useState("report");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Citizen Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor water usage, report leaks, and earn blockchain rewards
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-4 h-auto p-1 bg-muted/50">
            <TabsTrigger value="report" className="gap-2 py-3">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Photo & Report Leak</span>
            </TabsTrigger>
            <TabsTrigger value="ledger" className="gap-2 py-3">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">View Rewards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            <UploadPhotoReport />
          </TabsContent>

          <TabsContent value="ledger">
            <ViewLedger />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CitizenDashboard;
