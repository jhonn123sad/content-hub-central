// MOCK TEMPORÁRIO — substituir por dados reais quando integrar Lovable Cloud.
import type { ContentStatus } from "@/components/status-badge";

export type Project = {
  id: string;
  name: string;
  description: string;
  objective: string;
  niche: string;
  platform: string;
  status: "active" | "paused" | "archived";
  dailyGoal: number;
  driveLink: string;
  startDate: string;
};

export type Content = {
  id: string;
  title: string;
  description: string;
  copy: string;
  projectId: string;
  status: ContentStatus;
  format: string;
  platform: string;
  priority: "low" | "medium" | "high";
  plannedDate: string;
  publishedDate?: string;
  driveLink?: string;
  publishedLink?: string;
  imageUrl?: string;
  notes?: string;
};

export type Reference = {
  id: string;
  title: string;
  description: string;
  type: "video" | "post" | "artigo" | "imagem" | "outro";
  link: string;
  imageUrl?: string;
  projectId?: string;
  contentId?: string;
  tags: string[];
  notes?: string;
};

export type Creative = {
  id: string;
  title: string;
  type: "thumbnail" | "capa" | "story" | "reels" | "post" | "outro";
  status: "draft" | "review" | "approved" | "published";
  projectId?: string;
  contentId?: string;
  fileLink?: string;
  imageUrl?: string;
  description?: string;
  tags: string[];
};

export type Goal = {
  id: string;
  projectId: string;
  type: "diaria" | "semanal" | "mensal";
  target: number;
  period: string;
  startDate: string;
  endDate: string;
  status: "active" | "done" | "paused";
};

export const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Canal de Tecnologia",
    description: "Conteúdos sobre dev e IA",
    objective: "Crescer 10k inscritos",
    niche: "Tecnologia",
    platform: "YouTube",
    status: "active",
    dailyGoal: 2,
    driveLink: "https://drive.google.com/exemplo",
    startDate: "2025-01-10",
  },
  {
    id: "p2",
    name: "Instagram Pessoal",
    description: "Branding e bastidores",
    objective: "Gerar autoridade",
    niche: "Lifestyle Tech",
    platform: "Instagram",
    status: "active",
    dailyGoal: 1,
    driveLink: "",
    startDate: "2025-03-01",
  },
];

export const mockContents: Content[] = [
  {
    id: "c1",
    title: "Como usar IA no dia a dia",
    description: "Vídeo explicando 5 fluxos com IA",
    copy: "",
    projectId: "p1",
    status: "editing",
    format: "Vídeo longo",
    platform: "YouTube",
    priority: "high",
    plannedDate: new Date().toISOString().slice(0, 10),
    imageUrl: "",
  },
  {
    id: "c2",
    title: "Dica rápida: atalho do VSCode",
    description: "Reels de 30s",
    copy: "",
    projectId: "p2",
    status: "ready",
    format: "Reels",
    platform: "Instagram",
    priority: "medium",
    plannedDate: new Date().toISOString().slice(0, 10),
  },
  {
    id: "c3",
    title: "Carrossel: 7 livros para devs",
    description: "Carrossel de 8 slides",
    copy: "",
    projectId: "p2",
    status: "scheduled",
    format: "Carrossel",
    platform: "Instagram",
    priority: "medium",
    plannedDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  },
  {
    id: "c4",
    title: "Tutorial atrasado",
    description: "",
    copy: "",
    projectId: "p1",
    status: "draft",
    format: "Vídeo",
    platform: "YouTube",
    priority: "low",
    plannedDate: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
  },
];

export const mockReferences: Reference[] = [
  {
    id: "r1",
    title: "Edição rápida de cortes",
    description: "Inspiração de ritmo",
    type: "video",
    link: "https://youtube.com/exemplo",
    tags: ["edição", "ritmo"],
  },
];

export const mockCreatives: Creative[] = [
  {
    id: "cr1",
    title: "Thumb — IA no dia a dia",
    type: "thumbnail",
    status: "review",
    projectId: "p1",
    contentId: "c1",
    tags: ["thumb", "ia"],
  },
];

export const mockGoals: Goal[] = [
  {
    id: "g1",
    projectId: "p1",
    type: "diaria",
    target: 2,
    period: "Janeiro 2025",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "active",
  },
];
