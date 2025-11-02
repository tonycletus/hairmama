import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Camera,
  X,
  LogOut,
  Target,
  Shield,
  TrendingUp,
  Heart,
  Apple,
  Settings
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const sidebarItems = [
    { icon: Camera, label: "Hair Analysis", path: "/dashboard" },
    { icon: Target, label: "Hair Goals", path: "/goals" },
    { icon: Shield, label: "Ingredient Checker", path: "/ingredient-checker" },
    // { icon: Heart, label: "Remedies", path: "/remedies" }, // Future feature
    // { icon: Apple, label: "Nutrition", path: "/nutrition" }, // Future feature
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-border/30 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Hairmama" className="w-100 h-10" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
          
          <div className="pt-4 border-t border-border/30">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Card className="glass-secondary border-border/30">
            <CardContent className="p-4">
              <div className="text-sm">
                <div className="font-medium text-foreground">Free Analysis</div>
                <div className="text-muted-foreground">Upload unlimited photos</div>
                <Button variant="accent" size="sm" className="w-full mt-2">
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;