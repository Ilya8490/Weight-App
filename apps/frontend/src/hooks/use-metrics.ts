import { useState } from 'react';
import { buildMetrics, getInsightKey, type MetricInput, type MetricEntry, type MetricsSummary } from '@health-metrics/shared';
import { api } from '../lib/api';
import { useAppStore } from '../store/app-store';

export const useMetrics = () => {
  const [loading, setLoading] = useState(false);
  const mode = useAppStore((state) => state.mode);
  const history = useAppStore((state) => state.history);
  const latestEntry = useAppStore((state) => state.latestEntry);
  const insightKey = useAppStore((state) => state.insightKey);
  const setMetrics = useAppStore((state) => state.setMetrics);
  const addEntry = useAppStore((state) => state.addEntry);

  const fetchHistory = async () => {
    if (mode === 'guest') {
      const guestSummary: MetricsSummary = {
        history,
        latestEntry,
        insight: insightKey
      };

      setMetrics(guestSummary);
      return guestSummary;
    }

    setLoading(true);
    try {
      const response = await api<MetricsSummary>('/metrics/history', { method: 'GET' });
      setMetrics(response);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (payload: MetricInput) => {
    if (mode === 'guest') {
      const metrics = buildMetrics(payload);
      const entry: MetricEntry = {
        id: crypto.randomUUID(),
        ...payload,
        ...metrics,
        createdAt: new Date().toISOString()
      };

      addEntry(entry, getInsightKey(entry.bmi));
      return entry;
    }

    setLoading(true);
    try {
      const response = await api<{ entry: MetricEntry }>('/metrics/entry', {
        method: 'POST',
        body: payload
      });
      addEntry(response.entry, getInsightKey(response.entry.bmi));
      return response.entry;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchHistory,
    createEntry
  };
};
