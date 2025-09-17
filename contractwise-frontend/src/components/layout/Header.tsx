import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export function Header() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";    
    console.log("Logging out...");
  };

  return (
    <header className="h-16 bg-card border-b border-card-border px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-foreground ml-12 lg:ml-0">
          Contract Management Dashboard
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>John Doe</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              john@example.com
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}