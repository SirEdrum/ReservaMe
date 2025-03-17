// Mock data for the application

// Buses
let buses = [
  {
    id: "1",
    plate: "ABC-1234",
    model: "Mercedes Benz",
    year: "2020",
    seats: 40,
    driver: "Juan Pérez",
    driverId: "3",
    available: true,
  },
  {
    id: "2",
    plate: "XYZ-5678",
    model: "Volvo",
    year: "2019",
    seats: 35,
    driver: "",
    driverId: "",
    available: true,
  },
  {
    id: "3",
    plate: "DEF-9012",
    model: "Scania",
    year: "2021",
    seats: 45,
    driver: "",
    driverId: "",
    available: false,
  },
]

// Drivers
let drivers = [
  {
    id: "3",
    name: "Juan Pérez",
    phone: "555-123-4567",
    username: "chofer1",
    password: "chofer123",
    active: true,
  },
  {
    id: "4",
    name: "María Rodríguez",
    phone: "555-987-6543",
    username: "chofer2",
    password: "chofer456",
    active: true,
  },
  {
    id: "5",
    name: "Carlos López",
    phone: "555-456-7890",
    username: "chofer3",
    password: "chofer789",
    active: false,
  },
]

// Users (admin and receptionists)
let users = [
  {
    id: "1",
    name: "Admin Usuario",
    phone: "555-111-2222",
    workDays: "L-V",
    workHours: "9:00-18:00",
    username: "admin",
    password: "admin123",
    role: "administrador",
    active: true,
  },
  {
    id: "2",
    name: "Recepcionista Demo",
    phone: "555-333-4444",
    workDays: "L-V",
    workHours: "9:00-18:00",
    username: "recepcion",
    password: "recepcion123",
    role: "recepcionista",
    active: true,
  },
]

// Destinations
let destinations = [
  {
    id: "1",
    name: "Ciudad de México",
  },
  {
    id: "2",
    name: "Guadalajara",
  },
  {
    id: "3",
    name: "Monterrey",
  },
  {
    id: "4",
    name: "Cancún",
  },
]

// Boarding Locations
let boardingLocations = [
  {
    id: "1",
    name: "Terminal Central",
    address: "Av. Principal #123",
  },
  {
    id: "2",
    name: "Terminal Norte",
    address: "Blvd. Norte #456",
  },
  {
    id: "3",
    name: "Terminal Sur",
    address: "Calle Sur #789",
  },
]

// Trips
let trips = [
  {
    id: "1",
    busId: "1",
    busPlate: "ABC-1234",
    driverId: "3",
    driverName: "Juan Pérez",
    destinationId: "2",
    destinationName: "Guadalajara",
    departureTime: "2025-04-15T10:30:00",
    price: 450,
    status: "Programado",
    passengers: [],
    capacity: 40,
  },
  {
    id: "2",
    busId: "2",
    busPlate: "XYZ-5678",
    driverId: "4",
    driverName: "María Rodríguez",
    destinationId: "3",
    destinationName: "Monterrey",
    departureTime: "2025-04-16T08:00:00",
    price: 550,
    status: "Programado",
    passengers: [],
    capacity: 35,
  },
]

// Reservations
let reservations = [
  {
    id: "1",
    tripId: "1",
    destinationName: "Guadalajara",
    departureTime: "2025-04-15T10:30:00",
    passengerName: "Pedro Sánchez",
    passengerPhone: "555-111-2222",
    passengerGender: "masculino",
    seatNumber: "15",
    boardingLocationId: "1",
    boardingLocationName: "Terminal Central",
    status: "Pendiente",
    price: 450,
  },
  {
    id: "2",
    tripId: "1",
    destinationName: "Guadalajara",
    departureTime: "2025-04-15T10:30:00",
    passengerName: "Ana García",
    passengerPhone: "555-333-4444",
    passengerGender: "femenino",
    seatNumber: "16",
    boardingLocationId: "2",
    boardingLocationName: "Terminal Norte",
    status: "Confirmado",
    price: 450,
  },
]

// Trip History
const tripHistory = [
  {
    id: "1",
    tripId: "101",
    destination: "Guadalajara",
    driver: "Juan Pérez",
    driverId: "3",
    bus: "ABC-1234",
    departureTime: "2025-03-10T08:30:00",
    completionTime: "2025-03-10T14:30:00",
    passengerCount: 35,
    amount: 15750,
  },
  {
    id: "2",
    tripId: "102",
    destination: "Monterrey",
    driver: "María Rodríguez",
    driverId: "4",
    bus: "XYZ-5678",
    departureTime: "2025-03-11T07:00:00",
    completionTime: "2025-03-11T17:00:00",
    passengerCount: 30,
    amount: 16500,
  },
  {
    id: "3",
    tripId: "103",
    destination: "Cancún",
    driver: "Juan Pérez",
    driverId: "3",
    bus: "ABC-1234",
    departureTime: "2025-03-12T06:00:00",
    completionTime: "2025-03-12T18:00:00",
    passengerCount: 38,
    amount: 22800,
  },
]

