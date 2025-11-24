"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useLogin } from "@/hooks/auth"

export function LoginForm() {
  const { login, isLoading } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  })
  const [showWelcome, setShowWelcome] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "El correo electrónico es requerido"
    if (!emailRegex.test(email)) return "Formato de correo electrónico inválido"
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) return "La contraseña es requerida"
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres"
    return ""
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Limpiar errores mientras el usuario escribe
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }

    // Limpiar error general
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validaciones
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        general: ""
      })
      return
    }

    // Limpiar errores previos
    setErrors({ email: "", password: "", general: "" })

    const result = await login(formData)

    if (result.success) {
      // Mostrar animación de bienvenida
      setShowWelcome(true)
      toast.success("¡Bienvenido al Sistema de Movilidad Urbana!")

      // Redirigir después de la animación
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
    } else {
      // Mostrar error específico
      let errorMessage = "Error al iniciar sesión"

      if (result.error?.includes("Usuario no encontrado")) {
        errorMessage = "Usuario no encontrado. Verifica tu correo electrónico."
        setErrors(prev => ({ ...prev, email: "Usuario no encontrado" }))
      } else if (result.error?.includes("Contraseña incorrecta")) {
        errorMessage = "Contraseña incorrecta. Inténtalo de nuevo."
        setErrors(prev => ({ ...prev, password: "Contraseña incorrecta" }))
      } else if (result.error?.includes("Formato")) {
        errorMessage = result.error
        setErrors(prev => ({ ...prev, email: result.error! }))
      } else {
        errorMessage = result.error || "Error desconocido"
        setErrors(prev => ({ ...prev, general: errorMessage }))
      }

      toast.error(errorMessage)
    }
  }

  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
        <div className="text-center animate-fade-in-up">
          <div className="mb-6 animate-bounce-subtle">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Bienvenido de vuelta!
          </h2>
          <p className="text-gray-600 animate-pulse">
            Preparando tu panel de control...
          </p>
          <div className="mt-4 w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="w-5 h-5" />
          Iniciar Sesión
        </CardTitle>
        <CardDescription>
          Ingrese sus credenciales para acceder al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="usuario@gamlp.bo"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
