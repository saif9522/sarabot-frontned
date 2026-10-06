'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '@/store/api';
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
    s.on('message', (e: { contactId: string }) => dispatch(api.util.invalidateTags(['Chats', 'Subscribers', 'Dashboard', { type: 'Thread', id: e.contactId }])));
    s.on('handoff', (e: { contactId: string }) => dispatch(api.util.invalidateTags(['Chats', 'Dashboard', { type: 'Thread', id: e.contactId }])));
    return () => {
      s.disconnect();
    };
  }, [dispatch]);
  return connected;
}