// Payment History
const paymentHistory = [
  {
    id: "1",
    driverId: "3",
    driverName: "Juan Pérez",
    date: "2025-03-10T00:00:00",
    tripCount: 1,
    totalAmount: 15750,
    paymentAmount: 15750,
    timestamp: "2025-03-10T19:30:00",
    registeredBy: "Admin Usuario",
  },
  {
    id: "2",
    driverId: "4",
    driverName: "María Rodríguez",
    date: "2025-03-11T00:00:00",
    tripCount: 1,
    totalAmount: 16500,
    paymentAmount: 16500,
    timestamp: "2025-03-11T20:15:00",
    registeredBy: "Recepcionista Demo",
  },
  {
    id: "3",
    driverId: "3",
    driverName: "Juan Pérez",
    date: "2025-03-12T00:00:00",
    tripCount: 1,
    totalAmount: 22800,
    paymentAmount: 22800,
    timestamp: "2025-03-12T21:00:00",
    registeredBy: "Admin Usuario",
  },
]

// Data access functions
export function getBuses() {
  return buses
}

export function addBus(bus) {
  buses.push(bus)
  return bus
}

export function updateBusAvailability(busId, available) {
  buses = buses.map((bus) => (bus.id === busId ? { ...bus, available } : bus))
}

export function updateBus(updatedBus) {
  buses = buses.map((bus) => (bus.id === updatedBus.id ? updatedBus : bus))
  return updatedBus
}

export function getDrivers() {
  return drivers
}

export function addDriver(driver) {
  drivers.push(driver)
  return driver
}

export function updateDriver(updatedDriver) {
  drivers = drivers.map((driver) => (driver.id === updatedDriver.id ? updatedDriver : driver))
  return updatedDriver
}

export function getUsers() {
  return users
}

export function addUser(user) {
  users.push(user)
  return user
}

export function updateUser(updatedUser) {
  users = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
  return updatedUser
}

export function getDestinations() {
  return destinations
}

export function addDestination(destination) {
  destinations.push(destination)
  return destination
}

export function updateDestination(updatedDestination) {
  destinations = destinations.map((destination) =>
    destination.id === updatedDestination.id ? updatedDestination : destination,
  )
  return updatedDestination
}

export function getBoardingLocations() {
  return boardingLocations
}

export function addBoardingLocation(location) {
  boardingLocations.push(location)
  return location
}

export function updateBoardingLocation(updatedLocation) {
  boardingLocations = boardingLocations.map((location) =>
    location.id === updatedLocation.id ? updatedLocation : location,
  )
  return updatedLocation
}

export function getTrips() {
  return trips
}

export function addTrip(trip) {
  trips.push(trip)
  return trip
}

export function getReservations() {
  return reservations
}

export function addReservation(reservation) {
  reservations.push(reservation)
  return reservation
}

export function updateReservationStatus(reservationId, status) {
  reservations = reservations.map((reservation) =>
    reservation.id === reservationId ? { ...reservation, status } : reservation,
  )
}

export function completeTripAndCollectPayment(tripId, passengerIds, amount) {
  // Update trip status
  trips = trips.map((trip) => (trip.id === tripId ? { ...trip, status: "Completado" } : trip))

  // Add to trip history
  const trip = trips.find((t) => t.id === tripId)
  const confirmedPassengers = reservations.filter((r) => r.tripId === tripId && passengerIds.includes(r.id))

  tripHistory.push({
    id: tripHistory.length + 1,
    tripId,
    destination: trip.destinationName,
    driver: trip.driverName,
    driverId: trip.driverId,
    bus: trip.busPlate,
    departureTime: trip.departureTime,
    completionTime: new Date().toISOString(),
    passengerCount: confirmedPassengers.length,
    amount,
  })

  return { success: true }
}

export function getTripHistory() {
  return tripHistory
}

export function getPaymentHistory() {
  return paymentHistory
}

export function addPayment(payment) {
  paymentHistory.push(payment)
  return payment
}

export function getActiveTrips() {
  // For demo purposes, return some active trips
  return [
    {
      id: "1",
      destination: "Guadalajara",
      bus: "ABC-1234",
      driver: "Juan Pérez",
      time: "10:30 AM",
      status: "Programado",
      passengers: 2,
      capacity: 40,
      price: 450,
    },
    {
      id: "2",
      destination: "Monterrey",
      bus: "XYZ-5678",
      driver: "María Rodríguez",
      time: "08:00 AM",
      status: "En ruta",
      passengers: 25,
      capacity: 35,
      price: 550,
    },
  ]
}

