import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Edit3, LogOut, RefreshCw, Star, Trash2 } from 'lucide-react';
import PortfolioForm from '../components/admin/PortfolioForm.jsx';
import LazyPage3DAccent from '../components/three/LazyPage3DAccent.jsx';
import { useAuth } from '../contexts/authContext.js';
import { portfolioTypes } from '../data/portfolioMeta.js';
import { api } from '../services/api.js';
import { formatProjectDate } from '../utils/date.js';

const filters = [{ label: 'All', value: 'all' }, ...portfolioTypes];

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const { admin, logout } = useAuth();

  const loadItems = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/portfolio?limit=120');
      setItems(data.items || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load portfolio items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === 'all') {
      return items;
    }

    return items.filter((item) => item.type === filter);
  }, [filter, items]);

  const handleSaved = async () => {
    setSuccess(editingItem ? 'Portfolio item updated.' : 'Portfolio item uploaded.');
    setEditingItem(null);
    await loadItems();
  };

  const handleDelete = async (item) => {
    const shouldDelete = window.confirm(`Delete "${item.title}"? This cannot be undone.`);

    if (!shouldDelete) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await api.delete(`/portfolio/${item.id}`);
      setSuccess('Portfolio item deleted.');
      await loadItems();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete portfolio item');
    }
  };

  return (
    <main className="page-pad relative overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-cinematic-sheen opacity-20" />
      <LazyPage3DAccent
        variant="admin"
        className="right-[-13rem] top-28 h-[24rem] w-[32rem] opacity-25 sm:right-[-8rem] sm:h-[30rem] sm:w-[39rem] sm:opacity-42 lg:right-[-3rem] lg:top-28 lg:opacity-50"
      />
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1 className="mt-3 font-display text-4xl font-black leading-none text-white md:text-6xl lg:text-7xl">
              Manage portfolio uploads.
            </h1>
            <p className="mt-4 text-sm text-white/60">Signed in as {admin?.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary" type="button" onClick={loadItems}>
              <RefreshCw size={18} />
              Refresh
            </button>
            <button className="btn-ghost" type="button" onClick={logout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {success && <p className="relative mt-6 rounded-lg border border-electric/30 bg-electric/10 p-3 text-sm text-electric">{success}</p>}

        <div className="relative mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <PortfolioForm editingItem={editingItem} onSaved={handleSaved} onCancel={() => setEditingItem(null)} />

          <div className="anime-surface rounded-lg p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow">Library</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-white">{items.length} uploaded works</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((itemFilter) => (
                  <button
                    key={itemFilter.value}
                    className={`rounded-full px-3 py-2 text-xs capitalize transition ${
                      filter === itemFilter.value ? 'bg-white text-ink shadow-glow' : 'border border-white/10 text-white/60 hover:border-electric/30 hover:text-white'
                    }`}
                    onClick={() => setFilter(itemFilter.value)}
                    type="button"
                  >
                    {itemFilter.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="mt-5 rounded-lg border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</p>}
            {loading && <p className="mt-6 text-sm text-white/60">Loading uploads...</p>}

            <div className="mt-6 space-y-3">
              {!loading && filteredItems.length === 0 && (
                <div className="rounded-lg border border-dashed border-white/20 p-8 text-center text-sm text-white/60">
                  {items.length === 0 ? 'Upload your first project to start building your portfolio.' : 'No items in this filter yet.'}
                </div>
              )}

              {filteredItems.map((item) => (
                <article key={item.id} className="manga-panel grid gap-4 p-3 sm:grid-cols-[112px_1fr]">
                  <img
                    src={item.thumbnailUrl || item.mediaUrl || '/cinematic-editor-hero.png'}
                    alt={item.title}
                    loading="lazy"
                    className="aspect-video w-full rounded-md object-cover sm:h-24"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                          {item.featured && <Star size={16} className="fill-acid text-acid" />}
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40 sm:tracking-[0.22em]">
                          {item.type} / {item.category}
                        </p>
                        {item.projectDate && (
                          <p className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-electric/80">
                            <CalendarDays size={13} />
                            {formatProjectDate(item.projectDate)}
                          </p>
                        )}
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{item.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="icon-button" type="button" onClick={() => setEditingItem(item)} aria-label={`Edit ${item.title}`}>
                          <Edit3 size={17} />
                        </button>
                        <button className="icon-button text-ember" type="button" onClick={() => handleDelete(item)} aria-label={`Delete ${item.title}`}>
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
