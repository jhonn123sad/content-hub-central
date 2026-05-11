import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Target } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGoals, useProjects, useContents, useCreateGoal } from "@/hooks/use-database";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Metas — Central de Conteúdo" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const [open, setOpen] = useState(false);
  const { data: goals = [], isLoading: isLoadingGoals } = useGoals();
  const { data: projects = [] } = useProjects();
  const { data: contents = [] } = useContents();
  const createGoal = useCreateGoal();

  const [formData, setFormData] = useState({
    project_id: "",
    title: "",
    goal_type: "diaria",
    target_count: "1",
    period: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = async () => {
    try {
      await createGoal.mutateAsync({
        ...formData,
        target_count: parseInt(formData.target_count) || 0,
        project_id: formData.project_id || null,
      });
      toast.success("Meta salva!");
      setOpen(false);
      setFormData({
        project_id: "",
        title: "",
        goal_type: "diaria",
        target_count: "1",
        period: "",
        start_date: "",
        end_date: "",
        status: "active",
      });
    } catch (error) {
      toast.error("Erro ao salvar meta");
    }
  };

  return (
    <div>
      <PageHeader
        title="Metas"
        description="Acompanhe seu progresso por projeto"
        action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova meta</Button>}
      />
      <div className="space-y-6 p-6">
        {isLoadingGoals ? (
          <div className="flex justify-center p-12">Carregando metas...</div>
        ) : goals.length === 0 ? (
          <EmptyState
            icon={<Target className="h-6 w-6" />}
            title="Nenhuma meta definida"
            description="Defina metas diárias, semanais ou mensais."
            action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova meta</Button>}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {goals.map((g) => {
              const project = projects.find((p) => p.id === g.project_id);
              const projectContents = contents.filter((c) => c.project_id === g.project_id);
              const planned = projectContents.length;
              const published = projectContents.filter((c) => c.status === "published").length;
              const late = projectContents.filter((c) => c.planned_date && c.planned_date < today && c.status !== "published").length;
              const target = g.target_count || 1;
              const pct = Math.min(100, Math.round((published / target) * 100));
              return (
                <Card key={g.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{g.title} ({project?.title ?? "—"})</CardTitle>
                      <p className="text-xs text-muted-foreground">{g.period}</p>
                    </div>
                    <Badge variant="outline">{g.goal_type}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Progresso</span>
                        <span className="font-medium">{published}/{target}</span>
                      </div>
                      <Progress value={pct} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <Stat label="Planejados" value={planned} />
                      <Stat label="Publicados" value={published} tone="success" />
                      <Stat label="Atrasados" value={late} tone="destructive" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <FormDialog open={open} onOpenChange={setOpen} title="Nova meta"
        onSubmit={handleSubmit}>
        <Field label="Título"><Input value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Ex: Meta de inscritos" /></Field>
        <Field label="Projeto">
          <Select value={formData.project_id} onValueChange={v => setFormData(prev => ({ ...prev, project_id: v }))}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo de meta">
            <Select value={formData.goal_type} onValueChange={v => setFormData(prev => ({ ...prev, goal_type: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="diaria">Diária</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Quantidade alvo"><Input type="number" min={0} value={formData.target_count} onChange={e => setFormData(prev => ({ ...prev, target_count: e.target.value }))} /></Field>
        </div>
        <Field label="Período"><Input value={formData.period} onChange={e => setFormData(prev => ({ ...prev, period: e.target.value }))} placeholder="Ex: Janeiro 2025" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Data inicial"><Input type="date" value={formData.start_date} onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))} /></Field>
          <Field label="Data final"><Input type="date" value={formData.end_date} onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))} /></Field>
        </div>
        <Field label="Status">
          <Select value={formData.status} onValueChange={v => setFormData(prev => ({ ...prev, status: v }))}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativa</SelectItem>
              <SelectItem value="paused">Pausada</SelectItem>
              <SelectItem value="done">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FormDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "success" | "destructive" }) {
  const cls = tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : "";
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className={`text-2xl font-semibold ${cls}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
