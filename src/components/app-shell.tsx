import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, FileText, Home, Plus, Settings, UserRound } from "lucide-react";
import { ProofBoxLogo, ProofBoxMark } from "@/components/proofbox-logo";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "ProofBoxes", to: "/proofboxes", icon: FileText },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-20 items-center px-6"><Link to="/" aria-label="ProofBox home"><ProofBoxLogo /></Link></div>
        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Main navigation">
          {nav.map(({ label, to, icon: Icon }) => { const active = pathname === to || (to === "/proofboxes" && pathname.startsWith("/proofboxes/")); return <Link key={to} to={to} className={cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground transition hover:bg-sidebar-accent", active && "bg-sidebar-accent text-sidebar-primary")}><Icon className="size-[18px]" />{label}</Link>; })}
        </nav>
        <div className="border-t p-4"><div className="flex items-center gap-3 rounded-md p-2"><span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">MI</span><div className="min-w-0"><p className="truncate text-sm font-semibold">Muhammed Imam</p><p className="truncate text-xs text-muted-foreground">Personal account</p></div></div></div>
      </aside>
      <header className="sticky top-0 z-20 grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center border-b bg-background/95 px-4 backdrop-blur-sm lg:ml-60 lg:px-8">
        <Link to="/" className="lg:hidden" aria-label="ProofBox home"><ProofBoxLogo /></Link>
        <div className="hidden lg:block" />
        <div className="flex items-center gap-2"><Link to="/notifications" aria-label="Notifications" className="relative grid size-11 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"><Bell className="size-[18px]" /><span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-primary" /></Link><Link to="/settings" aria-label="Profile settings" className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-bold">MI</Link></div>
      </header>
      <div className="lg:ml-60"><main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-7 sm:px-6 sm:pt-9 lg:px-8 lg:pb-12">{children}</main></div>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-background/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden" aria-label="Mobile navigation">
        <MobileLink to="/dashboard" label="Home" icon={Home} active={pathname === "/dashboard"} />
        <MobileLink to="/proofboxes" label="ProofBoxes" icon={FileText} active={pathname === "/proofboxes" || pathname.startsWith("/proofboxes/")} />
        <Link to="/proofboxes/create" aria-label="Create ProofBox" className="flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-semibold text-primary"><span className="grid size-11 -translate-y-4 place-items-center rounded-full bg-primary text-primary-foreground shadow-brand"><Plus className="size-5" /></span><span className="-mt-4">Create</span></Link>
        <MobileLink to="/notifications" label="Alerts" icon={Bell} active={pathname === "/notifications"} />
        <MobileLink to="/settings" label="Profile" icon={UserRound} active={pathname === "/settings"} />
      </nav>
    </div>
  );
}

function MobileLink({ to, label, icon: Icon, active }: { to: "/dashboard" | "/proofboxes" | "/notifications" | "/settings"; label: string; icon: typeof Home; active: boolean }) { return <Link to={to} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground", active && "text-primary")}><Icon className="size-5" /><span>{label}</span></Link>; }

export function PageHeading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) { return <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4"><div className="min-w-0"><h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>{description && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>}</div>{action}</header>; }

export function SectionHeading({ title, action }: { title: string; action?: ReactNode }) { return <div className="mb-4 flex items-center justify-between gap-4"><h2 className="text-lg font-semibold sm:text-xl">{title}</h2>{action}</div>; }