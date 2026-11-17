import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getHealth } from '../services/api'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-white/15 text-white' : 'text-emerald-50 hover:bg-white/10'
  }`

export default function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const [apiActiva, setApiActiva] = useState(null)

  useEffect(() => {
    getHealth()
      .then(() => setApiActiva(true))
      .catch(() => setApiActiva(false))
  }, [])

  const salir = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-[#193b35] shadow-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-4">
        <span className="text-lg font-bold tracking-tight text-white">Mi-Clase<span className="text-amber-300">.</span></span>

        <div className="flex flex-wrap items-center gap-1">
          <span className="px-2 text-xs text-emerald-100">
            {apiActiva === null ? 'Conectando...' : apiActiva ? 'API en línea' : 'API sin conexión'}
          </span>
          <NavLink to="/posts" className={linkClass}>
            Publicaciones
          </NavLink>
          <NavLink to="/usuarios" className={linkClass}>
            Usuarios
          </NavLink>
          {token && (
            <NavLink to="/crear-post" className={linkClass}>
              Crear publicación
            </NavLink>
          )}
          {token ? (
            <>
              <span className="hidden px-2 text-sm text-indigo-100 sm:inline">
                <NavLink to="/mi-cuenta" className="hover:underline">
                  {user?.name}
                </NavLink>
              </span>
              <button
                onClick={salir}
                className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Iniciar sesión
              </NavLink>
              <NavLink to="/registro" className={linkClass}>
                Registrarme
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
