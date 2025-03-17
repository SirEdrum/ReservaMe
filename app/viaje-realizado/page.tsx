"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getTrips, getReservations, completeTripAndCollectPayment, updateBusAvailability } from "@/lib/data"
import { Bus, User, MapPin, DollarSign, ShipWheelIcon as SteeringWheel, Check } from "lucide-react"

export default function ViajeRealizadoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [trip, setTrip] = useState(null)
  const [passengers, setPassengers] = useState([])
  const [selectedPassengers, setSelectedPassengers] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [arrivalConfirmed, setArrivalConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const tripId = searchParams.get("tripId")

  // Efecto para autenticación - solo se ejecuta una vez
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "chofer") {
      router.push("/login")
      return
    }

    if (!tripId) {
      router.push("/mis-viajes")
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intencionalmente vacío para ejecutarse solo una vez

  // Efecto para cargar datos - solo se ejecuta cuando cambia tripId o user
  useEffect(() => {
    if (!user || user.role !== "chofer" || !tripId) {
      return
    }

    // Get trip data
    const tripData = getTrips().find((t) => t.id === tripId)
    if (!tripData || tripData.driverId !== user.id) {
      router.push("/mis-viajes")
      return
    }

    setTrip(tripData)

    // Get confirmed reservations for this trip
    const confirmedReservations = getReservations().filter((r) => r.tripId === tripId && r.status === "Confirmado")

    setPassengers(confirmedReservations)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, user]) // Solo dependencias esenciales

  // Efecto para calcular el total - solo se ejecuta cuando cambian las selecciones
  useEffect(() => {
    // Calculate total amount based on selected passengers
    const total = selectedPassengers.reduce((sum, passengerId) => {
      const passenger = passengers.find((p) => p.id === passengerId)
      return sum + (passenger ? passenger.price : 0)
    }, 0)

    setTotalAmount(total)
  }, [selectedPassengers, passengers])

  const handleConfirmArrival = () => {
    setArrivalConfirmed(true)

    toast({
      title: "Llegada Confirmada",
      description: "Ahora puedes seleccionar los pasajeros para confirmar el cobro",
    })
  }

  const handlePassengerSelect = (passengerId) => {
    setSelectedPassengers((prev) => {
      if (prev.includes(passengerId)) {
        return prev.filter((id) => id !== passengerId)
      } else {
        return [...prev, passengerId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedPassengers.length === passengers.length) {
      // Deselect all
      setSelectedPassengers([])
    } else {
      // Select all
      setSelectedPassengers(passengers.map((p) => p.id))
    }
  }

  const handleConfirmPayment = () => {
    if (selectedPassengers.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos un pasajero",
        variant: "destructive",
      })
      return
    }

    // Complete trip and collect payment
    completeTripAndCollectPayment(trip.id, selectedPassengers, totalAmount)

    // Update bus availability
    updateBusAvailability(trip.busId, true)

    toast({
      title: "Éxito",
      description: "Viaje completado y cobro registrado correctamente",
    })

    // Redirect to driver trips
    router.push("/mis-viajes")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Cargando...</h2>
          <p className="text-gray-500">Obteniendo información del viaje</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-gray-500">No se pudo obtener la información del viaje.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Viaje Realizado</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/mis-viajes")}>
            <SteeringWheel className="h-5 w-5" />
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información del Viaje</CardTitle>
            <CardDescription>Detalles del viaje completado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Destino</div>
                <div className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  {trip.destinationName}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500">Autobús</div>
                <div className="font-medium flex items-center">
                  <Bus className="h-4 w-4 mr-2 text-primary" />
                  {trip.busPlate}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500">Salida</div>
                <div className="font-medium">
                  {new Date(trip.departureTime).toLocaleString("es-MX", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            </div>

            {!arrivalConfirmed ? (
              <div className="mt-6 text-center">
                <Button size="lg" onClick={handleConfirmArrival}>
                  Confirmar Llegada a Destino
                </Button>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center text-green-700">
                  <Check className="h-5 w-5 mr-2" />
                  <span className="font-medium">Llegada confirmada</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {arrivalConfirmed && (
          <Card>
            <CardHeader>
              <CardTitle>Pasajeros Confirmados</CardTitle>
              <CardDescription>Selecciona los pasajeros para confirmar el cobro</CardDescription>
            </CardHeader>
            <CardContent>
              {passengers.length > 0 ? (
                <>
                  <div className="flex items-center mb-4">
                    <Checkbox
                      id="selectAll"
                      checked={selectedPassengers.length === passengers.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="selectAll" className="ml-2 text-sm font-medium">
                      Seleccionar todos
                    </label>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Asiento</TableHead>
                        <TableHead>Lugar de Abordaje</TableHead>
                        <TableHead>Precio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {passengers.map((passenger) => (
                        <TableRow key={passenger.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPassengers.includes(passenger.id)}
                              onCheckedChange={() => handlePassengerSelect(passenger.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              {passenger.passengerName}
                            </div>
                          </TableCell>
                          <TableCell>{passenger.seatNumber}</TableCell>
                          <TableCell>{passenger.boardingLocationName}</TableCell>
                          <TableCell>${passenger.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-500">Total Seleccionado</div>
                        <div className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{selectedPassengers.length} pasajeros seleccionados</div>
                      </div>

                      <Button size="lg" onClick={handleConfirmPayment} disabled={selectedPassengers.length === 0}>
                        <DollarSign className="h-5 w-5 mr-2" />
                        Confirmar Cobro
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-500">No hay pasajeros confirmados para este viaje</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

