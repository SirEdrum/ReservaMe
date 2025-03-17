"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getTrips, getReservations } from "@/lib/data"
import { Home, Bus, Calendar, MapPin, Check, Flag, LogOut } from "lucide-react"

export default function MisViajesPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Efecto para autenticación - solo se ejecuta una vez
  useEffect(() => {
    if (!user) {
      return
    }

    if (user.role !== "chofer") {
      router.push("/login")
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intencionalmente vacío para ejecutarse solo una vez

  // Efecto para cargar datos - solo se ejecuta cuando cambia user
  useEffect(() => {
    if (!user || user.role !== "chofer") {
      return
    }

    // Get trips assigned to this driver
    const driverTrips = getTrips().filter((trip) => trip.driverId === user.id)

    // Get reservations for each trip
    const tripsWithReservations = driverTrips.map((trip) => {
      const reservations = getReservations().filter((r) => r.tripId === trip.id)
      return {
        ...trip,
        totalPassengers: reservations.length,
        confirmedPassengers: reservations.filter((r) => r.status === "Confirmado").length,
      }
    })

    setTrips(tripsWithReservations)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // Solo dependencia esencial

  const handleLogout = () => {
    logout()
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Cargando...</h2>
          <p className="text-gray-500">Obteniendo información de viajes</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario o no es chofer, no renderizar nada
  if (!user || user.role !== "chofer") {
    return null
  }

  const handleConfirmBoarding = (tripId) => {
    router.push(`/a-viajar?tripId=${tripId}`)
  }

  const handleTripCompleted = (tripId) => {
    router.push(`/viaje-realizado?tripId=${tripId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Mis Viajes</h1>
            <p className="text-gray-500">Bienvenido, {user.name}</p>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Viajes Asignados</CardTitle>
            <CardDescription>Lista de viajes asignados a {user.name}</CardDescription>
          </CardHeader>
          <CardContent>
            {trips.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {trips.map((trip) => (
                  <Card key={trip.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <MapPin className="h-5 w-5 mr-2 text-primary" />
                            <h3 className="font-bold text-lg">{trip.destinationName}</h3>
                            <Badge className="ml-2 bg-blue-500">{trip.status}</Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Bus className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Combi: {trip.busPlate}</span>
                            </div>

                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>
                                Salida:{" "}
                                {new Date(trip.departureTime).toLocaleString("es-MX", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </span>
                            </div>

                            <div className="flex items-center text-sm">
                              <span className="text-gray-500 mr-2">Pasajeros:</span>
                              <span className="font-medium">
                                {trip.confirmedPassengers}/{trip.totalPassengers} confirmados ({trip.capacity}{" "}
                                capacidad)
                              </span>
                            </div>
                          </div>
                        </div>

                        {trip.status !== "Completado" && (
                          <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Button onClick={() => handleConfirmBoarding(trip.id)} className="w-full md:w-auto">
                              <Check className="h-4 w-4 mr-2" />
                              Confirmar Abordaje
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() => handleTripCompleted(trip.id)}
                              className="w-full md:w-auto"
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              Viaje Realizado
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">No tienes viajes asignados en este momento</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

