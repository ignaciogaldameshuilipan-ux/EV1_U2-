import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Posts from './pages/Posts'
import CrearPost from './pages/CrearPost'
import { useAuth } from './context/AuthContext'
import Registro from './pages/Registro'
import PostDetalle from './pages/PostDetalle'
import Usuarios from './pages/Usuarios'
import PerfilUsuario from './pages/PerfilUsuario'
import MiCuenta from './pages/MiCuenta'

function RutaPrivada({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Routes>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetalle />} />
          <Route
            path="/crear-post"
            element={
              <RutaPrivada>
                <CrearPost />
              </RutaPrivada>
            }
          />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios/:id" element={<PerfilUsuario />} />
          <Route
            path="/mi-cuenta"
            element={
              <RutaPrivada>
                <MiCuenta />
              </RutaPrivada>
            }
          />
          <Route path="*" element={<Navigate to="/posts" replace />} />
        </Routes>
      </main>
    </div>
  )
}
