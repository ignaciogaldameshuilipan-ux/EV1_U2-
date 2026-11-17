import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function CrearPost() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('El título y el contenido son obligatorios.')
      return
    }

    setEnviando(true)
    try {
      await createPost(token, { title: title.trim(), content: content.trim() })
      navigate('/posts')
    } catch (err) {
      if (err.status === 401) {
        logout()
        navigate('/login')
        return
      }
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h1 className="text-xl font-bold text-stone-800">Crear publicación</h1>
      {error && <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-stone-700">Título</label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-[#b45335] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium text-stone-700">Contenido</label>
        <textarea
          id="content"
          required
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-[#b45335] focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          disabled={enviando}
          className="rounded-lg bg-[#b45335] px-5 py-2 font-semibold text-white hover:bg-[#963f27] disabled:opacity-60"
        >
          {enviando ? 'Publicando...' : 'Publicar'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/posts')}
          className="rounded-lg border border-stone-300 px-5 py-2 text-stone-700 hover:bg-stone-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
