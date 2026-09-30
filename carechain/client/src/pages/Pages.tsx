import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check,
  CircleAlert, Clock3, FileCheck2, HeartPulse, Link2, ShieldCheck, Sparkles,
  Stethoscope, Users, Waypoints,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Background, Controls, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ActionCard, ConfirmDialog, EmptyState, LoadingSkeleton, MetricCard, PageHeader, PatientHeader, ProgressRing, StatusBadge } from "../components";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import { usePatient } from "../hooks/usePatient";
import { useToast } from "../hooks/useToast";
import { apiRequest } from "../lib/api";
import type { Role } from "../types";

const sampleActions = [
  { title: "Take morning medication", detail: "Take with breakfast and a full glass of water.", status: "pending" as const, due: "Today · 9:00 AM" },
  { title: "Complete breathing exercise", detail: "A short guided exercise from your discharge plan.", status: "completed" as const, due: "Completed today" },
  { title: "Schedule follow-up visit", detail: "Your care team would like to see you this week.", status: "broken" as const, due: "Due Sep 30" },
];

const recoveryData = [
  { day: "Sep 22", progress: 14 }, { day: "Sep 23", progress: 24 }, { day: "Sep 24", progress: 31 },
  { day: "Sep 25", progress: 39 }, { day: "Sep 26", progress: 45 }, { day: "Sep 27", progress: 54 },
  { day: "Sep 28", progress: 61 }, { day: "Today", progress: 68 },
];

function PatientLoading({ rows = 3 }: { rows?: number }) {
  return <div className="content-narrow"><LoadingSkeleton rows={rows} /></div>;
}

function PatientError({ message }: { message: string }) {
  return <Card className="error-panel"><CircleAlert size={22} /><div><strong>Could not load recovery profile</strong><p>{message}. Start the API and seed the demo database to view this record.</p></div></Card>;
}

function GreetingPanel({ patientName }: { patientName: string }) {
  return <section className="welcome-panel"><div className="welcome-copy"><p className="eyebrow">MONDAY, SEPTEMBER 29, 2026 <span className="welcome-rule" /></p><h2>A little progress<br />goes a long way.</h2><p>Your recovery plan is moving forward. Keep the next small step in sight.</p><Link className="welcome-link" to="/patient">View today&apos;s plan <ArrowRight size={16} /></Link></div><div className="welcome-art" aria-hidden="true"><div className="orbit orbit-outer" /><div className="orbit orbit-inner" /><div className="welcome-heart"><HeartPulse size={42} strokeWidth={1.5} /></div><span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" /><div className="welcome-caption"><span>RECOVERY MOMENTUM</span><strong>On track <ArrowUpRight size={15} /></strong></div></div><span className="welcome-patient">{patientName ? `PATIENT · ${patientName.toUpperCase()}` : "CARE, CONNECTED"}</span></section>;
}

