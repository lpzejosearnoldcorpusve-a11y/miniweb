"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useRegister } from "@/hooks/auth"

export function RegisterForm() {
  const router = useRouter()
  const { register, isLoading } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    general: ""
  })

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "nombres":
        return !value.trim() ? "Los nombres son requeridos" : ""
      case "apellidos":
        return !value.trim() ? "Los apellidos son requeridos" : ""
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) return "El correo electrónico es requerido"
        if (!emailRegex.test(value)) return "Formato de correo electrónico inválido"
        return ""
      case "telefono":
        return "" // Opcional
      case "password":
        if (!value) return "La contraseña es requerida"
        if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres"
        return ""
      case "confirmPassword":
        if (!value) return "La confirmación de contraseña es requerida"
        if (value !== formData.password) return "Las contraseñas no coinciden"
        return ""
      default:
        return ""
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Validar campo en tiempo real
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))

    // Limpiar error general
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }))
    }

    // Validar confirmación de contraseña cuando cambia la contraseña
    if (field === "password" && formData.confirmPassword) {
      const confirmError = formData.confirmPassword !== value ? "Las contraseñas no coinciden" : ""
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validar todos los campos
    const newErrors = {
      nombres: validateField("nombres", formData.nombres),
      apellidos: validateField("apellidos", formData.apellidos),
      email: validateField("email", formData.email),
      telefono: validateField("telefono", formData.telefono),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
      general: ""
    }

    setErrors(newErrors)

    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some(error => error !== "")
    if (hasErrors) {
      toast.error("Por favor corrige los errores en el formulario")
      return
    }

    const result = await register(formData)

    if (result.success) {
      toast.success("Cuenta creada exitosamente. Redirigiendo al login...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } else {
      let errorMessage = "Error al crear la cuenta"

      if (result.error?.includes("ya está registrado")) {
        errorMessage = "Este correo electrónico ya está registrado"
        setErrors(prev => ({ ...prev, email: errorMessage }))
      } else if (result.error?.includes("Formato")) {
        errorMessage = result.error
        setErrors(prev => ({ ...prev, email: result.error || "" }))
      } else {
        errorMessage = result.error || "Error desconocido"
        setErrors(prev => ({ ...prev, general: errorMessage }))
      }

      toast.error(errorMessage)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Registro de Usuario
        </CardTitle>
        <CardDescription>
          Complete el formulario para crear su cuenta
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres</Label>
              <Input
                id="nombres"
                name="nombres"
                placeholder="Juan"
                value={formData.nombres}
                onChange={(e) => handleInputChange("nombres", e.target.value)}
                className={errors.nombres ? "border-red-500" : ""}
                required
              />
              {errors.nombres && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.nombres}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos</Label>
              <Input
                id="apellidos"
                name="apellidos"
                placeholder="Pérez"
                value={formData.apellidos}
                onChange={(e) => handleInputChange("apellidos", e.target.value)}
                className={errors.apellidos ? "border-red-500" : ""}
                required
              />
              {errors.apellidos && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.apellidos}
                </p>
              )}
            </div>
          </div>

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
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="+591 70000000"
              value={formData.telefono}
              onChange={(e) => handleInputChange("telefono", e.target.value)}
              className={errors.telefono ? "border-red-500" : ""}
            />
            {errors.telefono && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.telefono}
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
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <UserPlus className="mr-2 h-4 w-4" />
            {isLoading ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
