export default function Tag({ text, active, onClick }) {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors';
  const off = 'bg-sky-900/10 border-sky-400/30 text-sky-100 hover:bg-sky-900/20';
  const on = 'bg-rose-900/10 border-rose-400/40 text-rose-100';
  return (
    <button className={`${base} ${active ? on : off}`} onClick={onClick}>{text}</button>
  );
}
