import { useQuery } from '@tanstack/react-query';
import { fetchLivePrices } from '@/services/priceService';
import type { ProductCatalogItem } from '@/types';

/**
 * Fetches live prices for a product.
 * Caches for 5 minutes, then auto-refetches.
 * On error: returns error state (never fake data).
 */
export function useLivePrices(product: ProductCatalogItem | null) {
  return useQuery({
    queryKey: ['live-prices', product?.id],
    queryFn: () => {
      if (!product) throw new Error('No product');
      return fetchLivePrices(product);
    },
    enabled: !!product,
    staleTime: 5 * 60 * 1000,      // 5 min cache
    gcTime: 10 * 60 * 1000,        // keep in memory 10 min
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
