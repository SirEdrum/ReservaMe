"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getUsers, updateUser } from "@/lib/data"
import { Home, ArrowLeft } from "lucide-react"

export default function EditarUsuariosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    workDays: "",
    workHours: "",
    username: "",
    password: "",
    role: "",
    active: true,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "administrador") {
      router.push("/login")
    }
  }, [user])

  useEffect(() => {
    const userId = searchParams.get("id")

    if (userId) {
      // Get user data
      const users = getUsers()
      const foundUser = users.find((u) => u.id === userId)

      if (foundUser) {
        setUserData(foundUser)
        setFormData({
          name: foundUser.name,
          phone: foundUser.phone,
          workDays: foundUser.workDays,
          workHours: foundUser.workHours,
          username: foundUser.username,
          password: "", // Don't show the password
          role: foundUser.role,
          active: foundUser.active,
        })
      } else {
        // User not found
        toast({
          title: "Error",
          description: "Usuario no encontrado",
          variant: "destructive",
        })
        router.push("/usuarios")
      }
    } else {
      // No user ID provided
      router.push("/usuarios")
    }
    setIsLoading(false)
  }, [searchParams, router, toast])

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

  const handleSwitchChange = (checked) => {
    setFormData({
      ...formData,
      active: checked,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.phone || !formData.username) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Check if username already exists (except for this user)
    const users = getUsers()
    if (users.some((u) => u.username === formData.username && u.id !== userData.id)) {
      toast({
        title: "Error",
        description: "El nombre de usuario ya existe",
        variant: "destructive",
      })
      return
    }

    // Update user
    const updatedUser = {
      ...userData,
      name: formData.name,
      phone: formData.phone,
      workDays: formData.workDays,
      workHours: formData.workHours,
      username: formData.username,
      role: formData.role,
      active: formData.active,
    }

    // Only update password if provided
    if (formData.password) {
      updatedUser.password = formData.password
    }

    updateUser(updatedUser)

    toast({
      title: "Éxito",
      description: "Usuario actualizado correctamente",
    })

    // Redirect to users page
    router.push("/usuarios")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Cargando...</h2>
          <p className="text-gray-500">Obteniendo información del usuario</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Cargando...</h2>
          <p className="text-gray-500">Obteniendo información del usuario</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/usuarios")} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Editar Usuario</h1>
          </div>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Editar Usuario: {userData.name}</CardTitle>
            <CardDescription>Modifica los datos del usuario</CardDescription>
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
                <Label htmlFor="password">Contraseña (Dejar en blanco para mantener la actual)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
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

              <div className="flex items-center space-x-2">
                <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="active">Usuario Activo</Label>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/usuarios")}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

