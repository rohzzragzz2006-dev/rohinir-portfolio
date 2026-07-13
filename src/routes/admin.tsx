import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchPortfolio,
  savePortfolio,
  useAdmin,
} from "@/lib/portfolio-client";
import { defaultPortfolio, newId, type PortfolioData } from "@/lib/portfolio-content";
import { ICON_NAMES } from "@/lib/icons";
import {
  Save, LogOut, Plus, Trash2, Loader2, ArrowLeft, RotateCcw,
  ChevronDown, ChevronUp,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin Dashboard · Rohini" }] }),
});

type ListKey = "skills" | "certifications" | "projects" | "experience" | "interests" | "achievements" | "education";

function AdminPage() {
  const { isAdmin, loading, userId } = useAdmin();
  const navigate = useNavigate();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!userId) navigate({ to: "/auth", search: { next: "/admin" } as never });
  }, [loading, userId, navigate]);

  useEffect(() => {
    fetchPortfolio().then(setData);
  }, []);

  if (loading || !data) {
    return <div className="grid min-h-screen place-items-center bg-hero-gradient"><Loader2 className="size-6 animate-spin" /></div>;
  }
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-hero-gradient p-6 text-center">
        <div className="max-w-md rounded-3xl glass-strong p-8">
          <h1 className="text-xl font-bold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">This account is signed in but doesn't have admin access. Only the portfolio owner can edit.</p>
          <div className="mt-6 flex justify-center gap-2">
            <button onClick={() => supabase.auth.signOut()} className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">Sign out</button>
            <Link to="/" className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--color-violet-deep)]">Back to site</Link>
          </div>
        </div>
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    try {
      await savePortfolio(data);
      toast.success("Saved!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const patch = (fn: (d: PortfolioData) => PortfolioData) => setData((d) => (d ? fn(d) : d));

  return (
    <div className="min-h-screen bg-section-soft pb-24">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/90 backdrop-blur-xl">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[color:var(--color-violet-deep)]">
              <ArrowLeft className="size-3.5" /> View site
            </Link>
            <h1 className="font-display text-lg font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { if (confirm("Reset all content to defaults? Your saved data will be replaced.")) setData(defaultPortfolio); }} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <RotateCcw className="size-3.5" /> Reset
            </button>
            <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/" }))} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[color:var(--color-violet-deep)]">
              <LogOut className="size-3.5" /> Sign out
            </button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-violet)] px-4 py-2 text-xs font-semibold text-white shadow-glow-violet disabled:opacity-60">
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />} Save all
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto grid gap-6 px-6 py-8">
        <p className="text-sm text-muted-foreground">
          Edit any field below and hit <b>Save all</b>. Uploading images (avatar, skills, certificates, projects, interests) is done directly on the main page — sign in as admin and click any image slot.
        </p>

        <Panel title="Hero & Voice Introduction">
          <TextField label="First name" value={data.hero.firstName} onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, firstName: v } }))} />
          <TextField label="Tagline" value={data.hero.tagline} onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, tagline: v } }))} />
          <TextArea label="Speech bubble (visible on hero)" value={data.hero.speechBubble} onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, speechBubble: v } }))} />
          <TextArea label="Voice introduction script (used for Play Voice)" value={data.hero.voiceScript} onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, voiceScript: v } }))} />
        </Panel>

        <Panel title="About">
          <TextField label="Heading" value={data.about.heading} onChange={(v) => patch((d) => ({ ...d, about: { ...d.about, heading: v } }))} />
          {data.about.paragraphs.map((p, i) => (
            <TextArea key={i} label={`Paragraph ${i + 1}`} value={p} onChange={(v) => patch((d) => ({ ...d, about: { ...d.about, paragraphs: d.about.paragraphs.map((x, ix) => ix === i ? v : x) } }))} />
          ))}
          <div className="flex gap-2">
            <button onClick={() => patch((d) => ({ ...d, about: { ...d.about, paragraphs: [...d.about.paragraphs, "New paragraph"] } }))} className="btn-ghost"><Plus className="size-3.5" /> Add paragraph</button>
            {data.about.paragraphs.length > 1 && (
              <button onClick={() => patch((d) => ({ ...d, about: { ...d.about, paragraphs: d.about.paragraphs.slice(0, -1) } }))} className="btn-ghost"><Trash2 className="size-3.5" /> Remove last</button>
            )}
          </div>
          <TagsField label="Badges" values={data.about.badges} onChange={(v) => patch((d) => ({ ...d, about: { ...d.about, badges: v } }))} />
        </Panel>

        <Panel title="Contact & Links">
          <TextField label="Email" value={data.contact.email} onChange={(v) => patch((d) => ({ ...d, contact: { ...d.contact, email: v } }))} />
          <TextField label="Phone" value={data.contact.phone} onChange={(v) => patch((d) => ({ ...d, contact: { ...d.contact, phone: v } }))} />
          <TextField label="Location" value={data.contact.location} onChange={(v) => patch((d) => ({ ...d, contact: { ...d.contact, location: v } }))} />
          <TextField label="GitHub URL" value={data.contact.github} onChange={(v) => patch((d) => ({ ...d, contact: { ...d.contact, github: v } }))} placeholder="https://github.com/yourusername" />
          <TextField label="LinkedIn URL" value={data.contact.linkedin} onChange={(v) => patch((d) => ({ ...d, contact: { ...d.contact, linkedin: v } }))} />
          <TextField label="Credly URL" value={data.contact.credly} onChange={(v) => patch((d) => ({ ...d, contact: { ...d.contact, credly: v } }))} />
          <TextField label="Resume URL (Google Drive / PDF link)" value={data.resumeUrl} onChange={(v) => patch((d) => ({ ...d, resumeUrl: v }))} />
        </Panel>

        <ListPanel<PortfolioData["education"][number]>
          title="Education"
          items={data.education}
          onChange={(items) => patch((d) => ({ ...d, education: items }))}
          create={() => ({ id: newId("edu"), year: "2025", title: "New qualification", place: "Institution", detail: "Details", cgpa: "" })}
          fields={[
            { key: "year", label: "Year" },
            { key: "title", label: "Title" },
            { key: "place", label: "Institution" },
            { key: "cgpa", label: "CGPA / Grade" },
            { key: "detail", label: "Details", multiline: true },
          ]}
          summary={(it) => `${it.year} · ${it.title}`}
        />

        <ListPanel<PortfolioData["skills"][number]>
          title="Skills"
          items={data.skills}
          onChange={(items) => patch((d) => ({ ...d, skills: items }))}
          create={() => ({ id: newId("s"), name: "New skill", area: "Category", desc: "Short description", icon: "Sparkles", imagePath: null })}
          fields={[
            { key: "name", label: "Name" },
            { key: "area", label: "Category" },
            { key: "icon", label: "Icon", type: "icon" },
            { key: "desc", label: "Description", multiline: true },
          ]}
          summary={(it) => `${it.name} — ${it.area}`}
        />

        <ListPanel<PortfolioData["certifications"][number]>
          title="Certifications"
          items={data.certifications}
          onChange={(items) => patch((d) => ({ ...d, certifications: items }))}
          create={() => ({ id: newId("c"), name: "New certification", org: "Issuing body", date: "2025", skills: [], tech: [], verifyUrl: "", imagePath: null })}
          fields={[
            { key: "name", label: "Certification name" },
            { key: "org", label: "Issued by" },
            { key: "date", label: "Date" },
            { key: "verifyUrl", label: "Verification URL" },
            { key: "skills", label: "Skills", type: "tags" },
            { key: "tech", label: "Tech / Standards", type: "tags" },
          ]}
          summary={(it) => `${it.name} — ${it.org}`}
        />

        <ListPanel<PortfolioData["projects"][number]>
          title="Projects"
          items={data.projects}
          onChange={(items) => patch((d) => ({ ...d, projects: items }))}
          create={() => ({ id: newId("p"), title: "New project", problem: "", solution: "", tech: [], workflow: "", results: "", github: "", icon: "Sparkles", imagePath: null })}
          fields={[
            { key: "title", label: "Title" },
            { key: "icon", label: "Icon", type: "icon" },
            { key: "problem", label: "Problem", multiline: true },
            { key: "solution", label: "Solution", multiline: true },
            { key: "workflow", label: "Workflow" },
            { key: "results", label: "Results", multiline: true },
            { key: "tech", label: "Tech stack", type: "tags" },
            { key: "github", label: "GitHub URL" },
          ]}
          summary={(it) => it.title}
        />

        <ListPanel<PortfolioData["experience"][number]>
          title="Experience / Internships"
          items={data.experience}
          onChange={(items) => patch((d) => ({ ...d, experience: items }))}
          create={() => ({ id: newId("x"), year: "2025", title: "New role / internship", place: "Company / Institution", detail: "Details", icon: "Briefcase" })}
          fields={[
            { key: "year", label: "Year" },
            { key: "title", label: "Title" },
            { key: "place", label: "Place" },
            { key: "icon", label: "Icon", type: "icon" },
            { key: "detail", label: "Details", multiline: true },
          ]}
          summary={(it) => `${it.year} · ${it.title}`}
        />

        <ListPanel<PortfolioData["interests"][number]>
          title="Career Interests"
          items={data.interests}
          onChange={(items) => patch((d) => ({ ...d, interests: items }))}
          create={() => ({ id: newId("i"), name: "New interest", desc: "Short description", icon: "Sparkles", imagePath: null })}
          fields={[
            { key: "name", label: "Name" },
            { key: "icon", label: "Icon", type: "icon" },
            { key: "desc", label: "Description", multiline: true },
          ]}
          summary={(it) => it.name}
        />

        <ListPanel<PortfolioData["achievements"][number]>
          title="Achievements"
          items={data.achievements}
          onChange={(items) => patch((d) => ({ ...d, achievements: items }))}
          create={() => ({ id: newId("a"), title: "New achievement", desc: "Details", icon: "Trophy" })}
          fields={[
            { key: "title", label: "Title" },
            { key: "icon", label: "Icon", type: "icon" },
            { key: "desc", label: "Details", multiline: true },
          ]}
          summary={(it) => it.title}
        />
      </main>
    </div>
  );
}

