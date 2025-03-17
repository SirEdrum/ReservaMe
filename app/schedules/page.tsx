import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bus, Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SchedulesPage() {
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
            <Link href="/routes" className="font-medium text-gray-600 hover:text-primary">
              Rutas
            </Link>
            <Link href="/schedules" className="font-medium text-primary">
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
          <h1 className="text-3xl font-bold">Horarios de Salida</h1>
          <p className="mt-2">Consulta los horarios de salida para todas nuestras rutas</p>
        </div>
      </div>

      {/* Schedule Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Selecciona una ruta para ver los horarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Origen
                </label>
                <select className="w-full rounded-md border border-gray-300 p-2">
                  <option value="">Seleccionar origen</option>
                  <option value="ciudad-mexico">Ciudad de México</option>
                  <option value="guadalajara">Guadalajara</option>
                  <option value="monterrey">Monterrey</option>
                  <option value="puebla">Puebla</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destino
                </label>
                <select className="w-full rounded-md border border-gray-300 p-2">
                  <option value="">Seleccionar destino</option>
                  <option value="acapulco">Acapulco</option>
                  <option value="cancun">Cancún</option>
                  <option value="veracruz">Veracruz</option>
                  <option value="oaxaca">Oaxaca</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha
                </label>
                <input type="date" className="w-full rounded-md border border-gray-300 p-2" />
              </div>
            </div>

            <Button className="mt-4">Buscar Horarios</Button>
          </CardContent>
        </Card>

        {/* Popular Routes Tabs */}
        <h2 className="text-2xl font-bold mb-4">Rutas Populares</h2>
        <Tabs defaultValue="cdmx-gdl">
          <TabsList className="mb-4">
            <TabsTrigger value="cdmx-gdl">CDMX - Guadalajara</TabsTrigger>
            <TabsTrigger value="cdmx-acapulco">CDMX - Acapulco</TabsTrigger>
            <TabsTrigger value="gdl-vallarta">Guadalajara - Puerto Vallarta</TabsTrigger>
          </TabsList>

          <TabsContent value="cdmx-gdl">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Ciudad de México - Guadalajara</span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">550 km • 6 horas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cdmxToGdlSchedules.map((schedule, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={`/placeholder.svg?height=40&width=80&text=${schedule.company}`}
                            alt={schedule.company}
                            className="h-10 w-20 object-contain mr-3"
                          />
                          <div>
                            <h3 className="font-medium">{schedule.company}</h3>
                            <p className="text-sm text-gray-500">{schedule.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">${schedule.price}</p>
                          <p className="text-sm text-gray-500">{schedule.availability}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex flex-wrap gap-2">
                          {schedule.departures.map((time, idx) => (
                            <div key={idx} className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-sm">{time}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Button>Reservar</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cdmx-acapulco">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Ciudad de México - Acapulco</span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">380 km • 4.5 horas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p>Selecciona esta ruta en el buscador para ver los horarios disponibles</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gdl-vallarta">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Guadalajara - Puerto Vallarta</span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">310 km • 5 horas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p>Selecciona esta ruta en el buscador para ver los horarios disponibles</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

const cdmxToGdlSchedules = [
  {
    company: "Primera Plus",
    type: "Primera Clase",
    price: "450",
    availability: "Asientos disponibles",
    departures: ["08:00", "10:30", "13:00", "16:30", "20:00"],
  },
  {
    company: "ETN",
    type: "Lujo",
    price: "650",
    availability: "Pocos asientos",
    departures: ["07:00", "11:00", "15:00", "19:00", "23:00"],
  },
  {
    company: "Futura",
    type: "Ejecutivo",
    price: "550",
    availability: "Asientos disponibles",
    departures: ["09:30", "14:30", "18:30", "22:30"],
  },
]

