import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const AdminAuth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return toast({ title: "Username required" });
    // mock login — store username via AuthContext
    login("admin", username);
    toast({ title: "Logged in", description: `Welcome back, ${username}` });
    navigate("/admin");
  };

  const submitSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return toast({ title: "Choose a username" });
    // mock signup: save username and auto-login
    login("admin", username);
    toast({ title: "Account created", description: `Welcome, ${username}` });
    navigate("/admin");
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
