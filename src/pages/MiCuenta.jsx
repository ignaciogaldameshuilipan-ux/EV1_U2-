import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMe } from '../services/api'

export default function MiCuenta() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getMe(token)
      .then((data) => setUser(data.user))
      .catch((err) => {
        setError(err.message)
        if (err.status === 401) {
          logout()
          navigate('/login')
        }
      })
  }, [token, logout, navigate])

  if (error) return <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>
  if (!user) return <p className="text-slate-500">Cargando cuenta...</p>

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-bold text-slate-900">Mi cuenta</h1>
      <dl className="mt-4 space-y-2 text-slate-700">
        <div><dt className="inline font-medium">Nombre: </dt><dd className="inline">{user.name} {user.lastName}</dd></div>
        <div><dt className="inline font-medium">Email: </dt><dd className="inline">{user.email}</dd></div>
        <div><dt className="inline font-medium">RUT: </dt><dd className="inline">{user.rut}</dd></div>
      </dl>
      <Link to={`/usuarios/${user.id}`} className="mt-4 inline-block text-indigo-700 hover:underline">
        Ver mi perfil público
      </Link>
    </section>
  )
}
