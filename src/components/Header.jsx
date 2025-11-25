export default function Header({ query, onChange }) {
  return (
    <header className="sticky top-0 z-10 bg-black/40 backdrop-blur-md px-4 py-3 flex items-center justify-between">
      <div className="text-xl font-extrabold text-slate-100">
        Short<span className="text-rose-500">flix</span>
      </div>
      <input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="w-[min(64vw,420px)] rounded-lg border border-slate-700 bg-slate-900 text-slate-100 px-3 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
        placeholder="Search titles or tags..."
      />
    </header>
  );
}
