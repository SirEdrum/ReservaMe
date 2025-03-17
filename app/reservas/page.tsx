"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getTrips, getBoardingLocations, addReservation, getReservations } from "@/lib/data"
import { Home, Calendar } from "lucide-react"

export default function ReservasPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [trips, setTrips] = useState(getTrips().filter((trip) => trip.status === "Programado"))
  const [boardingLocations, setBoardingLocations] = useState(getBoardingLocations())
  const [reservations, setReservations] = useState(getReservations())
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [formData, setFormData] = useState({
    passengerName: "",
    passengerPhone: "",
    passengerGender: "masculino",
    seatNumber: "",
    boardingLocationId: "",
  })
  const [availableSeats, setAvailableSeats] = useState([])

  // Check if user is authenticated and has appropriate role
  if (!user || (user.role !== "administrador" && user.role !== "recepcionista")) {
    router.push("/login")
    return null
  }

  const handleTripSelect = (tripId) => {
    const trip = trips.find((t) => t.id === tripId)
    setSelectedTrip(trip)

    // Generate available seats
    const reservedSeats = reservations.filter((r) => r.tripId === tripId).map((r) => r.seatNumber)

    const seats = []
    for (let i = 1; i <= trip.capacity; i++) {
      if (!reservedSeats.includes(i.toString())) {
        seats.push(i.toString())
      }
    }

    setAvailableSeats(seats)

    // Reset form
    setFormData({
      passengerName: "",
      passengerPhone: "",
      passengerGender: "masculino",
      seatNumber: "",
      boardingLocationId: "",
    })
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
      !selectedTrip ||
      !formData.passengerName ||
      !formData.passengerPhone ||
      !formData.seatNumber ||
      !formData.boardingLocationId
    ) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    // Get boarding location
    const boardingLocation = boardingLocations.find((loc) => loc.id === formData.boardingLocationId)

    if (!boardingLocation) {
      toast({
        title: "Error",
        description: "Lugar de abordaje inválido",
        variant: "destructive",
      })
      return
    }

    // Add new reservation
    const newReservation = {
      id: (reservations.length + 1).toString(),
      tripId: selectedTrip.id,
      destinationName: selectedTrip.destinationName,
      departureTime: selectedTrip.departureTime,
      passengerName: formData.passengerName,
      passengerPhone: formData.passengerPhone,
      passengerGender: formData.passengerGender,
      seatNumber: formData.seatNumber,
      boardingLocationId: formData.boardingLocationId,
      boardingLocationName: boardingLocation.name,
      status: "Pendiente",
      price: selectedTrip.price,
    }

    addReservation(newReservation)

    setReservations([...reservations, newReservation])

    // Update available seats
    const updatedSeats = availableSeats.filter((seat) => seat !== formData.seatNumber)
    setAvailableSeats(updatedSeats)

    // Reset form
    setFormData({
      passengerName: "",
      passengerPhone: "",
      passengerGender: "masculino",
      seatNumber: "",
      boardingLocationId: "",
    })

    toast({
      title: "Éxito",
      description: "Reserva agregada correctamente",
    })

    // Redirect to home page
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Reservas</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Viaje</CardTitle>
                <CardDescription>Elige un viaje para realizar la reserva</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trips.length > 0 ? (
                    trips.map((trip) => (
                      <div
                        key={trip.id}
                        className={`p-4 border rounded-md cursor-pointer transition-colors ${
                          selectedTrip?.id === trip.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        onClick={() => handleTripSelect(trip.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{trip.destinationName}</h3>
                            <p className="text-sm text-gray-500">
                              Autobús: {trip.busPlate} • Chofer: {trip.driverName}
                            </p>
                            <div className="flex items-center mt-2">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-sm">
                                {new Date(trip.departureTime).toLocaleString("es-MX", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-blue-500">{trip.status}</Badge>
                            <p className="mt-2 font-bold">${trip.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">Asientos disponibles: </span>
                          <span className="font-medium">
                            {trip.capacity - reservations.filter((r) => r.tripId === trip.id).length}/{trip.capacity}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">No hay viajes programados disponibles</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedTrip && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Datos del Pasajero</CardTitle>
                <CardDescription>Ingresa los datos para la reserva a {selectedTrip.destinationName}</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passengerName">Nombre del Pasajero *</Label>
                      <Input
                        id="passengerName"
                        name="passengerName"
                        value={formData.passengerName}
                        onChange={handleInputChange}
                        placeholder="Juan Pérez"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passengerPhone">Teléfono *</Label>
                      <Input
                        id="passengerPhone"
                        name="passengerPhone"
                        value={formData.passengerPhone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Sexo *</Label>
                    <RadioGroup
                      value={formData.passengerGender}
                      onValueChange={(value) => handleSelectChange("passengerGender", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="masculino" id="masculino" />
                        <Label htmlFor="masculino">Masculino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="femenino" id="femenino" />
                        <Label htmlFor="femenino">Femenino</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seatNumber">Número de Asiento *</Label>
                      <Select
                        value={formData.seatNumber}
                        onValueChange={(value) => handleSelectChange("seatNumber", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar asiento" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSeats.map((seat) => (
                            <SelectItem key={seat} value={seat}>
                              Asiento {seat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="boardingLocationId">Lugar de Abordaje *</Label>
                      <Select
                        value={formData.boardingLocationId}
                        onValueChange={(value) => handleSelectChange("boardingLocationId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar lugar" />
                        </SelectTrigger>
                        <SelectContent>
                          {boardingLocations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold mb-2">Resumen de la Reserva</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">Destino:</div>
                      <div>{selectedTrip.destinationName}</div>

                      <div className="text-gray-500">Fecha y Hora:</div>
                      <div>
                        {new Date(selectedTrip.departureTime).toLocaleString("es-MX", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>

                      <div className="text-gray-500">Autobús:</div>
                      <div>{selectedTrip.busPlate}</div>

                      <div className="text-gray-500">Precio:</div>
                      <div className="font-bold">${selectedTrip.price.toFixed(2)}</div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => router.push("/")}>
                    Cancelar
                  </Button>
                  <Button type="submit">Confirmar Reserva</Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

