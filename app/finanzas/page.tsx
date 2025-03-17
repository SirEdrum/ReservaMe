"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { getDrivers, getTripHistory } from "@/lib/data"
import { Home, User, DollarSign, Calendar, ArrowRight } from "lucide-react"

export default function FinanzasPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [drivers, setDrivers] = useState([])
  const [tripHistory, setTripHistory] = useState([])
  const [groupBy, setGroupBy] = useState("day")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticación
    if (!user) {
      return
    }

    if (user.role !== "administrador" && user.role !== "recepcionista") {
      router.push("/login")
      return
    }

    // Cargar datos
    const loadData = async () => {
      // Get drivers
      const allDrivers = getDrivers().filter((driver) => driver.active)

      // Get trip history
      const history = getTripHistory()

      // Calculate driver statistics
      const driversWithStats = allDrivers.map((driver) => {
        const driverTrips = history.filter((trip) => trip.driverId === driver.id)

        // Get today's trips
        const today = new Date().toLocaleDateString("es-MX")
        const todayTrips = driverTrips.filter(
          (trip) => new Date(trip.completionTime).toLocaleDateString("es-MX") === today,
        )

        return {
          ...driver,
          totalTrips: driverTrips.length,
          todayTrips: todayTrips.length,
          todayAmount: todayTrips.reduce((sum, trip) => sum + trip.amount, 0),
        }
      })

      setDrivers(driversWithStats)
      setTripHistory(history)
      setIsLoading(false)
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Group trips by day, week, month, or year
  const groupTrips = (trips, groupType) => {
    if (!trips.length) return []

    const grouped = {}

    trips.forEach((trip) => {
      const tripDate = new Date(trip.completionTime)
      let key

      if (groupType === "day") {
        key = tripDate.toLocaleDateString("es-MX")
      } else if (groupType === "week") {
        // Get the week number
        const firstDayOfYear = new Date(tripDate.getFullYear(), 0, 1)
        const pastDaysOfYear = (tripDate - firstDayOfYear) / 86400000
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
        key = `Semana ${weekNumber}, ${tripDate.getFullYear()}`
      } else if (groupType === "month") {
        key = tripDate.toLocaleDateString("es-MX", { month: "long", year: "numeric" })
      } else if (groupType === "year") {
        key = tripDate.getFullYear().toString()
      }

      if (!grouped[key]) {
        grouped[key] = {
          label: key,
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

  const groupedTrips = groupTrips(tripHistory, groupBy)

  const handleCobrosClick = () => {
    router.push("/cobros")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Cargando...</h2>
          <p className="text-gray-500">Obteniendo información financiera</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">FINANZAS</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Choferes</CardTitle>
            <CardDescription>Estadísticas financieras por chofer</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chofer</TableHead>
                  <TableHead>Total de Viajes</TableHead>
                  <TableHead>Viajes Hoy</TableHead>
                  <TableHead>Recaudado Hoy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        {driver.name}
                      </div>
                    </TableCell>
                    <TableCell>{driver.totalTrips}</TableCell>
                    <TableCell>{driver.todayTrips}</TableCell>
                    <TableCell className="font-bold">${driver.todayAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Historial de Viajes</CardTitle>
              <CardDescription>Estadísticas financieras de todos los viajes</CardDescription>
            </div>
            <Tabs defaultValue="day" value={groupBy} onValueChange={setGroupBy} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="day">Por Día</TabsTrigger>
                <TabsTrigger value="week">Por Semana</TabsTrigger>
                <TabsTrigger value="month">Por Mes</TabsTrigger>
                <TabsTrigger value="year">Por Año</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {groupedTrips.length > 0 ? (
              <div className="space-y-4">
                {groupedTrips.map((group, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">{group.label}</h3>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total recaudado</div>
                        <div className="font-bold text-primary text-xl">${group.totalAmount.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-md border">
                        <div className="text-sm text-gray-500">Viajes</div>
                        <div className="font-bold text-2xl">{group.trips.length}</div>
                      </div>

                      <div className="bg-white p-4 rounded-md border">
                        <div className="text-sm text-gray-500">Pasajeros</div>
                        <div className="font-bold text-2xl">{group.totalPassengers}</div>
                      </div>

                      <div className="bg-white p-4 rounded-md border">
                        <div className="text-sm text-gray-500">Promedio por viaje</div>
                        <div className="font-bold text-2xl">${(group.totalAmount / group.trips.length).toFixed(2)}</div>
                      </div>
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
                <p className="text-gray-500">No se han realizado viajes aún</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button size="lg" onClick={handleCobrosClick} className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            COBROS
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

