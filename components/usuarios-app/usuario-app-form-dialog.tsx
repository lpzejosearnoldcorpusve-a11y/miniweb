"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { useUsuariosAppMutations } from "@/hooks/use-usuarios-app"
import { Loader2 } from "lucide-react"
import type { UsuarioAppWithTarjetas } from "@/types"

interface UsuarioAppFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario?: UsuarioAppWithTarjetas | null
}

const ciudadesBolivia = [
  "La Paz",
  "El Alto",
  "Santa Cruz",
  "Cochabamba",
  "Oruro",
  "Potosí",
  "Tarija",
  "Sucre",
  "Trinidad",
  "Cobija",
]

export function UsuarioAppFormDialog({ open, onOpenChange, usuario }: UsuarioAppFormDialogProps) {
  const { createUsuario, updateUsuario } = useUsuariosAppMutations()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    carnetIdentidad: "",
    complemento: "",
    ciudad: "La Paz",
    fechaNacimiento: "",
    celular: "",
    password: "",
    estado: "activo",
  })

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombres: usuario.nombres,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        carnetIdentidad: usuario.carnetIdentidad,
        complemento: usuario.complemento || "",
        ciudad: usuario.ciudad,
        fechaNacimiento: usuario.fechaNacimiento?.toString().split("T")[0] || "",
        celular: usuario.celular,
        password: "",
        estado: usuario.estado,
      })
    } else {
      setFormData({
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        carnetIdentidad: "",
        complemento: "",
        ciudad: "La Paz",
        fechaNacimiento: "",
        celular: "",
        password: "",
        estado: "activo",
      })
    }
    setError(null)
  }, [usuario, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const dataToSend = {
        ...formData,
        complemento: formData.complemento || null,
      }

      // Remove password if empty (for updates)
      if (usuario && !formData.password) {
        const { password, ...rest } = dataToSend
        const result = await updateUsuario(usuario.id, rest)
        if (!result.success) {
          setError(result.error || "Error al actualizar usuario")
          return
        }
      } else {
        if (!formData.password && !usuario) {
          setError("La contraseña es requerida")
          return
        }

        const result = usuario ? await updateUsuario(usuario.id, dataToSend) : await createUsuario(dataToSend)

        if (!result.success) {
          setError(result.error || "Error al guardar usuario")
          return
        }
      }

      onOpenChange(false)
    } catch (err) {
      console.error("Error saving usuario:", err)
      setError("Error inesperado al guardar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{usuario ? "Editar Usuario" : "Nuevo Usuario de App"}</DialogTitle>
          <DialogDescription>
            {usuario ? "Modifique los datos del usuario móvil" : "Complete los datos para registrar un nuevo usuario"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres *</Label>
              <Input
                id="nombres"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                required
                placeholder="Juan Carlos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidoPaterno">Apellido Paterno *</Label>
              <Input
                id="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
                required
                placeholder="Mamani"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidoMaterno">Apellido Materno *</Label>
              <Input
                id="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })}
                required
                placeholder="Quispe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carnetIdentidad">Carnet de Identidad *</Label>
              <Input
                id="carnetIdentidad"
                value={formData.carnetIdentidad}
                onChange={(e) => setFormData({ ...formData, carnetIdentidad: e.target.value })}
                required
                placeholder="12345678"
                maxLength={12}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento (opcional)</Label>
              <Input
                id="complemento"
                value={formData.complemento}
                onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                placeholder="LP"
                maxLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad *</Label>
              <Select value={formData.ciudad} onValueChange={(value) => setFormData({ ...formData, ciudad: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {ciudadesBolivia.map((ciudad) => (
                    <SelectItem key={ciudad} value={ciudad}>
                      {ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular">Celular *</Label>
              <Input
                id="celular"
                value={formData.celular}
                onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                required
                placeholder="71234567"
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña {usuario ? "(dejar vacío para mantener)" : "*"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!usuario}
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="suspendido">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {usuario ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
