import { useState, type ReactNode } from "react";
import { Bell, Check, ChevronRight, CircleHelp, Clock3, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardTitle } from "./ui/card";
import type { Patient } from "../lib/api";
import type { Status } from "../types";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-heading-action">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status, children }: { status: Status; children?: ReactNode }) {
  const labels: Record<Status, string> = {
    completed: "Completed",
    pending: "In progress",
    broken: "Needs attention",
    escalated: "Escalated",
  };
  return <span className={`status status-${status}`}><span className="status-dot" />{children ?? labels[status]}</span>;
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "teal",
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "teal" | "blue" | "green" | "amber";
  icon: typeof Check;
}) {
  return (
    <Card className="metric-card">
      <div className={`metric-icon metric-${tone}`}><Icon size={18} /></div>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-detail">{detail}</p>
    </Card>
  );
}

export function ActionCard({
  title,
  detail,
  status,
  due,
  onComplete,
}: {
  title: string;
  detail: string;
  status: Status;
  due?: string;
  onComplete?: () => void;
}) {
  return (
    <Card className="action-card">
      <div className="action-copy">
        <div className="action-title-line"><CardTitle>{title}</CardTitle><StatusBadge status={status} /></div>
        <p>{detail}</p>
        {due && <span className="action-due"><Clock3 size={14} />{due}</span>}
      </div>
      {onComplete && status !== "completed" && <Button size="small" variant="secondary" onClick={onComplete}>Mark done</Button>}
    </Card>
  );
}

export function ProgressRing({ value, size = 124 }: { value: number; size?: number }) {
  const radius = 47;
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-ring" style={{ width: size, height: size }} role="img" aria-label={`${normalized}% recovery progress`}>
      <svg viewBox="0 0 112 112" aria-hidden="true">
        <circle className="progress-track" cx="56" cy="56" r={radius} />
        <circle className="progress-value" cx="56" cy="56" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - normalized / 100)} />
      </svg>
      <div className="progress-number"><strong>{normalized}%</strong><span>complete</span></div>
    </div>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="notification-wrap">
      <button className="icon-button" aria-label="Notifications" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Bell size={19} /><span className="notification-dot" />
      </button>
      {open && <div className="notification-popover"><div className="popover-heading"><strong>Notifications</strong><button aria-label="Close notifications" onClick={() => setOpen(false)}><X size={15} /></button></div><p><span className="popover-mark"><Check size={13} /></span>Your recovery plan is up to date.</p><p><span className="popover-mark popover-mark-amber"><Clock3 size={13} /></span>Follow-up visit coming up soon.</p></div>}
    </div>
  );
}

export function PatientHeader({ patient }: { patient: Patient }) {
  return (
    <Card className="patient-header">
      <div className="patient-avatar">{patient.name.split(" ").map((part) => part[0]).join("")}</div>
      <div className="patient-meta"><p className="eyebrow">RECOVERY PROFILE</p><h2>{patient.name}</h2><p>Care team: {patient.careTeam}</p></div>
      <div className="patient-header-link"><Link to="/patient/passport">Open passport <ChevronRight size={16} /></Link></div>
    </Card>
  );
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="empty-state"><span className="empty-icon"><CircleHelp size={22} /></span><h3>{title}</h3><p>{detail}</p></div>;
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return <div className="skeleton-list" aria-label="Loading" role="status">{Array.from({ length: rows }, (_, index) => <div className="skeleton-row" key={index}><span /><div><i /><i /></div></div>)}</div>;
}

export function ConfirmDialog({
  open,
  title,
  detail,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  detail: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title">
        <h2 id="dialog-title">{title}</h2><p>{detail}</p>
        <div className="dialog-actions"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button onClick={onConfirm}>Confirm</Button></div>
      </section>
    </div>
  );
}

export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return <div className="toast" role="status"><Check size={16} /><span>{message}</span><button aria-label="Dismiss notification" onClick={onDismiss}><X size={15} /></button></div>;
}