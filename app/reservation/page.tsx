"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Bus, Calendar, Check, CreditCard, MapPin, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ReservationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    passengers: [{ name: "", email: "", phone: "", document: "" }],
    paymentMethod: "credit-card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target

    if (index !== undefined) {
      // Update passenger data
      const newPassengers = [...formData.passengers]
      newPassengers[index] = {
        ...newPassengers[index],
        [name]: value,
      }

      setFormData({
        ...formData,
        passengers: newPassengers,
      })
    } else {
      // Update payment data
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData({
      ...formData,
      paymentMethod: value,
    })
  }

  const addPassenger = () => {
    setFormData({
      ...formData,
      passengers: [...formData.passengers, { name: "", email: "", phone: "", document: "" }],
    })
  }

  const removePassenger = (index: number) => {
    if (formData.passengers.length > 1) {
      const newPassengers = [...formData.passengers]
      newPassengers.splice(index, 1)

      setFormData({
        ...formData,
        passengers: newPassengers,
      })
    }
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would submit the form data to your backend
    // For this demo, we'll just redirect to a confirmation page
    router.push("/reservation/confirmation")
  }

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Reserva de Viaje</h1>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <Bus className="h-5 w-5" />
                </div>
                <span className="text-sm mt-2">Viaje</span>
              </div>

              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>

              <div className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <User className="h-5 w-5" />
                </div>
                <span className="text-sm mt-2">Pasajeros</span>
              </div>

              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>

              <div className={`flex flex-col items-center ${step >= 3 ? "text-primary" : "text-gray-400"}`}>
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="text-sm mt-2">Pago</span>
              </div>

              <div className={`flex-1 h-1 mx-2 ${step >= 4 ? "bg-primary" : "bg-gray-200"}`}></div>

              <div className={`flex flex-col items-center ${step >= 4 ? "text-primary" : "text-gray-400"}`}>
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 4 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-sm mt-2">Confirmación</span>
              </div>
            </div>
          </div>

          {/* Step 1: Trip Details */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Viaje</CardTitle>
                <CardDescription>Confirma los detalles de tu viaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-bold">Ciudad de México - Guadalajara</h3>
                        <p className="text-sm text-gray-500">Primera Plus • Primera Clase</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">$450</p>
                        <p className="text-xs text-gray-500">por persona</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Fecha y Hora de Salida</p>
                          <p className="text-sm text-gray-600">15 de Abril, 2025 • 10:30 AM</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Terminal de Salida</p>
                          <p className="text-sm text-gray-600">Terminal Central del Norte, CDMX</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Bus className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Duración del Viaje</p>
                          <p className="text-sm text-gray-600">6 horas (550 km)</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Terminal de Llegada</p>
                          <p className="text-sm text-gray-600">Terminal Nueva Central, Guadalajara</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-bold mb-2">Servicios Incluidos</h3>
                    <ul className="grid grid-cols-2 gap-2">
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Aire acondicionado
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Asientos reclinables
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Baño a bordo
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        WiFi gratuito
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Tomacorrientes
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Snack a bordo
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-md font-bold mb-2">Políticas de Viaje</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Presentarse 30 minutos antes de la salida</li>
                      <li>• Cancelación gratuita hasta 24 horas antes</li>
                      <li>• Equipaje permitido: 1 maleta (25kg) + 1 equipaje de mano</li>
                      <li>• Mascotas no permitidas (excepto animales de servicio)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/routes">
                  <Button variant="outline">Cambiar Viaje</Button>
                </Link>
                <Button onClick={nextStep}>Continuar</Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Passenger Information */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Información de Pasajeros</CardTitle>
                <CardDescription>Ingresa los datos de todos los pasajeros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {formData.passengers.map((passenger, index) => (
                    <div key={index} className="space-y-4">
                      {index > 0 && <Separator className="my-6" />}

                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">Pasajero {index + 1}</h3>
                        {index > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePassenger(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Nombre Completo</Label>
                          <Input
                            id={`name-${index}`}
                            name="name"
                            value={passenger.name}
                            onChange={(e) => handleInputChange(e, index)}
                            placeholder="Juan Pérez"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`email-${index}`}>Correo Electrónico</Label>
                          <Input
                            id={`email-${index}`}
                            name="email"
                            type="email"
                            value={passenger.email}
                            onChange={(e) => handleInputChange(e, index)}
                            placeholder="juan@example.com"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`phone-${index}`}>Teléfono</Label>
                          <Input
                            id={`phone-${index}`}
                            name="phone"
                            type="tel"
                            value={passenger.phone}
                            onChange={(e) => handleInputChange(e, index)}
                            placeholder="(55) 1234-5678"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`document-${index}`}>Documento de Identidad</Label>
                          <Input
                            id={`document-${index}`}
                            name="document"
                            value={passenger.document}
                            onChange={(e) => handleInputChange(e, index)}
                            placeholder="CURP o Pasaporte"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addPassenger} className="w-full">
                    Agregar Otro Pasajero
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Regresar
                </Button>
                <Button onClick={nextStep}>Continuar</Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Payment Information */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Información de Pago</CardTitle>
                <CardDescription>Ingresa los detalles de tu método de pago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Resumen de Compra</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Ciudad de México - Guadalajara</span>
                        <span>$450 x {formData.passengers.length}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Impuestos y cargos</span>
                        <span>$50 x {formData.passengers.length}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Seguro de viaje</span>
                        <span>$30 x {formData.passengers.length}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary">${(450 + 50 + 30) * formData.passengers.length}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-4">Método de Pago</h3>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={handlePaymentMethodChange}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Tarjeta de Crédito/Débito
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center gap-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M19.5 8.5H18.5C18.5 5.74 16.26 3.5 13.5 3.5H7.5C6.12 3.5 5 4.62 5 6V18C5 19.1 5.9 20 7 20H12C13.66 20 15 18.66 15 17V13.5H19.5C20.88 13.5 22 12.38 22 11V11C22 9.62 20.88 8.5 19.5 8.5Z"
                              fill="#0070BA"
                            />
                            <path
                              d="M15 8.5H16.5C17.88 8.5 19 7.38 19 6V6C19 4.62 17.88 3.5 16.5 3.5H10.5C7.74 3.5 5.5 5.74 5.5 8.5H4.5C3.12 8.5 2 9.62 2 11V11C2 12.38 3.12 13.5 4.5 13.5H9V17C9 18.66 10.34 20 12 20H17C18.1 20 19 19.1 19 18V6C19 4.62 17.88 3.5 16.5 3.5"
                              fill="#003087"
                            />
                          </svg>
                          PayPal
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="oxxo" id="oxxo" />
                        <Label htmlFor="oxxo" className="flex items-center gap-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="4" fill="#FFDB03" />
                            <path d="M5 7H19V17H5V7Z" fill="#E10718" />
                            <path d="M8 10H11V14H8V10Z" fill="white" />
                            <path d="M13 10H16V14H13V10Z" fill="white" />
                          </svg>
                          OXXO
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="JUAN PEREZ"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Fecha de Expiración</Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input
                            id="cardCvv"
                            name="cardCvv"
                            type="password"
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Regresar
                </Button>
                <Button onClick={handleSubmit}>Completar Pago</Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Confirmación de Reserva</CardTitle>
                <CardDescription>Tu reserva ha sido procesada exitosamente</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">¡Gracias por tu reserva!</h3>
                <p className="text-gray-600 mb-6">Hemos enviado los detalles de tu reserva a tu correo electrónico.</p>

                <div className="bg-primary/5 p-4 rounded-lg text-left mb-6">
                  <h4 className="font-bold mb-2">Detalles de la Reserva</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Número de Reserva:</span>
                      <span className="text-sm font-medium">BV-123456</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Ruta:</span>
                      <span className="text-sm font-medium">Ciudad de México - Guadalajara</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Fecha y Hora:</span>
                      <span className="text-sm font-medium">15 de Abril, 2025 • 10:30 AM</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Pasajeros:</span>
                      <span className="text-sm font-medium">{formData.passengers.length}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Total Pagado:</span>
                      <span className="text-sm font-medium">${(450 + 50 + 30) * formData.passengers.length}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Recuerda presentarte 30 minutos antes de la salida en la terminal.
                  </p>
                  <p className="text-sm text-gray-600">Puedes ver los detalles de tu viaje en tu panel de usuario.</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                <Link href="/dashboard">
                  <Button>Ir a Mi Panel</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Volver al Inicio</Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

