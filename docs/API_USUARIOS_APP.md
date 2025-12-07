# API Usuarios App - Documentación

Esta documentación cubre todos los endpoints disponibles para la gestión de Usuarios App, incluyendo autenticación, perfil, y gestión de tarjetas RFID.

## 📋 Tabla de Contenidos

- [Autenticación](#autenticación)
- [Gestión de Usuarios](#gestión-de-usuarios)
- [Gestión de Tarjetas](#gestión-de-tarjetas)
- [Modelos de Datos](#modelos-de-datos)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## Autenticación

### POST - Login Usuario App

**Endpoint:** `POST /api/usuarios-app/login`

Autentica un usuario app usando su número de carnet de identidad y contraseña.

#### Parámetros de Entrada

```json
{
  "carnetIdentidad": "string (requerido)",
  "password": "string (requerido)"
}
```

**Captura automática:**
- User-Agent del dispositivo
- Dirección IP del cliente

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "uuid",
      "nombres": "string",
      "apellidoPaterno": "string",
      "apellidoMaterno": "string",
      "carnetIdentidad": "string",
      "ciudad": "string",
      "complemento": "string | null",
      "fechaNacimiento": "date",
      "celular": "string",
      "ultimaConexion": "timestamp | null",
      "estado": "activo | inactivo | suspendido",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    },
    "token": "string",
    "expiresAt": "timestamp"
  },
  "message": "Login exitoso"
}
```

#### Errores Posibles

| Código | Mensaje | Razón |
|--------|---------|-------|
| 400 | Carnet de identidad y contraseña son requeridos | Faltan parámetros obligatorios |
| 401 | Credenciales inválidas | Usuario no existe o contraseña incorrecta |
| 500 | Error interno del servidor | Error en la base de datos |

---

## Gestión de Usuarios

### GET - Obtener Usuario por ID

**Endpoint:** `GET /api/usuarios-app/[id]`

Obtiene la información completa de un usuario incluyendo tarjetas vinculadas.

#### Parámetros

- `id` (URL parameter): UUID del usuario - **Requerido**

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombres": "string",
    "apellidoPaterno": "string",
    "apellidoMaterno": "string",
    "carnetIdentidad": "string",
    "ciudad": "string",
    "complemento": "string | null",
    "fechaNacimiento": "date",
    "celular": "string",
    "estado": "activo | inactivo | suspendido",
    "tarjetas": [
      {
        "id": "uuid",
        "nombre": "string",
        "celular": "string",
        "montoBs": "number",
        "estado": "activa | inactiva",
        "uid": "string"
      }
    ],
    "tokensActivos": "number"
  }
}
```

#### Errores Posibles

| Código | Mensaje | Razón |
|--------|---------|-------|
| 404 | Usuario no encontrado | El usuario con ese ID no existe |
| 500 | Error al obtener usuario | Error en la base de datos |

---

### PUT - Actualizar Usuario

**Endpoint:** `PUT /api/usuarios-app/[id]`

Actualiza la información de un usuario app.

#### Parámetros

- `id` (URL parameter): UUID del usuario - **Requerido**

#### Body (Parcial)

```json
{
  "nombres": "string (opcional)",
  "apellidoPaterno": "string (opcional)",
  "apellidoMaterno": "string (opcional)",
  "ciudad": "string (opcional)",
  "celular": "string (opcional)",
  "password": "string (opcional)",
  "estado": "activo | inactivo | suspendido (opcional)"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombres": "string",
    "apellidoPaterno": "string",
    "apellidoMaterno": "string",
    "carnetIdentidad": "string",
    "ciudad": "string",
    "complemento": "string | null",
    "fechaNacimiento": "date",
    "celular": "string",
    "estado": "activo | inactivo | suspendido",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "message": "Usuario actualizado exitosamente"
}
```

#### Errores Posibles

| Código | Mensaje | Razón |
|--------|---------|-------|
| 400 | Error al actualizar usuario | Datos inválidos |
| 404 | Usuario no encontrado | El usuario con ese ID no existe |
| 500 | Error interno del servidor | Error en la base de datos |

---

### DELETE - Eliminar Usuario

**Endpoint:** `DELETE /api/usuarios-app/[id]`

Elimina un usuario app de la base de datos.

#### Parámetros

- `id` (URL parameter): UUID del usuario - **Requerido**

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

#### Errores Posibles

| Código | Mensaje | Razón |
|--------|---------|-------|
| 404 | Usuario no encontrado | El usuario con ese ID no existe |
| 500 | Error al eliminar usuario | Error en la base de datos |

---

## Gestión de Tarjetas

### POST - Vincular Tarjeta a Usuario

**Endpoint:** `POST /api/usuarios-app/tarjetas`

Vincula una tarjeta RFID a un usuario app. La búsqueda y validación se realiza por celular.

#### Parámetros de Entrada

```json
{
  "usuarioAppId": "uuid (requerido)",
  "tarjetaId": "uuid (requerido)"
}
```

#### Validaciones

- ✅ La tarjeta debe existir
- ✅ La tarjeta debe estar activa (`estado: "activa"`)
- ✅ La tarjeta no debe estar vinculada a otro usuario
- ✅ El usuario debe existir

#### Proceso de Vinculación (Frontend)

**Paso 1: Búsqueda por Celular**

El frontend filtra las tarjetas disponibles por número de celular:

```typescript
const availableTarjetas = (tarjetas ?? []).filter(
  (t) =>
    !t.usuarioAppId &&                    // No vinculada
    t.estado === "activa" &&              // Debe estar activa
    t.celular.includes(search)            // Búsqueda por celular
)
```

**Paso 2: Panel de Validación**

Se muestra un panel con la información de la tarjeta seleccionada:

```
╔═══════════════════════════════════════╗
║    Validación de Tarjeta              ║
╠═══════════════════════════════════════╣
║                                       ║
║ Nombre:    Juan Pérez                 ║
║ Celular:   +591-123-456-789           ║
║ Monto:     Bs. 150.50                 ║
║ Estado:    ✓ Activa                   ║
║                                       ║
╚═══════════════════════════════════════╝
```

**Componente:** `TarjetaValidacionPanel`

Datos mostrados:
- **Nombre**: `tarjeta.nombre` - Nombre del titular
- **Celular**: `tarjeta.celular` - Número de celular
- **Monto**: `tarjeta.montoBs` - Saldo en Bolivianos
- **Estado**: `tarjeta.estado` - Visual indicator (✓ Activa / ✗ Inactiva)

**Paso 3: Confirmación**

Una vez validado, se hace click en "Vincular" para confirmar.

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "message": "Tarjeta vinculada exitosamente"
}
```

#### Errores Posibles

| Código | Mensaje | Razón |
|--------|---------|-------|
| 400 | usuarioAppId y tarjetaId son requeridos | Faltan parámetros |
| 400 | Error al vincular tarjeta | Tarjeta ya vinculada, inactiva, o usuario no existe |
| 500 | Error interno del servidor | Error en la base de datos |

---

### DELETE - Desvincular Tarjeta

**Endpoint:** `DELETE /api/usuarios-app/tarjetas?tarjetaId={tarjetaId}`

Desvincula una tarjeta de un usuario app.

#### Parámetros

- `tarjetaId` (Query parameter): UUID de la tarjeta - **Requerido**

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "message": "Tarjeta desvinculada exitosamente"
}
```

