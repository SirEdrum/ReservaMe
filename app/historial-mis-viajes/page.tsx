"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { getTripHistory } from "@/lib/data"
import { Home, Bus, Calendar, MapPin, User } from "lucide-react"

export default function HistorialMisViajesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [tripHistory, setTripHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "chofer") {
      router.push("/login")
      return
    }
  }, [user])

  useEffect(() => {
    if (user && user.role === "chofer") {
      setIsLoading(true)

      // Get trip history for this driver
      const history = getTripHistory().filter((trip) => trip.driverId === user.id)

      // Sort by completion time (most recent first)
      history.sort((a, b) => new Date(b.completionTime) - new Date(a.completionTime))

      // Get only the last 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const recentHistory = history.filter((trip) => new Date(trip.completionTime) >= sevenDaysAgo)

      setTripHistory(recentHistory)
      setIsLoading(false)
    }
  }, [user])

  // Group trips by day
  const groupTripsByDay = (trips) => {
    const grouped = {}

    trips.forEach((trip) => {
      const date = new Date(trip.completionTime).toLocaleDateString("es-MX")

      if (!grouped[date]) {
        grouped[date] = []
      }

      grouped[date].push(trip)
    })

    return Object.entries(grouped).map(([date, trips]) => ({
      date,
      trips,
      totalPassengers: trips.reduce((sum, trip) => sum + trip.passengerCount, 0),
      totalAmount: trips.reduce((sum, trip) => sum + trip.amount, 0),
    }))
  }

  const groupedTrips = groupTripsByDay(tripHistory)

  if (!user || user.role !== "chofer") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Historial de Mis Viajes</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Últimos 7 Días</CardTitle>
            <CardDescription>Historial de viajes realizados en los últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Cargando historial de viajes...</h3>
                <p className="text-gray-500">Por favor, espere.</p>
              </div>
            ) : groupedTrips.length > 0 ? (
              <div className="space-y-6">
                {groupedTrips.map((group, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">{group.date}</h3>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total recaudado</div>
                        <div className="font-bold text-primary">${group.totalAmount.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {group.trips.map((trip) => (
                        <div key={trip.id} className="p-4 border rounded-md bg-white">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <div className="flex items-center mb-2">
                                <MapPin className="h-4 w-4 mr-2 text-primary" />
                                <h4 className="font-medium">{trip.destination}</h4>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center text-sm">
                                  <Bus className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>Autobús: {trip.bus}</span>
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
                                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>
                                    Llegada:{" "}
                                    {new Date(trip.completionTime).toLocaleString("es-MX", {
                                      dateStyle: "short",
                                      timeStyle: "short",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1 text-gray-500" />
                                <span className="text-sm">{trip.passengerCount} pasajeros</span>
                              </div>

                              <div className="mt-2 font-bold text-primary">${trip.amount.toFixed(2)}</div>

                              <Badge className="mt-2 bg-green-500">Completado</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No hay viajes en el historial</h3>
                <p className="text-gray-500">No has realizado viajes en los últimos 7 días</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" size="lg" onClick={() => router.push("/mis-viajes")} className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Volver a Mis Viajes
          </Button>
        </div>
      </div>
    </div>
  )
}

