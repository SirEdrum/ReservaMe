"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getDrivers, getBuses, addBus, updateBus } from "@/lib/data"
import { Home, Edit, Check } from "lucide-react"

export default function AutobusesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [buses, setBuses] = useState(getBuses())
  const [drivers, setDrivers] = useState(getDrivers())
  const [formData, setFormData] = useState({
    id: "",
    plate: "",
    model: "",
    year: "",
    seats: "",
    driver: "",
    available: true,
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
      available: checked,
    })
  }

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      driver: value,
    })
  }

  const handleEditBus = (bus) => {
    setFormData({
      id: bus.id,
      plate: bus.plate,
      model: bus.model,
      year: bus.year || "",
      seats: bus.seats.toString(),
      driver: bus.driverId || "",
      available: bus.available,
    })
    setIsEditing(true)
  }

  const resetForm = () => {
    setFormData({
      id: "",
      plate: "",
      model: "",
      year: "",
      seats: "",
      driver: "",
      available: true,
    })
    setIsEditing(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.plate || !formData.model || !formData.seats) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    if (isEditing) {
      // Update existing bus
      const updatedBus = {
        id: formData.id,
        plate: formData.plate,
        model: formData.model,
        year: formData.year,
        seats: Number.parseInt(formData.seats),
        driver: formData.driver ? drivers.find((d) => d.id === formData.driver)?.name : "",
        driverId: formData.driver,
        available: formData.available,
      }

      updateBus(updatedBus)

      // Update local state
      setBuses(buses.map((bus) => (bus.id === formData.id ? updatedBus : bus)))

      // Show success message
      setSuccessMessage(`Combi ${updatedBus.plate} actualizada correctamente`)
      setTimeout(() => setSuccessMessage(""), 5000)
    } else {
      // Add new bus
      const newBus = {
        id: buses.length + 1,
        plate: formData.plate,
        model: formData.model,
        year: formData.year,
        seats: Number.parseInt(formData.seats),
        driver: formData.driver ? drivers.find((d) => d.id === formData.driver)?.name : "",
        driverId: formData.driver,
        available: formData.available,
      }

      addBus(newBus)
      setBuses([...buses, newBus])

      toast({
        title: "Éxito",
        description: "Combi agregada correctamente",
      })
    }

    // Reset form
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Combis</h1>
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
              <CardTitle>{isEditing ? "Editar Combi" : "Agregar Combi"}</CardTitle>
              <CardDescription>
                {isEditing ? "Modifica los datos de la combi" : "Ingresa los datos de la nueva combi"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placas *</Label>
                  <Input
                    id="plate"
                    name="plate"
                    value={formData.plate}
                    onChange={handleInputChange}
                    placeholder="ABC-1234"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modelo *</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Mercedes Benz"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Año</Label>
                  <Input
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="2023"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seats">Número de Asientos *</Label>
                  <Input
                    id="seats"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    placeholder="40"
                    type="number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver">Chofer</Label>
                  <Select value={formData.driver} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar chofer" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="available" checked={formData.available} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="available">Disponible</Label>
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
              <CardTitle>Combis Registradas</CardTitle>
              <CardDescription>Lista de todas las combis en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placas</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Asientos</TableHead>
                    <TableHead>Chofer</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buses.map((bus) => (
                    <TableRow key={bus.id}>
                      <TableCell className="font-medium">{bus.plate}</TableCell>
                      <TableCell>
                        {bus.model} {bus.year}
                      </TableCell>
                      <TableCell>{bus.seats}</TableCell>
                      <TableCell>{bus.driver || "No asignado"}</TableCell>
                      <TableCell>
                        <Badge className={bus.available ? "bg-green-500" : "bg-red-500"}>
                          {bus.available ? "Disponible" : "No disponible"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEditBus(bus)}>
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