#### Errores Posibles

| Código | Mensaje | Razón |
|--------|---------|-------|
| 400 | tarjetaId es requerido | Falta el parámetro |
| 400 | Error al desvincular tarjeta | Tarjeta no existe |
| 500 | Error interno del servidor | Error en la base de datos |

---

## Modelos de Datos

### UsuarioApp

```typescript
{
  id: string (UUID)
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  carnetIdentidad: string (Único)
  ciudad: string
  complemento?: string (Opcional - Complemento del CI)
  fechaNacimiento: Date
  celular: string
  password: string (Hash)
  ultimaConexion?: Date
  estado: "activo" | "inactivo" | "suspendido"
  createdAt: Date
  updatedAt: Date
}
```

### UsuarioAppWithTarjetas

```typescript
extends UsuarioApp {
  tarjetas?: TarjetaRfid[]
  tokensActivos?: number
}
```

### TarjetaRfid

```typescript
{
  id: string (UUID)
  uid: string (UID de la tarjeta RFID - Único)
  nombre: string (Nombre del titular)
  celular: string (Número de celular - Búsqueda principal)
  montoBs: number (Saldo en Bolivianos)
  estado: "activa" | "inactiva"
  usuarioAppId?: string (UUID del usuario vinculado)
  createdAt: Date
  updatedAt: Date
}
```

### TokenApp

```typescript
{
  id: string (UUID)
  usuarioAppId: string (UUID del usuario)
  token: string (Único)
  deviceInfo?: string (User-Agent)
  ipAddress?: string (Dirección IP)
  type: "access" | "refresh"
  expiresAt: Date
}
```

---

## Ejemplos de Uso

### Ejemplo 1: Login

```bash
curl -X POST http://localhost:3000/api/usuarios-app/login \
  -H "Content-Type: application/json" \
  -d '{
    "carnetIdentidad": "12345678",
    "password": "miContraseña123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nombres": "Juan",
      "apellidoPaterno": "Pérez",
      "apellidoMaterno": "García",
      "carnetIdentidad": "12345678",
      "ciudad": "La Paz",
      "celular": "+591-123-456-789",
      "estado": "activo"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-12-05T12:00:00Z"
  },
  "message": "Login exitoso"
}
```

---

### Ejemplo 2: Obtener Usuario con Tarjetas

