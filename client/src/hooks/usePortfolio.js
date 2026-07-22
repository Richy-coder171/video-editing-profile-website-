import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const usePortfolio = (endpoint = '/portfolio') => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const loadItems = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get(endpoint, { signal: controller.signal });
        if (active) {
          setItems(data.items || []);
        }
      } catch (requestError) {
        if (requestError.code === 'ERR_CANCELED') {
          return;
        }

        if (active) {
          setError(requestError.response?.data?.message || 'Portfolio API is not available yet');
          setItems([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      active = false;
      controller.abort();
    };
  }, [endpoint]);

  const displayItems = useMemo(() => items, [items]);

  return { items: displayItems, hasLiveItems: items.length > 0, loading, error };
};

export default usePortfolio;
