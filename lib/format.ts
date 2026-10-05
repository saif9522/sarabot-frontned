export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '–';
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 45) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
export const phone = (waId: string | null | undefined) => (!waId ? '' : waId.includes('@') ? waId.split('@')[0] : `+${waId}`);
export const SENT_BY: Record<string, string> = { flow: 'Bot flow', nomatch: 'No-match flow', ai: 'AI', fallback: 'Fallback', welcome: 'Welcome', system: 'System', human: 'You' };
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');
/** Uploaded file name or external link -> URL the browser can open. */
export const mediaUrl = (media: string) => (/^https?:\/\//i.test(media) ? media : `${API_ORIGIN}/uploads/${encodeURIComponent(media)}`);
export const money = (amount: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);
export const fmtDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '–');
export const chats = (n: number | null) => (n == null ? 'Unlimited' : n.toLocaleString('en-IN'));
/** 30 → "1 month", 90 → "3 months", 365 → "1 year", 45 → "45 days" */
export function duration(days: number) {
  if (days % 365 === 0) return `${days / 365} year${days === 365 ? '' : 's'}`;
  if (days % 30 === 0) return `${days / 30} month${days === 30 ? '' : 's'}`;
  return `${days} days`;
}
