import { useState } from "react";
import Navbar from "@/components/Navbar";
import UploadPhotoReport from "@/components/citizen/UploadPhotoReport";
import ViewLedger from "@/components/citizen/ViewLedger";
import Profile from "@/components/citizen/Profile";
import { Camera, FileText, User } from "lucide-react";

const CitizenDashboard = () => {
  const [screen, setScreen] = useState<"profile" | "report">("profile");

  return (
    <div className="min-h-screen bg-background pb-20">{/* pb for bottom nav */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Citizen Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor water usage, report leaks, and earn blockchain rewards
          </p>
        </div>

        {screen === "profile" ? (
          <Profile />
        ) : (
          <UploadPhotoReport />
        )}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4">
        <div className="max-w-3xl w-full bg-background/90 backdrop-blur rounded-full shadow-lg p-2 flex items-center justify-between">
          <button onClick={() => setScreen("profile")} className={`flex-1 py-3 px-4 rounded-full text-center transition ${screen === "profile" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
            <User className="mx-auto" />
            <div className="text-xs mt-1">Profile</div>
          </button>
          <button onClick={() => setScreen("report")} className={`flex-1 py-3 px-4 rounded-full text-center transition ${screen === "report" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
            <Camera className="mx-auto" />
            <div className="text-xs mt-1">Report</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
