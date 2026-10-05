import { FileText } from 'lucide-react';
import { mediaUrl } from '@/lib/format';

/** Image thumbnail or document chip for a flow step or chat message. */
export default function MediaPreview({ type, media, fileName, dark }: { type: 'image' | 'document'; media: string; fileName?: string; dark?: boolean }) {
  const url = mediaUrl(media);
  if (type === 'image') {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={fileName || 'Image'} className="max-h-56 max-w-full rounded-lg object-contain" loading="lazy" />
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${dark ? 'border-white/30 text-white' : 'border-line bg-white text-ink'}`}>
      <FileText className="h-5 w-5 flex-none" aria-hidden /> <span className="truncate">{fileName || media.split('/').pop()}</span>
    </a>
  );
}
