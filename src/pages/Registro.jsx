import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Registro() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({
    name: '',
    lastName: '',
    rut: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const cambiar = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await register(values)
      navigate('/posts')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="mx-auto max-w-sm space-y-4 rounded-xl bg-white p-6 shadow">
      <h1 className="text-xl font-bold text-slate-800">Crear cuenta</h1>
      {error && <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <input name="name" required placeholder="Nombre" value={values.name} onChange={cambiar} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="lastName" required placeholder="Apellido" value={values.lastName} onChange={cambiar} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="rut" required pattern="\d{1,2}\.\d{3}\.\d{3}-[\dkK]" placeholder="RUT (12.345.678-9)" value={values.rut} onChange={cambiar} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="email" type="email" required placeholder="Email" value={values.email} onChange={cambiar} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input name="password" type="password" minLength={6} required placeholder="Contraseña (mínimo 6 caracteres)" value={values.password} onChange={cambiar} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <button disabled={cargando} className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
        {cargando ? 'Creando cuenta...' : 'Registrarme'}
      </button>
      <p className="text-sm text-slate-600">
        ¿Ya tienes cuenta? <Link to="/login" className="text-indigo-700 hover:underline">Inicia sesión</Link>
      </p>
    </form>
  )
}
