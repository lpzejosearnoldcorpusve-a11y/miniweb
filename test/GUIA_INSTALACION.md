# 🚀 Guía de Instalación - Dashboard Moderno

## Paso 1: Instalar Dependencias

```bash
npm install recharts
```

O si usas yarn:

```bash
yarn add recharts
```

## Paso 2: Verificar Estructura de Carpetas

Asegúrate de que los siguientes archivos existan en `/components/dashboard/`:

```
components/dashboard/
├── dashboard-content.tsx        ✅ ACTUALIZADO
├── dashboard-header.tsx         (existente)
├── dashboard-shell.tsx          (existente)
├── dashboard-sidebar.tsx        (existente)
├── stats-overview.tsx           ✅ NUEVO
├── devices-chart.tsx            ✅ NUEVO
├── devices-table.tsx            ✅ NUEVO
├── routes-card.tsx              ✅ NUEVO
├── alerts-card.tsx              ✅ NUEVO
├── reports-card.tsx             ✅ NUEVO
├── live-monitor.tsx             ✅ NUEVO
├── connectivity-status.tsx      ✅ NUEVO
└── README.md                    ✅ NUEVO
```

## Paso 3: Verificar Componentes UI

Los siguientes componentes de UI deben estar presentes:

```bash
components/ui/
├── card.tsx         ✅ Requerido
├── badge.tsx        ✅ Requerido
└── ...otros...
```

## Paso 4: Actualizar package.json

El archivo `package.json` ha sido actualizado automáticamente con `recharts`.

Verifica que contenga:
```json
{
  "dependencies": {
    "recharts": "^2.10.4"
  }
}
```

## Paso 5: Configuración de Tailwind (ya incluida)

No requiere cambios adicionales. El proyecto ya usa Tailwind CSS v4.1.17

## Paso 6: Iniciar el Proyecto

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

El dashboard estará disponible en:
```
http://localhost:3000/dashboard
```

## 🧪 Pruebas del Dashboard

### Test 1: Verificar Carga Inicial
- [ ] Dashboard carga sin errores
- [ ] Todos los cards se renderizan
- [ ] Gráficos están visibles
- [ ] No hay console errors

### Test 2: Responsividad
- [ ] Vista móvil: 1 columna
- [ ] Vista tablet: 2 columnas
- [ ] Vista desktop: 3 columnas

### Test 3: Interactividad
- [ ] Hover en tarjetas cambia estilos
- [ ] Scrolling funciona correctamente
- [ ] Gráficos son interactivos

### Test 4: Modo Oscuro/Claro
- [ ] Cambiar tema en VS Code
- [ ] Verificar que los colores se adaptan
- [ ] Legibilidad en ambos modos

## 🔧 Troubleshooting

### Error: "Cannot find module 'recharts'"
```bash
npm install recharts
npm run build
npm run dev
```

### Error: "Badge component not found"
Verifica que existe:
```bash
ls components/ui/badge.tsx
```

### Gráficos no se renderizan
- Limpia caché: `rm -rf .next`
- Reinstala dependencias: `npm install`
- Reinicia el servidor: `npm run dev`

### Problema: Layout se ve desorganizado
- Vacía caché de navegador (Ctrl+Shift+Delete)
- Verifica Tailwind en `tailwind.config.ts`
- Reconstruye: `npm run build`

## 📊 Datos de Prueba

### URLs de Prueba Útiles

```
http://localhost:3000/dashboard              - Dashboard principal
http://localhost:3000/dashboard/mapa-gps     - Mapa GPS
http://localhost:3000/dashboard/reportes     - Reportes
http://localhost:3000/dashboard/rutas        - Rutas
```

## 🔐 Variables de Entorno Necesarias

Crea un archivo `.env.local` si no existe:

```env
# Firebase (si usas Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_url

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎯 Próximos Pasos de Integración

### 1. Conectar con Firebase
```tsx
// components/dashboard/devices-chart.tsx
import { onValue, ref } from 'firebase/database'
import { db } from '@/lib/firebase'

useEffect(() => {
  const ref_data = ref(db, 'devices')
  onValue(ref_data, (snapshot) => {
    const data = snapshot.val()
    setDeviceData(data)
  })
}, [])
```

### 2. Conectar con APIs del Backend
```tsx
// components/dashboard/routes-card.tsx
import { useTransport } from '@/hooks/use-transport'

export function RoutesCard() {
  const { rutas, loading } = useTransport()
  
  if (loading) return <div>Cargando...</div>
  
  return (
    <Card>
      {/* Usar rutas del hook */}
    </Card>
  )
}
```

### 3. Agregar Auto-refresh
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    // Actualizar datos
    refetch()
  }, 5000) // Cada 5 segundos
  
  return () => clearInterval(interval)
}, [])
```

## 📝 Checklist de Implementación

- [ ] Dependencias instaladas
- [ ] Estructura de carpetas verificada
- [ ] Dashboard carga sin errores
- [ ] Todos los componentes se renderizan
- [ ] Gráficos funcionan correctamente
- [ ] Responsividad verificada
- [ ] Modo oscuro/claro funciona
- [ ] Datos de prueba visibles
- [ ] Integración con Firebase planeada
- [ ] Integración con APIs planeada

## 🆘 Soporte

Para reportar problemas:

1. Verifica los logs de consola (F12)
2. Revisa la terminal del servidor
3. Consulta los archivos de documentación
4. Verifica que todas las dependencias estén instaladas

## 📞 Contacto

Proyecto: Sistema de Movilidad Urbana - La Paz
Versión: 1.0.0
Fecha: 2025-12-18

---

¡El dashboard está listo para usar! 🎉
