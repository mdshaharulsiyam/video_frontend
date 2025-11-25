import TagPill from './TagPill.jsx'

export default function Card({ item, onOpen }) {
  return (
    <article
      className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => onOpen(item)}
    >
      <div className="aspect-[16/9] bg-slate-950">
        <video className="w-full h-full object-cover" muted preload="metadata" src={`${item.videoUrl}#t=0.1`} />
      </div>
      <div className="p-3.5">
        <h3 className="mt-1 mb-2 text-sm font-bold text-slate-100">{item.title || 'Untitled'}</h3>
        <div className="flex flex-wrap gap-1.5">
          {(item.tags || []).map((t) => (
            <TagPill key={t} text={t} />
          ))}
        </div>
      </div>
    </article>
  )
}
