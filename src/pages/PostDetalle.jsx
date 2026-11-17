import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentCard from '../components/CommentCard'
import ReactionBar from '../components/ReactionBar'
import ReactionDetails from '../components/ReactionDetails'
import { useAuth } from '../context/AuthContext'
import {
  createComment,
  deleteComment,
  deletePostReaction,
  getComments,
  getPost,
  getPostReactions,
} from '../services/api'

export default function PostDetalle() {
  const { id } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [reactions, setReactions] = useState([])
  const [ownReactions, setOwnReactions] = useState(new Set())
  const [ownComments, setOwnComments] = useState(new Set())
  const [commentText, setCommentText] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    let activo = true
    Promise.all([getPost(id), getComments(id), getPostReactions(id)])
      .then(([postData, commentData, reactionData]) => {
        if (!activo) return
        setPost(postData.post)
        setComments(commentData.comments || [])
        setReactions(reactionData.reactions || [])
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [id])

  const reaccionar = (postId, counts, reaction) => {
    setPost((prev) => ({ ...prev, reactions: counts }))
    setReactions((prev) => [reaction, ...prev])
    if (reaction?.id) setOwnReactions((prev) => new Set(prev).add(reaction.id))
  }

  const quitarReaccion = async (reactionId) => {
    if (!window.confirm('¿Quitar esta reacción?')) return
    try {
      await deletePostReaction(reactionId)
      const data = await getPostReactions(id)
      setReactions(data.reactions || [])
      setPost((prev) => ({ ...prev, reactions: data.counts || {} }))
      setOwnReactions((prev) => {
        const next = new Set(prev)
        next.delete(reactionId)
        return next
      })
    } catch (err) {
      setError(err.message)
    }
  }

  const comentar = async (e) => {
    e.preventDefault()
    const content = commentText.trim()
    if (!content) return
    setError('')
    setEnviando(true)
    try {
      const data = await createComment(id, content, user?.id)
      setComments((prev) => [data.comment, ...prev])
      setPost((prev) => ({ ...prev, commentsCount: (prev.commentsCount || 0) + 1 }))
      setOwnComments((prev) => new Set(prev).add(data.comment.id))
      setCommentText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const borrarComentario = async (commentId) => {
    if (!window.confirm('¿Eliminar este comentario?')) return
    try {
      await deleteComment(commentId)
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
      setPost((prev) => ({ ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) }))
    } catch (err) {
      setError(err.message)
    }
  }

  const actualizarConteosComentario = (commentId, counts) => {
    setComments((prev) => prev.map((comment) =>
      comment.id === commentId ? { ...comment, reactions: counts } : comment,
    ))
  }

  if (cargando) return <p className="text-center text-slate-500">Cargando publicación...</p>
  if (error && !post) return <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>
  if (!post) return <p className="text-slate-600">No se encontró la publicación.</p>

  return (
    <section className="space-y-5">
      <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Por {post.author?.id ? (
            <Link to={`/usuarios/${post.author.id}`} className="text-indigo-700 hover:underline">
              {post.author.name}
            </Link>
          ) : 'Anónimo'} · {new Date(post.createdAt).toLocaleString('es-CL')}
        </p>
        <p className="mt-4 whitespace-pre-line text-slate-700">{post.content}</p>
        <ReactionBar postId={id} counts={post.reactions || {}} onReaccion={reaccionar} />
        <ReactionDetails
          reactions={reactions}
          ownIds={ownReactions}
          user={user}
          onDelete={quitarReaccion}
        />
      </article>

      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      <form onSubmit={comentar} className="space-y-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Deja un comentario</h2>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          maxLength={500}
          rows={3}
          required
          placeholder="Escribe algo..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{commentText.length}/500</span>
          <button disabled={enviando} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
            {enviando ? 'Enviando...' : 'Comentar'}
          </button>
        </div>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Comentarios ({post.commentsCount ?? comments.length})
        </h2>
        {comments.length === 0 && <p className="text-slate-500">Todavía no hay comentarios.</p>}
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            canDelete={
              (Boolean(user?.id) && user.id === comment.author?.id) ||
              ownComments.has(comment.id)
            }
            onDelete={borrarComentario}
            onCountsChange={actualizarConteosComentario}
          />
        ))}
      </section>
    </section>
  )
}
