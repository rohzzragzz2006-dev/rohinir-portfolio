import {
  Stethoscope, FileCheck2, Microscope, ShieldCheck, Brain, HeartPulse,
  ClipboardList, FlaskConical, Wrench, Code2, Palette, Boxes, BarChart3,
  FileText, Bot, MessageSquare, Puzzle, Users, Activity, PenTool,
  Accessibility, ScanLine, Wheat, Briefcase, Building2, Zap, Award,
  Layers, Trophy, Calendar, BookOpen, GraduationCap, Sparkles,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Stethoscope, FileCheck2, Microscope, ShieldCheck, Brain, HeartPulse,
  ClipboardList, FlaskConical, Wrench, Code2, Palette, Boxes, BarChart3,
  FileText, Bot, MessageSquare, Puzzle, Users, Activity, PenTool,
  Accessibility, ScanLine, Wheat, Briefcase, Building2, Zap, Award,
  Layers, Trophy, Calendar, BookOpen, GraduationCap, Sparkles,
};

export const ICON_NAMES = Object.keys(map).sort();

export function getIcon(name: string): LucideIcon {
  return map[name] ?? Sparkles;
}
