import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { fallbackPortfolio } from '../data/fallbackPortfolio.js';

const usePortfolio = (endpoint = '/portfolio', fallbackFilter = () => true) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get(endpoint);
        if (active) {
          setItems(data.items || []);
        }
      } catch (requestError) {
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
    };
  }, [endpoint]);

  const displayItems = useMemo(() => {
    if (items.length) {
      return items;
    }

    return fallbackPortfolio.filter(fallbackFilter);
  }, [fallbackFilter, items]);

  return { items: displayItems, hasLiveItems: items.length > 0, loading, error };
};

export default usePortfolio;
