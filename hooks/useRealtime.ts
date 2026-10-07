'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '@/store/api';
import type { Message } from '@/lib/types';
import { useAppDispatch } from '@/store/store';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4100';

/** Live updates: QR codes, connection changes, new messages and hand-offs. */
export function useRealtime() {
  const dispatch = useAppDispatch();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const s = io(`${WS_URL}/realtime`, { transports: ['websocket'], withCredentials: true });
    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    s.on('account', () => dispatch(api.util.invalidateTags(['Accounts', 'Dashboard'])));
    s.on('message', (e: { contactId: string; message?: Message }) => {
      if (e.message) {
        const msg = e.message;
        dispatch(api.util.updateQueryData('thread', e.contactId, (d) => {
          if (d.messages.some((m) => m.id === msg.id)) return;
          // our own reply may still be showing as "sending": swap it for the real one
          const temp = msg.sentBy === 'human' ? d.messages.findIndex((m) => m.pending && m.body === msg.body) : -1;
          if (temp >= 0) d.messages.splice(temp, 1, msg);
          else d.messages.push(msg);
        }));
      } else {
        dispatch(api.util.invalidateTags([{ type: 'Thread', id: e.contactId }]));
      }
      dispatch(api.util.invalidateTags(['Chats', 'Subscribers', 'Dashboard']));
    });
    s.on('handoff', (e: { contactId: string }) => dispatch(api.util.invalidateTags(['Chats', 'Dashboard', { type: 'Thread', id: e.contactId }])));
    return () => {
      s.disconnect();
    };
  }, [dispatch]);
  return connected;
}
