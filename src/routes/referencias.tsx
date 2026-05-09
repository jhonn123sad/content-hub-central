import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Bookmark, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { FormDialog } from "@/components/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockReferences, mockProjects } from "@/lib/mock-data";

export const Route = createFileRoute("/referencias")({
  head: () => ({ meta: [{ title: "Referências — Central de Conteúdo" }] }),
  component: ReferencesPage,
});

function ReferencesPage() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [project, setProject] = useState("all");

  const filtered = useMemo(() => {
    return mockReferences.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (type !== "all" && r.type !== type) return false;
      if (project !== "all" && r.projectId !== project) return false;
      return true;
    });
  }, [q, type, project]);

  return (
    <div>
      <PageHeader
        title="Referências"
        description="Inspirações para seus conteúdos"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova referência
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="w-[240px] pl-9"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="video">Vídeo</SelectItem>
              <SelectItem value="post">Post</SelectItem>
              <SelectItem value="artigo">Artigo</SelectItem>
              <SelectItem value="imagem">Imagem</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={project} onValueChange={setProject}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os projetos</SelectItem>
              {mockProjects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="h-6 w-6" />}
            title="Sem referências"
            description="Salve inspirações para usar nos seus conteúdos."
            action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova referência</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <Card key={r.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{r.title}</h3>
                    <Badge variant="outline">{r.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {r.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                  </div>
                  {r.link && (
                    <a href={r.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      Abrir <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FormDialog open={open} onOpenChange={setOpen} title="Nova referência"
        onSubmit={() => { toast.success("Referência salva (mock)"); setOpen(false); }}>
        <Field label="Título"><Input /></Field>
        <Field label="Descrição"><Textarea /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo">
            <Select>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Vídeo</SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="artigo">Artigo</SelectItem>
                <SelectItem value="imagem">Imagem</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Link"><Input placeholder="https://..." /></Field>
        </div>
        <Field label="Imagem principal (URL)"><Input placeholder="https://..." /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Projeto relacionado">
            <Select>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {mockProjects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Conteúdo relacionado"><Input placeholder="Título ou ID" /></Field>
        </div>
        <Field label="Tags (separadas por vírgula)"><Input placeholder="ex: edição, ritmo" /></Field>
        <Field label="Observações"><Textarea /></Field>
      </FormDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
