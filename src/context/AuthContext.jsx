import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as api from '../services/api'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const AuthContext = createContext(null)

function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(leerUsuario)

  const guardarSesion = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }, [])

  const login = useCallback(async (email, password) => {
    guardarSesion(await api.login(email, password))
  }, [guardarSesion])

  const register = useCallback(async (values) => {
    guardarSesion(await api.register(values))
  }, [guardarSesion])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ token, user, login, register, logout }), [
    token,
    user,
    login,
    register,
    logout,
  ])
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
