"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getUsers, addUser } from "@/lib/data"
import { Home, Calendar, Clock } from "lucide-react"

export default function UsuariosPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    workDays: "L-V",
    workHours: "9:00-18:00",
    username: "",
    password: "",
    role: "recepcionista",
  })
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role === "administrador") {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
        router.push("/login")
      }
    } else {
      setIsAdmin(false)
      router.push("/login")
    }
  }, [user])

  useEffect(() => {
    if (isAdmin) {
      // Get users
      setUsers(getUsers())
    }
  }, [isAdmin])

  if (!isAdmin) {
    return null
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.phone || !formData.username || !formData.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Check if username already exists
    if (users.some((u) => u.username === formData.username)) {
      toast({
        title: "Error",
        description: "El nombre de usuario ya existe",
        variant: "destructive",
      })
      return
    }

    // Add new user
    const newUser = {
      id: (users.length + 1).toString(),
      name: formData.name,
      phone: formData.phone,
      workDays: formData.workDays,
      workHours: formData.workHours,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      active: true,
    }

    addUser(newUser)
    setUsers([...users, newUser])

    // Reset form
    setFormData({
      name: "",
      phone: "",
      workDays: "L-V",
      workHours: "9:00-18:00",
      username: "",
      password: "",
      role: "recepcionista",
    })

    toast({
      title: "Éxito",
      description: "Usuario agregado correctamente",
    })
  }

  const handleEditUser = (userId) => {
    router.push(`/editar-usuarios?id=${userId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Agregar Usuario</CardTitle>
              <CardDescription>Ingresa los datos del nuevo usuario</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workDays">Días Laborales</Label>
                    <Input
                      id="workDays"
                      name="workDays"
                      value={formData.workDays}
                      onChange={handleInputChange}
                      placeholder="L-V"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workHours">Horario Laboral</Label>
                    <Input
                      id="workHours"
                      name="workHours"
                      value={formData.workHours}
                      onChange={handleInputChange}
                      placeholder="9:00-18:00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Usuario *</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="usuario123"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Nivel de Usuario *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrador">Administrador</SelectItem>
                      <SelectItem value="recepcionista">Recepcionista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/")}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar</Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Usuarios Registrados</CardTitle>
              <CardDescription>Lista de todos los usuarios en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Badge className={user.role === "administrador" ? "bg-purple-500" : "bg-blue-500"}>
                          {user.role === "administrador" ? "Administrador" : "Recepcionista"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {user.workDays}
                          </span>
                          <span className="text-xs flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {user.workHours}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.active ? "bg-green-500" : "bg-red-500"}>
                          {user.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => router.push("/")} className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