```bash
curl -X GET http://localhost:3000/api/usuarios-app/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombres": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "carnetIdentidad": "12345678",
    "ciudad": "La Paz",
    "celular": "+591-123-456-789",
    "estado": "activo",
    "tarjetas": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "nombre": "Juan Pérez",
        "celular": "+591-123-456-789",
        "montoBs": 150.50,
        "estado": "activa",
        "uid": "A1B2C3D4E5F6"
      }
    ],
    "tokensActivos": 1
  }
}
```

---

### Ejemplo 3: Buscar y Vincular Tarjeta

**Paso 1: Frontend busca tarjetas por celular**

```typescript
// El usuario ingresa un celular en el campo de búsqueda
const search = "+591-123-456-789"

// Se filtra en el frontend
const availableTarjetas = tarjetas.filter(
  (t) =>
    !t.usuarioAppId &&           // No vinculada
    t.estado === "activa" &&     // Estado activo
    t.celular.includes(search)   // Búsqueda por celular
)

// Resultado esperado:
// [
//   {
//     id: "660e8400-e29b-41d4-a716-446655440001",
//     nombre: "Juan Pérez",
//     celular: "+591-123-456-789",
//     montoBs: 150.50,
//     estado: "activa"
//   }
// ]
```

**Paso 2: Se muestra el panel de validación**

```
╔═══════════════════════════════════════╗
║    Validación de Tarjeta              ║
║                                       ║
║ Nombre:    Juan Pérez                 ║
║ Celular:   +591-123-456-789           ║
║ Monto:     Bs. 150.50                 ║
║ Estado:    ✓ Activa                   ║
║                                       ║
║              [Vincular]               ║
╚═══════════════════════════════════════╝
```

**Paso 3: Usuario confirma vinculación**

```bash
curl -X POST http://localhost:3000/api/usuarios-app/tarjetas \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioAppId": "550e8400-e29b-41d4-a716-446655440000",
    "tarjetaId": "660e8400-e29b-41d4-a716-446655440001"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Tarjeta vinculada exitosamente"
}
```

---

### Ejemplo 4: Desvincular Tarjeta

```bash
curl -X DELETE "http://localhost:3000/api/usuarios-app/tarjetas?tarjetaId=660e8400-e29b-41d4-a716-446655440001"
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Tarjeta desvinculada exitosamente"
}
```

---

## Flujo Completo: Vinculación de Tarjetas

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario accede a "Gestionar Tarjetas"                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Dialog abre con campo de búsqueda por celular             │
│    Placeholder: "Buscar por celular..."                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Usuario ingresa celular en campo de búsqueda             │
│    Ej: "+591-123-456-789"                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Frontend filtra tarjetas por:                             │
│    - Celular coincide con búsqueda                          │
│    - No está vinculada (usuarioAppId = null)                │
│    - Estado = "activa"                                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Se muestra lista de tarjetas disponibles                  │
│    Cada tarjeta es clickeable                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Usuario selecciona una tarjeta                            │
│    (Se resalta con borde azul)                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Panel de Validación muestra:                              │
│    ✓ Nombre:    Juan Pérez                                  │
│    ✓ Celular:   +591-123-456-789                            │
│    ✓ Monto:     Bs. 150.50                                  │
│    ✓ Estado:    Activa (indicador verde)                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Usuario hace click en botón "Vincular"                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Frontend envía POST a:                                    │
│    POST /api/usuarios-app/tarjetas                          │
│    {                                                        │
│      "usuarioAppId": "550e...",                             │
│      "tarjetaId": "660e..."                                 │
│    }                                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. Backend vincula la tarjeta                               │
│     UPDATE tarjetas_rfid                                    │
│     SET usuario_app_id = '550e...'                          │
│     WHERE id = '660e...'                                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 11. ✓ Éxito - Toast: "Tarjeta vinculada exitosamente"       │
│     Tarjeta aparece en "Tarjetas Vinculadas"                │
└─────────────────────────────────────────────────────────────┘
```

---

## Notas Importantes

- 🔒 **Seguridad**: Las contraseñas se almacenan con hash (bcrypt)
- 📱 **Búsqueda de Tarjetas**: Se filtra por número de celular, no por UID
- ✅ **Validación**: Solo se pueden vincular tarjetas activas
- 🔗 **Relación**: Un usuario puede tener múltiples tarjetas, una tarjeta solo un usuario
- 🔄 **Revalidación**: Después de vincular/desvincular se revalida cache de `/dashboard/usuarios-app` y `/dashboard/tarjetas`

---

## Estado de las Tarjetas

| Estado | Descripción | Puede vincularse |
|--------|-------------|------------------|
| `activa` | Tarjeta en uso normal | ✅ Sí |
| `inactiva` | Tarjeta desactivada | ❌ No |
| `suspendida` | Tarjeta temporalmente bloqueada | ❌ No |

---

**Última actualización:** Diciembre 4, 2025
