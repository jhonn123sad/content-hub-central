import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FolderKanban } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockProjects } from "@/lib/mock-data";

export const Route = createFileRoute("/projetos")({
  head: () => ({ meta: [{ title: "Projetos — Central de Conteúdo" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const projects = mockProjects;

  return (
    <div>
      <PageHeader
        title="Projetos"
        description="Organize seus canais e iniciativas de conteúdo"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo projeto
          </Button>
        }
      />
      <div className="p-6">
        {projects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="h-6 w-6" />}
            title="Nenhum projeto ainda"
            description="Crie seu primeiro projeto para começar a organizar conteúdos."
            action={
              <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Novo projeto
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Card key={p.id}>
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.niche}</p>
                    </div>
                    <Badge variant="outline">{p.platform}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Meta: {p.dailyGoal}/dia</span>
                    <span>Desde {p.startDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Novo projeto"
        description="Defina os dados principais do projeto"
        onSubmit={() => {
          toast.success("Projeto salvo (mock)");
          setOpen(false);
        }}
      >
        <Field label="Nome">
          <Input placeholder="Ex: Canal de tecnologia" />
        </Field>
        <Field label="Descrição">
          <Textarea placeholder="Sobre o que é este projeto" />
        </Field>
        <Field label="Objetivo">
          <Input placeholder="Ex: 10k inscritos em 6 meses" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nicho">
            <Input placeholder="Tecnologia, finanças..." />
          </Field>
          <Field label="Plataforma principal">
            <Select>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <Select>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Meta diária de conteúdos">
            <Input type="number" min={0} placeholder="0" />
          </Field>
        </div>
        <Field label="Link do Drive">
          <Input placeholder="https://drive.google.com/..." />
        </Field>
        <Field label="Data de início">
          <Input type="date" />
        </Field>
      </FormDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
