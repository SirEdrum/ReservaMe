import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bus, Search, MapPin, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function RoutesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">BusViajes</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="font-medium text-gray-600 hover:text-primary">
              Inicio
            </Link>
            <Link href="/routes" className="font-medium text-primary">
              Rutas
            </Link>
            <Link href="/schedules" className="font-medium text-gray-600 hover:text-primary">
              Horarios
            </Link>
            <Link href="/promotions" className="font-medium text-gray-600 hover:text-primary">
              Promociones
            </Link>
            <Link href="/contact" className="font-medium text-gray-600 hover:text-primary">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Rutas Disponibles</h1>
          <p className="mt-2">Explora todas nuestras rutas y encuentra tu próximo destino</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Origen
                </Label>
                <select className="w-full rounded-md border border-gray-300 p-2">
                  <option value="">Todos los orígenes</option>
                  <option value="ciudad-mexico">Ciudad de México</option>
                  <option value="guadalajara">Guadalajara</option>
                  <option value="monterrey">Monterrey</option>
                  <option value="puebla">Puebla</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Destino
                </Label>
                <select className="w-full rounded-md border border-gray-300 p-2">
                  <option value="">Todos los destinos</option>
                  <option value="acapulco">Acapulco</option>
                  <option value="cancun">Cancún</option>
                  <option value="veracruz">Veracruz</option>
                  <option value="oaxaca">Oaxaca</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Fecha
                </Label>
                <Input type="date" />
              </div>

              <div className="flex items-end">
                <Button className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Routes List */}
        <div className="space-y-4">
          {routes.map((route, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
                  <div className="bg-gray-100 p-4 flex items-center justify-center md:col-span-1">
                    <img
                      src={`/placeholder.svg?height=100&width=150&text=${route.company}`}
                      alt={route.company}
                      className="h-16 object-contain"
                    />
                  </div>
                  <div className="p-4 md:col-span-3 lg:col-span-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">
                            {route.from} - {route.to}
                          </h3>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">{route.type}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Operado por:</span> {route.company}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Bus className="h-4 w-4 mr-1" />
                          <span>
                            {route.duration} horas • {route.distance} km
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-1">
                        <div className="text-sm">
                          <p className="font-medium">Horarios disponibles:</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {route.schedules.map((time, idx) => (
                              <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-1 flex flex-col justify-between">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Desde</p>
                          <p className="text-2xl font-bold text-primary">${route.price}</p>
                        </div>
                        <Button className="mt-2 w-full">Ver Detalles</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Siguiente
            </Button>
          </nav>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bus className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">BusViajes</h3>
              </div>
              <p className="text-gray-400">
                La mejor plataforma para reservar tus viajes en autobús de manera rápida y segura.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/routes" className="text-gray-400 hover:text-white">
                    Rutas
                  </Link>
                </li>
                <li>
                  <Link href="/schedules" className="text-gray-400 hover:text-white">
                    Horarios
                  </Link>
                </li>
                <li>
                  <Link href="/promotions" className="text-gray-400 hover:text-white">
                    Promociones
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contacto</h4>
              <address className="not-italic text-gray-400">
                <p>Av. Principal #123</p>
                <p>Ciudad de México, México</p>
                <p className="mt-2">Email: info@busviajes.com</p>
                <p>Tel: (55) 1234-5678</p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} BusViajes. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const routes = [
  {
    from: "Ciudad de México",
    to: "Guadalajara",
    company: "Primera Plus",
    type: "Primera Clase",
    price: "450",
    duration: "6",
    distance: "550",
    schedules: ["08:00", "10:30", "13:00", "16:30", "20:00"],
  },
  {
    from: "Ciudad de México",
    to: "Acapulco",
    company: "ADO",
    type: "Ejecutivo",
    price: "380",
    duration: "4.5",
    distance: "380",
    schedules: ["07:30", "09:45", "12:15", "15:00", "18:30"],
  },
  {
    from: "Monterrey",
    to: "Ciudad de México",
    company: "ETN",
    type: "Lujo",
    price: "750",
    duration: "10",
    distance: "900",
    schedules: ["06:00", "14:00", "22:00"],
  },
  {
    from: "Guadalajara",
    to: "Puerto Vallarta",
    company: "Vallarta Plus",
    type: "Estándar",
    price: "320",
    duration: "5",
    distance: "310",
    schedules: ["08:30", "11:00", "14:30", "17:00"],
  },
  {
    from: "Ciudad de México",
    to: "Oaxaca",
    company: "ADO",
    type: "Platino",
    price: "520",
    duration: "7",
    distance: "460",
    schedules: ["07:00", "12:00", "19:00"],
  },
]

