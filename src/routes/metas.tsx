import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { mockGoals, mockProjects, mockContents } from "@/lib/mock-data";

export const Route = createFileRoute("/metas")({
  head: () => ({ meta: [{ title: "Metas — Central de Conteúdo" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Metas"
        description="Acompanhe seu progresso por projeto"
        action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova meta</Button>}
      />
      <div className="space-y-6 p-6">
        {mockGoals.length === 0 ? (
          <EmptyState
            icon={<Target className="h-6 w-6" />}
            title="Nenhuma meta definida"
            description="Defina metas diárias, semanais ou mensais."
            action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova meta</Button>}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {mockGoals.map((g) => {
              const project = mockProjects.find((p) => p.id === g.projectId);
              const projectContents = mockContents.filter((c) => c.projectId === g.projectId);
              const planned = projectContents.length;
              const published = projectContents.filter((c) => c.status === "published").length;
              const late = projectContents.filter((c) => c.plannedDate < today && c.status !== "published").length;
              const pct = Math.min(100, Math.round((published / g.target) * 100));
              return (
                <Card key={g.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{project?.name ?? "—"}</CardTitle>
                      <p className="text-xs text-muted-foreground">{g.period}</p>
                    </div>
                    <Badge variant="outline">{g.type}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Progresso</span>
                        <span className="font-medium">{published}/{g.target}</span>
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
        onSubmit={() => { toast.success("Meta salva (mock)"); setOpen(false); }}>
        <Field label="Projeto">
          <Select>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>{mockProjects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo de meta">
            <Select>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="diaria">Diária</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Quantidade alvo"><Input type="number" min={0} /></Field>
        </div>
        <Field label="Período"><Input placeholder="Ex: Janeiro 2025" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Data inicial"><Input type="date" /></Field>
          <Field label="Data final"><Input type="date" /></Field>
        </div>
        <Field label="Status">
          <Select>
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
