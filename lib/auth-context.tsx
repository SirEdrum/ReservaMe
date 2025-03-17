"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Admin Usuario",
    username: "admin",
    password: "admin123",
    role: "administrador",
  },
  {
    id: "2",
    name: "Recepcionista Demo",
    username: "recepcion",
    password: "recepcion123",
    role: "recepcionista",
  },
  {
    id: "3",
    name: "Juan Pérez",
    username: "chofer1",
    password: "chofer123",
    role: "chofer",
  },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Verificar que el usuario tenga la estructura esperada
        if (parsedUser && parsedUser.id && parsedUser.role) {
          setUser(parsedUser)
        } else {
          localStorage.removeItem("user")
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
    // Este efecto solo debe ejecutarse una vez al montar el componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (username, password) => {
    // Find user in mock data
    const foundUser = mockUsers.find((u) => u.username === username && u.password === password)

    if (foundUser) {
      // Store user in state and localStorage
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        username: foundUser.username,
        role: foundUser.role,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

