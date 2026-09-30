import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  Network,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const navigation: NavigationItem[] = [
  { label: "Overview", to: "/", icon: LayoutDashboard },
  { label: "My recovery", to: "/patient", icon: Activity },
  { label: "Recovery passport", to: "/patient/passport", icon: ClipboardList },
  { label: "Care team", to: "/doctor", icon: Users },
  { label: "Provider network", to: "/provider", icon: Network },
  { label: "Administration", to: "/admin", icon: Settings },
];