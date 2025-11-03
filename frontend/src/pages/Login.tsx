import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Droplets, Shield, Users } from "lucide-react";
import { UserRole } from "@/types";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // When a role card is clicked, go to the role-specific auth screen
  const goToAuth = (role: UserRole) => {
    setSelectedRole(role);
    navigate(role === "admin" ? "/auth/admin" : "/auth/citizen");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8 card-elevated">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl water-gradient mb-4">
            <Droplets className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Water Leakage Detection System
          </h1>
          <p className="text-muted-foreground">
            Blockchain-Enabled Smart Water Management
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-center mb-4">Select Your Role</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => goToAuth("citizen")}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedRole === "citizen"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedRole === "citizen" ? "water-gradient" : "bg-muted"
                }`}>
                  <Users className={`w-8 h-8 ${
                    selectedRole === "citizen" ? "text-white" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Citizen</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Report leaks, predict issues, earn rewards
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => goToAuth("admin")}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedRole === "admin"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedRole === "admin" ? "water-gradient" : "bg-muted"
                }`}>
                  <Shield className={`w-8 h-8 ${
                    selectedRole === "admin" ? "text-white" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Admin</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage system, view logs, retrain models
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">Select a role above to continue</div>
      </Card>
    </div>
  );
};

export default Login;
