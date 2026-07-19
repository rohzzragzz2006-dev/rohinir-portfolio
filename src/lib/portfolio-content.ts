// Central content model & defaults for the portfolio.
// The admin dashboard edits the same shape; every visitor reads it from
// the portfolio_content JSONB row.

export type SkillItem = {
  id: string;
  name: string;
  area: string;
  desc: string;
  icon: string; // lucide icon key
  imagePath?: string | null; // object path in portfolio-images bucket
};

export type ProjectItem = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  tech: string[];
  workflow: string;
  results: string;
  github?: string;
  icon: string;
  imagePath?: string | null;
};

export type CertItem = {
  id: string;
  name: string;
  org: string;
  date: string;
  skills: string[];
  tech: string[];
  verifyUrl?: string;
  imagePath?: string | null;
};

export type ExperienceItem = {
  id: string;
  year: string;
  title: string;
  place: string;
  detail: string;
  icon: string;
};

export type InterestItem = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  imagePath?: string | null;
};

export type AchievementItem = {
  id: string;
  title: string;
  desc: string;
  icon: string;
};

export type EducationItem = {
  id: string;
  year: string;
  title: string;
  place: string;
  detail: string;
  cgpa: string;
};

export type PortfolioData = {
  hero: {
    firstName: string;
    fullName: string;
    tagline: string;
    speechBubble: string;
    voiceScript: string;
    avatarPath?: string | null;
  };
  about: {
    heading: string;
    paragraphs: string[];
    badges: string[];
    imagePath?: string | null;
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    credly: string;
  };
  resumeUrl: string;
  education: EducationItem[];
  skills: SkillItem[];
  certifications: CertItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  interests: InterestItem[];
  achievements: AchievementItem[];
};

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export const defaultPortfolio: PortfolioData = {
  hero: {
    firstName: "Rohini",
    fullName: "Rohini",
    tagline: "Biomedical Engineer · Portfolio",
    speechBubble:
      "Hello! I'm Rohini. Welcome to my portfolio. I'm passionate about Medical Devices, Regulatory Affairs, Clinical Investigation, Quality Systems and AI-powered healthcare. Scroll down to explore my journey.",
    voiceScript:
      "Hello! I'm Rohini. Welcome to my portfolio. I am a Biomedical Engineer passionate about Medical Devices, Regulatory Affairs, Clinical Investigation, Quality Systems, AI-powered Healthcare solutions, and continuous learning. Thank you for visiting my portfolio. Scroll down to explore my journey.",
    avatarPath: null,
  },
  about: {
    heading: "Engineering for safer healthcare",
    paragraphs: [
      "I'm a Biomedical Engineer with a strong interest in Medical Devices, Regulatory Affairs, Clinical Investigation, Quality Systems, Biomedical Instrumentation, and AI-assisted healthcare workflows.",
      "I enjoy learning new technologies, adapting quickly, solving problems and contributing to safer, smarter healthcare technologies. My goal is to help bring compliant, human-centered medical products from concept to patient care.",
    ],
    badges: [
      "Quick Learner",
      "Curious Mindset",
      "Adaptable",
      "Problem Solver",
      "Detail Oriented",
      "Team Player",
      "Continuous Learner",
      "AI Assisted Workflow",
    ],
    imagePath: null,
  },
  contact: {
    email: "rohini@example.com",
    phone: "+91 00000 00000",
    location: "Tamil Nadu, India",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    credly: "https://credly.com/",
  },
  resumeUrl: "",
  education: [
    { id: uid("edu"), year: "2022 — 2026", title: "B.E. Biomedical Engineering", place: "University College of Engineering", detail: "Focus on medical instrumentation, regulatory affairs, quality systems and AI in healthcare.", cgpa: "CGPA: 8.6 / 10" },
    { id: uid("edu"), year: "2020 — 2022", title: "Higher Secondary — Bio-Maths", place: "State Board", detail: "Foundation in biology, mathematics and computer science.", cgpa: "92%" },
    { id: uid("edu"), year: "2019 — 2020", title: "Secondary School", place: "State Board", detail: "Consistent academic excellence and leadership roles.", cgpa: "94%" },
  ],
  skills: [
    { id: uid("s"), name: "Medical Devices", area: "Devices", icon: "Stethoscope", desc: "Design, testing and lifecycle of safe medical equipment." },
    { id: uid("s"), name: "Regulatory Affairs", area: "Compliance", icon: "FileCheck2", desc: "ISO 13485, MDR, FDA pathways and technical files." },
    { id: uid("s"), name: "Clinical Investigation", area: "Research", icon: "Microscope", desc: "Study design, protocols, GCP and evidence generation." },
    { id: uid("s"), name: "Quality Assurance", area: "Quality", icon: "ShieldCheck", desc: "QMS, audits, CAPA and process assurance." },
    { id: uid("s"), name: "Quality Control", area: "Quality", icon: "ClipboardList", desc: "Inspection, sampling and release testing." },
    { id: uid("s"), name: "Biomedical Instrumentation", area: "Devices", icon: "Activity", desc: "ECG, EEG, imaging, sensors and signal chains." },
    { id: uid("s"), name: "Risk Management", area: "Compliance", icon: "ShieldCheck", desc: "ISO 14971 hazard analysis and risk-benefit." },
    { id: uid("s"), name: "Medical Device Documentation", area: "Compliance", icon: "FileText", desc: "DHF, DMR, technical files and SOPs." },
    { id: uid("s"), name: "Design Thinking", area: "Innovation", icon: "PenTool", desc: "Human-centered problem framing and prototyping." },
    { id: uid("s"), name: "Machine Learning in Healthcare", area: "AI", icon: "Brain", desc: "Clinical ML models, validation and deployment." },
    { id: uid("s"), name: "Python", area: "Programming", icon: "Code2", desc: "Data, ML pipelines and biomedical scripting." },
    { id: uid("s"), name: "HTML", area: "Web", icon: "Code2", desc: "Semantic structure for healthcare interfaces." },
    { id: uid("s"), name: "CSS", area: "Web", icon: "Palette", desc: "Accessible, responsive interface styling." },
    { id: uid("s"), name: "JavaScript", area: "Web", icon: "Code2", desc: "Interactive healthcare dashboards & tools." },
    { id: uid("s"), name: "Figma", area: "Design", icon: "Palette", desc: "Wireframes and healthcare product UI." },
    { id: uid("s"), name: "FlutterFlow", area: "Design", icon: "Boxes", desc: "Rapid clinical & wellness app prototypes." },
    { id: uid("s"), name: "Power BI", area: "Analytics", icon: "BarChart3", desc: "Healthcare KPI dashboards and reporting." },
    { id: uid("s"), name: "Microsoft Office", area: "Productivity", icon: "FileText", desc: "Documentation, analysis and presentations." },
    { id: uid("s"), name: "AI Tools", area: "AI", icon: "Bot", desc: "LLMs and copilots for engineering workflows." },
    { id: uid("s"), name: "Communication", area: "Soft Skills", icon: "MessageSquare", desc: "Clear technical and stakeholder communication." },
    { id: uid("s"), name: "Documentation", area: "Soft Skills", icon: "FileText", desc: "Structured, audit-ready technical writing." },
    { id: uid("s"), name: "Problem Solving", area: "Soft Skills", icon: "Puzzle", desc: "Root-cause analysis and creative solutions." },
    { id: uid("s"), name: "Teamwork", area: "Soft Skills", icon: "Users", desc: "Cross-functional collaboration." },
  ],
  certifications: [
    { id: uid("c"), name: "ISO 13485:2016 Internal Auditor", org: "TÜV / Accredited Body", date: "2025", skills: ["QMS", "Auditing", "CAPA"], tech: ["ISO 13485", "ISO 19011"] },
    { id: uid("c"), name: "Microsoft Azure AI Fundamentals (AI-900)", org: "Microsoft", date: "2024", skills: ["Azure AI", "ML Basics"], tech: ["Azure", "Cognitive Services"] },
    { id: uid("c"), name: "AWS Machine Learning Foundations", org: "AWS", date: "2024", skills: ["ML Lifecycle", "SageMaker"], tech: ["AWS", "Python"] },
    { id: uid("c"), name: "IBM Enterprise Design Thinking", org: "IBM", date: "2024", skills: ["Empathy Map", "Prototype"], tech: ["Design Thinking"] },
    { id: uid("c"), name: "Foundations of AI", org: "NPTEL / Online", date: "2023", skills: ["AI Concepts", "Ethics"], tech: ["AI", "ML"] },
    { id: uid("c"), name: "Medical Device Regulatory Basics", org: "Coursera", date: "2024", skills: ["MDR", "510(k)"], tech: ["FDA", "CE"] },
  ],
  projects: [
    { id: uid("p"), title: "Smart Wheelchair", problem: "Limited mobility independence for patients with motor impairments.", solution: "IoT-enabled wheelchair with obstacle detection, gesture and voice control.", tech: ["Arduino", "Sensors", "Python", "IoT"], workflow: "Requirement study → Prototype → Sensor integration → Field test", results: "Improved autonomous navigation & reduced caregiver dependency.", github: "", icon: "Accessibility" },
    { id: uid("p"), title: "Breast Cancer Detection (ML)", problem: "Early, accurate diagnosis from tabular clinical features.", solution: "Comparative ML models with explainability for clinical trust.", tech: ["Python", "scikit-learn", "Pandas"], workflow: "EDA → Feature engineering → Model comparison → Evaluation", results: "Achieved high accuracy with interpretable predictions.", github: "", icon: "ScanLine" },
    { id: uid("p"), title: "Smart Agriculture Monitoring", problem: "Farmers lack real-time crop & soil insights.", solution: "Sensor-based monitoring with dashboard analytics.", tech: ["IoT", "Node MCU", "Cloud"], workflow: "Sensor design → Data pipeline → Dashboard", results: "Actionable insights improving yield decisions.", github: "", icon: "Wheat" },
    { id: uid("p"), title: "Healthcare UI / UX", problem: "Complex clinical workflows overwhelm users.", solution: "Human-centered app designs for patient & clinician journeys.", tech: ["Figma", "FlutterFlow"], workflow: "Research → Wireframe → Prototype → Usability test", results: "Cleaner flows validated with user feedback.", github: "", icon: "Palette" },
  ],
  experience: [
    { id: uid("x"), year: "2025", title: "Medical Device Industry Internship", place: "MedTech Company", detail: "Exposure to QMS, DHF and production floor.", icon: "Briefcase" },
    { id: uid("x"), year: "2024", title: "Hospital Industrial Visit", place: "Multi-specialty Hospital", detail: "Observed biomedical equipment lifecycle & maintenance.", icon: "Building2" },
    { id: uid("x"), year: "2024", title: "Healthcare Hackathon", place: "State Level", detail: "Prototyped an AI-assisted triage concept.", icon: "Zap" },
    { id: uid("x"), year: "2024", title: "International Biomedical Conference", place: "Chennai", detail: "Presented poster on AI in healthcare.", icon: "Award" },
    { id: uid("x"), year: "2023", title: "Workshop on Medical Imaging", place: "IIT", detail: "Hands-on with MRI/CT reconstruction techniques.", icon: "Layers" },
  ],
  interests: [
    { id: uid("i"), name: "Medical Devices", desc: "Design, testing and lifecycle.", icon: "Stethoscope" },
    { id: uid("i"), name: "Regulatory Affairs", desc: "Global compliance & approvals.", icon: "FileCheck2" },
    { id: uid("i"), name: "Clinical Investigation", desc: "Evidence generation for safe devices.", icon: "Microscope" },
    { id: uid("i"), name: "Quality Assurance", desc: "QMS design & audits.", icon: "ShieldCheck" },
    { id: uid("i"), name: "Quality Control", desc: "Product release & inspection.", icon: "ClipboardList" },
    { id: uid("i"), name: "Research & Development", desc: "Innovating next-gen medical tech.", icon: "FlaskConical" },
    { id: uid("i"), name: "Application Specialist", desc: "Bridging engineering & clinical use.", icon: "Wrench" },
    { id: uid("i"), name: "Healthcare AI", desc: "ML/LLM applications in clinical workflows.", icon: "Brain" },
  ],
  achievements: [
    { id: uid("a"), title: "Best Poster Award", desc: "Biomedical Innovations Symposium 2024", icon: "Trophy" },
    { id: uid("a"), title: "Hackathon Finalist", desc: "State-level MedTech Hackathon 2024", icon: "Zap" },
    { id: uid("a"), title: "Class Coordinator", desc: "Led biomedical engineering student council", icon: "Users" },
    { id: uid("a"), title: "IEEE Student Member", desc: "Active EMBS chapter participant", icon: "Award" },
    { id: uid("a"), title: "Workshop Coordinator", desc: "Organized regulatory affairs workshop", icon: "Calendar" },
    { id: uid("a"), title: "Top 5% Academic Rank", desc: "Consistent university-level performance", icon: "BookOpen" },
  ],
};

/** Merges saved DB content over defaults so missing fields never crash the UI. */
export function mergePortfolio(partial: unknown): PortfolioData {
  const p = (partial ?? {}) as Partial<PortfolioData>;
  return {
    hero: { ...defaultPortfolio.hero, ...(p.hero ?? {}) },
    about: { ...defaultPortfolio.about, ...(p.about ?? {}) },
    contact: { ...defaultPortfolio.contact, ...(p.contact ?? {}) },
    resumeUrl: p.resumeUrl ?? defaultPortfolio.resumeUrl,
    education: p.education?.length ? p.education : defaultPortfolio.education,
    skills: p.skills?.length ? p.skills : defaultPortfolio.skills,
    certifications: p.certifications?.length ? p.certifications : defaultPortfolio.certifications,
    projects: p.projects?.length ? p.projects : defaultPortfolio.projects,
    experience: p.experience?.length ? p.experience : defaultPortfolio.experience,
    interests: p.interests?.length ? p.interests : defaultPortfolio.interests,
    achievements: p.achievements?.length ? p.achievements : defaultPortfolio.achievements,
  };
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
