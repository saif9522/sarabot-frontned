'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowDown, ArrowLeft, ArrowUp, Clock, FileText, Image as ImageIcon, MessageSquareText, Trash2, Upload, Zap } from 'lucide-react';
import { useBotQuery, useSaveFlowMutation, useUploadMutation } from '@/store/api';
import type { Flow, FlowStep, StepType } from '@/lib/types';
import { ErrorNote, PageHeader, Switch } from '@/components/ui';
import MediaPreview from '@/components/MediaPreview';

type Draft = Omit<Flow, 'id' | 'botId'> & { id?: string };
const blankStep = (type: StepType): FlowStep => ({ type, text: '', media: '', fileName: '', delaySeconds: type === 'delay' ? 2 : 0 });
const NEW_FLOW: Draft = { name: '', keywords: '', matchType: 'exact', isNoMatch: false, enabled: true, priority: 0, steps: [blankStep('text')] };

const STEP_META: Record<StepType, { label: string; icon: typeof MessageSquareText; tone: string }> = {
  text: { label: 'Text message', icon: MessageSquareText, tone: 'border-brand-edge' },
  image: { label: 'Image', icon: ImageIcon, tone: 'border-tech-edge' },
  document: { label: 'Document', icon: FileText, tone: 'border-ai-edge' },
  delay: { label: 'Wait', icon: Clock, tone: 'border-line' },
};

function Connector() {
  return <div className="mx-auto h-6 w-px bg-line" aria-hidden />;
}

function MediaField({ step, onChange }: { step: FlowStep; onChange: (p: Partial<FlowStep>) => void }) {
  const [upload, { isLoading, error }] = useUploadMutation();
  const [mode, setMode] = useState<'upload' | 'link'>(/^https?:/i.test(step.media) ? 'link' : 'upload');
  const accept = step.type === 'image' ? 'image/jpeg,image/png,image/webp' : '.pdf,.doc,.docx,.xls,.xlsx';
  async function pick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const r = await upload(file).unwrap();
    onChange({ media: r.media, fileName: step.type === 'document' ? step.fileName || r.fileName : r.fileName });
  }
  const errMsg = error && 'data' in error ? (error.data as { message?: string })?.message : undefined;
  return (
    <div className="space-y-2">
      {step.media && <MediaPreview type={step.type as 'image' | 'document'} media={step.media} fileName={step.fileName} />}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button type="button" className={`rounded-full px-2.5 py-1 ${mode === 'upload' ? 'bg-navy text-white' : 'bg-canvas'}`} onClick={() => setMode('upload')}>Upload file</button>
        <button type="button" className={`rounded-full px-2.5 py-1 ${mode === 'link' ? 'bg-navy text-white' : 'bg-canvas'}`} onClick={() => setMode('link')}>Use a link</button>
      </div>
      {mode === 'upload' ? (
        <label className="btn-secondary btn-sm cursor-pointer">
          <Upload className="h-4 w-4" aria-hidden /> {isLoading ? 'Uploading…' : step.media ? 'Replace file' : 'Choose file'}
          <input type="file" accept={accept} className="sr-only" onChange={pick} disabled={isLoading} />
        </label>
      ) : (
        <input type="url" className="input" placeholder="https://…" aria-label="File link" value={/^https?:/i.test(step.media) ? step.media : ''} onChange={(e) => onChange({ media: e.target.value })} />
      )}
      {errMsg && <p className="text-xs text-err">{errMsg}</p>}
      <p className="hint">{step.type === 'image' ? 'JPG, PNG or WebP, up to 5 MB.' : 'PDF, Word or Excel, up to 16 MB.'}</p>
    </div>
  );
}

