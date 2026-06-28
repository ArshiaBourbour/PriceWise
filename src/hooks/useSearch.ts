import { useState, useMemo, useCallback } from 'react';
import { CATALOG } from '@/constants';
import { searchProductsAI } from '@/services/priceService';
import { normalizeQuery } from '@/utils';
import { useSearchStore } from '@/store';
import type { ProductCatalogItem } from '@/types';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [aiResults, setAiResults] = useState<ProductCatalogItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addQuery } = useSearchStore();

  // Local catalog filter
  const localResults = useMemo(() => {
    if (!query.trim()) return CATALOG;
    const q = query.toLowerCase();
    return CATALOG.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.cat.includes(q)
    );
  }, [query]);

  const search = useCallback(async (q: string) => {
    const trimmed = normalizeQuery(q.trim());
    if (!trimmed) return;
    setQuery(trimmed);
    addQuery(trimmed);
    setError(null);

    // If local results are sufficient, skip AI call
    if (localResults.length >= 3) {
      setAiResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchProductsAI(trimmed);
      setAiResults(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطای جستجو');
    } finally {
      setIsSearching(false);
    }
  }, [localResults.length, addQuery]);

  const results = query && localResults.length < 3
    ? aiResults
    : localResults;

  return { query, results, isSearching, error, search, setQuery };
}
