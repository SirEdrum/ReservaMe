"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { getPaymentHistory } from "@/lib/data"
import { Home, User, DollarSign } from "lucide-react"

export default function HistorialCobrosPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [paymentHistory, setPaymentHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true) // Add loading state

  useEffect(() => {
    if (!user || (user.role !== "administrador" && user.role !== "recepcionista")) {
      router.push("/login")
      return
    }
  }, [user])

  useEffect(() => {
    if (user && (user.role === "administrador" || user.role === "recepcionista")) {
      // Get payment history
      const history = getPaymentHistory()

      // Sort by timestamp (most recent first)
      history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

      setPaymentHistory(history)
      setIsLoading(false) // Set loading to false after data is fetched
    }
  }, [user])

  // Check if user is authenticated and has appropriate role
  if (isLoading) {
    return <div>Loading...</div> // Or any other loading indicator
  }

  if (!user || (user.role !== "administrador" && user.role !== "recepcionista")) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Historial de Cobros</h1>
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cobros Registrados</CardTitle>
            <CardDescription>Historial de todos los cobros realizados</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentHistory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Chofer</TableHead>
                    <TableHead>Viajes</TableHead>
                    <TableHead>Total Generado</TableHead>
                    <TableHead>Monto Entregado</TableHead>
                    <TableHead>Registrado Por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{new Date(payment.date).toLocaleDateString("es-MX")}</span>
                          <span className="text-xs text-gray-500">
                            Registrado:{" "}
                            {new Date(payment.timestamp).toLocaleString("es-MX", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          {payment.driverName}
                        </div>
                      </TableCell>
                      <TableCell>{payment.tripCount}</TableCell>
                      <TableCell>${payment.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="font-bold text-primary">${payment.paymentAmount.toFixed(2)}</TableCell>
                      <TableCell>{payment.registeredBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No hay cobros registrados</h3>
                <p className="text-gray-500">Los cobros registrados aparecerán aquí</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/cobros")}>
                  Registrar un Cobro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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

