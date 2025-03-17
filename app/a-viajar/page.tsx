"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getTrips, getReservations, updateReservationStatus } from "@/lib/data"
import { Bus, User, MapPin, Check, ShipWheelIcon as SteeringWheel } from "lucide-react"

export default function AViajarPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [trip, setTrip] = useState(null)
  const [pendingPassengers, setPendingPassengers] = useState([])
  const [confirmedPassengers, setConfirmedPassengers] = useState([])
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

    const tripData = getTrips().find((t) => t.id === tripId)
    if (!tripData || tripData.driverId !== user.id) {
      router.push("/mis-viajes")
      return
    }

    setTrip(tripData)

    // Get reservations for this trip
    const reservations = getReservations().filter((r) => r.tripId === tripId)

    // Split into pending and confirmed
    setPendingPassengers(reservations.filter((r) => r.status === "Pendiente"))
    setConfirmedPassengers(reservations.filter((r) => r.status === "Confirmado"))
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, user]) // Solo dependencias esenciales

  const handleConfirmBoarding = (reservationId) => {
    // Update reservation status
    updateReservationStatus(reservationId, "Confirmado")

    // Update local state
    const reservation = pendingPassengers.find((p) => p.id === reservationId)

    if (reservation) {
      setPendingPassengers((prev) => prev.filter((p) => p.id !== reservationId))
      setConfirmedPassengers((prev) => [...prev, { ...reservation, status: "Confirmado" }])

      toast({
        title: "Éxito",
        description: "Abordaje confirmado correctamente",
      })
    }
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
          <h1 className="text-2xl font-bold">Confirmar Abordaje</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/mis-viajes")}>
            <SteeringWheel className="h-5 w-5" />
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información del Viaje</CardTitle>
            <CardDescription>Detalles del viaje seleccionado</CardDescription>
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pasajeros Pendientes</CardTitle>
              <CardDescription>Pasajeros que aún no han abordado</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPassengers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Asiento</TableHead>
                      <TableHead>Lugar de Abordaje</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPassengers.map((passenger) => (
                      <TableRow key={passenger.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            {passenger.passengerName}
                          </div>
                        </TableCell>
                        <TableCell>{passenger.seatNumber}</TableCell>
                        <TableCell>{passenger.boardingLocationName}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => handleConfirmBoarding(passenger.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Confirmar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-gray-500">No hay pasajeros pendientes</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pasajeros Confirmados</CardTitle>
              <CardDescription>Pasajeros que ya han abordado</CardDescription>
            </CardHeader>
            <CardContent>
              {confirmedPassengers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Asiento</TableHead>
                      <TableHead>Lugar de Abordaje</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {confirmedPassengers.map((passenger) => (
                      <TableRow key={passenger.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            {passenger.passengerName}
                          </div>
                        </TableCell>
                        <TableCell>{passenger.seatNumber}</TableCell>
                        <TableCell>{passenger.boardingLocationName}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Confirmado</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-gray-500">No hay pasajeros confirmados</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => router.push("/mis-viajes")} className="flex items-center">
            <SteeringWheel className="h-5 w-5 mr-2" />
            Volver a Mis Viajes
          </Button>
        </div>
      </div>
    </div>
  )
}

