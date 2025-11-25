import { useEffect, useState } from 'react';
import Card from './components/Card.jsx';
import Header from './components/Header.jsx';
import PlayerModal from './components/PlayerModal.jsx';
import Tag from './components/Tag.jsx';
import './style.css';

const API_BASE = 'https://video-backend-sable.vercel.app/';

const STATIC_TAGS = [
  'animals', 'nature', 'classic', 'sample', 'short', 'demo', 'longer', 'sea', 'relax', 'city', 'travel', 'mountain', 'sports', 'fun'
];

export default function App() {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(null);

  async function fetchShorts(signal) {
    const url = new URL('/api/shorts', API_BASE || window.location.origin);
    if (query) url.searchParams.set('q', query);
    const res = await fetch(url, { credentials: 'omit', signal });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  }

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError('');
    fetchShorts(ctrl.signal)
      .then((data) => {
        // Apply client-side tag filter so UI consistency doesn't depend on backend
        let list = Array.isArray(data) ? data : [];
        if (activeTag) {
          const t = activeTag.toLowerCase();
          list = list.filter((it) => (it.tags || []).some((x) => String(x).toLowerCase() === t));
        }
        setShorts(list);
      })

      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message || 'Error');
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [query, activeTag]);

  // Use static, frontend-defined tags to keep the list consistent regardless of backend data
  const tags = STATIC_TAGS;

  function openModal(item) { setCurrent(item); }
  function closeModal() { setCurrent(null); }

  return (
    <>
      <Header query={query} onChange={setQuery} />

      <main className="max-w-6xl mx-auto px-4 pb-12 pt-2 text-slate-100">
        <div className="flex flex-wrap gap-2 my-3">
          <Tag text="All" active={!activeTag} onClick={() => setActiveTag('')} />
          {tags.map((t) => (
            <Tag key={t} text={t} active={activeTag === t} onClick={() => setActiveTag(activeTag === t ? '' : t)} />
          ))}
        </div>

        {error && <div className="px-4 py-3 rounded-xl border border-rose-800 bg-rose-900/20 text-rose-100">{error}</div>}
        {loading && <div className="px-4 py-3 rounded-xl border border-teal-800 bg-teal-900/20 text-teal-100">Loading…</div>}

        <section className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {shorts.map((item) => (
            <Card key={item.id} item={item} onOpen={openModal} />
          ))}
        </section>

        <PlayerModal current={current} onClose={closeModal} />
      </main>
    </>
  );
}   