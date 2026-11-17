import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteCommentReaction, getCommentReactions } from '../services/api'
import { useAuth } from '../context/AuthContext'
import ReactionBar from './ReactionBar'
import ReactionDetails from './ReactionDetails'

export default function CommentCard({ comment, canDelete, onDelete, onCountsChange }) {
  const { user } = useAuth()
  const [counts, setCounts] = useState(comment.reactions || {})
  const [reactions, setReactions] = useState([])
  const [ownIds, setOwnIds] = useState(new Set())
  const [error, setError] = useState('')

  const cargarReacciones = useCallback(async () => {
    const data = await getCommentReactions(comment.id)
    setCounts(data.counts || {})
    setReactions(data.reactions || [])
  }, [comment.id])

  useEffect(() => {
    let activo = true
    getCommentReactions(comment.id)
      .then((data) => {
        if (!activo) return
        setCounts(data.counts || {})
        setReactions(data.reactions || [])
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
    return () => {
      activo = false
    }
  }, [comment.id])

  const reaccionar = (id, nuevosConteos, reaction) => {
    setCounts(nuevosConteos)
    setReactions((prev) => [reaction, ...prev])
    setOwnIds((prev) => new Set(prev).add(reaction.id))
    onCountsChange(id, nuevosConteos)
  }

  const quitarReaccion = async (id) => {
    if (!window.confirm('¿Quitar esta reacción?')) return
    try {
      await deleteCommentReaction(id)
      await cargarReacciones()
      setOwnIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <article className="rounded-lg border border-slate-200 p-4">
      <p className="whitespace-pre-line text-slate-700">{comment.content}</p>
      <p className="mt-2 text-xs text-slate-500">
        Por {comment.author?.id ? (
          <Link to={`/usuarios/${comment.author.id}`} className="hover:text-indigo-700">
            {comment.author.name}
          </Link>
        ) : 'Anónimo'} · {new Date(comment.createdAt).toLocaleString('es-CL')}
      </p>
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(comment.id)}
          className="mt-2 text-xs text-red-600 hover:underline"
        >
          Eliminar comentario
        </button>
      )}
      <ReactionBar
        tipo="comment"
        commentId={comment.id}
        counts={counts}
        onReaccion={reaccionar}
      />
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
      <ReactionDetails
        reactions={reactions}
        ownIds={ownIds}
        user={user}
        onDelete={quitarReaccion}
      />
    </article>
  )
}
