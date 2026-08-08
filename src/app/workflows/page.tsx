"use client";

import { ArrowDown, ArrowLeft, ArrowUp, CheckCircle2, Download, FolderOpen, GitBranch, Loader2, Plus, Save, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../components/Button";

type DirectoryFile = File & { webkitRelativePath?: string };
type StepType = "CONVERT_TO_PDF" | "COMPRESS_PDF" | "MERGE_PDF";
type WorkflowStep = { type: StepType; config: Record<string, number> };
type Workflow = { id: number; name: string; description: string; steps: WorkflowStep[]; updatedAt: string };
const stepLabels: Record<StepType, string> = { CONVERT_TO_PDF: "Convert to PDF", COMPRESS_PDF: "Compress PDFs", MERGE_PDF: "Merge PDFs" };
const supported = /\.(pdf|png|jpe?g)$/i;

function exclusionReason(file: DirectoryFile) {
  if (file.name === ".DS_Store" || file.name.startsWith("._")) return "System metadata file";
  const extension = file.name.match(/\.([^.]+)$/)?.[1]?.toUpperCase();
  if (!extension) return "File has no supported extension";
  if (["DOC", "DOCX", "XLS", "XLSX"].includes(extension)) return `${extension} conversion is not available yet`;
  return `${extension} files are not supported`;
}
function formatBytes(bytes: number) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }

