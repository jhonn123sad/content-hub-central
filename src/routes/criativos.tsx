import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCreatives, mockProjects, mockContents } from "@/lib/mock-data";

export const Route = createFileRoute("/criativos")({
  head: () => ({ meta: [{ title: "Criativos — Central de Conteúdo" }] }),
  component: CreativesPage,
});

const types = ["thumbnail", "capa", "story", "reels", "post", "outro"];
const statuses = ["draft", "review", "approved", "published"];

function CreativesPage() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [project, setProject] = useState("all");
  const [content, setContent] = useState("all");

  const filtered = useMemo(() => mockCreatives.filter((c) => {
    if (type !== "all" && c.type !== type) return false;
    if (status !== "all" && c.status !== status) return false;
    if (project !== "all" && c.projectId !== project) return false;
    if (content !== "all" && c.contentId !== content) return false;
    return true;
  }), [type, status, project, content]);

  return (
    <div>
      <PageHeader
        title="Criativos"
        description="Artes e peças visuais"
        action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo criativo</Button>}
      />
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap gap-2">
          <FilterSelect value={type} onChange={setType} options={[{ value: "all", label: "Todos os tipos" }, ...types.map((t) => ({ value: t, label: t }))]} />
          <FilterSelect value={status} onChange={setStatus} options={[{ value: "all", label: "Todos status" }, ...statuses.map((s) => ({ value: s, label: s }))]} />
          <FilterSelect value={project} onChange={setProject} options={[{ value: "all", label: "Todos projetos" }, ...mockProjects.map((p) => ({ value: p.id, label: p.name }))]} />
          <FilterSelect value={content} onChange={setContent} options={[{ value: "all", label: "Todos conteúdos" }, ...mockContents.map((c) => ({ value: c.id, label: c.title }))]} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="h-6 w-6" />}
            title="Nenhum criativo"
            description="Adicione thumbnails, capas e outras peças."
            action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo criativo</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <Card key={c.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{c.title}</h3>
                    <Badge variant="outline">{c.type}</Badge>
                  </div>
                  <Badge variant="secondary">{c.status}</Badge>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FormDialog open={open} onOpenChange={setOpen} title="Novo criativo"
        onSubmit={() => { toast.success("Criativo salvo (mock)"); setOpen(false); }}>
        <Field label="Título"><Input /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo">
            <Select>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Projeto relacionado">
            <Select>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{mockProjects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Conteúdo relacionado">
            <Select>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{mockContents.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Link do arquivo"><Input placeholder="https://drive..." /></Field>
        <Field label="Imagem principal (URL)"><Input placeholder="https://..." /></Field>
        <Field label="Descrição"><Textarea /></Field>
        <Field label="Tags (separadas por vírgula)"><Input /></Field>
      </FormDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
    </Select>
  );
}
