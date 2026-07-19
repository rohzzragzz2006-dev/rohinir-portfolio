import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import defaultAvatar from "@/assets/rohini-avatar.png";
import { Particles } from "@/components/portfolio/Particles";
import { getIcon } from "@/lib/icons";
import {
  usePortfolio,
  useAdmin,
  useImageUrls,
  uploadPortfolioImage,
  savePortfolio,
} from "@/lib/portfolio-client";
import type { PortfolioData } from "@/lib/portfolio-content";
import {
  ArrowDown, Volume2, ChevronDown, HeartPulse, GraduationCap, Award,
  ExternalLink, Github, Linkedin, Mail, Phone, MapPin, Download, Send,
  FileText, Pencil, Sparkles, ImagePlus, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

// ---------- Editable image slot ----------
function EditableImage({
  imagePath,
  fallbackIcon,
  label,
  onChange,
  aspect = "aspect-[4/3]",
  subdir,
}: {
  imagePath: string | null | undefined;
  fallbackIcon: string;
  label: string;
  onChange?: (newPath: string) => void;
  aspect?: string;
  subdir: string;
}) {
  const { isAdmin } = useAdmin();
  const urls = useImageUrls([imagePath]);
  const Icon = getIcon(fallbackIcon);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const url = imagePath ? urls[imagePath] : null;

  const handlePick = () => inputRef.current?.click();
  const handleFile = async (file: File | undefined) => {
    if (!file || !onChange) return;
    setUploading(true);
    try {
      const path = await uploadPortfolioImage(file, subdir);
      onChange(path);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`relative ${aspect} w-full overflow-hidden rounded-2xl border border-dashed border-violet/40 bg-gradient-to-br from-violet/5 via-white to-coral/5`}
      data-editable-placeholder="true"
    >
      {url ? (
        <img src={url} alt={label} loading="lazy" className="size-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,oklch(0.62_0.22_290/0.25)_1px,transparent_0)] [background-size:14px_14px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <div className="grid size-16 place-items-center rounded-2xl bg-white/80 shadow-glow-violet">
              <Icon className="size-8 text-[color:var(--color-violet-deep)]" strokeWidth={1.75} />
            </div>
            <p className="max-w-[80%] text-xs font-medium text-muted-foreground">{label}</p>
          </div>
        </>
      )}
      {isAdmin && onChange ? (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={handlePick}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition hover:bg-black/50 hover:opacity-100"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[color:var(--color-violet-deep)] shadow-glow-violet">
              {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
              {uploading ? "Uploading…" : url ? "Replace image" : "Upload image"}
            </span>
          </button>
        </>
      ) : null}
    </div>
  );
}

// ---------- Sections ----------
function Hero({ data, onAvatarChange }: { data: PortfolioData; onAvatarChange: (p: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const urls = useImageUrls([data.hero.avatarPath]);
  const avatarUrl = data.hero.avatarPath ? urls[data.hero.avatarPath] : null;

  const { isAdmin } = useAdmin();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playVoice = async () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
      return;
    }
    setPlaying(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.hero.voiceScript }),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "TTS failed"));
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);
      audio.onerror = () => setPlaying(false);
      await audio.play();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Voice unavailable");
      setPlaying(false);
    }
  };

  const handleAvatarFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadPortfolioImage(file, "hero");
      onAvatarChange(path);
      toast.success("Avatar updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient">
      <Particles count={26} />
      <motion.div style={{ y, opacity }} className="container relative mx-auto grid gap-10 px-6 py-24 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold text-[color:var(--color-violet-deep)]">
              <Sparkles className="size-3.5" /> {data.hero.tagline}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-5 text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            <span className="font-script text-3xl font-normal text-[color:var(--color-violet-deep)] sm:text-4xl">Hi, I'm</span>
            <br />
            <span className="text-gradient-violet">{data.hero.firstName}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {data.hero.speechBubble.replace(/^Hello!?\s*I'?m\s*\w+\.\s*/, "")}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#about" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[color:var(--color-coral)] px-6 py-3 text-sm font-semibold text-white shadow-glow-coral transition hover:scale-[1.02]">
              <span className="absolute inset-0 -translate-x-full bg-white/25 skew-x-12 transition-transform duration-700 group-hover:translate-x-full" />
              Explore My Journey <ArrowDown className="size-4" />
            </a>
            <button
              type="button"
              onClick={playVoice}
              className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-semibold text-[color:var(--color-violet-deep)] transition hover:scale-[1.02]"
            >
              {playing ? <Loader2 className="size-4 animate-spin" /> : <Volume2 className="size-4" />}
              {playing ? "Playing…" : "Play Voice Introduction"}
            </button>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>Passionate</span><span>•</span><span>Curious</span><span>•</span><span>Dedicated</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-[color:var(--color-violet)]/25" />
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-[color:var(--color-violet)]/25 via-[color:var(--color-coral)]/15 to-[color:var(--color-emerald-soft)]/20 blur-3xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="relative">
              <div className="relative size-[320px] overflow-hidden rounded-full glass-strong sm:size-[380px] lg:size-[440px]">
                <img src={avatarUrl ?? defaultAvatar} alt="Rohini avatar" width={1024} height={1024} className="size-full object-cover" />
                {isAdmin ? (
                  <>
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarFile(e.target.files?.[0])} />
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      disabled={uploading}
                      className="absolute inset-x-4 bottom-4 inline-flex items-center justify-center gap-2 rounded-full bg-white/95 py-2 text-xs font-semibold text-[color:var(--color-violet-deep)] shadow-glow-violet"
                    >
                      {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
                      {uploading ? "Uploading…" : "Change avatar"}
                    </button>
                  </>
                ) : null}
              </div>
              <div className="absolute -top-3 -right-3 grid size-16 place-items-center rounded-full glass-strong shadow-glow-coral">
                <span className="animate-wave text-3xl">👋</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.6 }} className="absolute -left-6 -top-6 max-w-[300px] rounded-3xl glass-strong p-5 shadow-glow-violet sm:-left-10 sm:-top-10">
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-display font-semibold text-[color:var(--color-violet-deep)]">Hello! I'm {data.hero.firstName}.</span>{" "}
                {data.hero.speechBubble.replace(/^Hello!?\s*I'?m\s*\w+\.\s*/, "")}
              </p>
              <span className="absolute -bottom-2 left-10 size-4 rotate-45 bg-white/85 backdrop-blur-xl" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <a href="#about" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground">
        <ChevronDown className="size-6 animate-bounce" />
      </a>
    </section>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-violet-deep)]">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
        <span className="text-gradient-violet">{title}</span>
      </h2>
      {sub ? <p className="mt-4 text-base leading-relaxed text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay }}>
      {children}
    </motion.div>
  );
}

