import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/api/api";

const AdminAuth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return toast.error("Username required");
    
    console.log("🔵 LOGIN ATTEMPT - AdminAuth");
    console.log("API Base URL:", import.meta.env.VITE_API_URL);
    console.log("Username:", username);
    console.log("Password length:", password?.length);
    
    try {
      console.log("📡 Sending POST /login to backend...");
      const resp = await api.post("/login", { username, password });
      console.log("✅ Login response:", resp.data);
      
      const role = resp.data.role || "admin";
      login(role as any, username);
      toast.success(`Welcome back, ${username}`);
      navigate("/admin");
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Full error:", err.message);
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return toast.error("Choose a username");
    try {
      await api.post("/signup", { username, password, role: "admin" });
      const resp = await api.post("/login", { username, password });
      const role = resp.data.role || "admin";
      login(role as any, username);
      toast.success(`Account created. Welcome, ${username}`);
      navigate("/admin");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-8 card-elevated">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Administrator Portal</h2>
          <p className="text-sm text-muted-foreground">Sign in to manage the system, view logs and retrain models</p>
        </div>

        <div className="flex gap-4 justify-center mb-6">
          <Button variant={mode === "login" ? "default" : "ghost"} onClick={() => setMode("login")}>Login</Button>
          <Button variant={mode === "signup" ? "default" : "ghost"} onClick={() => setMode("signup")}>Sign up</Button>
        </div>

        {mode === "login" ? (
          <form onSubmit={submitLogin} className="space-y-4">
            <div>
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin user" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            </div>
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
        ) : (
          <form onSubmit={submitSignup} className="space-y-4">
            <div>
              <Label>Choose username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin handle" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="create a password" />
            </div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AdminAuth;
