"use client"

import type React from "react"
import { useState, useTransition, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUser, updateUser } from "@/lib/actions/users"
import type { User } from "@/types"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: "create" | "edit"
  user?: User
  onSuccess?: () => void // Callback para éxito
}

interface FormData {
  nombres: string
  apellidos: string
  email: string
  telefono: string
  rol: string
  password: string
}

interface FormErrors {
  nombres?: string
  apellidos?: string
  email?: string
  telefono?: string
  rol?: string
  password?: string
}

export function UserFormDialog({ open, onOpenChange, mode = "create", user, onSuccess }: UserFormDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<FormData>({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    rol: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [globalError, setGlobalError] = useState<string>("")

  // Resetear estado cuando se abre/cierra el diálogo
  useEffect(() => {
    if (open) {
      setGlobalError("")
      setErrors({})
      
      if (mode === "edit" && user) {
        setFormData({
          nombres: user.nombres || "",
          apellidos: user.apellidos || "",
          email: user.email || "",
          telefono: user.telefono || "",
          rol: user.rol || "",
          password: "", // Nunca pre-llenar contraseña
        })
      } else {
        setFormData({
          nombres: "",
          apellidos: "",
          email: "",
          telefono: "",
          rol: "user", // Valor por defecto
          password: "",
        })
      }
    }
  }, [mode, user, open])

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar nombres
    if (!formData.nombres.trim()) {
      newErrors.nombres = "Los nombres son obligatorios"
    } else if (formData.nombres.trim().length < 2) {
      newErrors.nombres = "Los nombres deben tener al menos 2 caracteres"
    }

    // Validar apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios"
    } else if (formData.apellidos.trim().length < 2) {
      newErrors.apellidos = "Los apellidos deben tener al menos 2 caracteres"
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    // Validar teléfono (opcional pero con formato)
    if (formData.telefono && !/^[\d\s+\-()]+$/.test(formData.telefono)) {
      newErrors.telefono = "El formato del teléfono no es válido"
    }

    // Validar rol
    if (!formData.rol) {
      newErrors.rol = "El rol es obligatorio"
    }

    // Validar contraseña en creación
    if (mode === "create") {
      if (!formData.password) {
        newErrors.password = "La contraseña es obligatoria"
      } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres"
      }
    }

    // Validar contraseña en edición (si se proporciona)
    if (mode === "edit" && formData.password && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError("")
    
    if (!validateForm()) {
      return
    }

    startTransition(async () => {
      try {
        // Preparar datos para enviar
        const submitData = {
          ...formData,
          nombres: formData.nombres.trim(),
          apellidos: formData.apellidos.trim(),
          email: formData.email.toLowerCase().trim(),
          telefono: formData.telefono.trim() || undefined,
          // Si en edición no se cambió la contraseña, no enviarla
          ...(mode === "edit" && !formData.password && { password: undefined }),
        }

        let success = false
        let errorMsg = ""

        if (mode === "create") {
          const result = await createUser(submitData)
          success = result.success
          errorMsg = result.error || ""
        } else if (mode === "edit" && user) {
          const result = await updateUser(user.id, submitData)
          success = result.success
          errorMsg = result.error || ""
        }

        if (success) {
          onOpenChange(false)
          onSuccess?.() // Ejecutar callback de éxito
        } else {
          setGlobalError(errorMsg || "Error al guardar el usuario. Por favor, intente nuevamente.")
        }
      } catch (error) {
        console.error("Error in form submission:", error)
        setGlobalError("Error inesperado. Por favor, intente nuevamente.")
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }))
    }
  }

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Limpiar error del campo cuando el usuario seleccione una opción
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nuevo Usuario" : "Editar Usuario"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Complete el formulario para agregar un nuevo usuario al sistema"
              : "Modifique los datos del usuario"}
          </DialogDescription>
        </DialogHeader>

        {globalError && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  placeholder="Juan"
                  className={errors.nombres ? "border-destructive" : ""}
                />
                {errors.nombres && <p className="text-destructive text-xs">{errors.nombres}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="Pérez"
                  className={errors.apellidos ? "border-destructive" : ""}
                />
                {errors.apellidos && <p className="text-destructive text-xs">{errors.apellidos}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="usuario@gamlp.bo"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+591 70000000"
                className={errors.telefono ? "border-destructive" : ""}
              />
              {errors.telefono && <p className="text-destructive text-xs">{errors.telefono}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol *</Label>
              <Select 
                value={formData.rol} 
                onValueChange={(value) => handleSelectChange("rol", value)}
              >
                <SelectTrigger className={errors.rol ? "border-destructive" : ""}>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrador">Administrador</SelectItem>
                  <SelectItem value="operador">Operador</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="conductor">Conductor</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
              {errors.rol && <p className="text-destructive text-xs">{errors.rol}</p>}
            </div>

            {(mode === "create" || (mode === "edit" && formData.password)) && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  Contraseña {mode === "create" ? "*" : ""}
                  {mode === "edit" && (
                    <span className="text-muted-foreground text-xs ml-2">(Dejar en blanco para no cambiar)</span>
                  )}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
                {mode === "create" && (
                  <p className="text-muted-foreground text-xs">Mínimo 6 caracteres</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
            >
              {isPending 
                ? "Guardando..." 
                : mode === "create" 
                  ? "Crear Usuario" 
                  : "Guardar Cambios"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}