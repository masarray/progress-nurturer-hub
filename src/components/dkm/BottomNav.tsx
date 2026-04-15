import { Home, Calendar, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export type Screen = "home" | "event" | "login";

interface BottomNavProps {
  active: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems: { id: Screen; label: string; sub: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", sub: "Beranda", icon: Home },
  { id: "event", label: "Event", sub: "Qurban", icon: Calendar },
  { id: "login", label: "Login", sub: "Internal", icon: LogIn },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(500px,calc(100vw-24px))] z-20
                 bg-card/95 backdrop-blur-xl border border-border rounded-[22px] shadow-elevated
                 p-2 grid grid-cols-3 gap-1"
      aria-label="Navigasi utama"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 py-3 px-2 rounded-2xl transition-all duration-200 active:scale-[0.97]",
              isActive
                ? "bg-dkm-green-soft text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            <Icon className={cn("w-5 h-5 mb-0.5", isActive ? "text-primary" : "text-muted-foreground")} />
            <span className="text-[13px] font-semibold leading-tight">{item.label}</span>
            <small className="text-[11px] opacity-70">{item.sub}</small>
          </button>
        );
      })}
    </nav>
  );
}
