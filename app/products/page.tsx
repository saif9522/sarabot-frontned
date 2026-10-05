'use client';
import { FormEvent, useState } from 'react';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAddCategoryMutation, useCategoriesQuery, useDeleteCategoryMutation, useDeleteProductMutation, useProductsQuery, useSaveProductMutation } from '@/store/api';
import type { Product } from '@/lib/types';
import { Empty, ErrorNote, Modal, PageHeader, StatusPill, Switch } from '@/components/ui';

type Draft = { id?: string; name: string; sku: string; price: string; currency: string; description: string; inStock: boolean; imageUrl: string; categoryId: string };
const toDraft = (p?: Product): Draft => ({
  id: p?.id, name: p?.name ?? '', sku: p?.sku ?? '', price: p?.price != null ? String(p.price) : '', currency: p?.currency ?? 'INR',
  description: p?.description ?? '', inStock: p?.inStock ?? true, imageUrl: p?.imageUrl ?? '', categoryId: p?.categoryId ?? '',
});
const money = (p: Product) => (p.price == null ? 'On request' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: p.currency || 'INR', maximumFractionDigits: 2 }).format(p.price));

export default function ProductsPage() {
  const [categoryId, setCategoryId] = useState('');
  const [q, setQ] = useState('');
  const { data: cats } = useCategoriesQuery();
  const { data, isLoading, isError } = useProductsQuery({ ...(categoryId ? { categoryId } : {}), ...(q.trim() ? { q: q.trim() } : {}) });
  const [save, { isLoading: saving, error }] = useSaveProductMutation();
  const [del] = useDeleteProductMutation();
  const [addCat] = useAddCategoryMutation();
  const [delCat] = useDeleteCategoryMutation();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [newCat, setNewCat] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    await save({
      id: draft.id, name: draft.name.trim(), sku: draft.sku.trim() || null, price: draft.price === '' ? null : Number(draft.price), currency: draft.currency,
      description: draft.description, inStock: draft.inStock, imageUrl: draft.imageUrl.trim() || null, categoryId: draft.categoryId || null,
    }).unwrap();
    setDraft(null);
  }

  return (
    <>
      <PageHeader icon={Package} tone="amber" title="Products" description="Bots with “Answer from the product catalogue” switched on use this list for prices, stock and details."
        actions={<button className="btn-primary" onClick={() => setDraft(toDraft())}><Plus className="h-4 w-4" aria-hidden /> Add product</button>} />
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="card h-fit p-4" aria-label="Categories">
          <h2 className="mb-2 text-sm font-semibold text-navy">Categories</h2>
          <ul className="space-y-0.5 text-sm">
            <li><button className={`w-full rounded-lg px-3 py-2 text-left ${!categoryId ? 'bg-brand-tint font-semibold text-brand-dark' : 'hover:bg-canvas'}`} onClick={() => setCategoryId('')}>All products</button></li>
            {cats?.map((c) => (
              <li key={c.id} className="group flex items-center">
                <button className={`flex-1 rounded-lg px-3 py-2 text-left ${categoryId === c.id ? 'bg-brand-tint font-semibold text-brand-dark' : 'hover:bg-canvas'}`} onClick={() => setCategoryId(c.id)}>
                  {c.name} <span className="text-xs text-muted">({c._count?.products ?? 0})</span>
                </button>
                <button className="rounded p-1.5 text-muted opacity-60 hover:text-err group-hover:opacity-100" aria-label={`Delete category ${c.name}`}
                  onClick={() => confirm(`Delete category "${c.name}"? Its products are kept without a category.`) && delCat(c.id)}><Trash2 className="h-3.5 w-3.5" /></button>
              </li>
            ))}
          </ul>
          <form className="mt-3 flex gap-2" onSubmit={async (e) => { e.preventDefault(); if (newCat.trim()) { await addCat({ name: newCat.trim() }); setNewCat(''); } }}>
            <label htmlFor="new-cat" className="sr-only">New category</label>
            <input id="new-cat" className="input h-9" placeholder="New category" value={newCat} maxLength={80} onChange={(e) => setNewCat(e.target.value)} />
            <button className="btn-secondary h-9 px-3" aria-label="Add category"><Plus className="h-4 w-4" /></button>
          </form>
        </aside>
        <section>
          <div className="mb-3 w-72"><label htmlFor="p-q" className="sr-only">Search products</label><input id="p-q" className="input" placeholder="Search name, SKU or description" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          {isError ? <ErrorNote what="products" /> : isLoading ? <p className="text-muted">Loading…</p> : !data?.length ? (
            <Empty title={q || categoryId ? 'No matching products' : 'No products yet'}>Add products with prices and stock so the bot can answer &ldquo;how much is…&rdquo; and &ldquo;do you have…&rdquo;.</Empty>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-line bg-c-indigo-tint text-xs text-c-indigo">
                  <tr><th className="px-4 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold">Category</th><th className="px-4 py-3 text-right font-semibold">Price</th><th className="px-4 py-3 font-semibold">Stock</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3"><p className="font-medium text-navy">{p.name}</p>{p.sku && <p className="font-mono text-xs text-muted">{p.sku}</p>}{p.description && <p className="line-clamp-1 text-xs text-muted">{p.description}</p>}</td>
                      <td className="px-4 py-3 text-muted">{p.category?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{money(p)}</td>
                      <td className="px-4 py-3"><StatusPill tone={p.inStock ? 'ok' : 'off'}>{p.inStock ? 'In stock' : 'Out of stock'}</StatusPill></td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button className="rounded p-2 text-muted hover:bg-canvas" aria-label={`Edit ${p.name}`} onClick={() => setDraft(toDraft(p))}><Pencil className="h-4 w-4" /></button>
                        <button className="rounded p-2 text-muted hover:bg-err-tint hover:text-err" aria-label={`Delete ${p.name}`} onClick={() => confirm(`Delete "${p.name}"?`) && del(p.id)}><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <Modal open={!!draft} onClose={() => setDraft(null)} title={draft?.id ? 'Edit product' : 'Add product'} wide>
        {draft && (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label htmlFor="d-name" className="label">Name</label><input id="d-name" className="input" required maxLength={200} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
              <div><label htmlFor="d-cat" className="label">Category</label>
                <select id="d-cat" className="input" value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>
                  <option value="">None</option>{cats?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label htmlFor="d-price" className="label">Price</label>
                <div className="flex gap-2">
                  <select aria-label="Currency" className="input w-24" value={draft.currency} onChange={(e) => setDraft({ ...draft, currency: e.target.value })}>{['INR', 'USD', 'AED', 'EUR', 'GBP'].map((c) => <option key={c}>{c}</option>)}</select>
                  <input id="d-price" type="number" min="0" step="0.01" inputMode="decimal" className="input" placeholder="Leave empty for “on request”" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
                </div>
              </div>
              <div><label htmlFor="d-sku" className="label">SKU / code (optional)</label><input id="d-sku" className="input font-mono" maxLength={80} value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} /></div>
            </div>
            <div><label htmlFor="d-desc" className="label">Description</label><textarea id="d-desc" className="textarea" maxLength={4000} placeholder="Size, colour, material, what's included…" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
            <div><label htmlFor="d-img" className="label">Image or product link (optional)</label><input id="d-img" type="url" className="input" placeholder="https://…" value={draft.imageUrl} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} /><p className="hint">The bot can share this link when customers ask to see the product.</p></div>
            <div className="flex items-center gap-3"><Switch checked={draft.inStock} onChange={(v) => setDraft({ ...draft, inStock: v })} label="In stock" /><span className="text-sm">{draft.inStock ? 'In stock' : 'Out of stock'}</span></div>
            {error && <p className="text-sm text-err">Couldn&apos;t save. Check the image link is a full URL starting with https://.</p>}
            <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button>
          </form>
        )}
      </Modal>
    </>
  );
}
