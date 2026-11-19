"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useConvexAuth,
  useQuery,
  useMutation,
  usePaginatedQuery,
  useAction,
  useConvexConnectionState,
} from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  useSignInWithGithub,
  useOauth,
} from "@convex-dev/auth/methods/github/react";
import {
  LayoutDashboard,
  Users,
  Columns3,
  Inbox,
  Zap,
  Settings,
  Search,
  Plus,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  Pause,
  Play,
  Check,
  CheckCheck,
  X,
  Globe,
  Mail,
  Clock,
  FileText,
  ExternalLink,
  ShieldCheck,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Bell,
  LogOut,
  Menu,
  RefreshCw,
  Send,
  Download,
  Target,
  MoreHorizontal,
  Building2,
  WifiOff,
} from "lucide-react";
import Papa from "papaparse";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { FunctionReturnType } from "convex/server";
import { stages, stageLabels, languages, type Stage } from "@/lib/crm/policy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
type Snapshot = FunctionReturnType<typeof api.crm.snapshot>;
type CrmSettings = Omit<Doc<"settings">, "_id" | "_creationTime">;
const nav = [
  { id: "overview", name: "Overview", icon: LayoutDashboard },
  { id: "leads", name: "Leads", icon: Users },
  { id: "pipeline", name: "Pipeline", icon: Columns3 },
  { id: "inbox", name: "Inbox & approvals", icon: Inbox },
  { id: "automation", name: "Automation", icon: Zap },
  { id: "settings", name: "Settings", icon: Settings },
];
const money = (n: number, currency = "EUR") =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
const date = (n: number) =>
  new Date(n).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const relative = (n: number) => {
  const m = Math.floor((Date.now() - n) / 60000);
  return m < 1
    ? "Just now"
    : m < 60
      ? `${m}m ago`
      : m < 1440
        ? `${Math.floor(m / 60)}h ago`
        : `${Math.floor(m / 1440)}d ago`;
};
function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`crm-badge ${tone}`}>{children}</span>;
}
function Empty({
  icon: Icon = Inbox,
  title,
  body,
  action,
}: {
  icon?: typeof Inbox;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="crm-empty">
      <span className="crm-empty-icon">
        <Icon size={24} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="crm-field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Avatar({ name }: { name: string }) {
  return (
    <span className="crm-company-avatar">
      {name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()}
    </span>
  );
}
function StageBadge({ stage }: { stage: string }) {
  return (
    <Badge
      tone={
        stage === "won"
          ? "green"
          : ["interested", "meeting"].includes(stage)
            ? "purple"
            : stage === "lost"
              ? "red"
              : "neutral"
      }
    >
      <span className={`crm-stage-dot ${stage}`} />
      {stageLabels[stage as Stage] ?? stage}
    </Badge>
  );
}
function Login() {
  const config = useQuery(api.publicConfig.connection, {});
  const { signIn } = useSignInWithGithub(api.auth),
    { flowError } = useOauth();
  const [error, setError] = useState("");
  return (
    <div className="crm-root crm-login">
      <div className="crm-login-story">
        <Link href="/" className="crm-login-brand">
          <span className="crm-brand-mark">m.</span> Muiz Rexhepi{" "}
          <span>WORKSPACE</span>
        </Link>
        <div>
          <span className="crm-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>
            Good work.
            <br />
            Great conversations.
            <br />
            <em>New possibilities.</em>
          </h1>
          <p>
            A little more clarity, from the first hello
            <br />
            to your next meaningful project.
          </p>
          <div className="crm-login-flow">
            <span>
              <Search size={18} /> Discover
            </span>
            <ChevronRight size={15} />
            <span>
              <Sparkles size={18} /> Understand
            </span>
            <ChevronRight size={15} />
            <span>
              <Mail size={18} /> Connect
            </span>
          </div>
        </div>
        <span className="crm-login-foot">
          Independent by design. Thoughtful by default.
        </span>
        <div className="crm-orbit o1" />
        <div className="crm-orbit o2" />
      </div>
      <div className="crm-login-form">
        <div className="crm-signin-card">
          <div className="crm-lock">
            <ShieldCheck size={26} />
          </div>
          <span className="crm-eyebrow">PRIVATE SALES CRM</span>
          <h2>Welcome back, Muiz.</h2>
          <p>
            Your leads, conversations, and next opportunities. All in one
            thoughtful workspace.
          </p>
          <Button
            className="crm-primary crm-login-button"
            disabled={config?.ownerLoginConfigured === false}
            onClick={async () => {
              setError("");
              try {
                const result = await signIn({
                  redirectTo: window.location.origin + "/crm",
                });
                if (result.status === "error")
                  setError(
                    "GitHub sign-in is not configured yet. Follow docs/CRM_SETUP.md.",
                  );
              } catch {
                setError(
                  "GitHub sign-in needs its OAuth app credentials. Follow docs/CRM_SETUP.md.",
                );
              }
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.53-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.64 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.56.23 2.71.11 3 .73.79 1.16 1.8 1.16 3.03 0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z" />
            </svg>
            Continue with GitHub
            <ArrowRight size={17} />
          </Button>
          {config?.ownerLoginConfigured === false && (
            <div className="crm-login-setup">
              Owner sign-in is ready to connect. Register the GitHub OAuth app
              using the callback in <code>docs/CRM_SETUP.md</code>.
            </div>
          )}
          {(error || flowError) && (
            <div className="crm-error" role="alert">
              {error ||
                "Sign-in could not be completed. Only the configured owner can access this workspace."}
            </div>
          )}
          <div className="crm-login-security">
            <ShieldCheck size={15} />
            <span>
              Restricted to your configured owner account.
              <br />
              Your inbox and correspondence stay private.
            </span>
          </div>
          <Link className="crm-back-site" href="https://www.muizrexhepi.com">
            Visit public website <ArrowUpRight size={14} />
          </Link>
        </div>
        <span className="crm-login-bottom">
          Built for the business you want to build.
        </span>
      </div>
    </div>
  );
}
class WorkspaceBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="crm-root crm-signin">
        <div className="crm-signin-card">
          <ShieldCheck />
          <h1>Owner access required</h1>
          <p>
            The backend rejected this session. Sign in with the configured
            GitHub owner account.
          </p>
          <SignOutButton />
        </div>
      </div>
    ) : (
      this.props.children
    );
  }
}
function SignOutButton() {
  const { signOut } = useAuthActions();
  return (
    <Button variant="outline" onClick={() => void signOut()}>
      Sign out
    </Button>
  );
}
export function CrmApp({ section }: { section: string }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  if (isLoading)
    return (
      <div className="crm-root crm-signin">
        <span className="crm-brand-mark crm-pulse">m.</span>
        <p>Opening your workspace…</p>
      </div>
    );
  return isAuthenticated ? (
    <WorkspaceBoundary>
      <Suspense fallback={<p>Opening workspace…</p>}>
        <Workspace section={section} />
      </Suspense>
    </WorkspaceBoundary>
  ) : (
    <Login />
  );
}
function Workspace({ section }: { section: string }) {
  const connection = useConvexConnectionState();
  const [clock, setClock] = useState(() => new Date().toISOString());
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date().toISOString()), 60000);
    return () => clearInterval(timer);
  }, []);
  const data = useQuery(api.crm.snapshot, { month: clock.slice(0, 7) }),
    budget = useQuery(api.jobs.budget, {
      day: clock.slice(0, 10),
      month: clock.slice(0, 7),
    }),
    pause = useMutation(api.crm.pause),
    enqueue = useMutation(api.jobs.enqueue),
    create = useMutation(api.crm.createLead),
    importLeads = useMutation(api.crm.importLeads),
    mark = useMutation(api.crm.markNotification),
    { signOut } = useAuthActions(),
    router = useRouter(),
    params = useSearchParams();
  const [toast, setToast] = useState(""),
    [busy, setBusy] = useState(false),
    [add, setAdd] = useState(false),
    [mobile, setMobile] = useState(false),
    [notifications, setNotifications] = useState(false),
    [discovery, setDiscovery] = useState(false),
    [offline, setOffline] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator)
      void navigator.serviceWorker
        .register("/crm-sw.js", { scope: "/crm" })
        .catch(() => undefined);
  }, []);
  const current = nav.find((n) => n.id === section) ?? nav[0],
    selected = params.get("id");
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 6000);
    return () => clearTimeout(t);
  }, [toast]);
  async function run(task: () => Promise<unknown>, success = "Saved") {
    setBusy(true);
    try {
      if (!navigator.onLine || !connection.isWebSocketConnected)
        throw new Error(
          "Reconnect before saving or sending. No send is queued offline.",
        );
      await task();
      setToast(success);
    } catch (error) {
      setToast(
        error instanceof Error
          ? error.message.split("Uncaught ConvexError: ").pop()!.split("\n")[0]
          : "Action failed. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (!data)
    return (
      <div className="crm-root crm-signin">
        <span className="crm-brand-mark crm-pulse">m.</span>
        <p>Loading your workspace…</p>
      </div>
    );
  const pending = data.drafts.filter((d) => d.status === "draft").length;
  return (
    <div className="crm-root">
      <aside className={`crm-sidebar ${mobile ? "open" : ""}`}>
        <Link href="/crm" className="crm-logo">
          <span className="crm-brand-mark">m.</span>
          <span>
            Muiz Rexhepi<small>Personal workspace</small>
          </span>
          <button
            className="crm-mobile-close"
            aria-label="Close navigation"
            onClick={() => setMobile(false)}
          >
            <X size={18} />
          </button>
        </Link>
        <div className="crm-sidebar-caption">WORKSPACE</div>
        <nav aria-label="CRM navigation">
          {nav.map((n) => (
            <Link
              key={n.id}
              href={n.id === "overview" ? "/crm" : `/crm/${n.id}`}
              className={`crm-nav-item ${current.id === n.id ? "active" : ""}`}
              onClick={() => setMobile(false)}
            >
              <n.icon size={18} />
              {n.name}
              {n.id === "inbox" && pending > 0 && (
                <span className="crm-count">{pending}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="crm-sidebar-bottom">
          <div className="crm-mode">
            <span
              className={`crm-status-light ${data.settings.paused ? "amber" : ""}`}
            />
            <div>
              {data.settings.paused ? "Outbound paused" : "Outbound enabled"}
              <small>
                {data.settings.paused
                  ? "Research & drafts still work"
                  : "Owner approval required"}
              </small>
            </div>
            <button
              aria-label={
                data.settings.paused ? "Resume outbound" : "Pause outbound"
              }
              onClick={() =>
                void run(
                  () => pause({ paused: !data.settings.paused }),
                  data.settings.paused
                    ? "Outbound resumed; eligibility checks still apply"
                    : "Outbound paused",
                )
              }
            >
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="crm-user">
            <span>MR</span>
            <div>
              Muiz Rexhepi<small>Workspace owner</small>
            </div>
            <button aria-label="Sign out" onClick={() => void signOut()}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      {mobile && (
        <button
          className="crm-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <div className="crm-workspace">
        <header className="crm-topbar">
          <div>
            <button
              className="crm-mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={21} />
            </button>
            <span className="crm-breadcrumb">Workspace</span>
            <ChevronRight size={13} />
            <strong>{current.name}</strong>
          </div>
          <div>
            <button
              className="crm-search-shortcut"
              onClick={() => router.push("/crm/leads")}
            >
              <Search size={16} />
              <span>Find a lead</span>
            </button>
            <span className="crm-private">
              <ShieldCheck size={14} /> Private
            </span>
            <button
              className="crm-bell"
              aria-label="Notifications"
              onClick={() => setNotifications(!notifications)}
            >
              <Bell size={19} />
              {data.notifications.some((n) => !n.read) && <i />}
            </button>
            <span className="crm-top-avatar">M</span>
          </div>
        </header>
        {offline && (
          <div className="crm-offline">
            <WifiOff size={15} /> You’re offline. Sending and changes require a
            connection.
          </div>
        )}
        <main className="crm-content" id="crm-main">
          <div className="crm-page-heading">
            <div>
              <span className="crm-eyebrow">
                {current.id === "overview"
                  ? new Date().toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                  : "YOUR SALES WORKSPACE"}
              </span>
              <h1>
                {current.id === "overview"
                  ? "A little momentum, every day."
                  : current.name}
              </h1>
              <p>
                {
                  (
                    {
                      overview:
                        "Make room for the right opportunities. Here’s where things stand.",
                      leads:
                        "Good relationships begin with a little understanding.",
                      pipeline:
                        "From first conversation to a project worth building.",
                      inbox:
                        "Thoughtful conversations. Always with you in control.",
                      automation:
                        "Quietly working in the background. Clearly under your control.",
                      settings: "Make this workspace work the way you do.",
                    } as Record<string, string>
                  )[current.id]
                }
              </p>
            </div>
            <div className="crm-heading-actions">
              {["overview", "leads"].includes(current.id) && (
                <Button
                  className="crm-secondary"
                  onClick={() => setDiscovery(true)}
                >
                  <Sparkles size={16} />
                  Discover leads
                </Button>
              )}
              <Button
                className="crm-primary"
                disabled={offline}
                onClick={() => setAdd(true)}
              >
                <Plus size={17} />
                Add lead
              </Button>
            </div>
          </div>
          {current.id === "overview" && (
            <Overview
              data={data}
              onAdd={() => setAdd(true)}
              onDiscover={() => setDiscovery(true)}
            />
          )}
          {current.id === "leads" && (
            <Leads
              onAdd={() => setAdd(true)}
              onImport={async (file) => {
                const result = Papa.parse<Record<string, string>>(
                  await file.text(),
                  { header: true, skipEmptyLines: true },
                );
                if (result.errors.length)
                  throw new Error(
                    "CSV is malformed. Check the header and quoted fields.",
                  );
                const rows = result.data.map((row) => ({
                  name: row.name ?? row.business_name ?? "",
                  website: row.website ?? "",
                  location: row.location ?? "",
                  industry: row.industry ?? "",
                  email: row.email ?? "",
                  contactName: row.contact_name ?? "",
                  language: languages.includes(
                    row.language as (typeof languages)[number],
                  )
                    ? (row.language as (typeof languages)[number])
                    : ("en" as const),
                  notes: row.notes ?? "",
                }));
                if (rows.length > 1000)
                  throw new Error("Import at most 1,000 rows per file");
                let created = 0,
                  duplicates = 0;
                for (let i = 0; i < rows.length; i += 100) {
                  const result = await importLeads({
                    rows: rows.slice(i, i + 100),
                  });
                  created += result.created;
                  duplicates += result.duplicates;
                }
                setToast(
                  `${created} leads imported; ${duplicates} duplicates skipped`,
                );
              }}
              run={run}
            />
          )}
          {current.id === "pipeline" && <Pipeline data={data} />}
          {current.id === "inbox" && <InboxView data={data} run={run} />}
          {current.id === "automation" && (
            <Automation data={data} budget={budget} run={run} />
          )}
          {current.id === "settings" && <SettingsView data={data} run={run} />}
          <footer className="crm-workspace-footer">
            <span>
              <span className="crm-status-light" />
              Connected to your private workspace
            </span>
            <span>Muiz Rexhepi · Private CRM</span>
          </footer>
        </main>
      </div>
      {notifications && (
        <div className="crm-notification-panel">
          <div className="crm-panel-heading">
            <h3>Notifications</h3>
            <button
              aria-label="Close notifications"
              onClick={() => setNotifications(false)}
            >
              <X size={18} />
            </button>
          </div>
          {data.notifications.length ? (
            data.notifications.map((n) => (
              <Link
                key={n._id}
                href={n.href}
                className={`crm-notification ${n.read ? "read" : ""}`}
                onClick={() => {
                  void mark({ id: n._id });
                  setNotifications(false);
                }}
              >
                <Bell size={17} />
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.body}</p>
                  <small>{relative(n.createdAt)}</small>
                </div>
              </Link>
            ))
          ) : (
            <Empty
              title="You’re all caught up"
              body="Important updates will appear here."
            />
          )}
        </div>
      )}
      {add && (
        <Modal
          title="A new connection"
          subtitle="Start with what you know. You can research the rest."
          close={() => setAdd(false)}
        >
          <LeadForm
            busy={busy}
            onSave={(values) =>
              void run(async () => {
                const result = await create(values);
                setAdd(false);
                router.push(`/crm/leads?id=${result.id}`);
              }, "Lead saved. Existing businesses and contacts are deduplicated.")
            }
          />
        </Modal>
      )}
      {discovery && (
        <Modal
          title="Find your next opportunity"
          subtitle="Search real businesses. Keep the ones that fit."
          close={() => setDiscovery(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = String(new FormData(e.currentTarget).get("query"));
              void run(async () => {
                await enqueue({ kind: "discovery", query });
                setDiscovery(false);
              }, "Discovery queued. Watch its progress in Automation.");
            }}
          >
            <Field label="What would you like to discover?">
              <textarea
                name="query"
                defaultValue={`${data.settings.industries.join(", ")} in ${data.settings.markets.join(" and ")}`}
                required
                rows={4}
              />
            </Field>
            <div className="crm-info">
              <ShieldCheck size={17} />
              <p>
                Uses OpenAI Responses with web search. Spending is reserved
                before the job starts. Discovery does not authorize contacting a
                business.
              </p>
            </div>
            {!data.integrations.openai && (
              <div className="crm-error">
                OpenAI is disconnected. Add its server-side key to enable
                discovery.
              </div>
            )}
            <Button
              type="submit"
              className="crm-primary"
              disabled={busy || !data.integrations.openai}
            >
              Start discovery
              <ArrowRight size={16} />
            </Button>
          </form>
        </Modal>
      )}
      {selected && (
        <LeadDetail
          id={selected as Id<"leads">}
          run={run}
          close={() =>
            router.push(
              `/crm/${current.id === "overview" ? "leads" : current.id}`,
            )
          }
        />
      )}
      {toast && (
        <div className="crm-toast" role="status">
          <AlertCircle size={18} />
          <span>{toast}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
type Run = (task: () => Promise<unknown>, success?: string) => Promise<void>;
function Overview({
  data,
  onAdd,
  onDiscover,
}: {
  data: Snapshot;
  onAdd: () => void;
  onDiscover: () => void;
}) {
  const open = data.leads.filter((l) => !["won", "lost"].includes(l.stage)),
    interested = data.leads.filter((l) =>
      ["interested", "meeting"].includes(l.stage),
    ),
    drafts = data.drafts.filter((d) => d.status === "draft");
  const totals = Object.fromEntries(
    ["EUR", "CHF", "MKD"].map((c) => [
      c,
      open
        .filter((l) => l.currency === c)
        .reduce((sum, l) => sum + l.dealValue, 0),
    ]),
  );
  return (
    <>
      <div className="crm-stats">
        <Stat
          label="Active opportunities"
          value={String(open.length)}
          icon={Target}
          foot="Across your open pipeline"
        />
        <Stat
          label="Interested prospects"
          value={String(interested.length)}
          icon={Users}
          foot="Conversations worth your attention"
        />
        <Stat
          label="Awaiting your approval"
          value={String(drafts.length)}
          icon={CheckCheck}
          foot="Nothing sends without permission"
        />
        <Stat
          label="Open pipeline value"
          value={money(totals.EUR)}
          icon={Columns3}
          foot={
            totals.CHF || totals.MKD
              ? `${money(totals.CHF, "CHF")} · ${money(totals.MKD, "MKD")}`
              : "Estimated deal value, not revenue"
          }
        />
      </div>
      <div className="crm-overview-grid">
        <section className="crm-card crm-pipeline-summary">
          <div className="crm-card-heading">
            <div>
              <h2>Your pipeline</h2>
              <p>Every opportunity has a next step.</p>
            </div>
            <Link href="/crm/pipeline">
              View pipeline
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="crm-pipeline-visual">
            {stages
              .filter((s) => s !== "lost")
              .map((s, i) => {
                const count = data.leads.filter((l) => l.stage === s).length;
                return (
                  <Link
                    href={`/crm/pipeline?stage=${s}`}
                    className="crm-pipeline-bar-col"
                    key={s}
                  >
                    <span className="crm-bar-value">{count}</span>
                    <div className="crm-bar-track">
                      <div
                        style={{
                          height: count
                            ? `${Math.max(12, (count / Math.max(1, data.leads.length)) * 100)}%`
                            : "4px",
                          background: `hsl(${258 - i * 5} ${45 + i * 3}% ${80 - i * 4}%)`,
                        }}
                      />
                    </div>
                    <span>{stageLabels[s]}</span>
                  </Link>
                );
              })}
          </div>
          <div className="crm-card-note">
            Based on the latest {data.leads.length} leads (up to 250). Currency
            values remain separate.
          </div>
        </section>
        <section className="crm-card">
          <div className="crm-card-heading">
            <div>
              <h2>Needs your attention</h2>
              <p>A good place to start.</p>
            </div>
            <span className="crm-count">
              {drafts.length + interested.length}
            </span>
          </div>
          {drafts.length || interested.length ? (
            <div className="crm-attention-list">
              {drafts.slice(0, 3).map((d) => (
                <Link key={d._id} href={`/crm/inbox?draft=${d._id}`}>
                  <span className="crm-attention-icon">
                    <FileText size={18} />
                  </span>
                  <div>
                    <strong>{d.subject}</strong>
                    <small>Draft waiting for approval</small>
                  </div>
                  <ChevronRight size={16} />
                </Link>
              ))}
              {interested.slice(0, 2).map((l) => (
                <Link key={l._id} href={`/crm/leads?id=${l._id}`}>
                  <Avatar name={l.name} />
                  <div>
                    <strong>{l.name}</strong>
                    <small>{l.nextAction}</small>
                  </div>
                  <ChevronRight size={16} />
                </Link>
              ))}
            </div>
          ) : (
            <Empty
              icon={CheckCircle2}
              title="A clean slate"
              body="Drafts to review and interested prospects will find their way here."
            />
          )}
        </section>
        <section className="crm-card">
          <div className="crm-card-heading">
            <div>
              <h2>Recent connections</h2>
              <p>A little context goes a long way.</p>
            </div>
            <Link href="/crm/leads">
              All leads
              <ArrowUpRight size={15} />
            </Link>
          </div>
          {data.leads.length ? (
            <div className="crm-recent-leads">
              {data.leads.slice(0, 5).map((l) => (
                <Link key={l._id} href={`/crm/leads?id=${l._id}`}>
                  <Avatar name={l.name} />
                  <div>
                    <strong>{l.name}</strong>
                    <small>
                      {l.location || "Location to research"} ·{" "}
                      {l.industry || "Uncategorized"}
                    </small>
                  </div>
                  <StageBadge stage={l.stage} />
                </Link>
              ))}
            </div>
          ) : (
            <Empty
              icon={Building2}
              title="Your next chapter starts with a lead"
              body="Add a business you know, import your contacts, or discover new opportunities."
              action={
                <div className="crm-inline-actions">
                  <Button className="crm-secondary" onClick={onDiscover}>
                    <Sparkles size={15} />
                    Discover
                  </Button>
                  <Button className="crm-primary" onClick={onAdd}>
                    <Plus size={15} />
                    Add first lead
                  </Button>
                </div>
              }
            />
          )}
        </section>
        <section className="crm-card">
          <div className="crm-card-heading">
            <div>
              <h2>Workspace activity</h2>
              <p>The small steps that move things forward.</p>
            </div>
            <Clock size={17} />
          </div>
          {data.activity.length ? (
            <div className="crm-timeline">
              {data.activity.slice(0, 5).map((a) => (
                <div key={a._id}>
                  <span className="crm-timeline-dot" />
                  <div>
                    <strong>{a.action.replaceAll(".", " ")}</strong>
                    <p>{a.detail}</p>
                    <small>{relative(a.createdAt)}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={Clock}
              title="Ready when you are"
              body="Your research, decisions, and conversations will build a clear history here."
            />
          )}
        </section>
      </div>
      <div className="crm-health-strip">
        <span className="crm-health-icon">
          <Zap size={20} />
        </span>
        <div>
          <strong>
            {data.settings.paused
              ? "Your workspace is ready. Outbound is paused."
              : "Thoughtful automation, with you in control."}
          </strong>
          <p>
            {data.integrations.openai
              ? "Research is connected. Your sending controls apply to every message."
              : "Connect OpenAI to begin discovery and research. Lead management is ready now."}
          </p>
        </div>
        <Link href="/crm/settings">
          Review setup
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
function Stat({
  label,
  value,
  icon: Icon,
  foot,
}: {
  label: string;
  value: string;
  icon: typeof Users;
  foot: string;
}) {
  return (
    <section className="crm-card crm-stat">
      <div>
        <span>{label}</span>
        <Icon size={17} />
      </div>
      <strong>{value}</strong>
      <small>{foot}</small>
    </section>
  );
}
function Leads({
  onAdd,
  onImport,
  run,
}: {
  onAdd: () => void;
  onImport: (file: File) => Promise<void>;
  run: Run;
}) {
  const [search, setSearch] = useState(""),
    [stage, setStage] = useState("");
  const { results, status, loadMore } = usePaginatedQuery(
    api.crm.listLeads,
    { search, ...(stage ? { stage } : {}) },
    { initialNumItems: 30 },
  );
  return (
    <section className="crm-card crm-lead-table">
      <div className="crm-table-toolbar">
        <label className="crm-search-input">
          <Search size={17} />
          <Input
            aria-label="Search leads"
            placeholder="Search businesses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div>
          <select
            aria-label="Filter by stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            <option value="">All stages</option>
            {stages.map((s) => (
              <option value={s} key={s}>
                {stageLabels[s]}
              </option>
            ))}
          </select>
          <label className="crm-upload-button">
            <Upload size={15} />
            Import CSV
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void run(() => onImport(file), "CSV import complete");
                e.target.value = "";
              }}
            />
          </label>
          <a
            className="crm-icon-button"
            href="/crm-assets/import-template.csv"
            download
            aria-label="Download CSV template"
          >
            <Download size={17} />
          </a>
        </div>
      </div>
      {results.length ? (
        <>
          <div className="crm-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Location & industry</th>
                  <th>Stage</th>
                  <th>Fit score</th>
                  <th>Contact eligibility</th>
                  <th>Next step</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {results.map((l) => (
                  <tr key={l._id}>
                    <td>
                      <Link
                        href={`/crm/leads?id=${l._id}`}
                        className="crm-business-cell"
                      >
                        <Avatar name={l.name} />
                        <div>
                          <strong>{l.name}</strong>
                          <small>
                            {l.domain || l.email || "No website yet"}
                          </small>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <span>{l.location || "Unknown"}</span>
                      <small>{l.industry || "Uncategorized"}</small>
                    </td>
                    <td>
                      <StageBadge stage={l.stage} />
                    </td>
                    <td>
                      {l.researchAt ? (
                        <span
                          className={`crm-score ${l.score >= 65 ? "good" : ""}`}
                        >
                          {l.score}
                          <small>/100</small>
                        </span>
                      ) : (
                        <span className="crm-muted">Not researched</span>
                      )}
                    </td>
                    <td>
                      <Badge
                        tone={
                          l.suppressed
                            ? "red"
                            : ["requested", "opted_in"].includes(l.eligibility)
                              ? "green"
                              : "neutral"
                        }
                      >
                        {l.eligibility.replaceAll("_", " ")}
                      </Badge>
                    </td>
                    <td className="crm-next-step">{l.nextAction}</td>
                    <td>
                      <Link
                        href={`/crm/leads?id=${l._id}`}
                        aria-label={`View ${l.name}`}
                      >
                        <ArrowUpRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="crm-table-footer">
            <span>{results.length} leads loaded</span>
            {status === "CanLoadMore" && (
              <Button className="crm-secondary" onClick={() => loadMore(30)}>
                Load more
              </Button>
            )}
          </div>
        </>
      ) : status === "LoadingFirstPage" ? (
        <Empty
          title="Loading your leads…"
          body="Connecting to your workspace."
        />
      ) : (
        <Empty
          icon={Users}
          title={
            search ? "No matching businesses" : "Make your first connection"
          }
          body={
            search
              ? "Try another name or pipeline stage."
              : "Add a lead manually, import a CSV, or start discovery. Each lead stays private and is deduplicated."
          }
          action={
            !search ? (
              <Button className="crm-primary" onClick={onAdd}>
                <Plus size={16} />
                Add a lead
              </Button>
            ) : undefined
          }
        />
      )}
    </section>
  );
}
function Pipeline({ data }: { data: Snapshot }) {
  return (
    <>
      <div className="crm-pipeline-legend">
        <span>
          <span className="crm-status-light" /> Live pipeline
        </span>
        <span>
          Latest {data.leads.length} leads · Deal values are estimates · Record
          wins explicitly
        </span>
      </div>
      <div className="crm-kanban">
        {stages.map((stage) => (
          <section className="crm-kanban-column" key={stage}>
            <div className="crm-kanban-heading">
              <span>
                <span className={`crm-stage-dot ${stage}`} />
                {stageLabels[stage]}
              </span>
              <span>{data.leads.filter((l) => l.stage === stage).length}</span>
            </div>
            {data.leads
              .filter((l) => l.stage === stage)
              .map((l) => (
                <Link
                  className="crm-deal-card"
                  key={l._id}
                  href={`/crm/pipeline?id=${l._id}`}
                >
                  <div>
                    <Avatar name={l.name} />
                    <MoreHorizontal size={17} />
                  </div>
                  <h3>{l.name}</h3>
                  <p>
                    {l.suggestedService || l.industry || "Service to explore"}
                  </p>
                  <div className="crm-deal-bottom">
                    <span>
                      {l.dealValue
                        ? money(l.dealValue, l.currency)
                        : "Value to scope"}
                    </span>
                    {l.researchAt && (
                      <span className="crm-score">{l.score}</span>
                    )}
                  </div>
                  <div className="crm-deal-next">
                    <Clock size={13} />
                    {l.nextAction || "Set next action"}
                  </div>
                </Link>
              ))}
            {!data.leads.some((l) => l.stage === stage) && (
              <div className="crm-empty-column">No opportunities yet</div>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
function Modal({
  title,
  subtitle,
  close,
  children,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  close: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = previous;
    };
  }, [close]);
  return (
    <div
      className="crm-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section
        className={`crm-modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="crm-modal-heading">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button aria-label="Close dialog" onClick={close}>
            <X size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
function LeadForm({
  onSave,
  busy,
}: {
  onSave: (input: {
    name: string;
    website: string;
    location: string;
    industry: string;
    email: string;
    contactName: string;
    language: (typeof languages)[number];
    notes: string;
  }) => void;
  busy: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget),
          value = (k: string) => String(f.get(k) ?? "");
        onSave({
          name: value("name"),
          website: value("website"),
          location: value("location"),
          industry: value("industry"),
          email: value("email"),
          contactName: value("contactName"),
          language: value("language") as (typeof languages)[number],
          notes: value("notes"),
        });
      }}
    >
      <Field label="Business name">
        <Input
          name="name"
          required
          maxLength={200}
          placeholder="The business you’d like to get to know"
          autoFocus
        />
      </Field>
      <div className="crm-form-grid">
        <Field label="Website">
          <Input name="website" placeholder="https://example.com" />
        </Field>
        <Field label="Location">
          <Input name="location" placeholder="e.g. Zürich, Switzerland" />
        </Field>
        <Field label="Industry">
          <Input name="industry" placeholder="e.g. Hospitality" />
        </Field>
        <Field label="Contact name">
          <Input name="contactName" placeholder="If known" />
        </Field>
        <Field label="Business email">
          <Input type="email" name="email" placeholder="If available" />
        </Field>
        <Field label="Conversation language">
          <select name="language">
            {languages.map((l) => (
              <option key={l} value={l}>
                {
                  {
                    en: "English",
                    sq: "Albanian",
                    mk: "Macedonian",
                    de: "German",
                  }[l]
                }
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="A little context">
        <textarea
          name="notes"
          rows={3}
          placeholder="What do you know about this business?"
        />
      </Field>
      <div className="crm-info">
        <ShieldCheck size={16} />
        <p>
          Contact eligibility starts as unknown. A published address does not
          grant permission to email.
        </p>
      </div>
      <div className="crm-form-actions">
        <Button className="crm-primary" type="submit" disabled={busy}>
          <Plus size={16} />
          Save lead
        </Button>
      </div>
    </form>
  );
}
function LeadDetail({
  id,
  run,
  close,
}: {
  id: Id<"leads">;
  run: Run;
  close: () => void;
}) {
  const router = useRouter();
  const detail = useQuery(api.crm.detail, { id }),
    update = useMutation(api.crm.updateLead),
    editBusiness = useMutation(api.crm.editBusiness),
    enqueue = useMutation(api.jobs.enqueue),
    suppress = useMutation(api.crm.suppress),
    cancel = useMutation(api.outbound.cancel),
    createDraft = useMutation(api.outbound.createDraft),
    saveTask = useMutation(api.crm.saveTask),
    completeTask = useMutation(api.crm.completeTask),
    reply = useMutation(api.crm.logReply);
  const [tab, setTab] = useState("research");
  const [editingBusiness, setEditingBusiness] = useState(false);
  if (!detail)
    return (
      <Modal title="Opening lead…" close={close}>
        <p>Loading the latest research and conversations.</p>
      </Modal>
    );
  const { lead, drafts, messages, tasks } = detail;
  return (
    <Modal
      wide
      title={lead.name}
      subtitle={
        [lead.location, lead.industry].filter(Boolean).join(" · ") ||
        "A new connection"
      }
      close={close}
    >
      <div className="crm-detail-actions">
        <Button
          className="crm-secondary"
          onClick={() => setEditingBusiness(!editingBusiness)}
        >
          <Building2 size={15} />{" "}
          {editingBusiness
            ? "Close business details"
            : "Edit business & contact"}
        </Button>
      </div>
      {editingBusiness && (
        <BusinessEditor
          lead={lead}
          onSave={(values) =>
            void run(async () => {
              await editBusiness({ id, ...values });
              setEditingBusiness(false);
            }, "Business details saved. Changed recipients need fresh permission and approval.")
          }
        />
      )}
      <div className="crm-detail-meta">
        <StageBadge stage={lead.stage} />
        <Badge tone={lead.suppressed ? "red" : "neutral"}>
          {lead.eligibility.replaceAll("_", " ")}
        </Badge>
        {lead.website && (
          <a href={lead.website} target="_blank" rel="noreferrer">
            <Globe size={14} />
            {lead.domain}
            <ExternalLink size={12} />
          </a>
        )}
        {lead.email && (
          <span>
            <Mail size={14} />
            {lead.email}
          </span>
        )}
      </div>
      <div className="crm-detail-actions">
        <Button
          className="crm-secondary"
          onClick={() =>
            void run(
              () => enqueue({ kind: "research", leadId: id }),
              "Research queued",
            )
          }
        >
          <Sparkles size={15} />
          Research
        </Button>
        <Button
          className="crm-secondary"
          onClick={() =>
            void run(
              () => enqueue({ kind: "draft", leadId: id }),
              "Draft generation queued",
            )
          }
        >
          <FileText size={15} />
          Generate draft
        </Button>
        <Button
          className="crm-secondary"
          onClick={() =>
            void run(
              () => enqueue({ kind: "proposal", leadId: id }),
              "Proposal queued for owner review",
            )
          }
        >
          <Plus size={15} />
          Proposal
        </Button>
        <Button
          className="crm-secondary"
          onClick={() =>
            void run(async () => {
              const draftId = await createDraft({
                leadId: id,
                kind: "reply",
                subject: `Re: ${lead.name}`,
                body: "",
              });
              router.push(`/crm/inbox?draft=${draftId}`);
            }, "Draft ready to write")
          }
        >
          <Mail size={15} />
          Write draft
        </Button>
      </div>
      <div className="crm-tabs">
        {["research", "conversation", "details", "tasks"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === "research" && (
        <div className="crm-detail-research">
          <div className="crm-fit-card">
            <div>
              <span>Qualification score</span>
              <strong>
                {lead.researchAt ? lead.score : "—"}
                <small>/100</small>
              </strong>
            </div>
            <div>
              <h3>{lead.suggestedService || "An opportunity to understand"}</h3>
              <p>
                {lead.researchAt
                  ? `Researched ${date(lead.researchAt)}. Review the original sources before relying on any observation.`
                  : "Research this business to understand whether your services could be a useful fit."}
              </p>
            </div>
          </div>
          {lead.scoreReasons.length > 0 && (
            <div className="crm-reasons">
              {lead.scoreReasons.map((r, i) => (
                <p key={i}>
                  <CheckCircle2 size={15} />
                  {r}
                </p>
              ))}
            </div>
          )}
          <h3>Research & observations</h3>
          {lead.observations.length ? (
            lead.observations.map((o, i) => (
              <div key={i} className="crm-observation">
                <Badge tone={o.kind === "verified" ? "green" : "amber"}>
                  {o.kind === "verified" ? "Source checked" : "Hypothesis"}
                </Badge>
                <p>{o.text}</p>
                {o.sourceUrl && (
                  <a href={o.sourceUrl} rel="noreferrer" target="_blank">
                    Original source
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="crm-muted">
              No research yet. Unknown details stay unknown.
            </p>
          )}
          <h3>Evidence</h3>
          {lead.sources.map((s, i) => (
            <a
              key={i}
              className="crm-source-card"
              href={s.url}
              target="_blank"
              rel="noreferrer"
            >
              <Globe size={17} />
              <div>
                <strong>{s.title}</strong>
                <small>{s.url}</small>
                <p>{s.excerpt}</p>
              </div>
              <Badge tone={s.verified ? "green" : "amber"}>
                {s.verified ? "Fetched" : "Unverified"}
              </Badge>
            </a>
          ))}
          <div className="crm-info">
            <ShieldCheck size={17} />
            <p>
              Research sources can be incomplete. Opportunities are suggestions,
              and discovery never grants contact permission.
            </p>
          </div>
        </div>
      )}
      {tab === "conversation" && (
        <>
          <div className="crm-detail-actions">
            <Button
              className="crm-secondary"
              onClick={() =>
                void run(
                  () => enqueue({ kind: "classify", leadId: id }),
                  "Conversation analysis queued",
                )
              }
            >
              <Sparkles size={15} />
              Summarize & recommend
            </Button>
          </div>
          <h3>Conversation history</h3>
          {messages.length ? (
            messages.map((m) => (
              <article className={`crm-message ${m.direction}`} key={m._id}>
                <div>
                  <strong>
                    {m.direction === "inbound" ? lead.name : "Muiz Rexhepi"}
                  </strong>
                  <span>
                    {date(m.receivedAt)} · {m.provider}
                  </span>
                  <Badge>{m.classification}</Badge>
                </div>
                <h4>{m.subject}</h4>
                <p>{m.body}</p>
                <small>
                  {m.direction === "outbound"
                    ? m.delivery
                    : `${m.from} → ${m.to}`}
                </small>
              </article>
            ))
          ) : (
            <p className="crm-muted">No conversation yet.</p>
          )}
          <h3>Record an existing reply</h3>
          <p className="crm-muted">
            For replies you received directly. Recording a reply cancels pending
            follow-ups.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget,
                f = new FormData(form);
              void run(async () => {
                await reply({
                  leadId: id,
                  subject: String(f.get("subject")),
                  body: String(f.get("body")),
                  providerId: crypto.randomUUID(),
                });
                form.reset();
              }, "Reply recorded. Follow-ups cancelled.");
            }}
          >
            <Field label="Subject">
              <Input name="subject" required />
            </Field>
            <Field label="Reply text">
              <textarea name="body" rows={4} required maxLength={20000} />
            </Field>
            <Button className="crm-secondary" type="submit">
              Record reply
            </Button>
          </form>
          {drafts.length > 0 && (
            <p className="crm-muted">
              {drafts.length} draft(s) for this lead are in{" "}
              <Link href="/crm/inbox">Inbox & approvals</Link>.
            </p>
          )}
        </>
      )}
      {tab === "details" && (
        <form
          key={lead.updatedAt}
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget),
              s = (key: string) => String(f.get(key) ?? "");
            void run(
              () =>
                update({
                  id,
                  stage: s("stage"),
                  notes: s("notes"),
                  nextAction: s("nextAction"),
                  eligibility: s("eligibility") as Doc<"leads">["eligibility"],
                  permissionEvidence: s("permissionEvidence"),
                  dealValue: Number(f.get("dealValue")),
                  currency: s("currency") as "EUR" | "CHF" | "MKD",
                  collectedRevenue: Number(f.get("collectedRevenue")),
                  outcomeReason: s("outcomeReason"),
                  language: s("language") as (typeof languages)[number],
                }),
              "Lead updated",
            );
          }}
        >
          <div className="crm-form-grid">
            <Field label="Pipeline stage">
              <select name="stage" defaultValue={lead.stage}>
                {stages.map((s) => (
                  <option value={s} key={s}>
                    {stageLabels[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Language">
              <select name="language" defaultValue={lead.language}>
                {languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Contact eligibility">
              <select
                name="eligibility"
                defaultValue={lead.eligibility}
                disabled={lead.suppressed}
              >
                {[
                  "unknown",
                  "requested",
                  "opted_in",
                  "prospecting_eligible",
                  "suppressed",
                ].map((e) => (
                  <option key={e} value={e}>
                    {e.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Permission basis & evidence">
              <Input
                name="permissionEvidence"
                defaultValue={lead.permissionEvidence}
                placeholder="Source, date, and specific permission"
              />
            </Field>
          </div>
          <Field label="Next action">
            <Input name="nextAction" defaultValue={lead.nextAction} />
          </Field>
          <Field label="Notes">
            <textarea name="notes" rows={4} defaultValue={lead.notes} />
          </Field>
          <div className="crm-form-grid three">
            <Field label="Estimated deal value">
              <Input
                type="number"
                name="dealValue"
                min={0}
                step="0.01"
                defaultValue={lead.dealValue}
              />
            </Field>
            <Field label="Currency">
              <select name="currency" defaultValue={lead.currency}>
                <option>EUR</option>
                <option>CHF</option>
                <option>MKD</option>
              </select>
            </Field>
            <Field label="Collected revenue">
              <Input
                type="number"
                name="collectedRevenue"
                min={0}
                step="0.01"
                defaultValue={lead.collectedRevenue}
              />
            </Field>
          </div>
          <Field label="Outcome evidence / reason">
            <textarea
              name="outcomeReason"
              rows={2}
              defaultValue={lead.outcomeReason}
              placeholder="Contract agreed, payment received, lost reason…"
            />
          </Field>
          <div className="crm-form-actions">
            <Button className="crm-primary" type="submit">
              Save details
            </Button>
            <Button
              className="crm-secondary"
              type="button"
              onClick={() =>
                void run(() => cancel({ leadId: id }), "Follow-ups cancelled")
              }
            >
              Cancel follow-ups
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() =>
                void run(
                  () => suppress({ id, reason: "Owner requested suppression" }),
                  "Recipient suppressed; queued sends cancelled",
                )
              }
            >
              Suppress contact
            </Button>
          </div>
        </form>
      )}
      {tab === "tasks" && (
        <>
          <div className="crm-task-list">
            {tasks.map((t) => (
              <div key={t._id}>
                <button
                  aria-label={`Complete ${t.title}`}
                  disabled={t.done}
                  onClick={() =>
                    void run(
                      () => completeTask({ id: t._id }),
                      "Task completed",
                    )
                  }
                >
                  {t.done ? (
                    <CheckCircle2 size={19} />
                  ) : (
                    <span className="crm-task-circle" />
                  )}
                </button>
                <div>
                  <strong className={t.done ? "crm-strike" : ""}>
                    {t.title}
                  </strong>
                  <small>
                    {t.kind} · {new Date(t.dueAt).toLocaleString()}{" "}
                    {t.cancelled ? "· cancelled" : ""}
                  </small>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              void run(
                () =>
                  saveTask({
                    leadId: id,
                    title: String(f.get("title")),
                    dueAt: new Date(String(f.get("dueAt"))).getTime(),
                    kind: String(f.get("kind")) as
                      "task" | "meeting" | "followup",
                  }),
                "Next action scheduled",
              );
            }}
          >
            <Field label="Next action or meeting">
              <Input name="title" required />
            </Field>
            <div className="crm-form-grid">
              <Field label="When">
                <Input type="datetime-local" name="dueAt" required />
              </Field>
              <Field label="Type">
                <select name="kind">
                  <option value="task">Task</option>
                  <option value="meeting">Meeting</option>
                  <option value="followup">Follow-up review</option>
                </select>
              </Field>
            </div>
            <Button className="crm-primary" type="submit">
              <Plus size={16} />
              Schedule
            </Button>
          </form>
        </>
      )}
    </Modal>
  );
}
function InboxView({ data, run }: { data: Snapshot; run: Run }) {
  const params = useSearchParams(),
    [selected, setSelected] = useState(params.get("draft") ?? ""),
    [filter, setFilter] = useState("pending");
  const drafts = data.drafts.filter(
      (d) => filter === "all" || ["draft", "approved"].includes(d.status),
    ),
    draft = data.drafts.find((d) => d._id === selected) ?? drafts[0];
  return (
    <div className="crm-inbox-grid">
      <section className="crm-card crm-inbox-list">
        <div className="crm-card-heading">
          <h2>Your drafts</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter drafts"
          >
            <option value="pending">To review</option>
            <option value="all">All drafts</option>
          </select>
        </div>
        {drafts.length ? (
          drafts.map((d) => (
            <button
              className={`crm-draft-item ${draft?._id === d._id ? "selected" : ""}`}
              key={d._id}
              onClick={() => setSelected(d._id)}
            >
              <div>
                <Avatar
                  name={
                    data.leads.find((l) => l._id === d.leadId)?.name ?? "Lead"
                  }
                />
                <small>{date(d.createdAt)}</small>
              </div>
              <strong>
                {data.leads.find((l) => l._id === d.leadId)?.name ?? "Lead"}
              </strong>
              <p>{d.subject || "Untitled draft"}</p>
              <Badge tone={d.status === "approved" ? "green" : "neutral"}>
                {d.kind} · {d.status}
              </Badge>
            </button>
          ))
        ) : (
          <Empty
            icon={CheckCheck}
            title="All clear"
            body="Drafts will appear here when you write one or generate one from a lead."
          />
        )}
      </section>
      <section className="crm-card crm-draft-editor">
        {draft ? (
          <DraftEditor
            key={`${draft._id}-${draft.updatedAt}`}
            draft={draft}
            lead={data.leads.find((l) => l._id === draft.leadId)}
            run={run}
          />
        ) : (
          <Empty
            icon={Mail}
            title="Every good conversation starts somewhere"
            body="Open a lead to write a message or generate a personalized draft from verified research."
            action={
              <Link href="/crm/leads" className="crm-text-link">
                Explore your leads
                <ArrowRight size={15} />
              </Link>
            }
          />
        )}
      </section>
      <section className="crm-card crm-conversation-list">
        <div className="crm-card-heading">
          <div>
            <h2>Latest conversations</h2>
            <p>Zoho sync and recorded replies.</p>
          </div>
          <Inbox size={17} />
        </div>
        {data.messages.length ? (
          data.messages.slice(0, 8).map((m) => (
            <Link key={m._id} href={`/crm/leads?id=${m.leadId}`}>
              <span className={`crm-message-direction ${m.direction}`}>
                <Mail size={17} />
              </span>
              <div>
                <strong>{m.subject}</strong>
                <p>{m.summary}</p>
                <small>
                  {m.direction} · {m.provider} · {date(m.receivedAt)}
                </small>
              </div>
              <Badge>{m.classification}</Badge>
            </Link>
          ))
        ) : (
          <Empty
            icon={Inbox}
            title="Your conversations belong here"
            body="Connect Zoho in Settings to sync replies to your existing business inbox."
          />
        )}
      </section>
    </div>
  );
}
function DraftEditor({
  draft: d,
  lead,
  run,
}: {
  draft: Doc<"drafts">;
  lead?: Doc<"leads">;
  run: Run;
}) {
  const edit = useMutation(api.outbound.editDraft),
    decide = useMutation(api.outbound.decide),
    send = useMutation(api.outbound.queueSend);
  const editable = ["draft", "approved", "rejected"].includes(d.status);
  const [dirty, setDirty] = useState(false);
  return (
    <>
      <div className="crm-card-heading">
        <div>
          <span className="crm-eyebrow">
            {d.kind.toUpperCase()} · REVISION {d.revision}
          </span>
          <h2>{lead?.name ?? "Draft review"}</h2>
        </div>
        <Badge tone={d.status === "approved" ? "green" : "neutral"}>
          {d.status}
        </Badge>
      </div>
      <form
        onChange={() => setDirty(true)}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget),
            get = (k: string) => String(f.get(k) ?? "");
          void run(
            () =>
              edit({
                id: d._id,
                subject: get("subject"),
                body: get("body"),
                price: Number(f.get("price") ?? 0),
                currency: get("currency") || d.currency,
                scope: get("scope"),
                exclusions: get("exclusions"),
                nextSteps: get("nextSteps"),
                provider: get("provider") as "resend" | "prospecting",
              }),
            "Draft saved. Previous approval cleared.",
          );
        }}
      >
        <div className="crm-email-to">
          <span>To</span>
          <strong>{lead?.email || "No recipient email"}</strong>
          <small>Reply-To: mail@muizrexhepi.com</small>
        </div>
        <Field label="Subject">
          <Input
            name="subject"
            defaultValue={d.subject}
            disabled={!editable}
            required
            maxLength={180}
          />
        </Field>
        <Field label="Message">
          <textarea
            className="crm-email-body"
            name="body"
            defaultValue={d.body}
            rows={10}
            disabled={!editable}
            required
          />
        </Field>
        <Field label="Sending channel">
          <select
            name="provider"
            defaultValue={d.provider}
            disabled={!editable}
          >
            <option value="resend">Resend · requested / opted-in only</option>
            <option value="prospecting">
              Prospecting provider · eligibility required
            </option>
          </select>
        </Field>
        {d.kind === "proposal" ? (
          <>
            <div className="crm-form-grid">
              <Field label="Price for owner approval">
                <Input
                  type="number"
                  name="price"
                  min={0}
                  step="0.01"
                  defaultValue={d.price}
                  disabled={!editable}
                />
              </Field>
              <Field label="Currency">
                <select
                  name="currency"
                  defaultValue={d.currency}
                  disabled={!editable}
                >
                  <option>EUR</option>
                  <option>CHF</option>
                  <option>MKD</option>
                </select>
              </Field>
            </div>
            <Field label="Scope">
              <textarea
                name="scope"
                defaultValue={d.scope}
                rows={3}
                disabled={!editable}
              />
            </Field>
            <Field label="Exclusions">
              <textarea
                name="exclusions"
                defaultValue={d.exclusions}
                rows={2}
                disabled={!editable}
              />
            </Field>
            <Field label="Next steps">
              <textarea
                name="nextSteps"
                defaultValue={d.nextSteps}
                rows={2}
                disabled={!editable}
              />
            </Field>
          </>
        ) : (
          <>
            <input type="hidden" name="price" value={d.price} />
            <input type="hidden" name="scope" value={d.scope} />
            <input type="hidden" name="exclusions" value={d.exclusions} />
            <input type="hidden" name="nextSteps" value={d.nextSteps} />
          </>
        )}
        <div className="crm-info">
          <ShieldCheck size={17} />
          <p>
            Saving changes clears approval. Approval applies to the saved
            revision. Permission and provider rules are checked again before
            sending.
          </p>
        </div>
        <div className="crm-form-actions">
          {dirty && (
            <p className="crm-muted">
              Save your changes before approving or sending.
            </p>
          )}
          {editable && (
            <Button type="submit" className="crm-secondary">
              Save changes
            </Button>
          )}
          {editable && (
            <Button
              type="button"
              className="crm-primary"
              disabled={dirty}
              onClick={() =>
                void run(
                  () => decide({ id: d._id, approve: true }),
                  `Saved revision ${d.revision} approved`,
                )
              }
            >
              <Check size={16} />
              Approve saved revision
            </Button>
          )}
          {editable && (
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                void run(
                  () => decide({ id: d._id, approve: false }),
                  "Draft rejected",
                )
              }
            >
              Reject
            </Button>
          )}
        </div>
        {d.status === "approved" && (
          <div className="crm-send-row">
            <p>
              <CheckCircle2 size={16} />
              Revision {d.revision} approved. Sending still requires an eligible
              channel.
            </p>
            <Button
              className="crm-primary"
              type="button"
              disabled={dirty}
              onClick={() =>
                void run(
                  () => send({ id: d._id }),
                  "Send intent queued. Delivery will be recorded.",
                )
              }
            >
              <Send size={15} />
              Queue send
            </Button>
          </div>
        )}
      </form>
    </>
  );
}
function Automation({
  data,
  budget,
  run,
}: {
  data: Snapshot;
  budget: FunctionReturnType<typeof api.jobs.budget> | undefined;
  run: Run;
}) {
  const pause = useMutation(api.crm.pause),
    retry = useMutation(api.jobs.retry),
    s = data.settings;
  return (
    <>
      <div className="crm-health-strip">
        <span className="crm-health-icon">
          <ShieldCheck size={21} />
        </span>
        <div>
          <strong>
            {s.paused ? "Outbound is safely paused" : "Outbound is enabled"}
          </strong>
          <p>
            Every queued send rechecks approval, suppression, contact
            eligibility, sending hours, and provider configuration.
          </p>
        </div>
        <Button
          className="crm-secondary"
          onClick={() =>
            void run(
              () => pause({ paused: !s.paused }),
              s.paused ? "Outbound resumed" : "Outbound paused",
            )
          }
        >
          {s.paused ? <Play size={16} /> : <Pause size={16} />}{" "}
          {s.paused ? "Resume outbound" : "Pause outbound"}
        </Button>
      </div>
      <div className="crm-stats three-stats">
        <Stat
          label="Estimated AI spend today"
          value={`$${(budget?.dailySpent ?? 0).toFixed(3)}`}
          icon={Sparkles}
          foot={`$${(budget?.dailyReserved ?? 0).toFixed(2)} reserved · $${s.dailyLimit.toFixed(2)} daily limit`}
        />
        <Stat
          label="Estimated spend this month"
          value={`$${(budget?.monthlySpent ?? 0).toFixed(3)}`}
          icon={Clock}
          foot={`$${(budget?.monthlyReserved ?? 0).toFixed(2)} reserved · $${s.monthlyLimit.toFixed(2)} monthly limit`}
        />
        <Stat
          label="Jobs needing attention"
          value={String(
            data.jobs.filter((j) => ["failed", "uncertain"].includes(j.state))
              .length,
          )}
          icon={AlertCircle}
          foot="Uncertain charges retain their reservation"
        />
      </div>
      <div className="crm-automation-cards">
        <section className="crm-card">
          <div className="crm-card-heading">
            <h2>Discovery & research</h2>
            <Badge tone={s.autoDiscovery ? "green" : "neutral"}>
              {s.autoDiscovery ? "Scheduled" : "Manual"}
            </Badge>
          </div>
          <p>{s.markets.join(" · ")}</p>
          <div className="crm-setting-fact">
            <span>Daily volume</span>
            <strong>{s.dailyVolume} AI jobs</strong>
          </div>
          <div className="crm-setting-fact">
            <span>Discovery schedule</span>
            <strong>
              {s.discoveryHour}:00 · {s.timezone}
            </strong>
          </div>
          <div className="crm-setting-fact">
            <span>Model</span>
            <strong>{s.model}</strong>
          </div>
          <Link href="/crm/settings" className="crm-text-link">
            Edit controls
            <ArrowRight size={14} />
          </Link>
        </section>
        <section className="crm-card">
          <div className="crm-card-heading">
            <h2>Follow-ups & replies</h2>
            <Badge tone={data.integrations.zoho ? "green" : "amber"}>
              {data.integrations.zoho ? "Zoho configured" : "Zoho disconnected"}
            </Badge>
          </div>
          <p>
            Replies, opt-outs, suppression and manual cancellation stop pending
            follow-ups.
          </p>
          <div className="crm-setting-fact">
            <span>Follow-up interval</span>
            <strong>
              {s.followupDays} days · max {s.maxFollowups}
            </strong>
          </div>
          <div className="crm-setting-fact">
            <span>Sending hours</span>
            <strong>
              {s.sendStart}:00–{s.sendEnd}:00
            </strong>
          </div>
          <div className="crm-setting-fact">
            <span>Background sweep</span>
            <strong>Every 5 minutes</strong>
          </div>
        </section>
      </div>
      <section className="crm-card">
        <div className="crm-card-heading">
          <div>
            <h2>Run history</h2>
            <p>Persistent jobs, reservations, and a clear audit trail.</p>
          </div>
          <RefreshCw size={17} />
        </div>
        {data.jobs.length ? (
          <div className="crm-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Workflow</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Reserved</th>
                  <th>Result / next action</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.jobs.map((j) => (
                  <tr key={j._id}>
                    <td className="crm-capitalize">{j.kind}</td>
                    <td>{date(j.createdAt)}</td>
                    <td>
                      <Badge
                        tone={
                          j.state === "complete"
                            ? "green"
                            : j.state === "failed"
                              ? "red"
                              : "amber"
                        }
                      >
                        {j.state}
                      </Badge>
                    </td>
                    <td>${j.reservation.toFixed(2)}</td>
                    <td className="crm-job-error">
                      {j.error ||
                        (j.state === "complete"
                          ? "Complete"
                          : "Waiting for worker")}
                    </td>
                    <td>
                      {j.state === "failed" && (
                        <Button
                          className="crm-secondary"
                          onClick={() =>
                            void run(
                              () => retry({ id: j._id }),
                              "New retry queued with a fresh spending reservation",
                            )
                          }
                        >
                          Retry
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            icon={Zap}
            title="Ready to get to work"
            body="Discovery, research and draft jobs will appear here with their status and usage accounting."
          />
        )}
      </section>
      <SendHistory run={run} />
      <UsageReconciliation
        jobs={data.jobs.filter((j) => j.state === "uncertain")}
        run={run}
      />
      <section className="crm-card crm-usage-card">
        <div className="crm-card-heading">
          <h2>Usage ledger</h2>
          <span>Estimated costs, including search tools</span>
        </div>
        {data.usage.length ? (
          <div className="crm-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Input / output tokens</th>
                  <th>Search calls</th>
                  <th>Estimated cost</th>
                  <th>Accounting</th>
                </tr>
              </thead>
              <tbody>
                {data.usage.map((u) => (
                  <tr key={u._id}>
                    <td>{u.model}</td>
                    <td>
                      {u.inputTokens.toLocaleString()} /{" "}
                      {u.outputTokens.toLocaleString()}
                    </td>
                    <td>{u.searchCalls}</td>
                    <td>${u.estimated.toFixed(4)}</td>
                    <td>
                      <Badge>{u.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="crm-muted crm-card-padding">
            No provider requests yet. Conservative reservations include model
            context, maximum output, and up to three web search calls.
          </p>
        )}
      </section>
    </>
  );
}
function SettingsView({ data, run }: { data: Snapshot; run: Run }) {
  const save = useMutation(api.crm.saveSettings),
    sync = useAction(api.zoho.syncNow);
  const {
    _id: ignored,
    _creationTime: ignored2,
    ...clean
  } = data.settings as CrmSettings & { _id?: string; _creationTime?: number };
  void ignored;
  void ignored2;
  const [s, setS] = useState<CrmSettings>(clean),
    [tab, setTab] = useState("general");
  const change = <K extends keyof CrmSettings>(key: K, value: CrmSettings[K]) =>
    setS({ ...s, [key]: value });
  const integrationStatus = useQuery(api.integrations.status, {});
  return (
    <>
      <div className="crm-tabs crm-settings-tabs">
        {[
          "general",
          "sales knowledge",
          "automation",
          "integrations",
          "notifications",
        ].map((t) => (
          <button
            className={t === tab ? "active" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(() => save({ settings: s }), "Workspace settings saved");
        }}
        className="crm-settings-form"
      >
        {tab === "general" && (
          <section className="crm-card crm-settings-card">
            <div className="crm-section-intro">
              <span className="crm-section-icon">
                <Target size={22} />
              </span>
              <div>
                <h2>Make the right connections</h2>
                <p>Define your markets, qualification, and research budget.</p>
              </div>
            </div>
            <div className="crm-form-grid">
              <Field label="Target markets (one per line)">
                <textarea
                  rows={3}
                  value={s.markets.join("\n")}
                  onChange={(e) =>
                    change("markets", e.target.value.split("\n"))
                  }
                />
              </Field>
              <Field label="Industries (one per line)">
                <textarea
                  rows={3}
                  value={s.industries.join("\n")}
                  onChange={(e) =>
                    change("industries", e.target.value.split("\n"))
                  }
                />
              </Field>
              <Field label="Qualification threshold (0–100)">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={s.qualificationThreshold}
                  onChange={(e) =>
                    change("qualificationThreshold", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="AI model">
                <select
                  value={s.model}
                  onChange={(e) =>
                    change("model", e.target.value as CrmSettings["model"])
                  }
                >
                  <option value="gpt-6-luna">GPT-6 Luna · economical</option>
                  <option value="gpt-6.2-sol">
                    GPT-6.2 Sol · more capable
                  </option>
                </select>
              </Field>
              <Field label="Daily AI spending limit (USD)">
                <Input
                  type="number"
                  min={0}
                  max={1000}
                  step="0.01"
                  value={s.dailyLimit}
                  onChange={(e) => change("dailyLimit", Number(e.target.value))}
                />
              </Field>
              <Field label="Monthly AI spending limit (USD)">
                <Input
                  type="number"
                  min={0}
                  max={10000}
                  step="0.01"
                  value={s.monthlyLimit}
                  onChange={(e) =>
                    change("monthlyLimit", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Manually entered credit balance (USD, optional)">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={s.manualCredit ?? ""}
                  onChange={(e) =>
                    change(
                      "manualCredit",
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />
              </Field>
              <Field label="Credit verification note">
                <Input
                  value={s.creditNote}
                  onChange={(e) => change("creditNote", e.target.value)}
                />
              </Field>
            </div>
            <div className="crm-info">
              <ShieldCheck size={17} />
              <p>
                Credit balances are manual reference values. App limits use the
                usage ledger and outstanding reservations. OpenAI invoices and
                credit grants remain the source of billing truth.
              </p>
            </div>
          </section>
        )}
        {tab === "sales knowledge" && (
          <section className="crm-card crm-settings-card">
            <div className="crm-section-intro">
              <span className="crm-section-icon">
                <FileText size={22} />
              </span>
              <div>
                <h2>Your work is the starting point</h2>
                <p>
                  Seeded from your actual portfolio and services. Keep it
                  current.
                </p>
              </div>
            </div>
            <Field label="Services and offers">
              <textarea
                rows={7}
                value={s.services}
                onChange={(e) => change("services", e.target.value)}
              />
            </Field>
            <Field label="Relevant projects and evidence">
              <textarea
                rows={8}
                value={s.projects}
                onChange={(e) => change("projects", e.target.value)}
              />
            </Field>
            <Field label="Approved pricing guidelines">
              <textarea
                rows={4}
                value={s.pricing}
                onChange={(e) => change("pricing", e.target.value)}
              />
            </Field>
            <p className="crm-muted">
              Languages: English, Albanian, Macedonian, German. Prices,
              proposals, discounts and delivery promises require owner approval.
            </p>
          </section>
        )}
        {tab === "automation" && (
          <section className="crm-card crm-settings-card">
            <div className="crm-section-intro">
              <span className="crm-section-icon">
                <Zap size={22} />
              </span>
              <div>
                <h2>Set your own pace</h2>
                <p>Jobs run on Convex, even when your devices are off.</p>
              </div>
            </div>
            <Toggle
              title="Global outbound pause"
              body="Prevents queued messages from being claimed for delivery."
              value={s.paused}
              onChange={(v) => change("paused", v)}
            />
            <Toggle
              title="Automatically queue saved, approved messages"
              body="Explicitly enable this to send eligible drafts you have already approved. Every send still rechecks channel, suppression, permission, hours and pause."
              value={s.autoSendApproved ?? false}
              onChange={(v) => change("autoSendApproved", v)}
            />
            <Toggle
              title="Scheduled discovery"
              body="Search your markets once a day at the chosen hour."
              value={s.autoDiscovery}
              onChange={(v) => change("autoDiscovery", v)}
            />
            <Toggle
              title="Automatically research new leads"
              body="Subject to daily volume and atomic spending reservations."
              value={s.autoResearch}
              onChange={(v) => change("autoResearch", v)}
            />
            <Toggle
              title="Automatically prepare qualified drafts"
              body="Drafts remain in owner approval mode."
              value={s.autoDraft}
              onChange={(v) => change("autoDraft", v)}
            />
            <Toggle
              title="Prepare eligible follow-up drafts"
              body="Eligible conversations use their permitted channel. Review and approval remain required."
              value={s.autoEligibleFollowups}
              onChange={(v) => change("autoEligibleFollowups", v)}
            />
            <div className="crm-form-grid">
              <Field label="Daily AI job volume">
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={s.dailyVolume}
                  onChange={(e) =>
                    change("dailyVolume", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Discovery hour (0–23)">
                <Input
                  type="number"
                  min={0}
                  max={23}
                  value={s.discoveryHour}
                  onChange={(e) =>
                    change("discoveryHour", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Follow-up after (days)">
                <Input
                  type="number"
                  min={1}
                  value={s.followupDays}
                  onChange={(e) =>
                    change("followupDays", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Maximum follow-up attempts">
                <Input
                  type="number"
                  min={0}
                  max={5}
                  value={s.maxFollowups}
                  onChange={(e) =>
                    change("maxFollowups", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Sending start hour">
                <Input
                  type="number"
                  min={0}
                  max={23}
                  value={s.sendStart}
                  onChange={(e) => change("sendStart", Number(e.target.value))}
                />
              </Field>
              <Field label="Sending end hour">
                <Input
                  type="number"
                  min={1}
                  max={24}
                  value={s.sendEnd}
                  onChange={(e) => change("sendEnd", Number(e.target.value))}
                />
              </Field>
              <Field label="Timezone">
                <Input
                  value={s.timezone}
                  onChange={(e) => change("timezone", e.target.value)}
                />
              </Field>
            </div>
          </section>
        )}
        {tab === "integrations" && (
          <section className="crm-card crm-settings-card">
            <div className="crm-section-intro">
              <span className="crm-section-icon">
                <Globe size={22} />
              </span>
              <div>
                <h2>A few good connections</h2>
                <p>Credentials stay in server environment variables.</p>
              </div>
            </div>
            {[
              {
                key: "openai",
                title: "OpenAI Responses + web search",
                body: "OPENAI_API_KEY · OPENAI_ORG_ID · optional OPENAI_PROJECT_ID. Research, discovery and drafting, with tool costs accounted for.",
              },
              {
                key: "resend",
                title: "Resend",
                body: "RESEND_API_KEY · RESEND_WEBHOOK_SECRET. Requested and opted-in email only. Cold outreach is blocked.",
              },
              {
                key: "zoho",
                title: "Zoho Mail",
                body: "ZOHO_CLIENT_ID · ZOHO_CLIENT_SECRET · ZOHO_REFRESH_TOKEN · ZOHO_ACCOUNT_ID · ZOHO_REGION. Read-only inbox synchronization. MX records remain unchanged.",
              },
              {
                key: "prospecting",
                title: "Prospecting channel",
                body: "No provider selected. Configure a provider gateway with PROSPECTING_API_URL and PROSPECTING_API_KEY, and document the recipient’s eligibility.",
              },
              {
                key: "push",
                title: "Web Push",
                body: "VAPID_PUBLIC_KEY · VAPID_PRIVATE_KEY. Enable permission on each device after installation.",
              },
            ].map((i) => (
              <div className="crm-integration" key={i.key}>
                <span className="crm-integration-icon">
                  {i.key === "zoho" ? (
                    <Mail size={20} />
                  ) : i.key === "push" ? (
                    <Bell size={20} />
                  ) : (
                    <Globe size={20} />
                  )}
                </span>
                <div>
                  <strong>{i.title}</strong>
                  <p>{i.body}</p>
                </div>
                <Badge
                  tone={
                    data.integrations[i.key as keyof Snapshot["integrations"]]
                      ? "green"
                      : "amber"
                  }
                >
                  {data.integrations[i.key as keyof Snapshot["integrations"]]
                    ? "Configured"
                    : "Disconnected"}
                </Badge>
              </div>
            ))}
            <Field label="Prospecting provider name">
              <Input
                value={s.prospectingProvider}
                placeholder="No provider selected"
                onChange={(e) => change("prospectingProvider", e.target.value)}
              />
            </Field>
            <Toggle
              title="Authorize the configured prospecting channel"
              body="This does not grant recipient permission or override provider restrictions. Eligibility and saved draft approval are still required."
              value={s.prospectingAuthorized}
              onChange={(v) => change("prospectingAuthorized", v)}
            />
            <div className="crm-form-actions">
              <Button
                type="button"
                className="crm-secondary"
                disabled={!data.integrations.zoho}
                onClick={() =>
                  void run(
                    () => sync({}),
                    "Zoho sync requested. Review integration health for its result.",
                  )
                }
              >
                <RefreshCw size={15} />
                Sync Zoho now
              </Button>
            </div>
            {integrationStatus?.map((i) => (
              <div key={i.key} className="crm-setting-fact">
                <strong>{i.key}</strong>
                <span>
                  {i.error ||
                    `Last success: ${i.lastSuccess ? new Date(i.lastSuccess).toLocaleString() : "Not yet connected"}`}
                </span>
              </div>
            ))}
            <div className="crm-info">
              <ShieldCheck size={17} />
              <p>
                Setup instructions: docs/CRM_SETUP.md. API keys and OAuth tokens
                are never entered in this interface or sent to the browser.
              </p>
            </div>
          </section>
        )}
        {tab === "notifications" && (
          <section className="crm-card crm-settings-card">
            <div className="crm-section-intro">
              <span className="crm-section-icon">
                <Bell size={22} />
              </span>
              <div>
                <h2>The right updates, at the right time</h2>
                <p>
                  Decisions, interested replies, workflow failures, and budget
                  limits.
                </p>
              </div>
            </div>
            <Toggle
              title="Web Push notifications"
              body="Private notification text, with a link back to the relevant record."
              value={s.notifyPush}
              onChange={(v) => change("notifyPush", v)}
            />
            <Toggle
              title="Owner email notifications"
              body="Permitted application email to mail@muizrexhepi.com through Resend."
              value={s.notifyEmail}
              onChange={(v) => change("notifyEmail", v)}
            />
            <Field label="Notification frequency">
              <select
                value={s.notificationMode}
                onChange={(e) =>
                  change(
                    "notificationMode",
                    e.target.value as "digest" | "individual",
                  )
                }
              >
                <option value="digest">Daily digest</option>
                <option value="individual">Individual updates</option>
              </select>
            </Field>
            <PushSetup run={run} />
            <div className="crm-info">
              <Bell size={17} />
              <p>
                On iPhone, add this CRM to your Home Screen first, then enable
                notifications from the installed app. Offline mode stores only
                the safe application shell.
              </p>
            </div>
          </section>
        )}
        <div className="crm-settings-save">
          <span>
            Your settings apply to future work and are rechecked before
            delivery.
          </span>
          <Button type="submit" className="crm-primary">
            <Check size={16} />
            Save settings
          </Button>
        </div>
      </form>
    </>
  );
}
function Toggle({
  title,
  body,
  value,
  onChange,
}: {
  title: string;
  body: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="crm-toggle-row">
      <span>
        <strong>{title}</strong>
        <small>{body}</small>
      </span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="crm-switch" />
    </label>
  );
}
function PushSetup({ run }: { run: Run }) {
  const subscribe = useMutation(api.notifications.subscribe),
    unsubscribe = useMutation(api.notifications.unsubscribe);
  return (
    <div className="crm-form-actions">
      <Button
        type="button"
        className="crm-secondary"
        onClick={() =>
          void run(async () => {
            if (!("serviceWorker" in navigator) || !("PushManager" in window))
              throw new Error(
                "Web Push is not supported here. On iPhone, open the installed Home Screen app.",
              );
            const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!key) throw new Error("Configure the public VAPID key first");
            const permission = await Notification.requestPermission();
            if (permission !== "granted")
              throw new Error("Notification permission was not granted");
            const registration = await navigator.serviceWorker.register(
              "/crm-sw.js",
              { scope: "/crm" },
            );
            await navigator.serviceWorker.ready;
            const bytes = Uint8Array.from(
              atob(key.replace(/-/g, "+").replace(/_/g, "/")),
              (c) => c.charCodeAt(0),
            );
            const existing = await registration.pushManager.getSubscription(),
              subscription =
                existing ??
                (await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: bytes,
                }));
            const data = subscription.toJSON();
            await subscribe({
              endpoint: subscription.endpoint,
              p256dh: data.keys!.p256dh,
              auth: data.keys!.auth,
            });
          }, "This device is subscribed. Save your notification preference to enable delivery.")
        }
      >
        <Bell size={16} />
        Enable on this device
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() =>
          void run(async () => {
            const registration =
                await navigator.serviceWorker.getRegistration("/crm"),
              sub = await registration?.pushManager.getSubscription();
            if (sub) {
              await unsubscribe({ endpoint: sub.endpoint });
              await sub.unsubscribe();
            }
          }, "Notifications disabled on this device")
        }
      >
        Disable on this device
      </Button>
    </div>
  );
}
function BusinessEditor({
  lead,
  onSave,
}: {
  lead: Doc<"leads">;
  onSave: (values: {
    name: string;
    website: string;
    location: string;
    industry: string;
    email: string;
    contactName: string;
    language: (typeof languages)[number];
    notes: string;
  }) => void;
}) {
  return (
    <form
      className="crm-business-edit"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget),
          get = (k: string) => String(f.get(k) ?? "");
        onSave({
          name: get("name"),
          website: get("website"),
          location: get("location"),
          industry: get("industry"),
          email: get("email"),
          contactName: get("contactName"),
          language: get("language") as (typeof languages)[number],
          notes: get("notes"),
        });
      }}
    >
      <div className="crm-form-grid">
        {[
          { key: "name", label: "Business name" },
          { key: "website", label: "Website" },
          { key: "location", label: "Location" },
          { key: "industry", label: "Industry" },
          { key: "email", label: "Primary business email" },
          { key: "contactName", label: "Contact name" },
        ].map((f) => (
          <Field key={f.key} label={f.label}>
            <Input
              name={f.key}
              defaultValue={
                lead[
                  f.key as
                    | "name"
                    | "website"
                    | "location"
                    | "industry"
                    | "email"
                    | "contactName"
                ]
              }
              required={f.key === "name"}
            />
          </Field>
        ))}
      </div>
      <input type="hidden" name="language" value={lead.language} />
      <input type="hidden" name="notes" value={lead.notes} />
      <Button type="submit" className="crm-primary">
        Save business details
      </Button>
      <div className="crm-info">
        <ShieldCheck size={17} />
        <p>
          Changing the recipient resets permission and saved approvals.
          Suppression is preserved.
        </p>
      </div>
    </form>
  );
}
function SendHistory({ run }: { run: Run }) {
  const rows = useQuery(api.outbound.sendHistory, {}),
    reconcile = useMutation(api.outbound.reconcile);
  const [selected, setSelected] = useState<Id<"sendIntents"> | null>(null);
  return (
    <section className="crm-card crm-usage-card">
      <div className="crm-card-heading">
        <div>
          <h2>Send intents & delivery</h2>
          <p>
            One durable intent per saved revision. Uncertain delivery requires
            provider evidence.
          </p>
        </div>
      </div>
      {rows?.length ? (
        <div className="crm-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Created</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Provider identifier</th>
                <th>Details</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{date(row.createdAt)}</td>
                  <td>{row.provider}</td>
                  <td>
                    <Badge
                      tone={
                        row.state === "sent"
                          ? "green"
                          : row.state === "uncertain"
                            ? "amber"
                            : "neutral"
                      }
                    >
                      {row.state}
                    </Badge>
                  </td>
                  <td>{row.providerId || "Pending / unknown"}</td>
                  <td className="crm-job-error">{row.error || "—"}</td>
                  <td>
                    {["uncertain", "sending"].includes(row.state) && (
                      <Button
                        className="crm-secondary"
                        onClick={() => setSelected(row.id)}
                      >
                        Reconcile
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="crm-muted crm-card-padding">
          No send intents. Approval, eligibility, channel configuration and
          pause controls apply before one is created.
        </p>
      )}
      {selected && (
        <Modal
          title="Reconcile provider delivery"
          subtitle="Check the provider’s actual delivery history before choosing an outcome."
          close={() => setSelected(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              void run(async () => {
                await reconcile({
                  id: selected,
                  outcome: String(f.get("outcome")) as "sent" | "not_sent",
                  providerId: String(f.get("providerId")),
                });
                setSelected(null);
              }, "Provider outcome recorded. Confirmed unsent drafts need fresh approval before retrying.");
            }}
          >
            <Field label="Verified provider result">
              <select name="outcome">
                <option value="sent">Provider confirmed sent</option>
                <option value="not_sent">Provider confirmed NOT sent</option>
              </select>
            </Field>
            <Field label="Provider message identifier (required if sent)">
              <Input name="providerId" />
            </Field>
            <Button className="crm-primary" type="submit">
              Record verified result
            </Button>
          </form>
        </Modal>
      )}
    </section>
  );
}
function UsageReconciliation({ jobs, run }: { jobs: Doc<"jobs">[]; run: Run }) {
  const reconcile = useMutation(api.jobs.reconcileUsage);
  const [selected, setSelected] = useState<Id<"jobs"> | null>(null);
  if (!jobs.length) return null;
  return (
    <section className="crm-card crm-usage-card">
      <div className="crm-card-heading">
        <div>
          <h2>Uncertain AI charges</h2>
          <p>
            Reservations remain held until verified provider usage is recorded.
          </p>
        </div>
      </div>
      {jobs.map((job) => (
        <div className="crm-table-toolbar" key={job._id}>
          <span>
            {job.kind} · {date(job.createdAt)} · ${job.reservation.toFixed(2)}{" "}
            reserved
          </span>
          <Button
            className="crm-secondary"
            onClick={() => setSelected(job._id)}
          >
            Reconcile usage
          </Button>
        </div>
      ))}
      {selected && (
        <Modal
          title="Reconcile AI provider usage"
          subtitle="Use OpenAI’s usage records or a confirmed no-charge result."
          close={() => setSelected(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              void run(async () => {
                await reconcile({
                  id: selected,
                  estimated: Number(f.get("estimated")),
                  responseId: String(f.get("responseId")),
                  evidence: String(f.get("evidence")),
                });
                setSelected(null);
              }, "Usage reconciled. A fresh explicit retry is available.");
            }}
          >
            <Field label="Verified cost (USD, including search)">
              <Input
                name="estimated"
                type="number"
                step="0.0001"
                min={0}
                required
              />
            </Field>
            <Field label="Response or provider request identifier">
              <Input name="responseId" />
            </Field>
            <Field label="Reconciliation evidence">
              <textarea
                name="evidence"
                minLength={12}
                rows={3}
                required
                placeholder="Provider record, date, and confirmed charge / no-charge finding"
              />
            </Field>
            <Button type="submit" className="crm-primary">
              Record verified usage
            </Button>
          </form>
        </Modal>
      )}
    </section>
  );
}
