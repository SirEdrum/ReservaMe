"use server"

// This is a server action that would normally connect to a database
// For demonstration purposes, we're just simulating the registration process

export async function registerUser(name: string, email: string, password: string) {
  // Simulate a delay to mimic a database call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real application, you would:
  // 1. Validate the input data
  // 2. Check if the email already exists in the database
  // 3. Hash the password
  // 4. Store the user in the database

  // For demo purposes, we'll just simulate a successful registration
  // except for a specific email that we'll use to demonstrate an error
  if (email === "existing@example.com") {
    return {
      success: false,
      error: "Este correo electrónico ya está registrado",
    }
  }

  return {
    success: true,
    userId: "new-user-123",
  }
}

