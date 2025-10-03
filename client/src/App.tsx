import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import UserLogin from "@/pages/UserLogin";
import UserRegister from "@/pages/UserRegister";
import SellProduct from "@/pages/SellProduct";
import MyProducts from "@/pages/MyProducts";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminProducts from "@/pages/AdminProducts";
import AdminReports from "@/pages/AdminReports";
import AdminSupport from "@/pages/AdminSupport";
import AdminSettings from "@/pages/AdminSettings";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={UserLogin} />
      <Route path="/cadastro" component={UserRegister} />
      <Route path="/vender" component={SellProduct} />
      <Route path="/meus-produtos" component={MyProducts} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/sellers" component={AdminUsers} />
      <Route path="/admin/reports" component={AdminReports} />
      <Route path="/admin/support" component={AdminSupport} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
