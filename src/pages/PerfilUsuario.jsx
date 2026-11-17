import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getUser } from '../services/api'

export default function PerfilUsuario() {
  const { id } = useParams()
  const [resultado, setResultado] = useState({ id: null, user: null, error: '' })

  useEffect(() => {
    let activo = true
    getUser(id)
      .then((data) => {
        if (activo) setResultado({ id, user: data.user, error: '' })
      })
      .catch((err) => {
        if (activo) setResultado({ id, user: null, error: err.message })
      })
    return () => {
      activo = false
    }
  }, [id])

  const perfil = resultado.id === id ? resultado.user : null
  const cargando = resultado.id !== id

  if (cargando) return <p className="text-slate-500">Cargando perfil...</p>
  if (resultado.id === id && resultado.error) {
    return <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{resultado.error}</p>
  }
  if (!perfil) return <p className="text-slate-500">No se encontró el usuario.</p>

  return (
    <section className="space-y-5">
      <header className="rounded-2xl bg-[#193b35] p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-200">
          Perfil
        </p>
        <h1 className="mt-2 text-3xl font-bold">{perfil.name} {perfil.lastName}</h1>
        <p className="mt-2 text-emerald-50/80">{perfil.email}</p>
        <p className="mt-1 text-sm text-emerald-100/60">RUT: {perfil.rut}</p>
      </header>
      <div>
        <h2 className="mb-3 text-lg font-semibold text-stone-800">Publicaciones</h2>
        {perfil.posts?.length ? (
          <div className="space-y-3">
            {perfil.posts.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className="block rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200 hover:ring-[#b45335]"
              >
                <h3 className="font-semibold text-slate-900">{post.title}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-slate-600">{post.content}</p>
              </Link>
            ))}
          </div>
        ) : <p className="rounded-xl bg-white p-4 text-stone-500 ring-1 ring-stone-200">Este perfil todavía no tiene publicaciones conectadas.</p>}
      </div>
    </section>
  )
}
