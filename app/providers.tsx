'use client';
import { createContext, useContext, useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '@/store/store';
import { useRealtime } from '@/hooks/useRealtime';

const LiveContext = createContext(false);
export const useLive = () => useContext(LiveContext);

function Live({ children }: { children: React.ReactNode }) {
  const connected = useRealtime();
  return <LiveContext.Provider value={connected}>{children}</LiveContext.Provider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const store = useRef<AppStore>();
  if (!store.current) store.current = makeStore();
  return (
    <Provider store={store.current}>
      <Live>{children}</Live>
    </Provider>
  );
}
