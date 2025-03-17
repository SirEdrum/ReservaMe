"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getBoardingLocations, addBoardingLocation, updateBoardingLocation } from "@/lib/data"
import { Home, MapPin, Edit, Check } from "lucide-react"

export default function LugaresAbordajePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [locations, setLocations] = useState(getBoardingLocations())
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
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

  const handleEditLocation = (location) => {
    setFormData({
      id: location.id,
      name: location.name,
      address: location.address,
    })
    setIsEditing(true)
  }

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      address: "",
    })
    setIsEditing(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre del lugar de abordaje",
        variant: "destructive",
      })
      return
    }

    if (isEditing) {
      // Update existing location
      const updatedLocation = {
        id: formData.id,
        name: formData.name,
        address: formData.address || "Sin dirección",
      }

      updateBoardingLocation(updatedLocation)

      // Update local state
      setLocations(locations.map((loc) => (loc.id === formData.id ? updatedLocation : loc)))

      // Show success message
      setSuccessMessage(`Lugar de abordaje ${updatedLocation.name} actualizado correctamente`)
      setTimeout(() => setSuccessMessage(""), 5000)
    } else {
      // Check if location already exists
      if (locations.some((loc) => loc.name.toLowerCase() === formData.name.toLowerCase())) {
        toast({
          title: "Error",
          description: "Este lugar de abordaje ya existe",
          variant: "destructive",
        })
        return
      }

      // Add new boarding location
      const newLocation = {
        id: (locations.length + 1).toString(),
        name: formData.name,
        address: formData.address || "Sin dirección",
      }

      addBoardingLocation(newLocation)
      setLocations([...locations, newLocation])

      toast({
        title: "Éxito",
        description: "Lugar de abordaje agregado correctamente",
      })
    }

    // Reset form
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Lugares de Abordaje</h1>
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
              <CardTitle>{isEditing ? "Editar Lugar de Abordaje" : "Agregar Lugar de Abordaje"}</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Modifica los datos del lugar de abordaje"
                  : "Ingresa los datos del nuevo lugar de abordaje"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Lugar *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Terminal Central"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Av. Principal #123"
                  />
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
              <CardTitle>Lugares de Abordaje Registrados</CardTitle>
              <CardDescription>Lista de todos los lugares de abordaje en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>{location.id}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          {location.name}
                        </div>
                      </TableCell>
                      <TableCell>{location.address}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEditLocation(location)}>
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

