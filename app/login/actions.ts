"use server"

// This is a server action that would normally connect to a database
// For demonstration purposes, we're just simulating the login process

export async function loginUser(email: string, password: string) {
  // Simulate a delay to mimic a database call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real application, you would:
  // 1. Validate the email and password
  // 2. Check the database for the user
  // 3. Verify the password hash
  // 4. Create a session or JWT token

  // For demo purposes, we'll just check for a specific email/password
  if (email === "demo@example.com" && password === "password123") {
    return {
      success: true,
      userId: "123456",
    }
  }

  return {
    success: false,
    error: "Correo electrónico o contraseña incorrectos",
  }
}

