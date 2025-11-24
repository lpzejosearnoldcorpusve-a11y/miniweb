# APIs de Autenticación

Este documento describe las APIs REST creadas para el manejo de autenticación de usuarios en el sistema.

## Estructura de las APIs

Las APIs de autenticación están ubicadas en `/app/api/auth/` y incluyen:

- `/api/auth/login` - Autenticación de usuarios
- `/api/auth/register` - Registro de nuevos usuarios
- `/api/auth/verify` - Verificación y gestión de tokens de sesión

## Endpoints Disponibles

### POST /api/auth/login

Autentica un usuario existente en el sistema y genera un token de sesión.

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "uuid",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "email": "usuario@example.com",
    "telefono": "123456789",
    "rol": "user",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "token": "session-token-uuid"
}
```

### POST /api/auth/register

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "nombres": "Juan",
  "apellidos": "Pérez",
  "email": "usuario@example.com",
  "telefono": "123456789",
  "password": "contraseña123",
  "confirmPassword": "contraseña123"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "email": "usuario@example.com",
    "telefono": "123456789",
    "rol": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/verify

Verifica la validez de un token de sesión.

**Request Body:**
```json
{
  "token": "session-token-uuid"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "email": "usuario@example.com",
    "telefono": "123456789",
    "rol": "user",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "Token válido"
}
```

### DELETE /api/auth/verify

Cierra la sesión eliminando el token.

**Request Body:**
```json
{
  "token": "session-token-uuid"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

## Gestión de Tokens

### Almacenamiento
Los tokens se almacenan en la tabla `tokens` con la siguiente estructura:
- `id`: UUID único
- `userId`: ID del usuario
- `token`: Token de sesión (UUID)
- `type`: Tipo de token ("session")
- `expiresAt`: Fecha de expiración (7 días)
- `createdAt`: Fecha de creación

### Expiración
Los tokens expiran automáticamente después de 7 días. La API verifica la expiración en cada solicitud.

### Seguridad
- Los tokens se generan usando `crypto.randomUUID()`
- Se verifica la expiración en cada uso
- Los tokens se eliminan al cerrar sesión

## Validaciones

### Login
- Email: Requerido, formato válido de email
- Password: Requerido

### Registro
- Nombres: Requerido, string no vacío
- Apellidos: Requerido, string no vacío
- Email: Requerido, formato válido de email, único en el sistema
- Teléfono: Opcional
- Password: Requerido, mínimo 6 caracteres
- ConfirmPassword: Debe coincidir con password

### Verificación de Token
- Token: Requerido, debe existir y no estar expirado

## Códigos de Estado HTTP

- `200` - Éxito (login, verify)
- `201` - Creado (registro exitoso)
- `400` - Error de validación
- `401` - Credenciales inválidas / Token inválido
- `409` - Conflicto (email ya existe)
- `500` - Error interno del servidor

## Hooks Modulares

### Estructura de Hooks

```
hooks/
├── auth/
│   ├── index.ts          # Exporta todos los hooks de auth
│   ├── use-auth.ts       # Hook completo de autenticación
│   ├── use-login.ts      # Hook específico para login
│   ├── use-register.ts   # Hook específico para registro
│   └── use-session.ts    # Hook para manejo de sesiones
└── users/
    ├── index.ts          # Exporta todos los hooks de users
    ├── use-users.ts      # Hooks para obtener usuarios
    └── use-user-operations.ts # Hooks para CRUD de usuarios
```

### Uso de Hooks

```typescript
// Autenticación completa
import { useAuth } from '@/hooks/auth'

function Component() {
  const { user, login, logout, isAuthenticated } = useAuth()
}

// Login específico
import { useLogin } from '@/hooks/auth'

function LoginForm() {
  const { login, isLoading } = useLogin()
}

// Usuarios
import { useUsers, useCreateUser } from '@/hooks/users'

function UserManagement() {
  const { users, isLoading } = useUsers()
  const { createUser } = useCreateUser()
}
```

## Configuración de Desarrollo

### Variables de Entorno

```env
# Para desarrollo local
NEXTAUTH_URL="http://localhost:3000"

# Para producción
NEXTAUTH_URL="https://tudominio.vercel.app"
```

La aplicación detecta automáticamente si está en modo desarrollo o producción y usa la URL correspondiente.

## Seguridad

- Las contraseñas se almacenan en texto plano (⚠️ En producción deberías usar hashing con bcrypt)
- Los tokens tienen expiración automática
- Se valida cada token en cada solicitud
- Los tokens se eliminan al cerrar sesión

## Próximos Pasos

1. Implementar hashing de contraseñas con bcrypt
2. Agregar refresh tokens
3. Implementar middleware de autenticación
4. Agregar rate limiting
5. Implementar reset de contraseña
6. Agregar logging de sesiones
```

### POST /api/auth/register

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "nombres": "Juan",
  "apellidos": "Pérez",
  "email": "usuario@example.com",
  "telefono": "123456789",
  "password": "contraseña123",
  "confirmPassword": "contraseña123"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "email": "usuario@example.com",
    "telefono": "123456789",
    "rol": "user",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Response Error (409):**
```json
{
  "success": false,
  "error": "El email ya está registrado"
}
```

## Validaciones

### Login
- Email: Requerido, formato válido de email
- Password: Requerido

### Registro
- Nombres: Requerido, string no vacío
- Apellidos: Requerido, string no vacío
- Email: Requerido, formato válido de email, único en el sistema
- Teléfono: Opcional
- Password: Requerido, mínimo 6 caracteres
- ConfirmPassword: Debe coincidir con password

## Códigos de Estado HTTP

- `200` - Éxito (login)
- `201` - Creado (registro exitoso)
- `400` - Error de validación
- `401` - Credenciales inválidas
- `409` - Conflicto (email ya existe)
- `500` - Error interno del servidor

## Uso desde Cliente

Las funciones de auth en `/lib/actions/auth.ts` ya están configuradas para usar estas APIs:

```javascript
// Login
const result = await login(formData)

// Registro
const result = await register(formData)
```

## Estructura de Archivos

```
app/api/auth/
├── route.ts           # Endpoint base
├── login/
│   └── route.ts       # Login API
└── register/
    └── route.ts       # Register API

lib/
├── actions/
│   └── auth.ts        # Client actions
└── validations/
    └── auth.ts        # Validation helpers
```

## Seguridad

- Las contraseñas se almacenan en texto plano (⚠️ En producción deberías usar hashing con bcrypt)
- No se incluye manejo de sesiones/tokens (puedes agregar JWT más tarde)
- Las respuestas no incluyen la contraseña del usuario

## Próximos Pasos

1. Implementar hashing de contraseñas con bcrypt
2. Agregar manejo de sesiones con JWT
3. Implementar middleware de autenticación
4. Agregar rate limiting
5. Implementar reset de contraseña