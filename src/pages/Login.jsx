import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await login(email, password)
      navigate('/posts')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="mx-auto max-w-sm space-y-4 rounded-xl bg-white p-6 shadow">
      <h1 className="text-xl font-bold text-slate-800">Iniciar sesión</h1>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
      />
      <input
        type="password"
        required
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
      />
      <button
        disabled={cargando}
        className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {cargando ? 'Entrando...' : 'Entrar'}
      </button>
      <p className="text-sm text-slate-600">
        ¿No tienes cuenta? <Link to="/registro" className="text-indigo-700 hover:underline">Regístrate</Link>
      </p>
    </form>
  )
}