export default function WorkflowsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState<Workflow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<WorkflowStep[]>([{ type: "CONVERT_TO_PDF", config: {} }]);
  const [files, setFiles] = useState<DirectoryFile[]>([]);
  const [working, setWorking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const accepted = useMemo(() => files.filter((file) => supported.test(file.name)), [files]);
  const excluded = useMemo(() => files.filter((file) => !supported.test(file.name)), [files]);

  const refresh = async () => {
    const response = await fetch("/api/workflows", { cache: "no-store" });
    if (response.ok) setSaved(await response.json());
  };
  useEffect(() => { void refresh(); }, []);

  const load = (workflow: Workflow) => {
    setSelectedId(workflow.id); setName(workflow.name); setDescription(workflow.description || "");
    setSteps(workflow.steps); setMessage(null); setError(null);
  };
  const newWorkflow = () => {
    setSelectedId(null); setName(""); setDescription(""); setSteps([{ type: "CONVERT_TO_PDF", config: {} }]); setFiles([]); setMessage(null); setError(null);
  };
  const addStep = (type: StepType) => {
    if (steps.some((step) => step.type === type)) return;
    const next = [...steps, { type, config: type === "COMPRESS_PDF" ? { quality: 70 } : {} }];
    next.sort((a, b) => ["CONVERT_TO_PDF", "COMPRESS_PDF", "MERGE_PDF"].indexOf(a.type) - ["CONVERT_TO_PDF", "COMPRESS_PDF", "MERGE_PDF"].indexOf(b.type));
    setSteps(next);
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction; if (target < 0 || target >= steps.length) return;
    setSteps((current) => { const copy = [...current]; [copy[index], copy[target]] = [copy[target], copy[index]]; return copy; });
  };
  const save = async () => {
    setSaving(true); setError(null); setMessage(null);
    try {
      const response = await fetch(selectedId ? `/api/workflows/${selectedId}` : "/api/workflows", {
        method: selectedId ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, description, steps }),
      });
      if (!response.ok) throw new Error((await response.text()) || "Unable to save workflow");
      const workflow: Workflow = await response.json();
      setSelectedId(workflow.id); setMessage("Workflow saved"); await refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save workflow"); }
    finally { setSaving(false); }
  };
  const removeWorkflow = async () => {
    if (!selectedId || !confirm("Delete this workflow?")) return;
    const response = await fetch(`/api/workflows/${selectedId}`, { method: "DELETE" });
    if (response.ok) { newWorkflow(); await refresh(); }
  };
  const chooseDirectory = (event: ChangeEvent<HTMLInputElement>) => { setFiles(Array.from(event.target.files ?? []) as DirectoryFile[]); setMessage(null); setError(null); };
  const run = async () => {
    if (!selectedId) { setError("Save the workflow before running it"); return; }
    setWorking(true); setError(null); setMessage(null);
    try {
      const form = new FormData();
      accepted.forEach((file) => { form.append("files", file, file.name); form.append("relativePaths", file.webkitRelativePath || file.name); });
      form.append("workflowId", String(selectedId));
      const response = await fetch("/api/workflows/run", { method: "POST", body: form });
      if (!response.ok) throw new Error((await response.text()) || "Workflow failed");
      const blob = await response.blob();
      const outputName = response.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/i)?.[1] || "workflow-output.pdf";
      const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = outputName; anchor.click(); URL.revokeObjectURL(url);
      setMessage(`Run completed: ${response.headers.get("x-workflow-completed") || accepted.length} files processed`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Workflow failed"); }
    finally { setWorking(false); }
  };

  return <main className="min-h-[calc(100vh-4rem)] bg-[#E2E1DF] px-5 py-10 dark:bg-[#0C3B2E] sm:px-8">
    <header className="mx-auto mb-8 max-w-7xl"><Link href="/#tools" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={16} /> Back to tools</Link><div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-[#FFBA00]"><GitBranch size={16} /> Workflow builder</div><h1 className="text-3xl font-semibold text-[#2F180B] dark:text-white">Create and run workflows</h1><p className="mt-2 text-slate-600 dark:text-white/60">Build a reusable sequence of document steps, save it, then run it against a directory.</p></header>
    <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[250px_390px_1fr]">
      <aside className="rounded-3xl border border-[#D0C1A9] bg-white p-5 dark:border-[#6D9773]/40 dark:bg-[#173F35]"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold dark:text-white">Saved workflows</h2><button onClick={newWorkflow} aria-label="New workflow" className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"><Plus size={18} /></button></div><div className="space-y-2">{saved.map((workflow) => <button key={workflow.id} onClick={() => load(workflow)} className={`w-full rounded-xl p-3 text-left text-sm ${selectedId === workflow.id ? "bg-indigo-50 text-indigo-800 dark:bg-[#FFBA00]/15 dark:text-[#FFBA00]" : "bg-slate-50 dark:bg-[#0C3B2E] dark:text-white"}`}><span className="block truncate font-semibold">{workflow.name}</span><span className="mt-1 block text-xs opacity-60">{workflow.steps.length} steps</span></button>)}{!saved.length && <p className="text-sm text-slate-500">No workflows saved yet.</p>}</div></aside>
      <section className="rounded-3xl border border-[#D0C1A9] bg-white p-5 dark:border-[#6D9773]/40 dark:bg-[#173F35]"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold dark:text-white">Definition</h2>{selectedId && <button onClick={removeWorkflow} className="text-rose-600" aria-label="Delete workflow"><Trash2 size={17} /></button>}</div><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Workflow name" maxLength={100} className="w-full rounded-xl border border-[#D0C1A9] bg-transparent px-3 py-2.5 dark:border-[#6D9773] dark:text-white" /><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" maxLength={500} className="mt-3 w-full resize-none rounded-xl border border-[#D0C1A9] bg-transparent px-3 py-2.5 dark:border-[#6D9773] dark:text-white" />
        <h3 className="mb-2 mt-5 text-sm font-semibold dark:text-white">Ordered steps</h3><div className="space-y-2">{steps.map((step, index) => <div key={step.type} className="rounded-xl border border-[#D0C1A9]/70 p-3 dark:border-[#6D9773]/40"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">{index + 1}</span><span className="flex-1 text-sm font-semibold dark:text-white">{stepLabels[step.type]}</span><button onClick={() => move(index, -1)} disabled={!index}><ArrowUp size={15} /></button><button onClick={() => move(index, 1)} disabled={index === steps.length - 1}><ArrowDown size={15} /></button><button onClick={() => setSteps(steps.filter((_, i) => i !== index))} className="text-rose-500"><Trash2 size={15} /></button></div>{step.type === "COMPRESS_PDF" && <label className="mt-3 block text-xs text-slate-500">Quality: {step.config.quality || 70}<input type="range" min="20" max="90" value={step.config.quality || 70} onChange={(e) => setSteps(steps.map((item, i) => i === index ? { ...item, config: { quality: Number(e.target.value) } } : item))} className="mt-1 w-full" /></label>}</div>)}</div>
        <div className="mt-3 flex flex-wrap gap-2">{(["CONVERT_TO_PDF", "COMPRESS_PDF", "MERGE_PDF"] as StepType[]).filter((type) => !steps.some((step) => step.type === type)).map((type) => <button key={type} onClick={() => addStep(type)} className="rounded-lg border border-dashed border-indigo-300 px-2.5 py-1.5 text-xs font-semibold text-indigo-700"><Plus size={12} className="mr-1 inline" />{stepLabels[type]}</button>)}</div>
        <Button onClick={save} disabled={saving || !name.trim() || !steps.length} className="mt-5 w-full justify-center gap-2"><Save size={17} />{saving ? "Saving..." : selectedId ? "Update workflow" : "Save workflow"}</Button>
      </section>
      <section className="rounded-3xl border border-[#D0C1A9] bg-white p-5 dark:border-[#6D9773]/40 dark:bg-[#173F35]"><h2 className="mb-4 font-semibold dark:text-white">Run saved workflow</h2><input ref={inputRef} type="file" multiple onChange={chooseDirectory} className="hidden" {...({ webkitdirectory: "" } as object)} />{!files.length ? <button onClick={() => inputRef.current?.click()} className="w-full rounded-2xl border-2 border-dashed border-indigo-200 p-10"><FolderOpen className="mx-auto mb-3 text-indigo-600" size={36} /><span className="font-semibold dark:text-white">Choose a directory</span></button> : <><div className="mb-4 flex justify-between"><p className="text-sm text-slate-500">{accepted.length} ready · {excluded.length} excluded · {formatBytes(accepted.reduce((sum, file) => sum + file.size, 0))}</p><button onClick={() => inputRef.current?.click()} className="text-sm font-semibold text-indigo-600">Change</button></div><div className="max-h-64 space-y-2 overflow-y-auto">{accepted.map((file, i) => <div key={`${file.webkitRelativePath}-${i}`} className="flex gap-2 rounded-lg bg-slate-50 p-2.5 dark:bg-[#0C3B2E]"><CheckCircle2 size={16} className="text-emerald-500" /><span className="truncate text-sm dark:text-white">{file.webkitRelativePath || file.name}</span></div>)}{excluded.length > 0 && <><p className="pt-3 text-xs font-semibold uppercase text-slate-500">Excluded</p>{excluded.map((file, i) => <div key={`${file.webkitRelativePath}-x-${i}`} className="rounded-lg bg-amber-50 p-2.5 dark:bg-amber-500/10"><div className="flex gap-2"><XCircle size={16} className="text-amber-600" /><span className="truncate text-sm dark:text-white">{file.webkitRelativePath || file.name}</span></div><p className="ml-6 text-xs text-amber-700 dark:text-amber-300">{exclusionReason(file)}</p></div>)}</>}</div></>}
        <Button onClick={run} disabled={!selectedId || !accepted.length || working} className="mt-5 w-full justify-center gap-2">{working ? <><Loader2 size={17} className="animate-spin" />Running...</> : <><Download size={17} />Run saved workflow</>}</Button>{message && <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}{error && <p className="mt-3 break-words text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      </section>
    </div>
  </main>;
}