function About({ data, onUpdate }: { data: PortfolioData; onUpdate: (next: PortfolioData) => void }) {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="About Me" title={data.about.heading} />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="max-w-lg">
              <EditableImage
                imagePath={data.about.imagePath}
                fallbackIcon="HeartPulse"
                label="Editable illustration — biomedical engineer at work"
                subdir="about"
                onChange={(path) => onUpdate({ ...data, about: { ...data.about, imagePath: path } })}
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              {data.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {data.about.badges.map((b, i) => (
                <motion.span key={b + i} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-full glass px-3.5 py-1.5 text-xs font-semibold text-[color:var(--color-violet-deep)] shadow-sm">
                  {b}
                </motion.span>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}


function Education({ data }: { data: PortfolioData }) {
  return (
    <section id="education" className="relative py-24 bg-section-soft sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Education" title="Academic Journey" sub="Building strong foundations in biomedical engineering." />
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[color:var(--color-violet)]/60 via-[color:var(--color-coral)]/60 to-transparent sm:left-1/2" />
          {data.education.map((e, i) => (
            <FadeIn key={e.id} delay={i * 0.05}>
              <div className={`relative mb-10 grid gap-4 sm:grid-cols-2 ${i % 2 ? "sm:[&>*:first-child]:order-2" : ""}`}>
                <div className={`sm:${i % 2 ? "pl-10" : "pr-10 text-right"} pl-10 sm:pl-0`}>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-violet-deep)]">{e.year}</span>
                  <h3 className="mt-1 text-xl font-semibold">{e.title}</h3>
                  <p className="text-sm text-muted-foreground">{e.place}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{e.detail}</p>
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-emerald-soft)]/25 px-3 py-1 text-xs font-semibold text-[color:var(--color-violet-deep)]">
                    <GraduationCap className="size-3.5" /> {e.cgpa}
                  </span>
                </div>
                <div className="hidden sm:block" />
                <span className="absolute left-4 top-1.5 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-white shadow-glow-violet sm:left-1/2">
                  <GraduationCap className="size-4 text-[color:var(--color-violet-deep)]" />
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills({ data, onUpdate }: { data: PortfolioData; onUpdate: (next: PortfolioData) => void }) {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Skills" title="Professional Skills" sub="A blend of biomedical, regulatory, quality and technology capabilities." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.skills.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <FadeIn key={s.id} delay={(i % 6) * 0.05}>
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl glass p-5 transition hover:-translate-y-1 hover:shadow-glow-violet">
                  <div className="mb-4">
                    <EditableImage
                      imagePath={s.imagePath}
                      fallbackIcon={s.icon}
                      label={`${s.name} — editable illustration`}
                      subdir="skills"
                      onChange={async (path) => {
                        const next = { ...data, skills: data.skills.map((x) => x.id === s.id ? { ...x, imagePath: path } : x) };
                        onUpdate(next);
                        await savePortfolio(next).catch((e) => toast.error(e.message));
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-[color:var(--color-violet)]/10">
                      <Icon className="size-5 text-[color:var(--color-violet-deep)]" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold leading-tight">{s.name}</h3>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--color-coral-deep)]">{s.area}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Certifications({ data, onUpdate }: { data: PortfolioData; onUpdate: (next: PortfolioData) => void }) {
  return (
    <section id="certifications" className="relative py-24 bg-section-soft sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Certifications" title="Credentials & Learning" sub="Continuously growing across medical devices, quality and AI." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.certifications.map((c, i) => (
            <FadeIn key={c.id} delay={(i % 3) * 0.08}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl glass-strong transition hover:-translate-y-1">
                <EditableImage
                  imagePath={c.imagePath}
                  fallbackIcon="Award"
                  label={`${c.name} — editable certificate preview`}
                  aspect="aspect-[16/9]"
                  subdir="certifications"
                  onChange={async (path) => {
                    const next = { ...data, certifications: data.certifications.map((x) => x.id === c.id ? { ...x, imagePath: path } : x) };
                    onUpdate(next);
                    await savePortfolio(next).catch((e) => toast.error(e.message));
                  }}
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-semibold leading-snug">{c.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.org} · {c.date}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.skills.map((s) => <span key={s} className="rounded-full bg-[color:var(--color-violet)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--color-violet-deep)]">{s}</span>)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.tech.map((t) => <span key={t} className="rounded-full bg-[color:var(--color-emerald-soft)]/25 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80">{t}</span>)}
                  </div>
                  <a
                    href={c.verifyUrl || "#"}
                    target={c.verifyUrl ? "_blank" : undefined}
                    rel={c.verifyUrl ? "noreferrer" : undefined}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-violet)]/30 bg-white/60 px-4 py-2 text-xs font-semibold text-[color:var(--color-violet-deep)] transition hover:bg-white"
                  >
                    Verify Certificate <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ data, onUpdate }: { data: PortfolioData; onUpdate: (next: PortfolioData) => void }) {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Projects" title="Case Studies" sub="Selected work spanning medical devices, ML and healthcare UX." />
        <div className="grid gap-8 lg:grid-cols-2">
          {data.projects.map((p, i) => (
            <FadeIn key={p.id} delay={(i % 2) * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl glass-strong transition hover:-translate-y-1">
                <div className="p-5">
                  <EditableImage
                    imagePath={p.imagePath}
                    fallbackIcon={p.icon}
                    label={`${p.title} — editable image gallery placeholder`}
                    subdir="projects"
                    onChange={async (path) => {
                      const next = { ...data, projects: data.projects.map((x) => x.id === p.id ? { ...x, imagePath: path } : x) };
                      onUpdate(next);
                      await savePortfolio(next).catch((e) => toast.error(e.message));
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 pt-0">
                  <h3 className="text-2xl font-bold">{p.title}</h3>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <p><b className="text-foreground">Problem: </b>{p.problem}</p>
                    <p><b className="text-foreground">Solution: </b>{p.solution}</p>
                    <p><b className="text-foreground">Workflow: </b>{p.workflow}</p>
                    <p><b className="text-foreground">Results: </b>{p.results}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => <span key={t} className="rounded-full bg-[color:var(--color-violet)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--color-violet-deep)]">{t}</span>)}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={p.github || data.contact.github || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:opacity-90"
                    >
                      <Github className="size-3.5" /> GitHub
                    </a>
                    <a href="#" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-coral)] px-4 py-2 text-xs font-semibold text-white shadow-glow-coral transition hover:scale-[1.02]">
                      Read Case Study <ArrowDown className="size-3.5 -rotate-90" />
                    </a>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience({ data }: { data: PortfolioData }) {
  return (
    <section id="experience" className="relative py-24 bg-section-soft sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Experience" title="Internships & Learning" sub="Industrial exposure, workshops, hackathons and conferences." />
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[color:var(--color-violet)]/60 to-transparent" />
          {data.experience.map((e, i) => {
            const Icon = getIcon(e.icon);
            return (
              <FadeIn key={e.id} delay={i * 0.05}>
                <div className="relative mb-8 flex gap-6 pl-14">
                  <span className="absolute left-4 top-1 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-white shadow-glow-violet">
                    <Icon className="size-4 text-[color:var(--color-violet-deep)]" />
                  </span>
                  <div className="flex-1 rounded-2xl glass p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-coral-deep)]">{e.year}</span>
                      <h3 className="text-lg font-semibold">{e.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{e.place}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{e.detail}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Interests({ data, onUpdate }: { data: PortfolioData; onUpdate: (next: PortfolioData) => void }) {
  return (
    <section id="interests" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Career Interests" title="Where I want to contribute" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.interests.map((it, i) => (
            <FadeIn key={it.id} delay={(i % 4) * 0.05}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl glass p-5 transition hover:-translate-y-1 hover:shadow-glow-violet">
                <EditableImage
                  imagePath={it.imagePath}
                  fallbackIcon={it.icon}
                  label={`${it.name} — editable illustration`}
                  subdir="interests"
                  onChange={async (path) => {
                    const next = { ...data, interests: data.interests.map((x) => x.id === it.id ? { ...x, imagePath: path } : x) };
                    onUpdate(next);
                    await savePortfolio(next).catch((e) => toast.error(e.message));
                  }}
                />
                <h3 className="mt-4 text-lg font-semibold">{it.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Achievements({ data }: { data: PortfolioData }) {
  return (
    <section id="achievements" className="relative py-24 bg-section-soft sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Achievements" title="Recognitions & Leadership" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.achievements.map((a, i) => {
            const Icon = getIcon(a.icon);
            return (
              <FadeIn key={a.id} delay={(i % 3) * 0.05}>
                <div className="flex h-full items-start gap-4 rounded-3xl glass-strong p-6 transition hover:-translate-y-1">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-violet)] to-[color:var(--color-coral)] text-white shadow-glow-violet">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Resume({ data }: { data: PortfolioData }) {
  return (
    <section id="resume" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] glass-strong p-10 text-center shadow-glow-violet sm:p-14">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-violet-deep)]">
              Resume
            </span>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              <span className="text-gradient-violet">Preview & Download</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Get the latest version of my resume — updated with certifications, projects and skills.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={data.resumeUrl || "#"} target={data.resumeUrl ? "_blank" : undefined} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-coral)] px-6 py-3 text-sm font-semibold text-white shadow-glow-coral transition hover:scale-[1.02]">
                <Download className="size-4" /> Download Resume
              </a>
              <a href={data.resumeUrl || "#"} target={data.resumeUrl ? "_blank" : undefined} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/80 px-6 py-3 text-sm font-semibold text-[color:var(--color-violet-deep)] transition hover:bg-white">
                <FileText className="size-4" /> Preview PDF
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Contact({ data }: { data: PortfolioData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const items = useMemo(() => ([
    { icon: Mail, label: "Email", value: data.contact.email, href: `mailto:${data.contact.email}` },
    { icon: Phone, label: "Phone", value: data.contact.phone, href: `tel:${data.contact.phone.replace(/\s+/g, "")}` },
    { icon: MapPin, label: "Location", value: data.contact.location, href: "#" },
    { icon: Linkedin, label: "LinkedIn", value: data.contact.linkedin, href: data.contact.linkedin || "#" },
    { icon: Github, label: "GitHub", value: data.contact.github, href: data.contact.github || "#" },
    { icon: Award, label: "Credly", value: data.contact.credly, href: data.contact.credly || "#" },
  ]), [data.contact]);

  const validate = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in name, email and message.");
      return false;
    }
    if (name.length > 100 || email.length > 255 || message.length > 1000) {
      toast.error("Please shorten your inputs.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const composeBody = () =>
    `Hi Rohini,\n\n${message.trim()}\n\n— ${name.trim()} (${email.trim()})`;

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = encodeURIComponent(`Portfolio message from ${name.trim()}`);
    const body = encodeURIComponent(composeBody());
    window.location.href = `mailto:${data.contact.email}?subject=${subject}&body=${body}`;
  };

  const sendWhatsApp = () => {
    if (!validate()) return;
    const phoneDigits = data.contact.phone.replace(/\D/g, "");
    if (!phoneDigits) {
      toast.error("WhatsApp number is not configured yet.");
      return;
    }
    const text = encodeURIComponent(composeBody());
    window.open(`https://wa.me/${phoneDigits}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contact" className="relative py-24 bg-section-soft sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Contact" title="Let's build safer healthcare" sub="Open to internships, entry-level roles and collaborations." />
        <div className="grid gap-8 lg:grid-cols-2">
          <FadeIn>
            <div className="grid gap-4">
              {items.map((c) => (
                <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                   className="group flex items-center gap-4 rounded-2xl glass p-4 transition hover:-translate-y-0.5 hover:shadow-glow-violet">
                  <div className="grid size-11 place-items-center rounded-xl bg-[color:var(--color-violet)]/10 transition group-hover:scale-110 group-hover:bg-[color:var(--color-violet)]/20">
                    <c.icon className="size-5 text-[color:var(--color-violet-deep)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{c.label}</p>
                    <p className="truncate text-sm font-semibold">{c.value}</p>
                  </div>
                </a>
              ))}
              {data.resumeUrl ? (
                <a href={data.resumeUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-coral)] px-5 py-3 text-sm font-semibold text-white shadow-glow-coral transition hover:scale-[1.02]">
                  <Download className="size-4" /> Download Resume
                </a>
              ) : null}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <form onSubmit={sendEmail} className="rounded-3xl glass-strong p-6 sm:p-8">
              <div className="grid gap-4">
                <label className="text-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Name</span>
                  <input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--color-violet)] focus:ring-2 focus:ring-[color:var(--color-violet)]/25" placeholder="Your name" />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</span>
                  <input required type="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--color-violet)] focus:ring-2 focus:ring-[color:var(--color-violet)]/25" placeholder="you@company.com" />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</span>
                  <textarea required maxLength={1000} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--color-violet)] focus:ring-2 focus:ring-[color:var(--color-violet)]/25" placeholder="How can I help?" />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-violet)] px-5 py-3 text-sm font-semibold text-white shadow-glow-violet transition hover:scale-[1.02]">
                    <Mail className="size-4" /> Send via Email
                  </button>
                  <button type="button" onClick={sendWhatsApp} className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-emerald-soft)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02]">
                    <Send className="size-4" /> Send via WhatsApp
                  </button>
                </div>
                <p className="text-center text-[11px] text-muted-foreground">Opens your mail app or WhatsApp with your message ready to send.</p>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}


function Nav({ isAdmin }: { isAdmin: boolean }) {
  const items = [
    ["About", "about"], ["Education", "education"], ["Skills", "skills"],
    ["Certifications", "certifications"], ["Projects", "projects"], ["Experience", "experience"],
    ["Interests", "interests"], ["Achievements", "achievements"], ["Contact", "contact"],
  ] as const;
  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto max-w-6xl px-4">
      <nav className="flex items-center justify-between rounded-full glass-strong px-4 py-2.5 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-violet)] to-[color:var(--color-coral)] text-white">
            <HeartPulse className="size-4" />
          </span>
          <span className="font-display text-sm font-bold">Rohini<span className="text-[color:var(--color-coral-deep)]">.</span></span>
        </a>
        <div className="hidden gap-1 lg:flex">
          {items.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-white/60 hover:text-[color:var(--color-violet-deep)]">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Link to="/admin" className="hidden items-center gap-1.5 rounded-full bg-[color:var(--color-violet)] px-3 py-1.5 text-xs font-semibold text-white shadow-glow-violet sm:inline-flex">
              <Pencil className="size-3.5" /> Edit
            </Link>
          ) : (
            <Link to="/auth" className="hidden rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[color:var(--color-violet-deep)] sm:inline-flex" search={{ next: "/admin" } as never}>
              Admin
            </Link>
          )}
          <a href="#contact" className="rounded-full bg-[color:var(--color-coral)] px-4 py-1.5 text-xs font-semibold text-white shadow-glow-coral">Hire Me</a>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Rohini · Biomedical Engineer. Crafted with care.</p>
        <p className="flex items-center gap-2">
          <HeartPulse className="size-3.5 text-[color:var(--color-coral)]" /> Safe Devices · Better Care · Stronger Impact
        </p>
      </div>
    </footer>
  );
}

function Portfolio() {
  const { data, setData } = usePortfolio();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (isAdmin) toast("You're signed in as admin — click any image to upload, or open Edit for the full dashboard.", { duration: 4000 });
  }, [isAdmin]);

  const onUpdate = async (next: PortfolioData) => {
    setData(next);
    try {
      await savePortfolio(next);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };
  const onAvatarChange = async (path: string) => {
    const next = { ...data, hero: { ...data.hero, avatarPath: path } };
    await onUpdate(next);
  };

  return (
    <div id="top" className="relative overflow-x-hidden">
      <Nav isAdmin={isAdmin} />
      <Hero data={data} onAvatarChange={onAvatarChange} />
      <About data={data} onUpdate={onUpdate} />
      <Education data={data} />
      <Skills data={data} onUpdate={onUpdate} />
      <Certifications data={data} onUpdate={onUpdate} />
      <Projects data={data} onUpdate={onUpdate} />
      <Experience data={data} />
      <Interests data={data} onUpdate={onUpdate} />
      <Achievements data={data} />
      <Resume data={data} />
      <Contact data={data} />
      <Footer />
    </div>
  );
}