export default function FlowBuilder() {
  const { id: botId, flowId } = useParams<{ id: string; flowId: string }>();
  const isNew = flowId === 'new';
  const { data: bot, isError } = useBotQuery(botId);
  const [save, { isLoading: saving, error }] = useSaveFlowMutation();
  const [draft, setDraft] = useState<Draft | null>(isNew ? NEW_FLOW : null);
  const router = useRouter();

  useEffect(() => {
    if (!isNew && bot && !draft) {
      const f = bot.flows?.find((x) => x.id === flowId);
      if (f) setDraft({ ...f, steps: f.steps.map((s) => ({ ...s })) });
    }
  }, [bot, draft, flowId, isNew]);

  if (isError) return <ErrorNote what="this bot" />;
  if (!bot || !draft) return <p className="text-muted">Loading…</p>;

  const setStep = (i: number, p: Partial<FlowStep>) => setDraft({ ...draft, steps: draft.steps.map((s, j) => (j === i ? { ...s, ...p } : s)) });
  const move = (i: number, by: -1 | 1) => {
    const steps = [...draft.steps];
    [steps[i], steps[i + by]] = [steps[i + by], steps[i]];
    setDraft({ ...draft, steps });
  };
  const errMsg = error && 'data' in error ? (error.data as { message?: string | string[] })?.message : undefined;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    await save({ ...draft, botId }).unwrap();
    router.push(`/bots/${botId}?tab=Bot%20flows`);
  }

  return (
    <form onSubmit={submit}>
      <Link href={`/bots/${botId}?tab=Bot%20flows`} className="mb-3 inline-flex items-center gap-1 text-sm text-brand-dark hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden /> {bot.name} · flows</Link>
      <PageHeader title={isNew ? 'New flow' : draft.name || 'Edit flow'} description="Messages are sent top to bottom when a customer's message matches the trigger."
        actions={<button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save flow'}</button>} />
      {errMsg && <div className="card mb-4 border-err-edge bg-err-tint p-3 text-sm text-err">{Array.isArray(errMsg) ? errMsg.join(' ') : errMsg}</div>}

      <div className="mx-auto max-w-2xl">
        {/* Trigger */}
        <section className="card border-2 border-auto-edge p-5" aria-labelledby="trigger">
          <h2 id="trigger" className="mb-3 flex items-center gap-2 font-semibold text-navy"><Zap className="h-5 w-5 text-auto" aria-hidden /> Trigger</h2>
          <div className="space-y-4">
            <div><label htmlFor="f-name" className="label">Flow name</label><input id="f-name" className="input" required maxLength={120} placeholder="e.g. Samuhik vivah form" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
            <div className="grid gap-3 sm:grid-cols-[170px_minmax(0,1fr)]">
              <div><label htmlFor="f-mt" className="label">When message</label>
                <select id="f-mt" className="input" value={draft.matchType} onChange={(e) => setDraft({ ...draft, matchType: e.target.value as Flow['matchType'] })}>
                  <option value="exact">is exactly</option><option value="contains">contains</option><option value="starts">starts with</option>
                </select>
              </div>
              <div><label htmlFor="f-kw" className="label">Trigger keywords (comma separated)</label>
                <input id="f-kw" className="input" maxLength={1000} placeholder="Samuhik form, सामूहिक फॉर्म" value={draft.keywords} onChange={(e) => setDraft({ ...draft, keywords: e.target.value })} />
              </div>
            </div>
            <p className="hint -mt-2">Matching ignores capitals and punctuation, so &ldquo;Hello!&rdquo; and &ldquo;hello&rdquo; are the same. &ldquo;Contains&rdquo; matches whole words anywhere in the message.</p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3"><Switch checked={draft.isNoMatch} onChange={(v) => setDraft({ ...draft, isNoMatch: v })} label="No match flow" /><span className="text-sm">Also send when nothing else matches</span></div>
              <div className="flex items-center gap-3"><Switch checked={draft.enabled} onChange={(v) => setDraft({ ...draft, enabled: v })} label="Flow enabled" /><span className="text-sm">Enabled</span></div>
              <div className="flex items-center gap-2"><label htmlFor="f-pr" className="text-sm">Priority</label><input id="f-pr" type="number" className="input h-9 w-20" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: Number(e.target.value) || 0 })} /></div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <ol aria-label="Messages in this flow">
          {draft.steps.map((s, i) => {
            const meta = STEP_META[s.type];
            const Icon = meta.icon;
            return (
              <li key={i}>
                <Connector />
                <section className={`card border-2 ${meta.tone} p-4`} aria-label={`Step ${i + 1}: ${meta.label}`}>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-navy"><Icon className="h-4 w-4" aria-hidden /> {i + 1}. {meta.label}</h3>
                    <div className="flex">
                      <button type="button" className="rounded p-1.5 text-muted hover:bg-canvas disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
                      <button type="button" className="rounded p-1.5 text-muted hover:bg-canvas disabled:opacity-30" disabled={i === draft.steps.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
                      <button type="button" className="rounded p-1.5 text-muted hover:bg-err-tint hover:text-err" onClick={() => setDraft({ ...draft, steps: draft.steps.filter((_, j) => j !== i) })} aria-label="Remove step"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  {s.type === 'text' && (
                    <>
                      <label htmlFor={`s-${i}`} className="sr-only">Message text</label>
                      <textarea id={`s-${i}`} className="textarea" maxLength={4096} value={s.text} onChange={(e) => setStep(i, { text: e.target.value })} placeholder="नमस्कार {name} जी! मैं विकास कुमार माली, कन्या विवाह & विकास सोसाइटी का सचिव हूँ।" />
                      <p className="hint">{'{name}'} = customer&apos;s first name. *bold* and _italic_ work on WhatsApp.</p>
                    </>
                  )}
                  {(s.type === 'image' || s.type === 'document') && (
                    <div className="space-y-3">
                      <MediaField step={s} onChange={(p) => setStep(i, p)} />
                      {s.type === 'document' && (
                        <div><label htmlFor={`fn-${i}`} className="label">File name shown to customer</label><input id={`fn-${i}`} className="input" maxLength={200} value={s.fileName} onChange={(e) => setStep(i, { fileName: e.target.value })} placeholder="Samuhik-Vivah-Form.pdf" /></div>
                      )}
                      <div><label htmlFor={`cap-${i}`} className="label">Caption (optional)</label><input id={`cap-${i}`} className="input" maxLength={1024} value={s.text} onChange={(e) => setStep(i, { text: e.target.value })} /></div>
                    </div>
                  )}
                  {s.type === 'delay' && (
                    <div className="flex items-center gap-2">
                      <label htmlFor={`d-${i}`} className="text-sm">Wait</label>
                      <input id={`d-${i}`} type="number" min={1} max={30} className="input h-9 w-20" value={s.delaySeconds} onChange={(e) => setStep(i, { delaySeconds: Math.max(1, Math.min(30, Number(e.target.value) || 1)) })} />
                      <span className="text-sm">seconds before the next message</span>
                    </div>
                  )}
                </section>
              </li>
            );
          })}
        </ol>

        <Connector />
        <div className="card border-dashed p-4">
          <p className="mb-2 text-center text-sm font-medium text-navy">Add to this flow</p>
          <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(STEP_META) as StepType[]).map((t) => {
              const Icon = STEP_META[t].icon;
              return <button key={t} type="button" className="btn-secondary btn-sm" disabled={draft.steps.length >= 30} onClick={() => setDraft({ ...draft, steps: [...draft.steps, blankStep(t)] })}><Icon className="h-4 w-4" aria-hidden /> {STEP_META[t].label}</button>;
            })}
          </div>
        </div>
        <div className="mt-6 flex justify-end"><button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save flow'}</button></div>
      </div>
    </form>
  );
}
