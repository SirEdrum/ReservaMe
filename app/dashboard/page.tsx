import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bus, Calendar, CreditCard, LogOut, MapPin, Settings, Ticket, User } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">BusViajes</h1>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium">Juan Pérez</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-4 w-4" />
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center py-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <User className="h-10 w-10" />
                  </div>
                  <h2 className="text-xl font-bold">Juan Pérez</h2>
                  <p className="text-sm text-gray-500">juan.perez@example.com</p>
                  <p className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full mt-2">Cliente Frecuente</p>
                </div>

                <nav className="mt-6 space-y-1">
                  <Link href="/dashboard" className="flex items-center gap-2 p-2 bg-primary/10 text-primary rounded-md">
                    <Ticket className="h-4 w-4" />
                    <span>Mis Viajes</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                  <Link
                    href="/dashboard/payment"
                    className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Métodos de Pago</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <h1 className="text-2xl font-bold mb-6">Panel de Usuario</h1>

            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Próximos Viajes</TabsTrigger>
                <TabsTrigger value="past">Historial de Viajes</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Viajes</CardTitle>
                    <CardDescription>Viajes que tienes programados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingTrips.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingTrips.map((trip, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg font-bold">
                                    {trip.from} - {trip.to}
                                  </span>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    {trip.status}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>
                                    {trip.date} • {trip.time}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Bus className="h-4 w-4 mr-1" />
                                  <span>
                                    {trip.company} • {trip.type}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">${trip.price}</p>
                                <p className="text-xs text-gray-500">Boleto #{trip.ticketNumber}</p>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <Button size="sm">Ver Boleto</Button>
                              <Button size="sm" variant="outline">
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <Calendar className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No tienes viajes programados</h3>
                        <p className="text-gray-500">Reserva un viaje para que aparezca aquí</p>
                        <Button className="mt-4">Buscar Viajes</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="past">
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Viajes</CardTitle>
                    <CardDescription>Viajes que has realizado anteriormente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pastTrips.length > 0 ? (
                      <div className="space-y-4">
                        {pastTrips.map((trip, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg font-bold">
                                    {trip.from} - {trip.to}
                                  </span>
                                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                    {trip.status}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>
                                    {trip.date} • {trip.time}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Bus className="h-4 w-4 mr-1" />
                                  <span>
                                    {trip.company} • {trip.type}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-500">${trip.price}</p>
                                <p className="text-xs text-gray-500">Boleto #{trip.ticketNumber}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Button size="sm" variant="outline">
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <Ticket className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No tienes viajes anteriores</h3>
                        <p className="text-gray-500">Tu historial de viajes aparecerá aquí</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold mb-2">Buscar Rutas</h3>
                    <p className="text-sm text-gray-500 mb-4">Encuentra las mejores rutas para tu próximo viaje</p>
                    <Button variant="outline" className="w-full">
                      Explorar
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <Ticket className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold mb-2">Reservar Boleto</h3>
                    <p className="text-sm text-gray-500 mb-4">Reserva un nuevo boleto para tu próximo destino</p>
                    <Button className="w-full">Reservar</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold mb-2">Métodos de Pago</h3>
                    <p className="text-sm text-gray-500 mb-4">Administra tus tarjetas y métodos de pago</p>
                    <Button variant="outline" className="w-full">
                      Administrar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

const upcomingTrips = [
  {
    from: "Ciudad de México",
    to: "Guadalajara",
    date: "15 de Abril, 2025",
    time: "10:30 AM",
    company: "Primera Plus",
    type: "Primera Clase",
    price: "450",
    status: "Confirmado",
    ticketNumber: "BP123456",
  },
  {
    from: "Guadalajara",
    to: "Puerto Vallarta",
    date: "28 de Mayo, 2025",
    time: "08:30 AM",
    company: "Vallarta Plus",
    type: "Ejecutivo",
    price: "320",
    status: "Pendiente de Pago",
    ticketNumber: "BP789012",
  },
]

const pastTrips = [
  {
    from: "Ciudad de México",
    to: "Acapulco",
    date: "10 de Marzo, 2025",
    time: "09:45 AM",
    company: "ADO",
    type: "Ejecutivo",
    price: "380",
    status: "Completado",
    ticketNumber: "BP345678",
  },
  {
    from: "Acapulco",
    to: "Ciudad de México",
    date: "15 de Marzo, 2025",
    time: "16:30 PM",
    company: "ADO",
    type: "Ejecutivo",
    price: "380",
    status: "Completado",
    ticketNumber: "BP567890",
  },
  {
    from: "Ciudad de México",
    to: "Puebla",
    date: "28 de Febrero, 2025",
    time: "11:00 AM",
    company: "ADO",
    type: "Estándar",
    price: "180",
    status: "Completado",
    ticketNumber: "BP234567",
  },
]

