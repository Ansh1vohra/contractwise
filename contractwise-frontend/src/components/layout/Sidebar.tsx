import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  FileText, 
  BarChart3, 
  FileSpreadsheet, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Contracts", href: "/dashboard/contracts", icon: FileText },
  { name: "Query", href: "/dashboard/query", icon: Settings }, 
  { name: "Insights", href: "/dashboard/insights", icon: BarChart3 },
  { name: "Reports", href: "/dashboard/reports", icon: FileSpreadsheet },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground">
          ContractPro
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-sidebar-primary-foreground"
                    : "text-sidebar-accent group-hover:text-sidebar-foreground"
                )}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}