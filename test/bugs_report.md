# Reporte de Bugs

## Bug 1: Error en el Registro de Usuario
**Descripción:** Al intentar registrar un usuario con un correo ya existente, no se muestra un mensaje de error.
**Severidad:** Alta
**Pasos para Reproducir:**
1. Navegar a la página de registro.
2. Ingresar un correo ya registrado.
3. Hacer clic en el botón de registro.
**Resultado esperado:** Mostrar un mensaje de error indicando que el correo ya está registrado.
**Resultado actual:** No se muestra ningún mensaje y la página se recarga.

## Bug 2: Carga Lenta de Mapas
**Descripción:** Los mapas tardan más de 10 segundos en cargar en la sección de GPS.
**Severidad:** Media
**Pasos para Reproducir:**
1. Navegar a la sección de GPS.
2. Visualizar el mapa.
**Resultado esperado:** El mapa debería cargar en menos de 3 segundos.
**Resultado actual:** El mapa tarda más de 10 segundos en cargar.

## Bug 3: Error en la Edición de Usuarios
**Descripción:** Al editar un usuario, los cambios no se guardan correctamente.
**Severidad:** Alta
**Pasos para Reproducir:**
1. Navegar a la sección de usuarios.
2. Editar la información de un usuario.
3. Guardar los cambios.
**Resultado esperado:** Los cambios se guardan correctamente.
**Resultado actual:** Los cambios no se reflejan en la base de datos.

## Bug 4: Problema con la Recuperación de Contraseña
**Descripción:** El enlace enviado para recuperar la contraseña expira inmediatamente.
**Severidad:** Alta
**Pasos para Reproducir:**
1. Navegar a la página de recuperación de contraseña.
2. Ingresar un correo registrado.
3. Intentar usar el enlace enviado al correo.
**Resultado esperado:** El enlace debería ser válido por al menos 24 horas.
**Resultado actual:** El enlace expira inmediatamente.

## Bug 5: Error en la Visualización de Reportes
**Descripción:** Algunos reportes no se muestran en la lista de reportes.
**Severidad:** Media
**Pasos para Reproducir:**
1. Navegar a la sección de reportes.
2. Buscar un reporte específico.
**Resultado esperado:** Todos los reportes deberían mostrarse correctamente.
**Resultado actual:** Algunos reportes no aparecen en la lista.