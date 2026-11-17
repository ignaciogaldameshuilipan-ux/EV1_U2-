import { Link } from 'react-router-dom'
import { usuarios } from '../data/usuarios'

export default function Usuarios() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl bg-[#193b35] p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-200">Comunidad Mi-Clase</p>
        <h1 className="mt-2 text-3xl font-bold">Personas</h1>
        <p className="mt-2 max-w-lg text-sm text-emerald-50/80">
          Conoce a quienes forman parte de este espacio.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
      {usuarios.map((user) => (
        <article
          key={user.id}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-md"
        >
          <Link to={`/usuarios/${user.id}`} className="group block">
            <div className="flex items-center gap-4">
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${user.color}`}>
                {user.name[0]}{user.lastName[0]}
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-stone-900 group-hover:text-[#b45335]">
                  {user.name} {user.lastName}
                </h2>
                <p className="mt-1 break-all text-sm text-stone-500">{user.email}</p>
                <p className="mt-1 text-sm text-stone-500">RUT mostrado: {user.rutListado}</p>
              </div>
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-wider text-stone-400">
              Ver perfil →
            </p>
          </Link>
          <Link
            to={`/login?email=${encodeURIComponent(user.email)}`}
            className="mt-3 inline-flex rounded-lg bg-[#193b35] px-3 py-2 text-sm font-medium text-white hover:bg-[#25584e]"
          >
            Iniciar sesión
          </Link>
        </article>
      ))}
      </div>
    </section>
  )
}
