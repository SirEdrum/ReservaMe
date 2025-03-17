"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getDrivers, addDriver, updateDriver } from "@/lib/data"
import { Home, Edit, Check } from "lucide-react"

export default function ChoferesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [drivers, setDrivers] = useState(getDrivers())
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    username: "",
    password: "",
    active: true,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Check if user is authenticated and has appropriate role
  if (!user || (user.role !== "administrador" && user.role !== "recepcionista")) {
    router.push("/login")
    return null
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
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

  const handleEditDriver = (driver) => {
    setFormData({
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      username: driver.username,
      password: "", // No mostrar la contraseña actual
      active: driver.active,
    })
    setIsEditing(true)
  }

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      phone: "",
      username: "",
      password: "",
      active: true,
    })
    setIsEditing(false)
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

    if (isEditing) {
      // Update existing driver
      const updatedDriver = {
        ...formData,
      }

      // Only update password if provided
      if (!formData.password) {
        const existingDriver = drivers.find((d) => d.id === formData.id)
        updatedDriver.password = existingDriver.password
      }

      updateDriver(updatedDriver)

      // Update local state
      setDrivers(drivers.map((driver) => (driver.id === formData.id ? updatedDriver : driver)))

      // Show success message
      setSuccessMessage(`Chofer ${updatedDriver.name} actualizado correctamente`)
      setTimeout(() => setSuccessMessage(""), 5000)
    } else {
      // Check if username already exists
      if (drivers.some((driver) => driver.username === formData.username)) {
        toast({
          title: "Error",
          description: "El nombre de usuario ya existe",
          variant: "destructive",
        })
        return
      }

      // Add new driver
      const newDriver = {
        id: (drivers.length + 1).toString(),
        name: formData.name,
        phone: formData.phone,
        username: formData.username,
        password: formData.password,
        active: formData.active,
      }

      addDriver(newDriver)
      setDrivers([...drivers, newDriver])

      toast({
        title: "Éxito",
        description: "Chofer agregado correctamente",
      })
    }

    // Reset form
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Choferes</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <p>{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>{isEditing ? "Editar Chofer" : "Agregar Chofer"}</CardTitle>
              <CardDescription>
                {isEditing ? "Modifica los datos del chofer" : "Ingresa los datos del nuevo chofer"}
              </CardDescription>
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

                <div className="space-y-2">
                  <Label htmlFor="username">Usuario *</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="juanperez"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    {isEditing ? "Contraseña (dejar en blanco para mantener la actual)" : "Contraseña *"}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required={!isEditing}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="active">Chofer Activo</Label>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={resetForm}>
                  {isEditing ? "Cancelar" : "Limpiar"}
                </Button>
                <Button type="submit">{isEditing ? "Actualizar" : "Guardar"}</Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Choferes Registrados</CardTitle>
              <CardDescription>Lista de todos los choferes en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell>{driver.phone}</TableCell>
                      <TableCell>{driver.username}</TableCell>
                      <TableCell>
                        <Badge className={driver.active ? "bg-green-500" : "bg-red-500"}>
                          {driver.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEditDriver(driver)}>
                          <Edit className="h-4 w-4 mr-2" />
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
      </div>
    </div>
  )
}

