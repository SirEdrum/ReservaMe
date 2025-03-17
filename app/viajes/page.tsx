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
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getBuses, getDrivers, getDestinations, getTrips, addTrip } from "@/lib/data"
import { Home, MapPin, DollarSign } from "lucide-react"

export default function ViajesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [buses, setBuses] = useState(getBuses().filter((bus) => bus.available))
  const [drivers, setDrivers] = useState(getDrivers().filter((driver) => driver.active))
  const [destinations, setDestinations] = useState(getDestinations())
  const [trips, setTrips] = useState(getTrips())
  const [formData, setFormData] = useState({
    busId: "",
    driverId: "",
    destinationId: "",
    departureTime: "",
    price: "",
  })

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

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.busId ||
      !formData.driverId ||
      !formData.destinationId ||
      !formData.departureTime ||
      !formData.price
    ) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    // Get related objects
    const bus = buses.find((b) => b.id === formData.busId)
    const driver = drivers.find((d) => d.id === formData.driverId)
    const destination = destinations.find((d) => d.id === formData.destinationId)

    if (!bus || !driver || !destination) {
      toast({
        title: "Error",
        description: "Datos inválidos",
        variant: "destructive",
      })
      return
    }

    // Add new trip
    const newTrip = {
      id: (trips.length + 1).toString(),
      busId: formData.busId,
      busPlate: bus.plate,
      driverId: formData.driverId,
      driverName: driver.name,
      destinationId: formData.destinationId,
      destinationName: destination.name,
      departureTime: formData.departureTime,
      price: Number.parseFloat(formData.price),
      status: "Programado",
      passengers: [],
      capacity: bus.seats,
    }

    addTrip(newTrip)
    setTrips([...trips, newTrip])

    // Reset form
    setFormData({
      busId: "",
      driverId: "",
      destinationId: "",
      departureTime: "",
      price: "",
    })

    toast({
      title: "Éxito",
      description: "Viaje agregado correctamente",
    })

    // Redirect to home page
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Viajes</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Agregar Viaje</CardTitle>
              <CardDescription>Ingresa los datos del nuevo viaje</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="busId">Autobús *</Label>
                  <Select value={formData.busId} onValueChange={(value) => handleSelectChange("busId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar autobús" />
                    </SelectTrigger>
                    <SelectContent>
                      {buses.map((bus) => (
                        <SelectItem key={bus.id} value={bus.id}>
                          {bus.plate} - {bus.model} ({bus.seats} asientos)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverId">Chofer *</Label>
                  <Select value={formData.driverId} onValueChange={(value) => handleSelectChange("driverId", value)}>
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

                <div className="space-y-2">
                  <Label htmlFor="destinationId">Destino *</Label>
                  <Select
                    value={formData.destinationId}
                    onValueChange={(value) => handleSelectChange("destinationId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((destination) => (
                        <SelectItem key={destination.id} value={destination.id}>
                          {destination.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departureTime">Hora de Salida *</Label>
                  <Input
                    id="departureTime"
                    name="departureTime"
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio del Viaje *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="0.00"
                      required
                    />
                  </div>
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
              <CardTitle>Viajes Programados</CardTitle>
              <CardDescription>Lista de todos los viajes en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destino</TableHead>
                    <TableHead>Autobús</TableHead>
                    <TableHead>Chofer</TableHead>
                    <TableHead>Salida</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          {trip.destinationName}
                        </div>
                      </TableCell>
                      <TableCell>{trip.busPlate}</TableCell>
                      <TableCell>{trip.driverName}</TableCell>
                      <TableCell>
                        {new Date(trip.departureTime).toLocaleString("es-MX", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </TableCell>
                      <TableCell>${trip.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            trip.status === "Programado"
                              ? "bg-blue-500"
                              : trip.status === "En ruta"
                                ? "bg-green-500"
                                : "bg-gray-500"
                          }
                        >
                          {trip.status}
                        </Badge>
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

