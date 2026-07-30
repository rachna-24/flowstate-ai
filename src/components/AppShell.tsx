import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarClock,
  Info,
  LayoutGrid,
  Mail,
  Menu,
  NotebookPen,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Workspace", icon: LayoutGrid },
  { to: "/email-generator", label: "Smart Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes Summarizer", icon: NotebookPen },
  { to: "/task-planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/about", label: "About", icon: Info },
] as const;

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden text-right sm:block" aria-live="off">
      <div className="text-xs text-muted-foreground">
        {now
          ? now.toLocaleDateString(undefined, {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </div>
      <div className="numeric text-base font-semibold text-foreground">
        {now ? now.toLocaleTimeString(undefined, { hour12: false }) : "--:--:--"}
      </div>
    </div>
  );
}

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1 px-3" aria-label="Main navigation">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            title={collapsed ? label : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary-soft text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              collapsed && "justify-center px-2",
            )}
          >
            <Icon className="size-[18px] shrink-0" strokeWidth={2} />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 px-5 py-6", collapsed && "justify-center px-2")}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Sparkles className="size-[18px]" />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate font-display text-[15px] font-semibold leading-tight">
            AI Workplace
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            Productivity Assistant
          </span>
        </span>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-out lg:flex",
          collapsed ? "w-[76px]" : "w-[268px]",
        )}
      >
        <Brand collapsed={collapsed} />
        <NavList collapsed={collapsed} />
        <div className="mt-auto p-3">
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
          />
          <div className="absolute inset-y-0 left-0 flex w-[272px] animate-fade-in flex-col border-r border-sidebar-border bg-sidebar">
            <div className="flex items-center justify-between pr-3">
              <Brand collapsed={false} />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavList collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-[268px]")}>
        <header className="glass sticky top-0 z-20">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              >
                <Menu className="size-4" />
              </button>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold sm:text-base">
                  Welcome back, Alex
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Your AI workspace is ready
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
              <LiveClock />
              <button
                aria-label="Notifications"
                className="relative rounded-xl border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-emerald" />
              </button>
              <span
                aria-label="User profile"
                className="numeric grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              >
                AS
              </span>
            </div>
          </div>
        </header>

        <main key={pathname} className="animate-fade-in px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
