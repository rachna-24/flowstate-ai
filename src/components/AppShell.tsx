import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BarChart3,
  Bot,
  CalendarDays,
  CheckSquare,
  CircleHelp,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Menu,
  NotebookPen,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BuddyMascot } from "./BuddyMascot";
import { LoadingScreen } from "./LoadingScreen";
import { useAppStore } from "@/store/useAppStore";

const MAIN_NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Smart Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Note Summary", icon: NotebookPen },
  { to: "/task-planner", label: "AI Task Planner", icon: CheckSquare },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/chat", label: "Chat with Buddy", icon: Bot },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

const FOOTER_NAV = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: CircleHelp },
  { to: "/support", label: "Support", icon: LifeBuoy },
] as const;

/** Mobile bottom bar shows the five most-used destinations. */
const MOBILE_NAV = [
  MAIN_NAV[0],
  MAIN_NAV[1],
  MAIN_NAV[3],
  MAIN_NAV[5],
  FOOTER_NAV[0],
] as const;

export function LiveClock({ stacked = false }: { stacked?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const day = now?.toLocaleDateString(undefined, { weekday: "long" }) ?? "—";
  const date =
    now?.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) ?? "—";
  const time = now?.toLocaleTimeString(undefined, { hour12: false }) ?? "--:--:--";

  if (stacked) {
    return (
      <div className="text-right">
        <p className="text-sm font-medium text-foreground">{day}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
        <p className="numeric mt-1 text-3xl font-semibold text-cyan drop-shadow-[0_0_14px_oklch(0.79_0.14_200/0.45)]">
          {time}
        </p>
      </div>
    );
  }

  return (
    <div className="hidden text-right sm:block">
      <div className="text-xs text-muted-foreground">
        {day}, {date}
      </div>
      <div className="numeric text-base font-semibold text-cyan">{time}</div>
    </div>
  );
}

function NavLink({
  to,
  label,
  icon: Icon,
  collapsed,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: typeof Mail;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to;
  return (
    <Link
      to={to}
      onClick={onNavigate}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "border border-primary/40 bg-primary/15 text-foreground shadow-glow"
          : "border border-transparent text-muted-foreground hover:border-border hover:bg-white/5 hover:text-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon className={cn("size-[18px] shrink-0", active && "text-cyan")} strokeWidth={2} />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

function Brand({ collapsed, thinking }: { collapsed: boolean; thinking?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 px-5 pb-4 pt-6",
        collapsed && "px-2",
      )}
    >
      <BuddyMascot size={collapsed ? 40 : 62} mood={thinking ? "thinking" : "happy"} />
      {!collapsed && (
        <p className="font-display text-lg font-bold leading-none">
          Buddy<span className="neon-text">.AI</span>
        </p>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [booting, setBooting] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const name = useAppStore((s) => s.settings.name);

  // Only show the intro once per browser session.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("buddy-booted")) setBooting(false);
  }, []);

  const finishBoot = () => {
    sessionStorage.setItem("buddy-booted", "1");
    setBooting(false);
  };

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen w-full">
      <AnimatePresence>{booting && <LoadingScreen onDone={finishBoot} />}</AnimatePresence>

      {/* Desktop / tablet sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl transition-[width] duration-300 ease-out md:flex",
          collapsed ? "w-[78px]" : "w-[264px]",
        )}
      >
        <Brand collapsed={collapsed} />
        <nav className="flex flex-col gap-1 px-3" aria-label="Main navigation">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.to} {...item} collapsed={collapsed} />
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 px-3 pb-3">
          {FOOTER_NAV.map((item) => (
            <NavLink key={item.to} {...item} collapsed={collapsed} />
          ))}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <>
                <PanelLeftClose className="size-4" /> Collapse
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile drawer (full nav) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Close navigation overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-[268px] animate-fade-in flex-col border-r border-border bg-sidebar">
            <div className="relative">
              <Brand collapsed={false} />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="absolute right-3 top-3 rounded-lg p-2 text-muted-foreground hover:bg-white/5"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 overflow-y-auto px-3 pb-6" aria-label="Mobile navigation">
              {[...MAIN_NAV, ...FOOTER_NAV].map((item) => (
                <NavLink key={item.to} {...item} collapsed={false} onNavigate={() => setMobileOpen(false)} />
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className={cn("transition-[padding] duration-300", collapsed ? "md:pl-[78px]" : "md:pl-[264px]")}>
        <header className="glass-bar sticky top-0 z-20">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground md:hidden"
              >
                <Menu className="size-4" />
              </button>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold sm:text-base">
                  Welcome back, {name.split(" ")[0]} 👋
                </p>
                <p className="truncate text-xs text-muted-foreground">Buddy is ready when you are</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
              <LiveClock />
              <button
                aria-label="Notifications"
                className="relative rounded-xl border border-border bg-white/5 p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-pink shadow-glow" />
              </button>
              <span
                aria-label="User profile"
                className="numeric grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-purple text-sm font-semibold text-primary-foreground"
              >
                {initials}
              </span>
            </div>
          </div>
        </header>

        <main
          key={pathname}
          className="animate-fade-in px-4 py-8 pb-28 sm:px-6 md:pb-10 lg:px-10 lg:py-10"
        >
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Bottom navigation"
        className="glass-bar fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 gap-1 border-t px-2 py-2 md:hidden"
      >
        {MOBILE_NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-medium transition-colors",
              pathname === to ? "bg-primary/15 text-cyan" : "text-muted-foreground",
            )}
          >
            <Icon className="size-[18px]" />
            <span className="truncate">{label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
