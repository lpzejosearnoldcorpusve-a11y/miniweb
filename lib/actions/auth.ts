"use server"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email y contraseña requeridos" }
  }

  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXTAUTH_URL
      : 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", response.status, errorText)
      return { success: false, error: "Error en la autenticación" }
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Error en el servidor" }
  }
}

export async function register(formData: FormData) {
  const nombres = formData.get("names") as string
  const apellidos = formData.get("lastnames") as string
  const email = formData.get("email") as string
  const telefono = formData.get("phone") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXTAUTH_URL
      : 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombres,
        apellidos,
        email,
        telefono,
        password,
        confirmPassword
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", response.status, errorText)
      return { success: false, error: "Error en el registro" }
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Register error:", error)
    return { success: false, error: "Error al registrar usuario" }
  }
}