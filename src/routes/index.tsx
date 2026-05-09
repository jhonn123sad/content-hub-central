import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FolderKanban,
  Target,
  Bookmark,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge, type ContentStatus } from "@/components/status-badge";
import { useDashboardSummary } from "@/hooks/use-database";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Central de Conteúdo" },
      { name: "description", content: "Visão geral de conteúdos, projetos e metas." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: summary, isLoading } = useDashboardSummary();

  if (isLoading || !summary) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando dashboard...
      </div>
    );
  }

  const {
    active_projects,
    today_planned_contents,
    ready_contents,
    late_contents,
    published_contents,
    active_goals,
    recent_references,
    upcoming_contents
  } = summary;

  // Calculando meta diária simplificada (poderia ser movido para o RPC se necessário)
  const dailyTarget = 1; // Simplificado para o MVP
  const dailyPct = Math.min(100, Math.round((published_contents / dailyTarget) * 100));

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando dashboard...
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Sua visão geral do dia"
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<CalendarDays className="h-4 w-4" />}
            label="Planejados hoje"
            value={today_planned_contents}
          />
          <StatCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Prontos para publicar"
            value={ready_contents}
            tone="success"
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Em atraso"
            value={late_contents}
            tone="destructive"
          />
          <StatCard
            icon={<FolderKanban className="h-4 w-4" />}
            label="Projetos ativos"
            value={active_projects}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4" /> Próximos conteúdos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcoming_contents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nada planejado.</p>
              ) : (
                <ul className="divide-y">
                  {upcoming_contents.map((c) => (
                    <li key={c.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">{c.title || c.titulo}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.planned_date || c.data_planejada} · {c.platform || c.plataforma}
                        </p>
                      </div>
                      <StatusBadge status={(c.status) as ContentStatus} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4" /> Meta diária
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-semibold">
                {published_contents}
                <span className="text-base font-normal text-muted-foreground">
                  {" "}/ {dailyTarget}
                </span>
              </div>
              <Progress value={dailyPct} />
              <p className="text-xs text-muted-foreground">
                {dailyPct}% do objetivo de hoje
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bookmark className="h-4 w-4" /> Referências recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recent_references.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma referência ainda.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {recent_references.slice(0, 4).map((r) => (
                  <li
                    key={r.id}
                    className="rounded-lg border bg-card p-3 text-sm"
                  >
                    <p className="font-medium">{r.title || r.titulo}</p>
                    <p className="text-xs text-muted-foreground">{r.type || r.tipo}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: "success" | "destructive";
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "destructive"
        ? "text-destructive"
        : "text-foreground";
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className={`mt-2 text-3xl font-semibold ${toneClass}`}>{value}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
