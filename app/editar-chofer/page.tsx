"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getDrivers, updateDriver } from "@/lib/data"
import { Home, ArrowLeft } from "lucide-react"

export default function EditarChoferPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [driverData, setDriverData] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    username: "",
    password: "",
    active: true,
  })
  const [isLoading, setIsLoading] = useState(true) // Add loading state

  // Check if user is authenticated and has appropriate role
  useEffect(() => {
    if (!user || (user.role !== "administrador" && user.role !== "recepcionista")) {
      router.push("/login")
    }
  }, [user])

  useEffect(() => {
    const driverId = searchParams.get("id")

    if (driverId) {
      setIsLoading(true) // Start loading
      // Get driver data
      const drivers = getDrivers()
      const foundDriver = drivers.find((d) => d.id === driverId)

      if (foundDriver) {
        setDriverData(foundDriver)
        setFormData({
          name: foundDriver.name,
          phone: foundDriver.phone,
          username: foundDriver.username,
          password: "", // Don't show the password
          active: foundDriver.active,
        })
      } else {
        // Driver not found
        toast({
          title: "Error",
          description: "Chofer no encontrado",
          variant: "destructive",
        })
        router.push("/choferes")
      }
      setIsLoading(false) // Stop loading
    } else {
      // No driver ID provided
      router.push("/choferes")
    }
  }, [searchParams, router, toast])

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

    // Check if username already exists (except for this driver)
    const drivers = getDrivers()
    if (drivers.some((d) => d.username === formData.username && d.id !== driverData.id)) {
      toast({
        title: "Error",
        description: "El nombre de usuario ya existe",
        variant: "destructive",
      })
      return
    }

    // Update driver
    const updatedDriver = {
      ...driverData,
      name: formData.name,
      phone: formData.phone,
      username: formData.username,
      active: formData.active,
    }

    // Only update password if provided
    if (formData.password) {
      updatedDriver.password = formData.password
    }

    updateDriver(updatedDriver)

    toast({
      title: "Éxito",
      description: "Chofer actualizado correctamente",
    })

    // Redirect to drivers page
    router.push("/choferes")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Cargando...</h2>
          <p className="text-gray-500">Obteniendo información del chofer</p>
        </div>
      </div>
    )
  }

  if (!driverData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">No se encontró el chofer</h2>
          <p className="text-gray-500">El ID del chofer es inválido.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/choferes")} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Editar Chofer</h1>
          </div>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Editar Chofer: {driverData.name}</CardTitle>
            <CardDescription>Modifica los datos del chofer</CardDescription>
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

              <div className="flex items-center space-x-2">
                <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="active">Chofer Activo</Label>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/choferes")}>
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

