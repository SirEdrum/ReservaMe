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
import { getDestinations, addDestination, updateDestination } from "@/lib/data"
import { Home, MapPin, Edit, Check } from "lucide-react"

export default function DestinosPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [destinations, setDestinations] = useState(getDestinations())
  const [formData, setFormData] = useState({
    id: "",
    name: "",
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

  const handleEditDestination = (destination) => {
    setFormData({
      id: destination.id,
      name: destination.name,
    })
    setIsEditing(true)
  }

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
    })
    setIsEditing(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre de la ciudad",
        variant: "destructive",
      })
      return
    }

    if (isEditing) {
      // Update existing destination
      const updatedDestination = {
        id: formData.id,
        name: formData.name,
      }

      updateDestination(updatedDestination)

      // Update local state
      setDestinations(destinations.map((dest) => (dest.id === formData.id ? updatedDestination : dest)))

      // Show success message
      setSuccessMessage(`Destino ${updatedDestination.name} actualizado correctamente`)
      setTimeout(() => setSuccessMessage(""), 5000)
    } else {
      // Check if destination already exists
      if (destinations.some((dest) => dest.name.toLowerCase() === formData.name.toLowerCase())) {
        toast({
          title: "Error",
          description: "Este destino ya existe",
          variant: "destructive",
        })
        return
      }

      // Add new destination
      const newDestination = {
        id: (destinations.length + 1).toString(),
        name: formData.name,
      }

      addDestination(newDestination)
      setDestinations([...destinations, newDestination])

      toast({
        title: "Éxito",
        description: "Destino agregado correctamente",
      })
    }

    // Reset form
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Destinos</h1>
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
              <CardTitle>{isEditing ? "Editar Destino" : "Agregar Destino"}</CardTitle>
              <CardDescription>
                {isEditing ? "Modifica el nombre de la ciudad de destino" : "Ingresa el nombre de la ciudad de destino"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Ciudad *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ciudad de México"
                    required
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
              <CardTitle>Destinos Registrados</CardTitle>
              <CardDescription>Lista de todos los destinos en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinations.map((destination) => (
                    <TableRow key={destination.id}>
                      <TableCell>{destination.id}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          {destination.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEditDestination(destination)}>
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