// -------------- reusable panel primitives --------------
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-white">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-5 py-4 text-left">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
      {open ? <div className="grid gap-3 border-t border-border/70 p-5">{children}</div> : null}
    </section>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--color-violet)]" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--color-violet)]" />
    </label>
  );
}

function TagsField({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(values.join(", "));
  useEffect(() => { setText(values.join(", ")); }, [values]);
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label} (comma-separated)</span>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(text.split(",").map((s) => s.trim()).filter(Boolean))}
        className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--color-violet)]"
      />
    </label>
  );
}

function IconField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none">
        {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </label>
  );
}

type FieldDef<T> = { key: keyof T; label: string; multiline?: boolean; type?: "text" | "tags" | "icon" };

function ListPanel<T extends { id: string }>({ title, items, onChange, create, fields, summary }: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  fields: FieldDef<T>[];
  summary: (it: T) => string;
}) {
  return (
    <Panel title={`${title} (${items.length})`}>
      <div className="grid gap-3">
        {items.map((it, idx) => (
          <ItemCard key={it.id} title={summary(it)} onDelete={() => onChange(items.filter((_, i) => i !== idx))}>
            {fields.map((f) => {
              const raw = it[f.key];
              if (f.type === "tags") {
                return <TagsField key={String(f.key)} label={f.label} values={(raw as unknown as string[]) ?? []} onChange={(v) => onChange(items.map((x, i) => i === idx ? { ...x, [f.key]: v } : x))} />;
              }
              if (f.type === "icon") {
                return <IconField key={String(f.key)} label={f.label} value={(raw as unknown as string) ?? "Sparkles"} onChange={(v) => onChange(items.map((x, i) => i === idx ? { ...x, [f.key]: v } : x))} />;
              }
              if (f.multiline) {
                return <TextArea key={String(f.key)} label={f.label} value={(raw as unknown as string) ?? ""} onChange={(v) => onChange(items.map((x, i) => i === idx ? { ...x, [f.key]: v } : x))} />;
              }
              return <TextField key={String(f.key)} label={f.label} value={(raw as unknown as string) ?? ""} onChange={(v) => onChange(items.map((x, i) => i === idx ? { ...x, [f.key]: v } : x))} />;
            })}
          </ItemCard>
        ))}
        <button onClick={() => onChange([...items, create()])} className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--color-violet)]/40 bg-[color:var(--color-violet)]/5 px-4 py-3 text-sm font-semibold text-[color:var(--color-violet-deep)] hover:bg-[color:var(--color-violet)]/10">
          <Plus className="size-4" /> Add {title.replace(/\s\(.+\)$/, "").toLowerCase()}
        </button>
      </div>
    </Panel>
  );
}

function ItemCard({ title, onDelete, children }: { title: string; onDelete: () => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-section-soft">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <button onClick={() => setOpen(!open)} className="flex flex-1 items-center gap-2 text-left text-sm font-semibold">
          {open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          <span className="truncate">{title || "(untitled)"}</span>
        </button>
        <button onClick={onDelete} className="rounded-lg bg-white p-1.5 text-[color:var(--color-coral-deep)] hover:bg-red-50" aria-label="Delete"><Trash2 className="size-3.5" /></button>
      </div>
      {open ? <div className="grid gap-3 border-t border-border/70 bg-white p-4">{children}</div> : null}
    </div>
  );
}