export function OverviewPage() {
  const { patient } = usePatient();
  const { showToast } = useToast();
  return <><PageHeader eyebrow="MONDAY · 29 SEPTEMBER 2026" title="Good morning, Jordan" description="Here is a clear view of the recovery work moving forward." action={<Button variant="secondary" onClick={() => showToast("Your care team view is up to date.")}><Activity size={16} />Refresh overview</Button>} /><GreetingPanel patientName={patient?.name ?? ""} /><div className="metric-grid"><MetricCard label="Active recovery plans" value="24" detail="3 added this week" icon={Activity} tone="teal" /><MetricCard label="Actions completed" value="86%" detail="Across active plans" icon={Check} tone="green" /><MetricCard label="Needs a follow-up" value="4" detail="Across 3 care teams" icon={Clock3} tone="amber" /><MetricCard label="Care connections" value="18" detail="Providers in network" icon={Link2} tone="blue" /></div><div className="dashboard-grid"><Card className="chart-card"><div className="section-heading"><div><p className="eyebrow">RECOVERY MOMENTUM</p><CardTitle>Plan completion</CardTitle></div><span className="chart-period">Last 8 days <ArrowDownRight size={14} /></span></div><div className="chart-legend"><span /><strong>Actions completed</strong><small>+12% this week</small></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={recoveryData} margin={{ top: 10, right: 8, bottom: 0, left: -22 }}><defs><linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2b8b7b" stopOpacity={0.18} /><stop offset="95%" stopColor="#2b8b7b" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e9ece7" strokeDasharray="3 5" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8b9691", fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b9691", fontSize: 11 }} tickFormatter={(value: number) => `${value}%`} /><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e6eae6", fontSize: 12 }} /><Area type="monotone" dataKey="progress" stroke="#287e72" strokeWidth={2.5} fill="url(#progressFill)" /></AreaChart></ResponsiveContainer></div></Card><Card className="followup-card"><div className="section-heading"><div><p className="eyebrow">TEAM FOLLOW-UPS</p><CardTitle>Worth a closer look</CardTitle></div><span className="count-pill">2</span></div><div className="followup-item"><span className="followup-icon followup-amber"><Clock3 size={16} /></span><div><strong>Visit needs scheduling</strong><p>Follow-up · {patient?.name ?? "Active patient"}</p></div><ArrowRight size={15} /></div><div className="followup-item"><span className="followup-icon followup-purple"><Waypoints size={16} /></span><div><strong>Care transition pending</strong><p>Referral · Lakeside Therapy</p></div><ArrowRight size={15} /></div><Link className="text-link" to="/doctor">Review all follow-ups <ArrowRight size={15} /></Link></Card></div><div className="section-heading patient-section-heading"><div><p className="eyebrow">DEMO PATIENT PROFILE</p><CardTitle>Recovery, in context</CardTitle></div><Link to="/doctor/patient/demo-patient" className="text-link">Open patient view <ArrowRight size={15} /></Link></div>{patient && <PatientHeader patient={patient} />}</>;
}

