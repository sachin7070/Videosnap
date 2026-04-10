'use client';
import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  platform: string;
  thumbnail: string | null;
  formatLabel: string;
  downloadedAt: string;
}

const STORAGE_KEY = 'videosnap-history';
const MAX_ITEMS = 20;

export function useDownloadHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'downloadedAt'>) => {
    const entry: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      downloadedAt: new Date().toISOString(),
    };
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, MAX_ITEMS);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const removeItem = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  return { history, addToHistory, clearHistory, removeItem };
}
