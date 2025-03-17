"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Home, Bus, User } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { getTripHistory } from "@/lib/data"

export default function HistorialPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [tripHistory, setTripHistory] = useState([])
  const [filteredHistory, setFilteredHistory] = useState([])
  const [date, setDate] = useState(null)
  const [groupBy, setGroupBy] = useState("day")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role === "administrador" || user.role === "recepcionista") {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        router.push("/login")
      }
    } else {
      setIsAuthenticated(false)
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    // Get trip history
    const history = getTripHistory()
    setTripHistory(history)
    setFilteredHistory(history)
  }, [])

  useEffect(() => {
    if (date) {
      // Filter history by selected date
      const selectedDate = new Date(date)
      const filtered = tripHistory.filter((trip) => {
        const tripDate = new Date(trip.completionTime)
        return (
          tripDate.getDate() === selectedDate.getDate() &&
          tripDate.getMonth() === selectedDate.getMonth() &&
          tripDate.getFullYear() === selectedDate.getFullYear()
        )
      })
      setFilteredHistory(filtered)
    } else {
      setFilteredHistory(tripHistory)
    }
  }, [date, tripHistory])

  // Group trips by day, week, or month
  const groupTrips = (trips, groupType) => {
    if (!trips.length) return []

    const grouped = {}

    trips.forEach((trip) => {
      const tripDate = new Date(trip.completionTime)
      let key

      if (groupType === "day") {
        key = format(tripDate, "yyyy-MM-dd")
      } else if (groupType === "week") {
        // Get the week number
        const firstDayOfYear = new Date(tripDate.getFullYear(), 0, 1)
        const pastDaysOfYear = (tripDate - firstDayOfYear) / 86400000
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
        key = `${tripDate.getFullYear()}-W${weekNumber}`
      } else if (groupType === "month") {
        key = format(tripDate, "yyyy-MM")
      }

      if (!grouped[key]) {
        grouped[key] = {
          label: getGroupLabel(tripDate, groupType),
          trips: [],
          totalPassengers: 0,
          totalAmount: 0,
        }
      }

      grouped[key].trips.push(trip)
      grouped[key].totalPassengers += trip.passengerCount
      grouped[key].totalAmount += trip.amount
    })

    return Object.values(grouped)
  }

  const getGroupLabel = (date, groupType) => {
    if (groupType === "day") {
      return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
    } else if (groupType === "week") {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
      const pastDaysOfYear = (date - firstDayOfYear) / 86400000
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
      return `Semana ${weekNumber}, ${date.getFullYear()}`
    } else if (groupType === "month") {
      return format(date, "MMMM 'de' yyyy", { locale: es })
    }
    return ""
  }

  const groupedTrips = groupTrips(filteredHistory, groupBy)

  const clearDateFilter = () => {
    setDate(null)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Historial de Viajes</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Tabs defaultValue="day" value={groupBy} onValueChange={setGroupBy} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="day">Por Día</TabsTrigger>
              <TabsTrigger value="week">Por Semana</TabsTrigger>
              <TabsTrigger value="month">Por Mes</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            {date && (
              <Button variant="ghost" size="sm" onClick={clearDateFilter}>
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {groupedTrips.length > 0 ? (
          <div className="space-y-6">
            {groupedTrips.map((group, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{group.label}</CardTitle>
                  <CardDescription>
                    {group.trips.length} viajes • {group.totalPassengers} pasajeros • ${group.totalAmount.toFixed(2)}{" "}
                    recaudados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {group.trips.map((trip) => (
                      <div key={trip.id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h3 className="font-bold text-lg">{trip.destination}</h3>
                            <div className="space-y-1 mt-2">
                              <div className="flex items-center text-sm">
                                <Bus className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Autobús: {trip.bus}</span>
                              </div>

                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Chofer: {trip.driver}</span>
                              </div>

                              <div className="flex items-center text-sm">
                                <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                                <span>
                                  Salida:{" "}
                                  {new Date(trip.departureTime).toLocaleString("es-MX", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  })}
                                </span>
                              </div>

                              <div className="flex items-center text-sm">
                                <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
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
                            <div className="text-sm text-gray-500">Pasajeros</div>
                            <div className="font-bold">{trip.passengerCount}</div>

                            <div className="text-sm text-gray-500 mt-2">Recaudado</div>
                            <div className="font-bold text-primary text-xl">${trip.amount.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No hay viajes en el historial</h3>
              {date ? (
                <p className="text-gray-500 text-center">
                  No se encontraron viajes para la fecha seleccionada.
                  <br />
                  <Button variant="link" onClick={clearDateFilter} className="mt-2">
                    Ver todos los viajes
                  </Button>
                </p>
              ) : (
                <p className="text-gray-500">Los viajes completados aparecerán aquí.</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => router.push("/")} className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

