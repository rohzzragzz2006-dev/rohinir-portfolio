import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import avatarImg from "@/assets/rohini-avatar.png";
import { Particles } from "@/components/portfolio/Particles";
import { IllustrationPlaceholder } from "@/components/portfolio/Placeholder";
import {
  Stethoscope, FileCheck2, Microscope, ShieldCheck, Brain, GraduationCap,
  Sparkles, ArrowDown, Volume2, ChevronDown, HeartPulse, ClipboardList,
  Cpu, Beaker, FlaskConical, Code2, Palette, Wrench, BarChart3, Users,
  MessageSquare, Puzzle, BookOpen, Zap, Award, ExternalLink, Github,
  Linkedin, Mail, Phone, MapPin, Download, Send, Trophy, Calendar,
  Briefcase, Building2, Layers, Activity, ScanLine, Wheat, Accessibility,
  Bot, FileText, PenTool, Boxes,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

// ---------- Data ----------
const badges = [
  "Quick Learner", "Curious Mindset", "Adaptable", "Problem Solver",
  "Detail Oriented", "Team Player", "Continuous Learner", "AI Assisted Workflow",
];

const education = [
  {
    year: "2022 — 2026",
    title: "B.E. Biomedical Engineering",
    place: "University College of Engineering",
    detail: "Focus on medical instrumentation, regulatory affairs, quality systems and AI in healthcare.",
    cgpa: "CGPA: 8.6 / 10",
  },
  {
    year: "2020 — 2022",
    title: "Higher Secondary — Bio-Maths",
    place: "State Board",
    detail: "Foundation in biology, mathematics and computer science.",
    cgpa: "92%",
  },
  {
    year: "2019 — 2020",
    title: "Secondary School",
    place: "State Board",
    detail: "Consistent academic excellence and leadership roles.",
    cgpa: "94%",
  },
];

const skills = [
  { name: "Medical Devices", icon: Stethoscope, area: "Devices", desc: "Design, testing and lifecycle of safe medical equipment.", placeholder: "Biomedical equipment illustration" },
  { name: "Regulatory Affairs", icon: FileCheck2, area: "Compliance", desc: "ISO 13485, MDR, FDA pathways and technical files.", placeholder: "Documentation, standards & approvals" },
  { name: "Clinical Investigation", icon: Microscope, area: "Research", desc: "Study design, protocols, GCP and evidence generation.", placeholder: "Clinical research workflow" },
  { name: "Quality Assurance", icon: ShieldCheck, area: "Quality", desc: "QMS, audits, CAPA and process assurance.", placeholder: "Audit checklist & QMS process" },
  { name: "Quality Control", icon: ClipboardList, area: "Quality", desc: "Inspection, sampling and release testing.", placeholder: "QC inspection & lab testing" },
  { name: "Biomedical Instrumentation", icon: Activity, area: "Devices", desc: "ECG, EEG, imaging, sensors and signal chains.", placeholder: "Bio-signal instrumentation" },
  { name: "Risk Management", icon: ShieldCheck, area: "Compliance", desc: "ISO 14971 hazard analysis and risk-benefit.", placeholder: "Risk matrix & FMEA" },
  { name: "Medical Device Documentation", icon: FileText, area: "Compliance", desc: "DHF, DMR, technical files and SOPs.", placeholder: "Technical file documentation" },
  { name: "Design Thinking", icon: PenTool, area: "Innovation", desc: "Human-centered problem framing and prototyping.", placeholder: "Design thinking canvas" },
  { name: "Machine Learning in Healthcare", icon: Brain, area: "AI", desc: "Clinical ML models, validation and deployment.", placeholder: "ML in healthcare visualization" },
  { name: "Python", icon: Code2, area: "Programming", desc: "Data, ML pipelines and biomedical scripting.", placeholder: "Python code visualization" },
  { name: "HTML", icon: Code2, area: "Web", desc: "Semantic structure for healthcare interfaces.", placeholder: "HTML markup illustration" },
  { name: "CSS", icon: Palette, area: "Web", desc: "Accessible, responsive interface styling.", placeholder: "CSS design system" },
  { name: "JavaScript", icon: Code2, area: "Web", desc: "Interactive healthcare dashboards & tools.", placeholder: "JS interactivity" },
  { name: "Figma", icon: Palette, area: "Design", desc: "Wireframes and healthcare product UI.", placeholder: "Figma UI mockup" },
  { name: "FlutterFlow", icon: Boxes, area: "Design", desc: "Rapid clinical & wellness app prototypes.", placeholder: "App prototype screens" },
  { name: "Power BI", icon: BarChart3, area: "Analytics", desc: "Healthcare KPI dashboards and reporting.", placeholder: "Analytics dashboard" },
  { name: "Microsoft Office", icon: FileText, area: "Productivity", desc: "Documentation, analysis and presentations.", placeholder: "Office productivity" },
  { name: "AI Tools", icon: Bot, area: "AI", desc: "LLMs and copilots for engineering workflows.", placeholder: "AI assistant workflow" },
  { name: "Communication", icon: MessageSquare, area: "Soft Skills", desc: "Clear technical and stakeholder communication.", placeholder: "Team communication" },
  { name: "Documentation", icon: FileText, area: "Soft Skills", desc: "Structured, audit-ready technical writing.", placeholder: "Structured documentation" },
  { name: "Problem Solving", icon: Puzzle, area: "Soft Skills", desc: "Root-cause analysis and creative solutions.", placeholder: "Problem solving process" },
  { name: "Teamwork", icon: Users, area: "Soft Skills", desc: "Cross-functional collaboration.", placeholder: "Collaborative teamwork" },
];

const certifications = [
  { name: "ISO 13485:2016 Internal Auditor", org: "TÜV / Accredited Body", date: "2025", skills: ["QMS", "Auditing", "CAPA"], tech: ["ISO 13485", "ISO 19011"] },
  { name: "Microsoft Azure AI Fundamentals (AI-900)", org: "Microsoft", date: "2024", skills: ["Azure AI", "ML Basics"], tech: ["Azure", "Cognitive Services"] },
  { name: "AWS Machine Learning Foundations", org: "AWS", date: "2024", skills: ["ML Lifecycle", "SageMaker"], tech: ["AWS", "Python"] },
  { name: "IBM Enterprise Design Thinking", org: "IBM", date: "2024", skills: ["Empathy Map", "Prototype"], tech: ["Design Thinking"] },
  { name: "Foundations of AI", org: "NPTEL / Online", date: "2023", skills: ["AI Concepts", "Ethics"], tech: ["AI", "ML"] },
  { name: "Medical Device Regulatory Basics", org: "Coursera", date: "2024", skills: ["MDR", "510(k)"], tech: ["FDA", "CE"] },
];

const projects = [
  {
    title: "Smart Wheelchair",
    problem: "Limited mobility independence for patients with motor impairments.",
    solution: "IoT-enabled wheelchair with obstacle detection, gesture and voice control.",
    tech: ["Arduino", "Sensors", "Python", "IoT"],
    workflow: "Requirement study → Prototype → Sensor integration → Field test",
    results: "Improved autonomous navigation & reduced caregiver dependency.",
    icon: Accessibility,
  },
  {
    title: "Breast Cancer Detection (ML)",
    problem: "Early, accurate diagnosis from tabular clinical features.",
    solution: "Comparative ML models with explainability for clinical trust.",
    tech: ["Python", "scikit-learn", "Pandas"],
    workflow: "EDA → Feature engineering → Model comparison → Evaluation",
    results: "Achieved high accuracy with interpretable predictions.",
    icon: ScanLine,
  },
  {
    title: "Smart Agriculture Monitoring",
    problem: "Farmers lack real-time crop & soil insights.",
    solution: "Sensor-based monitoring with dashboard analytics.",
    tech: ["IoT", "Node MCU", "Cloud"],
    workflow: "Sensor design → Data pipeline → Dashboard",
    results: "Actionable insights improving yield decisions.",
    icon: Wheat,
  },
  {
    title: "Healthcare UI / UX",
    problem: "Complex clinical workflows overwhelm users.",
    solution: "Human-centered app designs for patient & clinician journeys.",
    tech: ["Figma", "FlutterFlow"],
    workflow: "Research → Wireframe → Prototype → Usability test",
    results: "Cleaner flows validated with user feedback.",
    icon: Palette,
  },
];

const experience = [
  { year: "2025", title: "Medical Device Industry Internship", place: "MedTech Company", detail: "Exposure to QMS, DHF and production floor.", icon: Briefcase },
  { year: "2024", title: "Hospital Industrial Visit", place: "Multi-specialty Hospital", detail: "Observed biomedical equipment lifecycle & maintenance.", icon: Building2 },
  { year: "2024", title: "Healthcare Hackathon", place: "State Level", detail: "Prototyped an AI-assisted triage concept.", icon: Zap },
  { year: "2024", title: "International Biomedical Conference", place: "Chennai", detail: "Presented poster on AI in healthcare.", icon: Award },
  { year: "2023", title: "Workshop on Medical Imaging", place: "IIT", detail: "Hands-on with MRI/CT reconstruction techniques.", icon: Layers },
];

const interests = [
  { name: "Medical Devices", icon: Stethoscope, desc: "Design, testing and lifecycle." },
  { name: "Regulatory Affairs", icon: FileCheck2, desc: "Global compliance & approvals." },
  { name: "Clinical Investigation", icon: Microscope, desc: "Evidence generation for safe devices." },
  { name: "Quality Assurance", icon: ShieldCheck, desc: "QMS design & audits." },
  { name: "Quality Control", icon: ClipboardList, desc: "Product release & inspection." },
  { name: "Research & Development", icon: FlaskConical, desc: "Innovating next-gen medical tech." },
  { name: "Application Specialist", icon: Wrench, desc: "Bridging engineering & clinical use." },
  { name: "Healthcare AI", icon: Brain, desc: "ML/LLM applications in clinical workflows." },
];

const achievements = [
  { title: "Best Poster Award", desc: "Biomedical Innovations Symposium 2024", icon: Trophy },
  { title: "Hackathon Finalist", desc: "State-level MedTech Hackathon 2024", icon: Zap },
  { title: "Class Coordinator", desc: "Led biomedical engineering student council", icon: Users },
  { title: "IEEE Student Member", desc: "Active EMBS chapter participant", icon: Award },
  { title: "Workshop Coordinator", desc: "Organized regulatory affairs workshop", icon: Calendar },
  { title: "Top 5% Academic Rank", desc: "Consistent university-level performance", icon: BookOpen },
];

// ---------- Sections ----------
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient">
      <Particles count={26} />
      <motion.div style={{ y, opacity }} className="container relative mx-auto grid gap-10 px-6 py-24 lg:grid-cols-2 lg:gap-6">
        {/* Left copy */}
        <div className="flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold text-[color:var(--color-violet-deep)]">
              <Sparkles className="size-3.5" /> Biomedical Engineer · Portfolio
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-5 text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            <span className="font-script text-3xl font-normal text-[color:var(--color-violet-deep)] sm:text-4xl">Hi, I'm</span>
            <br />
            <span className="text-gradient-violet">Rohini</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Biomedical Engineer passionate about <b className="text-foreground">Medical Devices</b>,{" "}
            <b className="text-foreground">Regulatory Affairs</b>,{" "}
            <b className="text-foreground">Clinical Investigation</b>,{" "}
            <b className="text-foreground">Quality Systems</b>, and{" "}
            <b className="text-foreground">AI-powered Healthcare</b>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="#about"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[color:var(--color-coral)] px-6 py-3 text-sm font-semibold text-white shadow-glow-coral transition hover:scale-[1.02]"
            >
              <span className="absolute inset-0 -translate-x-full bg-white/25 skew-x-12 transition-transform duration-700 group-hover:translate-x-full" />
              Explore My Journey <ArrowDown className="size-4" />
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-semibold text-[color:var(--color-violet-deep)] transition hover:scale-[1.02]"
            >
              <Volume2 className="size-4" /> Play Voice Introduction
            </button>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>Passionate</span><span>•</span><span>Curious</span><span>•</span><span>Dedicated</span>
          </div>
        </div>

        {/* Right avatar + speech bubble */}
        <div className="relative flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-[color:var(--color-violet)]/25" />
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-[color:var(--color-violet)]/25 via-[color:var(--color-coral)]/15 to-[color:var(--color-emerald-soft)]/20 blur-3xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <div className="relative size-[320px] overflow-hidden rounded-full glass-strong sm:size-[380px] lg:size-[440px]">
                <img
                  src={avatarImg}
                  alt="Rohini — Biomedical Engineer avatar (placeholder — replace with your own)"
                  width={1024}
                  height={1024}
                  className="size-full object-cover"
                />
              </div>
              {/* waving hand overlay */}
              <div className="absolute -top-3 -right-3 grid size-16 place-items-center rounded-full glass-strong shadow-glow-coral">
                <span className="animate-wave text-3xl">👋</span>
              </div>
            </motion.div>

            {/* Speech bubble */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="absolute -left-6 -top-6 max-w-[300px] rounded-3xl glass-strong p-5 shadow-glow-violet sm:-left-10 sm:-top-10"
            >
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-display font-semibold text-[color:var(--color-violet-deep)]">Hello! I'm Rohini.</span>{" "}
                Welcome to my portfolio. I'm passionate about Medical Devices, Regulatory Affairs, Clinical Investigation,
                Quality Systems and AI-powered healthcare. Scroll down to explore my journey.
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="About Me" title="Engineering for safer healthcare" />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <IllustrationPlaceholder icon={HeartPulse} label="Editable illustration — biomedical engineer at work" className="max-w-lg" />
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                I'm a <b className="text-foreground">Biomedical Engineer</b> with a strong interest in Medical Devices,
                Regulatory Affairs, Clinical Investigation, Quality Systems, Biomedical Instrumentation, and
                AI-assisted healthcare workflows.
              </p>
              <p>
                I enjoy learning new technologies, adapting quickly, solving problems and contributing to safer,
                smarter healthcare technologies. My goal is to help bring compliant, human-centered medical products
                from concept to patient care.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {badges.map((b, i) => (
                <motion.span
                  key={b}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-full glass px-3.5 py-1.5 text-xs font-semibold text-[color:var(--color-violet-deep)] shadow-sm"
                >
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

function Education() {
  return (
    <section id="education" className="relative py-24 bg-section-soft sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Education" title="Academic Journey" sub="Building strong foundations in biomedical engineering." />
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[color:var(--color-violet)]/60 via-[color:var(--color-coral)]/60 to-transparent sm:left-1/2" />
          {education.map((e, i) => (
            <FadeIn key={e.title} delay={i * 0.05}>
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

function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Skills" title="Professional Skills" sub="A blend of biomedical, regulatory, quality and technology capabilities." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <FadeIn key={s.name} delay={(i % 6) * 0.05}>
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl glass p-5 transition hover:-translate-y-1 hover:shadow-glow-violet">
                <div className="mb-4">
                  <IllustrationPlaceholder icon={s.icon} label={s.placeholder} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-[color:var(--color-violet)]/10">
                    <s.icon className="size-5 text-[color:var(--color-violet-deep)]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold leading-tight">{s.name}</h3>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--color-coral-deep)]">{s.area}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications" className="relative py-24 bg-section-soft sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Certifications" title="Credentials & Learning" sub="Continuously growing across medical devices, quality and AI." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <FadeIn key={c.name} delay={(i % 3) * 0.08}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl glass-strong transition hover:-translate-y-1">
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[color:var(--color-violet)]/15 via-white to-[color:var(--color-coral)]/15">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid size-16 place-items-center rounded-2xl bg-white shadow-glow-violet">
                      <Award className="size-8 text-[color:var(--color-violet-deep)]" />
                    </div>
                  </div>
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-violet-deep)]">
                    Editable Preview
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-semibold leading-snug">{c.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.org} · {c.date}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.skills.map((s) => (
                      <span key={s} className="rounded-full bg-[color:var(--color-violet)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--color-violet-deep)]">{s}</span>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.tech.map((t) => (
                      <span key={t} className="rounded-full bg-[color:var(--color-emerald-soft)]/25 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80">{t}</span>
                    ))}
                  </div>
                  <button type="button" className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-violet)]/30 bg-white/60 px-4 py-2 text-xs font-semibold text-[color:var(--color-violet-deep)] transition hover:bg-white">
                    Verify Certificate <ExternalLink className="size-3.5" />
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Projects" title="Case Studies" sub="Selected work spanning medical devices, ML and healthcare UX." />
        <div className="grid gap-8 lg:grid-cols-2">
          {projects.map((p, i) => (
            <FadeIn key={p.title} delay={(i % 2) * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl glass-strong transition hover:-translate-y-1">
                <div className="p-5">
                  <IllustrationPlaceholder icon={p.icon} label={`${p.title} — editable image gallery placeholder`} />
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
                    {p.tech.map((t) => (
                      <span key={t} className="rounded-full bg-[color:var(--color-violet)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--color-violet-deep)]">{t}</span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href="#" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:opacity-90">
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

function Experience() {
  return (
    <section id="experience" className="relative py-24 bg-section-soft sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Experience" title="Internships & Learning" sub="Industrial exposure, workshops, hackathons and conferences." />
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[color:var(--color-violet)]/60 to-transparent" />
          {experience.map((e, i) => (
            <FadeIn key={e.title} delay={i * 0.05}>
              <div className="relative mb-8 flex gap-6 pl-14">
                <span className="absolute left-4 top-1 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-white shadow-glow-violet">
                  <e.icon className="size-4 text-[color:var(--color-violet-deep)]" />
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
          ))}
        </div>
      </div>
    </section>
  );
}

function Interests() {
  return (
    <section id="interests" className="relative py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Career Interests" title="Where I want to contribute" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {interests.map((it, i) => (
            <FadeIn key={it.name} delay={(i % 4) * 0.05}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl glass p-5 transition hover:-translate-y-1 hover:shadow-glow-violet">
                <IllustrationPlaceholder icon={it.icon} label={`${it.name} — editable illustration`} />
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

function Achievements() {
  return (
    <section id="achievements" className="relative py-24 bg-section-soft sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Achievements" title="Recognitions & Leadership" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <FadeIn key={a.title} delay={(i % 3) * 0.05}>
              <div className="flex h-full items-start gap-4 rounded-3xl glass-strong p-6 transition hover:-translate-y-1">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-violet)] to-[color:var(--color-coral)] text-white shadow-glow-violet">
                  <a.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Resume() {
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
              <a href="#" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-coral)] px-6 py-3 text-sm font-semibold text-white shadow-glow-coral transition hover:scale-[1.02]">
                <Download className="size-4" /> Download Resume
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-full bg-white/80 px-6 py-3 text-sm font-semibold text-[color:var(--color-violet-deep)] transition hover:bg-white">
                <FileText className="size-4" /> Preview PDF
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative py-24 bg-section-soft sm:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Contact" title="Let's build safer healthcare" sub="Open to internships, entry-level roles and collaborations." />
        <div className="grid gap-8 lg:grid-cols-2">
          <FadeIn>
            <div className="grid gap-4">
              {[
                { icon: Mail, label: "Email", value: "rohini@example.com", href: "mailto:rohini@example.com" },
                { icon: Phone, label: "Phone", value: "+91 00000 00000", href: "tel:+910000000000" },
                { icon: MapPin, label: "Location", value: "Tamil Nadu, India", href: "#" },
                { icon: Linkedin, label: "LinkedIn", value: "/in/rohini", href: "#" },
                { icon: Github, label: "GitHub", value: "@rohini", href: "#" },
                { icon: Award, label: "Credly", value: "credly.com/users/rohini", href: "#" },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="group flex items-center gap-4 rounded-2xl glass p-4 transition hover:-translate-y-0.5 hover:shadow-glow-violet"
                >
                  <div className="grid size-11 place-items-center rounded-xl bg-[color:var(--color-violet)]/10 transition group-hover:scale-110 group-hover:bg-[color:var(--color-violet)]/20">
                    <c.icon className="size-5 text-[color:var(--color-violet-deep)]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{c.label}</p>
                    <p className="text-sm font-semibold">{c.value}</p>
                  </div>
                </a>
              ))}
              <a href="#" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-coral)] px-5 py-3 text-sm font-semibold text-white shadow-glow-coral transition hover:scale-[1.02]">
                <Download className="size-4" /> Download Resume
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="rounded-3xl glass-strong p-6 sm:p-8"
            >
              <div className="grid gap-4">
                <label className="text-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Name</span>
                  <input required className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--color-violet)] focus:ring-2 focus:ring-[color:var(--color-violet)]/25" placeholder="Your name" />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</span>
                  <input required type="email" className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--color-violet)] focus:ring-2 focus:ring-[color:var(--color-violet)]/25" placeholder="you@company.com" />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</span>
                  <textarea required rows={5} className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--color-violet)] focus:ring-2 focus:ring-[color:var(--color-violet)]/25" placeholder="How can I help?" />
                </label>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-violet)] px-5 py-3 text-sm font-semibold text-white shadow-glow-violet transition hover:scale-[1.02]">
                  <Send className="size-4" /> {sent ? "Message Sent" : "Send Message"}
                </button>
                {sent ? (
                  <p className="text-center text-xs text-[color:var(--color-emerald-soft)]">Thanks! I'll get back soon.</p>
                ) : null}
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Nav() {
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
        <a href="#contact" className="hidden rounded-full bg-[color:var(--color-coral)] px-4 py-1.5 text-xs font-semibold text-white shadow-glow-coral sm:inline-flex">
          Hire Me
        </a>
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
  return (
    <div id="top" className="relative overflow-x-hidden">
      <Nav />
      <Hero />
      <About />
      <Education />
      <Skills />
      <Certifications />
      <Projects />
      <Experience />
      <Interests />
      <Achievements />
      <Resume />
      <Contact />
      <Footer />
    </div>
  );
}
