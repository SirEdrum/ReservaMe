"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, User, MapPin, Calendar, Clock, CreditCard, History, Users, DollarSign, Bell, LogOut } from "lucide-react"
import { getActiveTrips } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { Notification } from "@/components/notification"

export default function HomePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTrips, setActiveTrips] = useState([])
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Nueva reserva: Juan Pérez para el viaje a Guadalajara",
      time: "Hace 5 minutos",
      read: false,
    },
    {
      id: 2,
      message: "Viaje a Monterrey confirmado como realizado",
      time: "Hace 30 minutos",
      read: false,
    },
    {
      id: 3,
      message: "Combi MX-1234 disponible para nuevo viaje",
      time: "Hace 1 hora",
      read: true,
    },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [tripsLoaded, setTripsLoaded] = useState(false)

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Efecto separado para cargar viajes activos
  useEffect(() => {
    if (!tripsLoaded) {
      // Load active trips - solo una vez
      const loadTrips = async () => {
        const trips = await getActiveTrips()
        setActiveTrips(trips)
        setTripsLoaded(true)
      }

      loadTrips()
    }
  }, [tripsLoaded])

  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString()
  // Format date as Day, Month DD, YYYY
  const formattedDate = currentTime.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Check if user is authenticated and has appropriate role
  if (!user) {
    return null // Will redirect to login in auth context
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleLogout = () => {
    logout()
  }

  // Navigation buttons based on user role
  const getNavigationButtons = () => {
    if (user.role === "administrador") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NavigationButton icon={<Bus />} label="Combis" onClick={() => router.push("/autobuses")} />
          <NavigationButton icon={<User />} label="Choferes" onClick={() => router.push("/choferes")} />
          <NavigationButton icon={<MapPin />} label="Destinos" onClick={() => router.push("/destinos")} />
          <NavigationButton
            icon={<MapPin />}
            label="Lugares de Abordaje"
            onClick={() => router.push("/lugares-abordaje")}
          />
          <NavigationButton icon={<Calendar />} label="Viajes" onClick={() => router.push("/viajes")} />
          <NavigationButton icon={<CreditCard />} label="Reservas" onClick={() => router.push("/reservas")} />
          <NavigationButton icon={<History />} label="Historial" onClick={() => router.push("/historial")} />
          <NavigationButton icon={<Users />} label="Usuarios" onClick={() => router.push("/usuarios")} />
          <NavigationButton icon={<DollarSign />} label="Finanzas" onClick={() => router.push("/finanzas")} />
          <NavigationButton icon={<DollarSign />} label="Cobros" onClick={() => router.push("/cobros")} />
          <NavigationButton
            icon={<History />}
            label="Historial de Cobros"
            onClick={() => router.push("/historial-cobros")}
          />
          <NavigationButton
            icon={<History />}
            label="Historial General"
            onClick={() => router.push("/historial-general")}
          />
          <NavigationButton icon={<User />} label="System Edit" onClick={() => router.push("/system-edit")} />
        </div>
      )
    } else if (user.role === "recepcionista") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NavigationButton icon={<Bus />} label="Combis" onClick={() => router.push("/autobuses")} />
          <NavigationButton icon={<User />} label="Choferes" onClick={() => router.push("/choferes")} />
          <NavigationButton icon={<MapPin />} label="Destinos" onClick={() => router.push("/destinos")} />
          <NavigationButton
            icon={<MapPin />}
            label="Lugares de Abordaje"
            onClick={() => router.push("/lugares-abordaje")}
          />
          <NavigationButton icon={<Calendar />} label="Viajes" onClick={() => router.push("/viajes")} />
          <NavigationButton icon={<CreditCard />} label="Reservas" onClick={() => router.push("/reservas")} />
          <NavigationButton icon={<History />} label="Historial" onClick={() => router.push("/historial")} />
          <NavigationButton icon={<DollarSign />} label="Finanzas" onClick={() => router.push("/finanzas")} />
          <NavigationButton icon={<DollarSign />} label="Cobros" onClick={() => router.push("/cobros")} />
          <NavigationButton
            icon={<History />}
            label="Historial de Cobros"
            onClick={() => router.push("/historial-cobros")}
          />
          <NavigationButton
            icon={<History />}
            label="Historial General"
            onClick={() => router.push("/historial-general")}
          />
        </div>
      )
    } else if (user.role === "chofer") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <NavigationButton icon={<Calendar />} label="Mis Viajes" onClick={() => router.push("/mis-viajes")} />
          <NavigationButton icon={<Clock />} label="A Viajar" onClick={() => router.push("/a-viajar")} />
          <NavigationButton
            icon={<History />}
            label="Viaje Realizado"
            onClick={() => router.push("/viaje-realizado")}
          />
          <NavigationButton
            icon={<History />}
            label="Historial de Mis Viajes"
            onClick={() => router.push("/historial-mis-viajes")}
          />
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Sistema de Reservas de Combis</h1>
              <p className="text-gray-500">
                Bienvenido, {user.name} ({user.role})
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold">{formattedTime}</div>
              <div className="text-sm text-gray-500">{formattedDate}</div>
            </div>

            <div className="relative">
              <Button variant="outline" size="icon" onClick={toggleNotifications} className="relative">
                <Bell />
                {unreadNotificationsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-semibold">Notificaciones</h3>
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Marcar todas como leídas
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <Notification key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No hay notificaciones</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Viajes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            {activeTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeTrips.map((trip) => (
                  <Card key={trip.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{trip.destination}</h3>
                          <p className="text-sm text-gray-500">
                            Combi: {trip.bus} • Chofer: {trip.driver}
                          </p>
                          <div className="flex items-center mt-2">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">{trip.time}</span>
                          </div>
                        </div>
                        <Badge className={trip.status === "En ruta" ? "bg-green-500" : "bg-blue-500"}>
                          {trip.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-gray-500">Pasajeros: </span>
                          <span className="font-medium">
                            {trip.passengers}/{trip.capacity}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Precio: </span>
                          <span className="font-medium">${trip.price}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">No hay viajes activos en este momento</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navegación</CardTitle>
          </CardHeader>
          <CardContent>{getNavigationButtons()}</CardContent>
        </Card>
      </div>
    </div>
  )
}

function NavigationButton({ icon, label, onClick }) {
  return (
    <Button
      variant="outline"
      className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="text-primary">{icon}</div>
      <span>{label}</span>
    </Button>
  )
}

