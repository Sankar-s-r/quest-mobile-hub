import { Home, Target, Library, TrendingUp, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { id: "home", label: "Home", href: "/dashboard", icon: Home },
  { id: "practice", label: "Practice", href: "/roadmap", icon: Target },
  { id: "library", label: "Library", href: "/asanas", icon: Library },
  { id: "progress", label: "Progress", href: "/progress", icon: TrendingUp },
  { id: "profile", label: "Profile", href: "/profile", icon: User },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-40 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-1">
        {navigationItems.map(({ id, label, href, icon: Icon }) => {
          const isActive = location.pathname === href;
          
          return (
            <Link
              key={id}
              to={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                "min-w-0 flex-1 text-xs font-medium relative overflow-hidden",
                isActive
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-200",
                isActive ? "scale-110" : "hover:scale-105"
              )} />
              <span className="truncate">{label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}