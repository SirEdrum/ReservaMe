"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getDrivers, getTripHistory, addPayment } from "@/lib/data"
import { Home, CalendarIcon, DollarSign, Check } from "lucide-react"

export default function CobrosPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [driverTrips, setDriverTrips] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [showPaymentForm, setShowPaymentForm] = useState(false)
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
  }, [user])

  useEffect(() => {
    // Get active drivers
    const activeDrivers = getDrivers().filter((driver) => driver.active)
    setDrivers(activeDrivers)
  }, [])

  const handleDriverChange = (value) => {
    setSelectedDriver(value)
    setDriverTrips([])
    setTotalAmount(0)
    setShowPaymentForm(false)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setDriverTrips([])
    setTotalAmount(0)
    setShowPaymentForm(false)
  }

  const handleSearch = () => {
    if (!selectedDriver || !selectedDate) {
      toast({
        title: "Error",
        description: "Por favor selecciona un chofer y una fecha",
        variant: "destructive",
      })
      return
    }

    // Get trip history for selected driver and date
    const history = getTripHistory()
    const selectedDateStr = selectedDate.toLocaleDateString("es-MX")

    const trips = history.filter(
      (trip) =>
        trip.driverId === selectedDriver &&
        new Date(trip.completionTime).toLocaleDateString("es-MX") === selectedDateStr,
    )

    setDriverTrips(trips)

    // Calculate total amount
    const total = trips.reduce((sum, trip) => sum + trip.amount, 0)
    setTotalAmount(total)

    if (trips.length > 0) {
      setShowPaymentForm(true)
      setPaymentAmount(total.toFixed(2))
    } else {
      toast({
        title: "Información",
        description: "No se encontraron viajes para el chofer y fecha seleccionados",
      })
      setShowPaymentForm(false)
    }
  }

  const handlePaymentAmountChange = (e) => {
    setPaymentAmount(e.target.value)
  }

  const handleConfirmPayment = () => {
    if (!paymentAmount || Number.parseFloat(paymentAmount) <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa un monto válido",
        variant: "destructive",
      })
      return
    }

    // Add payment to history
    const driver = drivers.find((d) => d.id === selectedDriver)

    const payment = {
      id: Date.now().toString(),
      driverId: selectedDriver,
      driverName: driver.name,
      date: selectedDate.toISOString(),
      tripCount: driverTrips.length,
      totalAmount: totalAmount,
      paymentAmount: Number.parseFloat(paymentAmount),
      timestamp: new Date().toISOString(),
      registeredBy: user.name,
    }

    addPayment(payment)

    toast({
      title: "Éxito",
      description: "Pago registrado correctamente",
    })

    // Reset form
    setSelectedDriver("")
    setDriverTrips([])
    setTotalAmount(0)
    setPaymentAmount("")
    setShowPaymentForm(false)

    // Redirect to payment history
    router.push("/historial-cobros")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cobros</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registrar Cobro</CardTitle>
            <CardDescription>Selecciona un chofer y una fecha para ver los viajes realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="driver">Chofer</Label>
                <Select value={selectedDriver} onValueChange={handleDriverChange}>
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
                <Label>Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end">
                <Button className="w-full" onClick={handleSearch} disabled={!selectedDriver || !selectedDate}>
                  Buscar
                </Button>
              </div>
            </div>

            {driverTrips.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Viajes Encontrados</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destino</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Pasajeros</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driverTrips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="font-medium">{trip.destination}</TableCell>
                        <TableCell>
                          {new Date(trip.completionTime).toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>{trip.passengerCount}</TableCell>
                        <TableCell className="text-right">${trip.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-bold text-right">
                        Total:
                      </TableCell>
                      <TableCell className="font-bold text-right text-primary">${totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {showPaymentForm && (
          <Card>
            <CardHeader>
              <CardTitle>Registrar Pago</CardTitle>
              <CardDescription>Ingresa la cantidad de dinero a entregar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Chofer:</div>
                    <div className="font-medium">{drivers.find((d) => d.id === selectedDriver)?.name}</div>

                    <div className="text-sm text-gray-500">Fecha:</div>
                    <div className="font-medium">{format(selectedDate, "PPP", { locale: es })}</div>

                    <div className="text-sm text-gray-500">Viajes realizados:</div>
                    <div className="font-medium">{driverTrips.length}</div>

                    <div className="text-sm text-gray-500">Total a cobrar:</div>
                    <div className="font-bold text-primary">${totalAmount.toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Cantidad a Entregar</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="paymentAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={paymentAmount}
                      onChange={handlePaymentAmountChange}
                      className="pl-10"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleConfirmPayment} className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Confirmar Entrega
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

