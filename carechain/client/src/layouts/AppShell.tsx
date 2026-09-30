import { Activity, ArrowUpRight, ChevronDown, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { navigation } from "../data/navigation";
import { NotificationBell } from "../components";
import { Button } from "../components/ui/button";
import type { ReactNode } from "react";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand-lockup"><span className="brand-mark"><Activity size={20} strokeWidth={2.5} /></span><span>carechain<small>RECOVERY, CONNECTED</small></span></NavLink>
      <p className="nav-caption">WORKSPACE</p>
      <nav className="side-nav" aria-label="Main navigation">
        {navigation.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}><Icon size={18} /><span>{label}</span></NavLink>)}
      </nav>
      <div className="sidebar-bottom"><div className="support-box"><span className="support-orbit"><Activity size={16} /></span><strong>Recovery, together.</strong><p>Every small step moves care forward.</p><a href="mailto:support@carechain.demo">Contact support <ArrowUpRight size={13} /></a></div><div className="sidebar-profile"><span className="avatar-small">JD</span><span><strong>Jordan Davis</strong><small>Care coordinator</small></span><button aria-label="Profile options"><ChevronDown size={16} /></button></div></div>
    </aside>
  );
}

export function TopBar() {
  const navigate = useNavigate();
  const signOut = () => { localStorage.removeItem("carechain-token"); navigate("/login"); };
  return (
    <header className="topbar"><div className="mobile-brand"><span className="brand-mark"><Activity size={18} /></span><strong>carechain</strong></div><div className="topbar-context"><span className="live-indicator" />Demo workspace <span className="topbar-divider">/</span> Recovery operations</div><div className="topbar-actions"><NotificationBell /><button className="profile-menu" onClick={signOut} title="Sign out"><span className="avatar-small">JD</span><span>Jordan Davis</span><LogOut size={15} /></button></div><nav className="mobile-nav" aria-label="Mobile navigation">{navigation.slice(0, 5).map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} end={to === "/"}><Icon size={16} /><span>{label}</span></NavLink>)}</nav></header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="app-shell"><div className="prototype-banner"><span />Prototype: uses simulated data. Not for clinical use.</div><Sidebar /><div className="main-column"><TopBar /><main className="main-content">{children}</main><footer className="app-footer"><span>CARECHAIN · DEMO ENVIRONMENT</span><span>Designed for continuity of care</span></footer></div></div>;
}

export function RoleButton({ children }: { children: ReactNode }) {
  return <Button className="role-button" variant="ghost">{children}</Button>;
}