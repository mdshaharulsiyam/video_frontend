import { useEffect, useRef } from 'react'
import TagPill from './TagPill.jsx'

export default function PlayerModal({ current, onClose }) {
  const dialogRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (current) {
      if (typeof dialog.showModal === 'function') dialog.showModal()
      else dialog.setAttribute('open', 'true')
    } else {
      if (typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
    }
  }, [current])

  useEffect(() => {
    return () => {
      const v = videoRef.current
      if (v) {
        v.pause()
        v.removeAttribute('src')
        v.load()
      }
    }
  }, [])

  function handleClose() {
    const v = videoRef.current
    if (v) {
      v.pause(); v.removeAttribute('src'); v.load()
    }
    onClose?.()
  }

  return (
    <dialog
      ref={dialogRef}
      className="p-0 bg-transparent"
      onCancel={(e) => { e.preventDefault(); handleClose() }}
      onClick={(e) => {
        const rect = e.currentTarget.querySelector('.dialog-content').getBoundingClientRect()
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) handleClose()
      }}
    >
      <div className="dialog-content w-[min(960px,94vw)] my-8 mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="absolute right-2 top-2 w-9 h-9 rounded-full border border-slate-700 bg-black/50 text-white text-xl z-10"
          aria-label="Close"
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
        >
          ×
        </button>
        <video className="w-full bg-black" ref={videoRef} key={current?.videoUrl || 'player'} src={current ? current.videoUrl + '#t=0.001' : ''} controls playsInline preload="metadata" />
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">{current?.title || ''}</h2>
          <div className="flex flex-wrap gap-1.5">
            {(current?.tags || []).map((t) => (
              <TagPill key={t} text={t} />
            ))}
          </div>
        </div>
      </div>
    </dialog>
  )
}
