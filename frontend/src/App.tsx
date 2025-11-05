import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "./pages/Login";
import CitizenAuth from "./pages/CitizenAuth";
import AdminAuth from "./pages/AdminAuth";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: "admin" | "citizen" }) => {
  const { user } = useAuth();
  
  console.log("🛡️ ProtectedRoute check:", {
    user,
    allowedRole,
    userRole: user?.role,
    localStorage_role: localStorage.getItem("userRole"),
    localStorage_username: localStorage.getItem("username"),
  });
  
  if (!user) {
    console.log("❌ No user found, redirecting to /");
    return <Navigate to="/" replace />;
  }
  
  if (user.role !== allowedRole) {
    console.log(`❌ Wrong role: expected ${allowedRole}, got ${user.role}`);
    return <Navigate to={user.role === "admin" ? "/admin" : "/citizen"} replace />;
  }
  
  console.log("✅ Auth check passed, rendering protected content");
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/citizen"
              element={
                <ProtectedRoute allowedRole="citizen">
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/citizen" element={<CitizenAuth />} />
            <Route path="/auth/admin" element={<AdminAuth />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
