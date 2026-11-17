import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'

export default function Posts() {
  const { token } = useAuth()
  const [posts, setPosts] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    getPosts()
      .then((data) => activo && setPosts(data.posts))
      .catch((err) => activo && setError(err.message))
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [])

  const actualizarReacciones = useCallback((postId, counts) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, reactions: counts } : p)))
  }, [])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Publicaciones</h1>
        {token && (
          <Link
            to="/crear-post"
            className="rounded-lg bg-[#b45335] px-4 py-2 text-sm font-semibold text-white hover:bg-[#963f27]"
          >
            + Nueva
          </Link>
        )}
      </div>

      {cargando && (
        <p className="text-center text-slate-500">
          Cargando publicaciones... (el servidor gratuito puede tardar unos segundos en despertar)
        </p>
      )}
      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {!cargando && !error && posts.length === 0 && (
        <p className="text-center text-slate-500">Aún no hay publicaciones.</p>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} onReaccion={actualizarReacciones} />
      ))}
    </section>
  )
}
