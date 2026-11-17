import ReactionBar from './ReactionBar'
import { Link } from 'react-router-dom'

const formatearFecha = (iso) =>
  new Date(iso).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' })

export default function PostCard({ post, onReaccion }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <h2 className="text-lg font-semibold text-slate-900">
        <Link to={`/posts/${post.id}`} className="hover:text-[#b45335]">
          {post.title}
        </Link>
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Por {post.author?.id ? (
          <Link to={`/usuarios/${post.author.id}`} className="font-medium text-slate-700 hover:text-indigo-700">
            {post.author.name}
          </Link>
        ) : (
          <span className="font-medium text-slate-700">Anónimo</span>
        )}
        {' · '}
        {formatearFecha(post.createdAt)}
      </p>
      <p className="mt-3 whitespace-pre-line text-slate-700">{post.content}</p>
      <Link to={`/posts/${post.id}`} className="mt-3 inline-block text-sm text-indigo-700 hover:underline">
        {post.commentsCount ?? 0} comentarios · Ver publicación
      </Link>

      <ReactionBar
        postId={post.id}
        counts={post.reactions || {}}
        onReaccion={onReaccion}
      />
    </article>
  )
}
