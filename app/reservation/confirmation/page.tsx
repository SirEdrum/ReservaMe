import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, Check, Download, MapPin, Share2 } from "lucide-react"

export default function ConfirmationPage() {
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
            <Link href="/schedules" className="font-medium text-gray-600 hover:text-primary">
              Horarios
            </Link>
            <Link href="/promotions" className="font-medium text-gray-600 hover:text-primary">
              Promociones
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">¡Reserva Confirmada!</h1>
            <p className="text-gray-600">
              Tu reserva ha sido procesada exitosamente. Hemos enviado los detalles a tu correo electrónico.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader className="bg-primary text-white">
              <CardTitle>Boleto de Viaje</CardTitle>
              <CardDescription className="text-white/80">Presenta este boleto en la terminal</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Ciudad de México - Guadalajara</h2>
                  <p className="text-gray-500">Primera Plus • Primera Clase</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm text-gray-500">Número de Reserva</p>
                  <p className="text-lg font-bold">BV-123456</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Salida</p>
                    <p className="font-medium">15 de Abril, 2025</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Hora de Salida</p>
                    <p className="font-medium">10:30 AM</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Terminal de Salida</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                      <p className="font-medium">Terminal Central del Norte, CDMX</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Llegada</p>
                    <p className="font-medium">15 de Abril, 2025</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Hora de Llegada (estimada)</p>
                    <p className="font-medium">16:30 PM</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Terminal de Llegada</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                      <p className="font-medium">Terminal Nueva Central, Guadalajara</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed pt-6 mb-6">
                <h3 className="font-bold mb-4">Pasajeros</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Juan Pérez</p>
                      <p className="text-sm text-gray-500">Asiento: 15A</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Documento</p>
                      <p className="text-sm">PERJ901234</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Pagado</p>
                    <p className="text-xl font-bold text-primary">$530</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Método de Pago</p>
                    <p className="text-sm">Tarjeta terminada en 3456</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3 justify-center">
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Descargar Boleto
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <h3 className="font-bold text-yellow-800 mb-2">Información Importante</h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5" />
                  <span>Preséntate en la terminal al menos 30 minutos antes de la hora de salida.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5" />
                  <span>Lleva una identificación oficial vigente para abordar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5" />
                  <span>Equipaje permitido: 1 maleta (25kg) + 1 equipaje de mano.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5" />
                  <span>Cancelación gratuita hasta 24 horas antes de la salida.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full md:w-auto">
                  Ver Mis Viajes
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full md:w-auto">
                  Volver al Inicio
                </Button>
              </Link>
              <Link href="/routes">
                <Button className="w-full md:w-auto">Reservar Otro Viaje</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

