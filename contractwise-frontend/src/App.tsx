import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Dashboard pages
import Contracts from "./pages/dashboard/Contracts";
import Upload from "./pages/dashboard/Upload";
import ContractDetail from "./pages/dashboard/ContractDetail";
import Query from "./pages/dashboard/Query";
import Insights from "./pages/dashboard/Insights";
import Reports from "./pages/dashboard/Reports";
import Settings from "./pages/dashboard/Settings";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/contracts" element={<Contracts />} />
          <Route path="/dashboard/contracts/:id" element={<ContractDetail />} />
          <Route path="/dashboard/upload" element={<Upload />} />
          <Route path="/dashboard/query" element={<Query />} />
          <Route path="/dashboard/insights" element={<Insights />} />
          <Route path="/dashboard/reports" element={<Reports />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
