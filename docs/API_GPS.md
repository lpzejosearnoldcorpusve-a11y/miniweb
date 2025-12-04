# API GPS - Documentación Completa

Sistema de Movilidad Urbana - Gobierno Autónomo Municipal de La Paz

## Información General

**Base URL:** `/api/gps`

**Content-Type:** `application/json`

**Autenticación:** Por implementar (JWT/API Key)

---

## Índice de Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/gps/hardware` | Recibir datos del hardware GPS |
| GET | `/api/gps/vehiculos` | Listar todos los vehículos |
| POST | `/api/gps/vehiculos` | Crear nuevo vehículo |
| PUT | `/api/gps/vehiculos/[id]` | Actualizar vehículo |
| DELETE | `/api/gps/vehiculos/[id]` | Eliminar vehículo |
| GET | `/api/gps/ubicaciones` | Obtener ubicaciones en tiempo real |
| POST | `/api/gps/pagos/verificar` | Verificar y procesar pago RFID |
| GET | `/api/gps/transacciones` | Listar transacciones |
| GET | `/api/gps/estadisticas` | Obtener estadísticas del día |

---

## 1. Hardware GPS (ESP8266)

### POST /api/gps/hardware

Endpoint principal para recibir datos desde el dispositivo GPS (ESP8266/Arduino).

**Request Body:**

