import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bell, User, Settings, LogOut, Crown, CreditCard, HelpCircle, Plus, ChevronRight, History, TrendingUp } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AppLayout = ({ children, title, subtitle }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitial = () => {
    if (profile?.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (profile?.first_name) {
      return `${profile.first_name}`;
    }
    return "User's Hairmama";
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="glass-card border-b border-border/20 h-16 flex items-center px-6 lg:px-8 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-8 w-8 p-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  {title || `Good morning, ${profile?.first_name || 'there'}!`}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 transition-colors">
                <Bell className="h-4 w-4" />
              </Button>
              
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 p-2 h-10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                        <span className="text-sm font-semibold text-primary-foreground">
                          {getUserInitial()}
                        </span>
                      </div>
                    
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-80 p-0 max-h-[calc(100vh-64px)] overflow-y-auto" 
                  align="end" 
                  sideOffset={8}
                >
                  {/* User Info Section */}
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {getUserInitial()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{getUserDisplayName()}</p>
                        <p className="text-xs text-muted-foreground">{profile?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pro Upgrade Section */}
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                      <span className="flex items-center gap-1 text-sm">
                        <Crown className="h-4 w-4" />
                        Turn Pro
                      </span>
                      <Button size="sm" variant="default" className="h-7 px-3">
                        Upgrade
                      </Button>
                    </div>
                  </div>

                  {/* Credits Section */}
                  <div className="p-3 border-b border-border">
                    <div className="flex flex-col gap-2 rounded-lg bg-muted p-3">
                      <div className="flex items-center justify-between cursor-pointer transition-all duration-150 ease-in-out hover:opacity-80">
                        <p className="text-sm font-medium">Credits</p>
                        <div className="flex items-center gap-1">
                          <p className="text-sm text-muted-foreground">3 left</p>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex w-full items-center gap-2">
                        <div className="relative flex-1 overflow-hidden rounded-lg bg-muted/50" style={{ height: '8px' }}>
                          <div 
                            className="absolute h-full bg-blue-600 transition-all rounded-lg" 
                            style={{ left: '0%', width: '100%' }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        <p className="text-xs text-muted-foreground">Daily credits used first</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row gap-1.5 p-3 pb-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-7 text-xs"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Settings
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Invite
                    </Button>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Progress Tracking Section
                  <div className="p-3">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-xs text-muted-foreground">Progress Tracking</span>
                    </div>
                    <div className="space-y-1">
                      <div 
                        className="relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent hover:bg-accent"
                        onClick={() => navigate('/goals')}
                      >
                        <div className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center">
                          <TrendingUp className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <p className="min-w-0 truncate text-sm">Track Hair Progress</p>
                        <span className="rounded-full px-1.5 py-px text-[9px] font-medium uppercase bg-green-100 text-green-800">
                          New
                        </span>
                        <ChevronRight className="ml-auto h-3 w-3" />
                      </div>
                      <div 
                        className="flex items-center gap-3 px-3 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-lg"
                        onClick={() => navigate('/goals')}
                      >
                        <History className="h-3 w-3" />
                        <p className="text-sm">View Analysis History</p>
                      </div>
                    </div>
                  </div> */}

                  <DropdownMenuSeparator />

                  {/* Help and Support */}
                  <div className="p-3 space-y-1">
                    <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer">
                      <HelpCircle className="h-4 w-4" />
                      <p className="text-sm">Help Center</p>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Sign Out */}
                  <div className="p-3">
                    <DropdownMenuItem 
                      className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      <p className="text-sm">Sign out</p>
                    </DropdownMenuItem>
              </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;