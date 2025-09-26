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
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around px-2 py-1">
        {navigationItems.map(({ id, label, href, icon: Icon }) => {
          const isActive = location.pathname === href;
          
          return (
            <Link
              key={id}
              to={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                "min-w-0 flex-1 text-xs font-medium",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}