\`\`\`json
{
  "placa": "1234ABC",
  "linea": "Línea 102",
  "latitud": -16.5000,
  "longitud": -68.1500,
  "velocidad": 35.5,
  "direccion": 180,
  "satelites": 8,
  "timestamp": "2024-01-15T10:30:00Z",
  "transacciones": [
    {
      "rfid_id": "A1B2C3D4",
      "pasajero_id": "usr_123",
      "monto": 2.50,
      "tipo_pago": "normal",
      "descuento": 0,
      "fecha_hora": "2024-01-15T10:28:00Z",
      "estado": "completado",
      "saldo_restante": 47.50
    },
    {
      "rfid_id": "E5F6G7H8",
      "pasajero_id": "usr_456",
      "monto": 1.25,
      "tipo_pago": "estudiante",
      "descuento": 50,
      "fecha_hora": "2024-01-15T10:29:30Z",
      "estado": "completado",
      "saldo_restante": 23.75
    }
  ],
  "estadisticas": {
    "total_pasajeros": 45,
    "total_recaudado": 112.50,
    "pagos_normales": 30,
    "pagos_estudiante": 10,
    "pagos_tercera_edad": 5
  }
}
\`\`\`

**Campos del Request:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| placa | string | Si | Placa del vehículo |
| linea | string | Si | Línea o ruta del vehículo |
| latitud | number | Si | Latitud GPS (-90 a 90) |
| longitud | number | Si | Longitud GPS (-180 a 180) |
| velocidad | number | No | Velocidad en km/h |
| direccion | number | No | Dirección en grados (0-360) |
| satelites | number | No | Número de satélites conectados |
| timestamp | string | No | Fecha/hora ISO 8601 |
| transacciones | array | No | Lista de transacciones RFID |
| estadisticas | object | No | Estadísticas del viaje |

**Campos de Transacción:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| rfid_id | string | UID de la tarjeta RFID |
| pasajero_id | string | ID del usuario (opcional) |
| monto | number | Monto cobrado en Bs |
| tipo_pago | string | "normal", "estudiante", "tercera_edad" |
| descuento | number | Porcentaje de descuento aplicado |
| fecha_hora | string | Fecha/hora de la transacción |
| estado | string | "completado", "pendiente", "rechazado" |
| saldo_restante | number | Saldo restante en la tarjeta |

**Response Exitoso (200):**

\`\`\`json
{
  "success": true,
  "message": "Datos procesados correctamente",
  "vehiculoId": "vh_abc123",
  "ubicacionId": "ub_xyz789",
  "transaccionesProcesadas": 2
}
\`\`\`

**Response Error (400):**

\`\`\`json
{
  "success": false,
  "error": "Datos incompletos: placa, linea, latitud y longitud son requeridos"
}
\`\`\`

**Ejemplo cURL:**

\`\`\`bash
curl -X POST https://tu-dominio.com/api/gps/hardware \
  -H "Content-Type: application/json" \
  -d '{
    "placa": "1234ABC",
    "linea": "Línea 102",
    "latitud": -16.5000,
    "longitud": -68.1500,
    "velocidad": 35.5,
    "direccion": 180,
    "satelites": 8,
    "timestamp": "2024-01-15T10:30:00Z",
    "transacciones": [],
    "estadisticas": {
      "total_pasajeros": 0,
      "total_recaudado": 0,
      "pagos_normales": 0,
      "pagos_estudiante": 0,
      "pagos_tercera_edad": 0
    }
  }'
\`\`\`

**Código Arduino/ESP8266:**

\`\`\`cpp
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* serverUrl = "https://tu-dominio.com/api/gps/hardware";

void enviarDatosGPS(float lat, float lng, float vel, int dir, int sats) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClientSecure client;
    client.setInsecure();
    
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    StaticJsonDocument<512> doc;
    doc["placa"] = "1234ABC";
    doc["linea"] = "Linea 102";
    doc["latitud"] = lat;
    doc["longitud"] = lng;
    doc["velocidad"] = vel;
    doc["direccion"] = dir;
    doc["satelites"] = sats;
    
    String payload;
    serializeJson(doc, payload);
    
    int httpCode = http.POST(payload);
    
    if (httpCode == 200) {
      Serial.println("Datos enviados correctamente");
    } else {
      Serial.printf("Error: %d\n", httpCode);
    }
    
    http.end();
  }
}
\`\`\`

---

## 2. Gestión de Vehículos

### GET /api/gps/vehiculos

Obtener lista de todos los vehículos registrados.

**Response Exitoso (200):**

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "vh_abc123",
      "placa": "1234ABC",
      "linea": "Línea 102",
      "tipoVehiculo": "minibus",
      "conductorId": "usr_driver1",
      "activo": true,
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "vh_def456",
      "placa": "5678XYZ",
      "linea": "Línea Roja",
      "tipoVehiculo": "teleferico",
      "conductorId": null,
      "activo": true,
      "createdAt": "2024-01-05T09:00:00Z",
      "updatedAt": "2024-01-14T15:45:00Z"
    }
  ]
}
\`\`\`

**Ejemplo cURL:**

\`\`\`bash
curl -X GET https://tu-dominio.com/api/gps/vehiculos
\`\`\`

---

### POST /api/gps/vehiculos

Crear un nuevo vehículo en el sistema.

**Request Body:**

\`\`\`json
{
  "placa": "9999NEW",
  "linea": "Línea 205",
  "tipoVehiculo": "minibus",
  "conductorId": "usr_driver5"
}
\`\`\`

**Campos del Request:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| placa | string | Si | Placa única del vehículo |
| linea | string | Si | Línea o ruta asignada |
| tipoVehiculo | string | No | "minibus", "teleferico", "bus" |
| conductorId | string | No | ID del conductor asignado |

**Response Exitoso (201):**

\`\`\`json
{
  "success": true,
  "data": {
    "id": "vh_new789",
    "placa": "9999NEW",
    "linea": "Línea 205",
    "tipoVehiculo": "minibus",
    "conductorId": "usr_driver5",
    "activo": true,
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
\`\`\`

**Response Error (400):**

\`\`\`json
{
  "success": false,
  "error": "Placa y línea son requeridos"
}
\`\`\`

**Ejemplo cURL:**

\`\`\`bash
curl -X POST https://tu-dominio.com/api/gps/vehiculos \
  -H "Content-Type: application/json" \
  -d '{
    "placa": "9999NEW",
    "linea": "Línea 205",
    "tipoVehiculo": "minibus"
  }'
\`\`\`

---

### PUT /api/gps/vehiculos/[id]

Actualizar información de un vehículo existente.

**URL Params:**
- `id`: ID del vehículo a actualizar

**Request Body:**

\`\`\`json
{
  "linea": "Línea 210",
  "conductorId": "usr_driver10",
  "activo": false
}
\`\`\`

**Response Exitoso (200):**

\`\`\`json
{
  "success": true,
  "data": {
    "id": "vh_abc123",
    "placa": "1234ABC",
    "linea": "Línea 210",
    "tipoVehiculo": "minibus",
    "conductorId": "usr_driver10",
    "activo": false,
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
\`\`\`

**Ejemplo cURL:**

\`\`\`bash
curl -X PUT https://tu-dominio.com/api/gps/vehiculos/vh_abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Línea 210",
    "activo": false
  }'
\`\`\`

---

### DELETE /api/gps/vehiculos/[id]

Eliminar un vehículo del sistema.

**URL Params:**
- `id`: ID del vehículo a eliminar

**Response Exitoso (200):**

\`\`\`json
{
  "success": true,
  "message": "Vehículo eliminado correctamente"
}
\`\`\`

**Ejemplo cURL:**

\`\`\`bash
curl -X DELETE https://tu-dominio.com/api/gps/vehiculos/vh_abc123
\`\`\`

---

## 3. Ubicaciones en Tiempo Real

### GET /api/gps/ubicaciones

Obtener las últimas ubicaciones de todos los vehículos activos.

**Response Exitoso (200):**

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "ub_001",
      "vehiculoId": "vh_abc123",
      "placa": "1234ABC",
      "linea": "Línea 102",
      "tipoVehiculo": "minibus",
      "latitud": -16.5000,
      "longitud": -68.1500,
      "velocidad": 35.5,
      "direccion": 180,
      "satelites": 8,
      "ultimaActualizacion": "2024-01-15T10:30:00Z",
      "pasajerosHoy": 45,
      "recaudadoHoy": 112.50
    },
    {
      "id": "ub_002",
      "vehiculoId": "vh_def456",
      "placa": "5678XYZ",
      "linea": "Línea Roja",
      "tipoVehiculo": "teleferico",
      "latitud": -16.4950,
      "longitud": -68.1450,
      "velocidad": 5.0,
      "direccion": 90,
      "satelites": 12,
      "ultimaActualizacion": "2024-01-15T10:29:45Z",
      "pasajerosHoy": 320,
      "recaudadoHoy": 800.00
    }
  ]
}
\`\`\`

**Ejemplo cURL:**

\`\`\`bash
curl -X GET https://tu-dominio.com/api/gps/ubicaciones
\`\`\`

**Uso en Frontend (Polling cada 5 segundos):**

\`\`\`typescript
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

function MapaGPS() {
  const { data, error } = useSWR('/api/gps/ubicaciones', fetcher, {
    refreshInterval: 5000 // Actualizar cada 5 segundos
  })

  if (error) return <div>Error al cargar ubicaciones</div>
  if (!data) return <div>Cargando...</div>

  return (
    <div>
      {data.data.map((vehiculo) => (
        <Marker key={vehiculo.id} position={[vehiculo.latitud, vehiculo.longitud]} />
      ))}
    </div>
  )
}
\`\`\`

---

## 4. Verificación de Pagos RFID

### POST /api/gps/pagos/verificar

Verificar y procesar el pago de una tarjeta RFID.

**Request Body:**

\`\`\`json
{
  "rfidUid": "A1B2C3D4",
  "monto": 2.50,
  "vehiculoId": "vh_abc123",
  "tipoPago": "normal"
}
\`\`\`

**Campos del Request:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| rfidUid | string | Si | UID de la tarjeta RFID |
| monto | number | Si | Monto a cobrar en Bs |
| vehiculoId | string | No | ID del vehículo donde se realiza |
| tipoPago | string | No | "normal", "estudiante", "tercera_edad" |

**Response Exitoso - Pago Aprobado (200):**

\`\`\`json
{
  "success": true,
  "message": "Pago procesado correctamente",
  "transaccionId": "tx_abc123",
  "saldoRestante": 47.50,
  "tipoPago": "normal",
  "descuento": 0
}
\`\`\`

**Response Error - Saldo Insuficiente (400):**

\`\`\`json
{
  "success": false,
  "message": "Saldo insuficiente",
  "saldoActual": 1.50,
  "montoRequerido": 2.50
}
\`\`\`

**Response Error - Tarjeta No Encontrada (400):**

\`\`\`json
{
  "success": false,
  "message": "Tarjeta no registrada en el sistema"
}
\`\`\`

**Ejemplo cURL:**

\`\`\`bash
curl -X POST https://tu-dominio.com/api/gps/pagos/verificar \
  -H "Content-Type: application/json" \
  -d '{
    "rfidUid": "A1B2C3D4",
    "monto": 2.50,
    "vehiculoId": "vh_abc123"
  }'
\`\`\`

**Código Arduino/ESP8266 para Lector RFID:**

\`\`\`cpp
#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

#define SS_PIN D8
#define RST_PIN D0

MFRC522 rfid(SS_PIN, RST_PIN);
const char* serverUrl = "https://tu-dominio.com/api/gps/pagos/verificar";
const float TARIFA_NORMAL = 2.50;

void verificarPago(String rfidUid) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClientSecure client;
    client.setInsecure();
    
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    StaticJsonDocument<256> doc;
    doc["rfidUid"] = rfidUid;
    doc["monto"] = TARIFA_NORMAL;
    doc["vehiculoId"] = "vh_mi_vehiculo";
    
    String payload;
    serializeJson(doc, payload);
    
    int httpCode = http.POST(payload);
    
    if (httpCode == 200) {
      String response = http.getString();
      
      StaticJsonDocument<256> resDoc;
      deserializeJson(resDoc, response);
      
      if (resDoc["success"]) {
        // Activar LED verde y buzzer
        digitalWrite(LED_GREEN, HIGH);
        tone(BUZZER_PIN, 1000, 200);
        
        Serial.print("Pago aprobado. Saldo: ");
        Serial.println((float)resDoc["saldoRestante"]);
      } else {
        // Activar LED rojo
        digitalWrite(LED_RED, HIGH);
        tone(BUZZER_PIN, 500, 500);
        
        Serial.print("Pago rechazado: ");
        Serial.println((const char*)resDoc["message"]);
      }
    }
    
    http.end();
  }
}

void loop() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    String uid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      uid += String(rfid.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();
    
    verificarPago(uid);
    
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }
}
\`\`\`

---

## 5. Transacciones

### GET /api/gps/transacciones

Obtener lista de transacciones con filtros opcionales.

**Query Parameters:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| vehiculoId | string | Filtrar por ID de vehículo |
| tarjetaId | string | Filtrar por ID de tarjeta |

**Response Exitoso (200):**

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "tx_001",
      "tarjetaId": "tj_abc",
      "rfidUid": "A1B2C3D4",
      "vehiculoId": "vh_abc123",
      "monto": 2.50,
      "tipoPago": "normal",
      "descuento": 0,
      "saldoAnterior": 50.00,
      "saldoPosterior": 47.50,
      "ubicacionLat": -16.5000,
      "ubicacionLng": -68.1500,
      "createdAt": "2024-01-15T10:28:00Z"
    },
    {
      "id": "tx_002",
      "tarjetaId": "tj_def",
      "rfidUid": "E5F6G7H8",
      "vehiculoId": "vh_abc123",
      "monto": 1.25,
      "tipoPago": "estudiante",
      "descuento": 50,
      "saldoAnterior": 25.00,
      "saldoPosterior": 23.75,
      "ubicacionLat": -16.5010,
      "ubicacionLng": -68.1520,
      "createdAt": "2024-01-15T10:29:30Z"
    }
  ]
}
\`\`\`

**Ejemplo cURL con filtro:**

\`\`\`bash
curl -X GET "https://tu-dominio.com/api/gps/transacciones?vehiculoId=vh_abc123"
\`\`\`

---

## 6. Estadísticas del Día

### GET /api/gps/estadisticas

Obtener estadísticas consolidadas del día actual.

**Response Exitoso (200):**

\`\`\`json
{
  "success": true,
  "data": {
    "fecha": "2024-01-15",
    "totalVehiculos": 25,
    "vehiculosActivos": 18,
    "totalPasajeros": 1250,
    "totalRecaudado": 3125.00,
    "promedioVelocidad": 28.5,
    "desglosePagos": {
      "normales": {
        "cantidad": 850,
        "monto": 2125.00
      },
      "estudiante": {
        "cantidad": 300,
        "monto": 750.00
      },
      "terceraEdad": {
        "cantidad": 100,
        "monto": 250.00
      }
    },
    "porLinea": [
      {
        "linea": "Línea 102",
        "pasajeros": 450,
        "recaudado": 1125.00
      },
      {
        "linea": "Línea Roja",
        "pasajeros": 800,
        "recaudado": 2000.00
      }
    ]
  }
}
\`\`\`

**Ejemplo cURL:**

\`\`\`bash
curl -X GET https://tu-dominio.com/api/gps/estadisticas
\`\`\`

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Error en la solicitud (datos inválidos) |
| 401 | No autorizado (pendiente implementación) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Formato de Respuestas

Todas las respuestas siguen el siguiente formato:

**Respuesta Exitosa:**
\`\`\`json
{
  "success": true,
  "data": { ... },
  "message": "Mensaje opcional"
}
\`\`\`

**Respuesta de Error:**
\`\`\`json
{
  "success": false,
  "error": "Descripción del error"
}
\`\`\`

---

## Integración con Hardware

### Diagrama de Flujo

\`\`\`
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   ESP8266/GPS   │────▶│   API REST      │────▶│   Base de Datos │
│   + RFID RC522  │     │   /api/gps/*    │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       ▼                       │
        │               ┌─────────────────┐             │
        │               │   Dashboard     │◀────────────┘
        │               │   Tiempo Real   │
        │               └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Lector RFID    │     │   Mapa GPS      │
│  Verificación   │     │   Leaflet       │
└─────────────────┘     └─────────────────┘
\`\`\`

### Intervalo de Envío Recomendado

- **Ubicación GPS**: Cada 5-10 segundos
- **Transacciones RFID**: Inmediatamente al procesar
- **Estadísticas**: Cada 60 segundos o al final de ruta

---

## Notas de Implementación

1. **Seguridad**: Implementar autenticación JWT o API Key antes de producción
2. **Rate Limiting**: Limitar solicitudes por IP/dispositivo
3. **Caché**: Implementar caché Redis para ubicaciones frecuentes
4. **WebSockets**: Considerar WebSockets para actualizaciones en tiempo real más eficientes

---

**Versión:** 1.0.0  
**Última Actualización:** Enero 2024  
**Desarrollado para:** Gobierno Autónomo Municipal de La Paz
