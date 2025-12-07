# API de Reportes de Trameaje - Documentación Completa

Sistema de gestión de reportes de trameaje para el control de cumplimiento de rutas de transporte público.

## Base URL

\`\`\`
https://tu-dominio.com/api
\`\`\`

---

## Índice

1. [Reportes](#reportes)
   - [GET - Listar Reportes](#get-listar-reportes)
   - [POST - Crear Reporte](#post-crear-reporte)
   - [GET - Obtener Reporte por ID](#get-obtener-reporte-por-id)
   - [PUT - Actualizar Reporte](#put-actualizar-reporte)
   - [DELETE - Eliminar Reporte](#delete-eliminar-reporte)
   - [POST - Verificar Reporte](#post-verificar-reporte)
2. [Historial](#historial)
3. [Estadísticas](#estadísticas)
4. [Infracciones](#infracciones)

---

## Reportes

### GET - Listar Reportes

Obtiene todos los reportes con filtros opcionales.

**Endpoint:** `GET /api/reportes`

**Query Parameters:**

| Parámetro    | Tipo   | Requerido | Descripción                                          |
|--------------|--------|-----------|------------------------------------------------------|
| estado       | string | No        | `pendiente`, `en_revision`, `verificado`, `rechazado`, `resuelto` |
| prioridad    | string | No        | `baja`, `media`, `alta`, `urgente`                   |
| tipoReporte  | string | No        | `trameaje`, `exceso_velocidad`, `parada_no_autorizada`, `otro` |
| fechaInicio  | string | No        | Fecha inicio (ISO 8601)                              |
| fechaFin     | string | No        | Fecha fin (ISO 8601)                                 |
| placa        | string | No        | Filtrar por placa del vehículo                       |
| linea        | string | No        | Filtrar por línea de transporte                      |

**Ejemplo Request:**

\`\`\`bash
curl -X GET "https://tu-dominio.com/api/reportes?estado=pendiente&prioridad=alta" \
  -H "Content-Type: application/json"
\`\`\`

**Ejemplo Response (200 OK):**

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "placa": "1234ABCD",
      "linea": "Línea 80",
      "usuarioAppId": "user-123",
      "horaReporte": "2025-01-07T10:30:00.000Z",
      "horaSuceso": "2025-01-07T10:15:00.000Z",
      "latitud": -16.5000,
      "longitud": -68.1500,
      "direccion": "Av. 6 de Agosto esq. Rosendo Gutiérrez",
      "evidenciaImagenes": ["https://storage.com/img1.jpg", "https://storage.com/img2.jpg"],
      "evidenciaVideos": ["https://storage.com/video1.mp4"],
      "evidenciaAudios": [],
      "mensaje": "El minibus se desvió de la ruta establecida por la Av. Camacho",
      "tipoReporte": "trameaje",
      "estado": "pendiente",
      "prioridad": "alta",
      "notasRevision": null,
      "revisadoPor": null,
      "fechaRevision": null,
      "infraccionId": null,
      "createdAt": "2025-01-07T10:30:00.000Z",
      "updatedAt": "2025-01-07T10:30:00.000Z"
    }
  ],
  "total": 1
}
\`\`\`

---

### POST - Crear Reporte

Crea un nuevo reporte de trameaje. Este endpoint es utilizado principalmente por la aplicación móvil.

**Endpoint:** `POST /api/reportes`

**Headers:**

\`\`\`
Content-Type: application/json
\`\`\`

**Body Parameters:**

| Campo             | Tipo     | Requerido | Descripción                                     |
|-------------------|----------|-----------|------------------------------------------------|
| placa             | string   | **Sí**    | Placa del vehículo (ej: "1234ABCD" o "012ABC") |
| linea             | string   | **Sí**    | Línea de transporte (ej: "Línea 80")           |
| horaSuceso        | string   | **Sí**    | Fecha/hora del incidente (ISO 8601)            |
| usuarioAppId      | string   | No        | ID del usuario de la app que reporta           |
| latitud           | number   | No        | Latitud donde ocurrió el incidente             |
| longitud          | number   | No        | Longitud donde ocurrió el incidente            |
| direccion         | string   | No        | Dirección descriptiva del lugar                |
| evidenciaImagenes | string[] | No        | URLs de imágenes como evidencia                |
| evidenciaVideos   | string[] | No        | URLs de videos como evidencia                  |
| evidenciaAudios   | string[] | No        | URLs de audios como evidencia                  |
| mensaje           | string   | No        | Descripción detallada del incidente            |
| tipoReporte       | string   | No        | Tipo: `trameaje`, `exceso_velocidad`, `parada_no_autorizada`, `otro` (default: `trameaje`) |
| prioridad         | string   | No        | Prioridad: `baja`, `media`, `alta`, `urgente` (default: `media`) |

**Ejemplo Request - Reporte Básico:**

\`\`\`bash
curl -X POST "https://tu-dominio.com/api/reportes" \
  -H "Content-Type: application/json" \
  -d '{
    "placa": "1234ABCD",
    "linea": "Línea 80",
    "horaSuceso": "2025-01-07T10:15:00.000Z"
  }'
\`\`\`

**Ejemplo Request - Reporte Completo con Evidencia:**

\`\`\`bash
curl -X POST "https://tu-dominio.com/api/reportes" \
  -H "Content-Type: application/json" \
  -d '{
    "placa": "1234ABCD",
    "linea": "Línea 80",
    "usuarioAppId": "550e8400-e29b-41d4-a716-446655440001",
    "horaSuceso": "2025-01-07T10:15:00.000Z",
    "latitud": -16.5000,
    "longitud": -68.1500,
    "direccion": "Av. 6 de Agosto esq. Rosendo Gutiérrez, Sopocachi",
    "evidenciaImagenes": [
      "https://storage.com/evidencia/img_001.jpg",
      "https://storage.com/evidencia/img_002.jpg"
    ],
    "evidenciaVideos": [
      "https://storage.com/evidencia/video_001.mp4"
    ],
    "evidenciaAudios": [
      "https://storage.com/evidencia/audio_001.m4a"
    ],
    "mensaje": "El minibus de la línea 80 con placa 1234ABCD se desvió de la ruta establecida. En lugar de seguir por la Av. 6 de Agosto, tomó la Av. Camacho. Adjunto evidencia fotográfica y video del desvío.",
    "tipoReporte": "trameaje",
    "prioridad": "alta"
  }'
\`\`\`

**Ejemplo Response (201 Created):**

\`\`\`json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "placa": "1234ABCD",
    "linea": "Línea 80",
    "usuarioAppId": "550e8400-e29b-41d4-a716-446655440001",
    "horaReporte": "2025-01-07T10:30:00.000Z",
    "horaSuceso": "2025-01-07T10:15:00.000Z",
    "latitud": -16.5000,
    "longitud": -68.1500,
    "direccion": "Av. 6 de Agosto esq. Rosendo Gutiérrez, Sopocachi",
    "evidenciaImagenes": [
      "https://storage.com/evidencia/img_001.jpg",
      "https://storage.com/evidencia/img_002.jpg"
    ],
    "evidenciaVideos": [
      "https://storage.com/evidencia/video_001.mp4"
    ],
    "evidenciaAudios": [
      "https://storage.com/evidencia/audio_001.m4a"
    ],
    "mensaje": "El minibus de la línea 80 con placa 1234ABCD se desvió de la ruta establecida...",
    "tipoReporte": "trameaje",
    "estado": "pendiente",
    "prioridad": "alta",
    "notasRevision": null,
    "revisadoPor": null,
    "fechaRevision": null,
    "infraccionId": null,
    "createdAt": "2025-01-07T10:30:00.000Z",
    "updatedAt": "2025-01-07T10:30:00.000Z"
  },
  "message": "Reporte creado exitosamente"
}
\`\`\`

**Ejemplo Response Error (400 Bad Request):**

\`\`\`json
{
  "success": false,
  "error": "Campos requeridos: placa, linea, horaSuceso"
}
\`\`\`

---

### GET - Obtener Reporte por ID

Obtiene los detalles completos de un reporte específico.

**Endpoint:** `GET /api/reportes/{id}`

**Path Parameters:**

| Parámetro | Tipo   | Descripción           |
|-----------|--------|-----------------------|
| id        | string | UUID del reporte      |

**Ejemplo Request:**

\`\`\`bash
curl -X GET "https://tu-dominio.com/api/reportes/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json"
\`\`\`

**Ejemplo Response (200 OK):**

\`\`\`json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "placa": "1234ABCD",
    "linea": "Línea 80",
    "usuarioAppId": "550e8400-e29b-41d4-a716-446655440001",
    "horaReporte": "2025-01-07T10:30:00.000Z",
    "horaSuceso": "2025-01-07T10:15:00.000Z",
    "latitud": -16.5000,
    "longitud": -68.1500,
    "direccion": "Av. 6 de Agosto esq. Rosendo Gutiérrez",
    "evidenciaImagenes": ["https://storage.com/img1.jpg"],
    "evidenciaVideos": [],
    "evidenciaAudios": [],
    "mensaje": "Descripción del incidente...",
    "tipoReporte": "trameaje",
    "estado": "pendiente",
    "prioridad": "alta",
    "notasRevision": null,
    "revisadoPor": null,
    "fechaRevision": null,
    "infraccionId": null,
    "createdAt": "2025-01-07T10:30:00.000Z",
    "updatedAt": "2025-01-07T10:30:00.000Z",
    "usuarioApp": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "nombres": "Juan Carlos",
      "apellidoPaterno": "Mamani",
      "apellidoMaterno": "Quispe",
      "celular": "71234567"
    }
  }
}
\`\`\`

**Ejemplo Response (404 Not Found):**

\`\`\`json
{
  "success": false,
  "error": "Reporte no encontrado"
}
\`\`\`

---

### PUT - Actualizar Reporte

Actualiza el estado, prioridad o notas de revisión de un reporte.

**Endpoint:** `PUT /api/reportes/{id}`

**Path Parameters:**

| Parámetro | Tipo   | Descripción           |
|-----------|--------|-----------------------|
| id        | string | UUID del reporte      |

**Body Parameters:**

| Campo         | Tipo   | Requerido | Descripción                                          |
|---------------|--------|-----------|------------------------------------------------------|
| estado        | string | No        | `pendiente`, `en_revision`, `verificado`, `rechazado`, `resuelto` |
| prioridad     | string | No        | `baja`, `media`, `alta`, `urgente`                   |
| notasRevision | string | No        | Notas del revisor sobre el reporte                   |
| revisadoPor   | string | No        | UUID del usuario que revisa                          |

**Ejemplo Request - Cambiar Estado a En Revisión:**

\`\`\`bash
curl -X PUT "https://tu-dominio.com/api/reportes/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "en_revision",
    "revisadoPor": "admin-user-uuid-123"
  }'
\`\`\`

**Ejemplo Request - Rechazar Reporte:**

\`\`\`bash
curl -X PUT "https://tu-dominio.com/api/reportes/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "rechazado",
    "notasRevision": "La evidencia proporcionada no es suficiente para verificar el trameaje. Se requieren imágenes más claras de la placa del vehículo.",
    "revisadoPor": "admin-user-uuid-123"
  }'
\`\`\`

**Ejemplo Request - Cambiar Prioridad:**

\`\`\`bash
curl -X PUT "https://tu-dominio.com/api/reportes/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "prioridad": "urgente",
    "notasRevision": "Múltiples reportes del mismo vehículo en el día de hoy."
  }'
\`\`\`

**Ejemplo Response (200 OK):**

\`\`\`json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "placa": "1234ABCD",
    "linea": "Línea 80",
    "estado": "en_revision",
    "prioridad": "alta",
    "notasRevision": null,
    "revisadoPor": "admin-user-uuid-123",
    "fechaRevision": "2025-01-07T11:00:00.000Z",
    "updatedAt": "2025-01-07T11:00:00.000Z"
  },
  "message": "Reporte actualizado exitosamente"
}
\`\`\`

---

### DELETE - Eliminar Reporte

Elimina permanentemente un reporte del sistema.

**Endpoint:** `DELETE /api/reportes/{id}`

**Path Parameters:**

| Parámetro | Tipo   | Descripción           |
|-----------|--------|-----------------------|
| id        | string | UUID del reporte      |

**Ejemplo Request:**

\`\`\`bash
curl -X DELETE "https://tu-dominio.com/api/reportes/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json"
\`\`\`

**Ejemplo Response (200 OK):**

\`\`\`json
{
  "success": true,
  "message": "Reporte eliminado exitosamente"
}
\`\`\`

---

### POST - Verificar Reporte

Verifica un reporte y opcionalmente genera una infracción de Bs. 100 al chofer.

**Endpoint:** `POST /api/reportes/{id}/verificar`

**Path Parameters:**

| Parámetro | Tipo   | Descripción           |
|-----------|--------|-----------------------|
| id        | string | UUID del reporte      |

**Body Parameters:**

| Campo            | Tipo    | Requerido | Descripción                                |
|------------------|---------|-----------|-------------------------------------------|
| revisadoPor      | string  | **Sí**    | UUID del usuario que verifica el reporte  |
| generarInfraccion| boolean | No        | Si genera infracción automática (default: true) |

**Ejemplo Request - Verificar y Generar Infracción:**

\`\`\`bash
curl -X POST "https://tu-dominio.com/api/reportes/550e8400-e29b-41d4-a716-446655440000/verificar" \
  -H "Content-Type: application/json" \
  -d '{
    "revisadoPor": "admin-user-uuid-123",
    "generarInfraccion": true
  }'
\`\`\`

**Ejemplo Request - Verificar Sin Infracción:**

\`\`\`bash
curl -X POST "https://tu-dominio.com/api/reportes/550e8400-e29b-41d4-a716-446655440000/verificar" \
  -H "Content-Type: application/json" \
  -d '{
    "revisadoPor": "admin-user-uuid-123",
    "generarInfraccion": false
  }'
\`\`\`

**Ejemplo Response (200 OK) - Con Infracción:**

\`\`\`json
{
  "success": true,
  "data": {
    "reporte": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "estado": "verificado",
      "fechaRevision": "2025-01-07T11:30:00.000Z"
    },
    "infraccion": {
      "id": "infraccion-uuid-456",
      "placaId": "placa-uuid-789",
visadoPor      "choferId": "chofer-uuid-012",
      "reporteId": "550e8400-e29b-41d4-a716-446655440000",
      "tipoInfraccion": "trameaje",
      "descripcion": "Desvío de ruta verificado - Línea 80",
      "montoBs": 100,
      "estado": "pendiente",
      "fechaInfraccion": "2025-01-07T10:15:00.000Z",
      "createdAt": "2025-01-07T11:30:00.000Z"
    }
  },
  "message": "Reporte verificado. Infracción generada: Bs. 100"
}
\`\`\`

---

## Historial

### GET - Obtener Historial Paginado

Obtiene el historial de reportes con paginación.

**Endpoint:** `GET /api/reportes/historial`

**Query Parameters:**

| Parámetro | Tipo   | Requerido | Default | Descripción              |
|-----------|--------|-----------|---------|--------------------------|
| page      | number | No        | 1       | Número de página         |
| pageSize  | number | No        | 20      | Registros por página     |

**Ejemplo Request:**

\`\`\`bash
curl -X GET "https://tu-dominio.com/api/reportes/historial?page=1&pageSize=10" \
  -H "Content-Type: application/json"
\`\`\`

**Ejemplo Response (200 OK):**

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "placa": "1234ABCD",
      "linea": "Línea 80",
      "tipoReporte": "trameaje",
      "estado": "verificado",
      "prioridad": "alta",
      "horaReporte": "2025-01-07T10:30:00.000Z",
      "horaSuceso": "2025-01-07T10:15:00.000Z",
      "usuarioReportador": "Juan Carlos Mamani Quispe",
      "tieneEvidencia": true
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 150,
    "totalPages": 15
  }
}
\`\`\`

---

## Estadísticas

### GET - Obtener Estadísticas

Obtiene estadísticas generales de los reportes.

**Endpoint:** `GET /api/reportes/estadisticas`

**Ejemplo Request:**

\`\`\`bash
curl -X GET "https://tu-dominio.com/api/reportes/estadisticas" \
  -H "Content-Type: application/json"
\`\`\`

**Ejemplo Response (200 OK):**

\`\`\`json
{
  "success": true,
  "data": {
    "totalReportes": 250,
    "pendientes": 45,
    "enRevision": 12,
    "verificados": 150,
    "rechazados": 28,
    "resueltos": 15,
    "infraccionesGeneradas": 142,
    "montoTotalInfracciones": 14200
  }
}
\`\`\`

---

## Infracciones

### GET - Listar Infracciones

Obtiene todas las infracciones generadas.

**Endpoint:** `GET /api/infracciones`

**Ejemplo Request:**

\`\`\`bash
curl -X GET "https://tu-dominio.com/api/infracciones" \
  -H "Content-Type: application/json"
\`\`\`

**Ejemplo Response (200 OK):**

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "infraccion-uuid-456",
      "placaId": "placa-uuid-789",
      "choferId": "chofer-uuid-012",
      "reporteId": "550e8400-e29b-41d4-a716-446655440000",
      "tipoInfraccion": "trameaje",
      "descripcion": "Desvío de ruta verificado - Línea 80",
      "montoBs": 100,
      "estado": "pendiente",
      "fechaInfraccion": "2025-01-07T10:15:00.000Z",
      "fechaPago": null,
      "createdAt": "2025-01-07T11:30:00.000Z",
      "placa": {
        "id": "placa-uuid-789",
        "numero": "1234ABCD",
        "tipo": "moderna"
      },
      "chofer": {
        "id": "chofer-uuid-012",
        "nombres": "Pedro",
        "apellidoPaterno": "Condori",
        "apellidoMaterno": "Flores",
        "ci": "12345678"
      }
    }
  ],
  "total": 142
}
\`\`\`

---

### POST - Pagar Infracción

Marca una infracción como pagada.

**Endpoint:** `POST /api/infracciones/{id}/pagar`

**Path Parameters:**

| Parámetro | Tipo   | Descripción           |
|-----------|--------|-----------------------|
| id        | string | UUID de la infracción |

**Ejemplo Request:**

\`\`\`bash
curl -X POST "https://tu-dominio.com/api/infracciones/infraccion-uuid-456/pagar" \
  -H "Content-Type: application/json"
\`\`\`

**Ejemplo Response (200 OK):**

\`\`\`json
{
  "success": true,
  "data": {
    "id": "infraccion-uuid-456",
    "estado": "pagada",
    "fechaPago": "2025-01-07T14:00:00.000Z",
    "montoBs": 100
  },
  "message": "Infracción pagada exitosamente"
}
\`\`\`

---

## Códigos de Respuesta HTTP

| Código | Descripción                                      |
|--------|--------------------------------------------------|
| 200    | Operación exitosa                                |
| 201    | Recurso creado exitosamente                      |
| 400    | Error en la solicitud (campos faltantes/inválidos)|
| 404    | Recurso no encontrado                            |
| 500    | Error interno del servidor                       |

---

## Estructura JSON Completa para Envío desde App Móvil

### Flutter/Dart

\`\`\`dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> crearReporte({
  required String placa,
  required String linea,
  required DateTime horaSuceso,
  String? usuarioAppId,
  double? latitud,
  double? longitud,
  String? direccion,
  List<String>? imagenes,
  List<String>? videos,
  List<String>? audios,
  String? mensaje,
  String tipoReporte = 'trameaje',
  String prioridad = 'media',
}) async {
  final url = Uri.parse('https://tu-dominio.com/api/reportes');
  
  final body = {
    'placa': placa,
    'linea': linea,
    'horaSuceso': horaSuceso.toIso8601String(),
    if (usuarioAppId != null) 'usuarioAppId': usuarioAppId,
    if (latitud != null) 'latitud': latitud,
    if (longitud != null) 'longitud': longitud,
    if (direccion != null) 'direccion': direccion,
    if (imagenes != null && imagenes.isNotEmpty) 'evidenciaImagenes': imagenes,
    if (videos != null && videos.isNotEmpty) 'evidenciaVideos': videos,
    if (audios != null && audios.isNotEmpty) 'evidenciaAudios': audios,
    if (mensaje != null) 'mensaje': mensaje,
    'tipoReporte': tipoReporte,
    'prioridad': prioridad,
  };

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );

  return jsonDecode(response.body);
}
\`\`\`

### React Native/JavaScript

\`\`\`javascript
const crearReporte = async ({
  placa,
  linea,
  horaSuceso,
  usuarioAppId = null,
  latitud = null,
  longitud = null,
  direccion = null,
  evidenciaImagenes = [],
  evidenciaVideos = [],
  evidenciaAudios = [],
  mensaje = null,
  tipoReporte = 'trameaje',
  prioridad = 'media'
}) => {
  const body = {
    placa,
    linea,
    horaSuceso: new Date(horaSuceso).toISOString(),
    ...(usuarioAppId && { usuarioAppId }),
    ...(latitud && { latitud }),
    ...(longitud && { longitud }),
    ...(direccion && { direccion }),
    ...(evidenciaImagenes.length > 0 && { evidenciaImagenes }),
    ...(evidenciaVideos.length > 0 && { evidenciaVideos }),
    ...(evidenciaAudios.length > 0 && { evidenciaAudios }),
    ...(mensaje && { mensaje }),
    tipoReporte,
    prioridad
  };

  const response = await fetch('https://tu-dominio.com/api/reportes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  return response.json();
};

// Uso
const resultado = await crearReporte({
  placa: '1234ABCD',
  linea: 'Línea 80',
  horaSuceso: new Date(),
  latitud: -16.5000,
  longitud: -68.1500,
  mensaje: 'El minibus se desvió de la ruta'
});
\`\`\`

---

## Diagrama de Flujo del Sistema de Reportes

\`\`\`
┌─────────────────┐
│  Usuario App    │
│  (Ciudadano)    │
└────────┬────────┘
         │
         │ POST /api/reportes
         │ (placa, linea, evidencia)
         ▼
┌─────────────────┐
│    REPORTE      │
│   (pendiente)   │
└────────┬────────┘
         │
         │ PUT /api/reportes/{id}
         │ (estado: en_revision)
         ▼
┌─────────────────┐
│    REPORTE      │
│  (en_revision)  │
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
         │ POST /api/reportes/{id}/     │ PUT /api/reportes/{id}
         │ verificar                    │ (estado: rechazado)
         ▼                              ▼
┌─────────────────┐           ┌─────────────────┐
│    REPORTE      │           │    REPORTE      │
│  (verificado)   │           │  (rechazado)    │
└────────┬────────┘           └─────────────────┘
         │
         │ Genera automáticamente
         ▼
┌─────────────────┐
│   INFRACCIÓN    │
│   Bs. 100       │
│  (pendiente)    │
└────────┬────────┘
         │
         │ POST /api/infracciones/{id}/pagar
         ▼
┌─────────────────┐
│   INFRACCIÓN    │
│    (pagada)     │
└─────────────────┘
\`\`\`

---

## Notas de Implementación

1. **Evidencia**: Las URLs de imágenes, videos y audios deben ser URLs públicas accesibles. Se recomienda usar un servicio de almacenamiento como Vercel Blob, AWS S3 o similar.

2. **Geolocalización**: Se recomienda siempre enviar latitud y longitud para poder visualizar el reporte en el mapa.

3. **Infracciones**: El monto de Bs. 100 está configurado por defecto. Para modificarlo, actualizar la función `verificarReporte` en `lib/actions/reportes.ts`.

4. **Historial**: El endpoint de historial está optimizado para paginación. Usar `pageSize` apropiado para evitar cargas excesivas.
