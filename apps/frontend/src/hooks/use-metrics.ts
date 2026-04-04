import { useState } from 'react';
import { getInsightKey, type MetricInput, type MetricEntry, type MetricsSummary } from '@health-metrics/shared';
import { api } from '../lib/api';
import { useAppStore } from '../store/app-store';

export const useMetrics = () => {
  const [loading, setLoading] = useState(false);
  const setMetrics = useAppStore((state) => state.setMetrics);
  const addEntry = useAppStore((state) => state.addEntry);

  const fetchHistory = async () => {
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