export function PatientPage() {
  const { patient, loading, error } = usePatient();
  const { showToast } = useToast();
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  if (loading) return <><PageHeader eyebrow="YOUR RECOVERY" title="Today, step by step" /><PatientLoading /></>;
  if (error || !patient) return <><PageHeader eyebrow="YOUR RECOVERY" title="Today, step by step" /><PatientError message={error ?? "No matching patient record"} /></>;
  return <><PageHeader eyebrow="YOUR RECOVERY" title="Today, step by step" description="Small actions add up. Your plan is here when you need it." /><PatientHeader patient={patient} /><section className="patient-progress-layout"><Card className="progress-summary"><div><p className="eyebrow">YOUR RECOVERY JOURNEY</p><CardTitle>Steady progress, one day at a time</CardTitle><p className="muted-copy">You are moving through your plan. Keep going at a pace that works for you.</p><div className="progress-footnote"><span><span className="legend-dot legend-green" />Completed actions</span><span><span className="legend-dot legend-gray" />Still ahead</span></div></div><ProgressRing value={patient.recoveryPercent} /></Card><Card className="appointment-card"><div className="appointment-icon"><CalendarDays size={19} /></div><p className="eyebrow">NEXT CHECK-IN</p><h3>{new Date(patient.nextAppointment).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</h3><p>Care team follow-up</p><span className="appointment-time"><Clock3 size={14} />2:30 PM</span></Card></section><div className="section-heading action-section-title"><div><p className="eyebrow">TODAY&apos;S PLAN</p><CardTitle>Your recovery actions</CardTitle></div><span className="muted-copy">{completed.length} of {sampleActions.length} marked complete</span></div><div className="action-list">{sampleActions.map((action) => { const isComplete = action.status === "completed" || completed.includes(action.title); return <ActionCard key={action.title} {...action} status={isComplete ? "completed" : action.status} onComplete={isComplete ? undefined : () => setConfirmAction(action.title)} />; })}</div><ConfirmDialog open={Boolean(confirmAction)} title="Mark this action complete?" detail="This updates your local demo view only. It does not notify a clinician." onCancel={() => setConfirmAction(null)} onConfirm={() => { if (confirmAction) { setCompleted((items) => [...items, confirmAction]); showToast("Action marked complete."); } setConfirmAction(null); }} /></>;
}

export function PassportPage() {
  const { patient, loading, error } = usePatient();
  if (loading) return <><PageHeader eyebrow="RECOVERY RECORD" title="Your recovery passport" /><PatientLoading rows={4} /></>;
  if (error || !patient) return <><PageHeader eyebrow="RECOVERY RECORD" title="Your recovery passport" /><PatientError message={error ?? "No matching patient record"} /></>;
  return <><PageHeader eyebrow="RECOVERY RECORD" title="Your recovery passport" description="A simple record of the people and milestones in your recovery." action={<Button variant="secondary" onClick={() => window.print()}><FileCheck2 size={16} />Print passport</Button>} /><PatientHeader patient={patient} /><div className="passport-grid"><Card className="passport-main"><div className="passport-heading"><span className="passport-icon"><ShieldCheck size={20} /></span><div><p className="eyebrow">CARE SUMMARY</p><CardTitle>Your next chapter</CardTitle></div></div><p className="passport-intro">Your recovery plan brings your care team and next steps together in one place. This is a simulated record for demonstration.</p><div className="passport-facts"><div><span>Discharged</span><strong>{new Date(patient.dischargeDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong></div><div><span>Care team</span><strong>{patient.careTeam}</strong></div><div><span>Next appointment</span><strong>{new Date(patient.nextAppointment).toLocaleDateString("en-US", { month: "long", day: "numeric" })} · 2:30 PM</strong></div></div><div className="passport-safety"><CircleAlert size={17} /><p>This passport is a demo summary and does not replace your discharge paperwork or advice from your care team.</p></div></Card><Card className="passport-progress"><p className="eyebrow">PLAN PROGRESS</p><ProgressRing value={patient.recoveryPercent} size={146} /><StatusBadge status="pending">In progress</StatusBadge><p>Your care team can help with questions about your plan.</p></Card></div><Card className="timeline-card"><div className="section-heading"><div><p className="eyebrow">YOUR TIMELINE</p><CardTitle>Milestones so far</CardTitle></div></div><div className="timeline"><div className="timeline-entry"><span className="timeline-marker timeline-done"><Check size={13} /></span><div><strong>Recovery plan started</strong><p>Discharge instructions added to your passport</p></div><time>Sep 22</time></div><div className="timeline-entry"><span className="timeline-marker timeline-done"><Check size={13} /></span><div><strong>Care team connected</strong><p>{patient.careTeam} is following your progress</p></div><time>Sep 23</time></div><div className="timeline-entry"><span className="timeline-marker timeline-upcoming"><CalendarDays size={13} /></span><div><strong>Follow-up appointment</strong><p>Check in with your care team</p></div><time>Oct 2</time></div></div></Card></>;
}

export function DoctorPage() {
  const { patient } = usePatient();
  return <><PageHeader eyebrow="CARE TEAM WORKSPACE" title="Patients in recovery" description="A coordinated view of the work continuing beyond discharge." action={<Button><Users size={16} />Invite a care teammate</Button>} /><div className="metric-grid doctor-metrics"><MetricCard label="Active patients" value="24" detail="Across 4 care teams" icon={Users} tone="blue" /><MetricCard label="Actions on track" value="86%" detail="+4% over last week" icon={Check} tone="green" /><MetricCard label="Follow-ups needed" value="4" detail="Review before end of day" icon={Clock3} tone="amber" /><MetricCard label="Connected providers" value="18" detail="Across 6 specialties" icon={Link2} tone="teal" /></div><Card className="table-card"><div className="table-heading"><div><p className="eyebrow">RECENTLY ACTIVE</p><CardTitle>Recovery plans</CardTitle></div><span className="count-pill">24 patients</span></div><div className="patient-table"><div className="patient-table-head"><span>Patient</span><span>Care team</span><span>Recovery</span><span>Next appointment</span><span>Status</span></div>{patient && <Link to={`/doctor/patient/${encodeURIComponent(patient.id)}`} className="patient-row"><span className="table-person"><span className="avatar-small avatar-teal">{patient.name.split(" ").map((part) => part[0]).join("")}</span><span><strong>{patient.name}</strong><small>Discharged {new Date(patient.dischargeDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</small></span></span><span>{patient.careTeam}</span><span><span className="mini-progress"><i style={{ width: `${patient.recoveryPercent}%` }} /></span>{patient.recoveryPercent}%</span><span>{new Date(patient.nextAppointment).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span><StatusBadge status="pending" /></Link>}{!patient && <EmptyState title="Connect to the demo API" detail="Start the server and seed the database to load the demo recovery plan." />}</div><div className="table-footer"><span>Showing seeded demo patient data</span><Link to="/doctor/patient/demo-patient">Open demo patient <ArrowRight size={14} /></Link></div></Card></>;
}

export function DoctorPatientPage() {
  const { id = "" } = useParams();
  const { patient, loading, error } = usePatient(id);
  const { showToast } = useToast();
  if (loading) return <><PageHeader eyebrow="CARE TEAM · PATIENT VIEW" title="Patient recovery plan" /><PatientLoading rows={4} /></>;
  if (error || !patient) return <><PageHeader eyebrow="CARE TEAM · PATIENT VIEW" title="Patient recovery plan" /><PatientError message={error ?? "No matching patient record"} /><Link to="/doctor" className="text-link">Back to patients <ArrowRight size={15} /></Link></>;
  return <><PageHeader eyebrow="CARE TEAM · PATIENT VIEW" title="Recovery overview" description="A shared view of milestones, follow-ups, and care continuity." action={<Button variant="secondary" onClick={() => showToast("Note saved to this demo session.")}>Add care note</Button>} /><PatientHeader patient={patient} /><section className="patient-progress-layout"><Card className="progress-summary"><div><p className="eyebrow">RECOVERY JOURNEY</p><CardTitle>Progress across the plan</CardTitle><p className="muted-copy">Recovery progress based on the actions currently recorded in the demo plan.</p></div><ProgressRing value={patient.recoveryPercent} /></Card><Card className="appointment-card appointment-wide"><div className="appointment-icon"><CalendarDays size={19} /></div><p className="eyebrow">NEXT APPOINTMENT</p><h3>{new Date(patient.nextAppointment).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</h3><p>{patient.careTeam}</p><StatusBadge status="pending">Scheduled</StatusBadge></Card></section><div className="section-heading action-section-title"><div><p className="eyebrow">SHARED PLAN</p><CardTitle>Recovery actions</CardTitle></div><span className="muted-copy">Read-only demo view</span></div><div className="action-list">{sampleActions.map((action) => <ActionCard key={action.title} {...action} />)}</div><div className="safety-note"><ShieldCheck size={16} /><span>Simulated data only. This view is not a clinical record or decision-support tool.</span></div></>;
}

export function ProviderPage() {
  const { showToast } = useToast();
  const providers = [
    { name: "Lakeside Therapy", specialty: "Physical therapy", city: "Portland, OR", status: "Connected", color: "blue" },
    { name: "Northstar Recovery Team", specialty: "Care coordination", city: "Seattle, WA", status: "Connected", color: "teal" },
    { name: "Harborview Home Support", specialty: "Home health", city: "Tacoma, WA", status: "Invitation sent", color: "amber" },
  ];
  return <><PageHeader eyebrow="CARE NETWORK" title="Connected providers" description="Keep community care partners in step with each recovery plan." action={<Button onClick={() => showToast("Provider invitation started.")}><Users size={16} />Invite provider</Button>} /><div className="provider-intro"><div className="provider-intro-icon"><Waypoints size={20} /></div><div><strong>Care works better when it connects.</strong><p>Manage the provider relationships that help recovery continue after discharge.</p></div><span className="provider-intro-count">18 <small>active partners</small></span></div><div className="provider-grid">{providers.map((provider) => <Card className="provider-card" key={provider.name}><div className={`provider-avatar provider-${provider.color}`}><Stethoscope size={20} /></div><div className="provider-card-top"><StatusBadge status={provider.status === "Connected" ? "completed" : "pending"}>{provider.status}</StatusBadge><button className="more-button" aria-label={`More about ${provider.name}`}>···</button></div><h3>{provider.name}</h3><p>{provider.specialty}</p><div className="provider-location"><span>{provider.city}</span><span>Care partner</span></div><button className="provider-action" onClick={() => showToast(`Opening ${provider.name} profile.`)}>View connection <ArrowRight size={15} /></button></Card>)}</div><Card className="provider-callout"><div className="callout-icon"><Sparkles size={18} /></div><div><strong>Have a new partner to add?</strong><p>Bring a trusted care provider into the network with a simple invitation.</p></div><Button variant="secondary" onClick={() => showToast("Provider invitation started.")}>Add a provider <ArrowUpRight size={15} /></Button></Card></>;
}

export function AdminPage() {
  const { showToast } = useToast();
  return <><PageHeader eyebrow="SYSTEM ADMINISTRATION" title="Workspace settings" description="A clear view of demo system health and access controls." action={<Button variant="secondary" onClick={() => showToast("Settings are up to date.")}>Save changes</Button>} /><div className="metric-grid"><MetricCard label="Workspace status" value="Healthy" detail="All demo services running" icon={Activity} tone="green" /><MetricCard label="Demo users" value="12" detail="Across 4 access roles" icon={Users} tone="blue" /><MetricCard label="Data mode" value="Simulated" detail="No live patient records" icon={ShieldCheck} tone="teal" /><MetricCard label="Pending invites" value="3" detail="Sent in the last 7 days" icon={Clock3} tone="amber" /></div><div className="admin-grid"><Card className="settings-card"><div className="section-heading"><div><p className="eyebrow">ACCESS CONTROL</p><CardTitle>Workspace roles</CardTitle></div><span className="count-pill">4 roles</span></div><div className="role-row"><span className="role-icon role-patient"><HeartPulse size={17} /></span><div><strong>Patient</strong><p>View personal recovery plan and passport</p></div><span>4 users</span></div><div className="role-row"><span className="role-icon role-doctor"><Stethoscope size={17} /></span><div><strong>Care team</strong><p>Coordinate plans and review progress</p></div><span>5 users</span></div><div className="role-row"><span className="role-icon role-provider"><Waypoints size={17} /></span><div><strong>Provider</strong><p>Connect with care teams and referrals</p></div><span>2 users</span></div><div className="role-row"><span className="role-icon role-admin"><ShieldCheck size={17} /></span><div><strong>Administrator</strong><p>Manage workspace configuration</p></div><span>1 user</span></div></Card><Card className="settings-card"><div className="section-heading"><div><p className="eyebrow">SERVICE STATUS</p><CardTitle>Connected services</CardTitle></div><span className="service-live"><i />Live</span></div>{["REST API", "Local database", "Demo authentication"].map((service) => <div className="service-row" key={service}><span className="service-check"><Check size={13} /></span><strong>{service}</strong><StatusBadge status="completed">Operational</StatusBadge></div>)}<div className="admin-notice"><CircleAlert size={16} /><p>This workspace uses simulated data and a demo-only sign-in. It is not configured for clinical use.</p></div></Card></div></>;
}

const workflowNodes: Node[] = [
  { id: "discharge", position: { x: 0, y: 80 }, data: { label: "Discharge plan" }, type: "input" },
  { id: "patient", position: { x: 240, y: 80 }, data: { label: "Patient actions" } },
  { id: "team", position: { x: 480, y: 0 }, data: { label: "Care team" } },
  { id: "provider", position: { x: 480, y: 160 }, data: { label: "Community provider" } },
  { id: "recovery", position: { x: 720, y: 80 }, data: { label: "Recovery progress" }, type: "output" },
];
const workflowEdges: Edge[] = [
  { id: "e1", source: "discharge", target: "patient", animated: true },
  { id: "e2", source: "patient", target: "team" },
  { id: "e3", source: "patient", target: "provider" },
  { id: "e4", source: "team", target: "recovery" },
  { id: "e5", source: "provider", target: "recovery" },
];

export function DemoPage() {
  return <><PageHeader eyebrow="PRODUCT WALKTHROUGH" title="A recovery journey, connected" description="Explore how the pieces of a post-discharge plan can stay in view." action={<StatusBadge status="pending">Interactive demo</StatusBadge>} /><GreetingPanel patientName="" /><div className="demo-flow-heading"><div><p className="eyebrow">CARE CONTINUITY MAP</p><h2>One plan. A connected team.</h2></div><span>Illustrative workflow</span></div><Card className="flow-card"><ReactFlow nodes={workflowNodes} edges={workflowEdges} fitView fitViewOptions={{ padding: 0.18 }} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}><Background color="#d9e2dd" gap={22} /><Controls showInteractive={false} /></ReactFlow></Card><div className="demo-step-grid"><Card><span className="demo-step-number">01</span><FileCheck2 size={20} /><h3>Start with the plan</h3><p>Discharge instructions become a shared set of next steps.</p></Card><Card><span className="demo-step-number">02</span><Users size={20} /><h3>Bring care together</h3><p>Patients, care teams, and community providers stay connected.</p></Card><Card><span className="demo-step-number">03</span><Activity size={20} /><h3>Keep progress visible</h3><p>Completed actions and open follow-ups are easy to see.</p></Card></div><div className="demo-disclaimer"><ShieldCheck size={17} /><span>Everything shown is simulated. CARECHAIN is not for clinical use.</span></div></>;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("jordan@example.demo");
  const [password, setPassword] = useState("demo");
  const [role, setRole] = useState<Role>("doctor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiRequest<{ token: string; user: { role: Role } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
      localStorage.setItem("carechain-token", result.token);
      showToast(`Signed in as ${result.user.role}.`);
      navigate(role === "patient" ? "/patient" : role === "doctor" ? "/doctor" : role === "provider" ? "/provider" : "/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }
  return <div className="login-page"><div className="login-topbar"><Link to="/" className="brand-lockup"><span className="brand-mark"><Activity size={20} /></span><span>carechain<small>RECOVERY, CONNECTED</small></span></Link><span className="login-demo-label"><span className="live-indicator" />DEMO WORKSPACE</span></div><div className="login-layout"><section className="login-story"><p className="eyebrow">CARE THAT CONTINUES</p><h1>Recovery is a journey.<br /><span>Make every step count.</span></h1><p>One connected view of the people, actions, and milestones that carry care forward.</p><div className="login-story-art"><div className="story-line story-line-one" /><div className="story-line story-line-two" /><span className="story-node story-node-one"><FileCheck2 size={19} /></span><span className="story-node story-node-two"><HeartPulse size={21} /></span><span className="story-node story-node-three"><Users size={19} /></span><span className="story-node story-node-four"><Check size={19} /></span><div className="story-label label-plan">A clear plan</div><div className="story-label label-care">Connected care</div><div className="story-label label-progress">Visible progress</div></div><div className="login-story-footer"><span>01 / CONTINUITY</span><span>People-first recovery coordination</span></div></section><Card className="login-card"><div className="login-card-heading"><span className="login-icon"><ShieldCheck size={20} /></span><p className="eyebrow">WELCOME BACK</p><h2>Sign in to CARECHAIN</h2><p>Choose a demo role to explore the workspace.</p></div><form onSubmit={handleSubmit}><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /><label htmlFor="password">Demo password</label><input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /><label htmlFor="role">Workspace role</label><select id="role" value={role} onChange={(event) => setRole(event.target.value as Role)}><option value="patient">Patient</option><option value="doctor">Care team</option><option value="provider">Provider</option><option value="admin">Administrator</option></select>{error && <p className="form-error" role="alert">{error}</p>}<Button className="login-submit" type="submit" disabled={loading}>{loading ? "Signing in…" : "Continue to workspace"}<ArrowRight size={17} /></Button></form><div className="login-credential"><span><CircleAlert size={15} /></span><p><strong>Demo access</strong><br />Use any email with the password <code>demo</code>.</p></div><div className="login-safety"><ShieldCheck size={15} />Simulated data only · Not for clinical use</div></Card></div><footer className="login-footer"><span>CARECHAIN · PROTOTYPE ENVIRONMENT</span><Link to="/demo">Explore the demo <ArrowRight size={14} /></Link></footer></div>;
}