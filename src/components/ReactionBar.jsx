import { useState } from 'react'
import { reactToComment, reactToPost } from '../services/api'
import { useAuth } from '../context/AuthContext'

const REACCIONES = [
  { type: 'like', emoji: '👍', label: 'Me gusta' },
  { type: 'love', emoji: '❤️', label: 'Me encanta' },
  { type: 'haha', emoji: '😂', label: 'Me divierte' },
  { type: 'wow', emoji: '😮', label: 'Me sorprende' },
  { type: 'sad', emoji: '😢', label: 'Me entristece' },
  { type: 'angry', emoji: '😡', label: 'Me enoja' },
]

export default function ReactionBar({ postId, commentId, counts, onReaccion, tipo = 'post' }) {
  const { user } = useAuth()
  const [enviando, setEnviando] = useState(null)
  const [aviso, setAviso] = useState(null)

  const reaccionar = async (type) => {
    setAviso(null)
    setEnviando(type)
    try {
      const data = tipo === 'comment'
        ? await reactToComment(commentId, type, user?.id)
        : await reactToPost(postId, type, user?.id)
      onReaccion(tipo === 'comment' ? commentId : postId, data.counts, data.reaction)
    } catch (err) {
      if (err.status === 409) {
        setAviso({
          tipo: 'warning',
          texto: 'Ya reaccionaste a esta publicación con ese tipo de reacción.',
        })
      } else {
        setAviso({ tipo: 'error', texto: err.message })
      }
    } finally {
      setEnviando(null)
    }
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-3">
      <div className="flex flex-wrap gap-2">
        {REACCIONES.map(({ type, emoji, label }) => (
          <button
            key={type}
            type="button"
            title={label}
            disabled={enviando === type}
            onClick={() => reaccionar(type)}
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm transition hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-300 disabled:opacity-50"
          >
            <span className="text-lg leading-none">{emoji}</span>
            <span className="min-w-[1ch] font-medium text-slate-700">{counts[type] ?? 0}</span>
          </button>
        ))}
      </div>

      {aviso && (
        <p
          role="alert"
          className={`mt-3 rounded-md px-3 py-2 text-sm ${
            aviso.tipo === 'warning'
              ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
              : 'bg-red-50 text-red-700 ring-1 ring-red-200'
          }`}
        >
          {aviso.texto}
        </p>
      )}
    </div>
  )
}
