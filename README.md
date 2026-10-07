# RedSocial React

Proyecto React + Vite con React Router, persistencia local y publicación multimedia.

## Funciones añadidas

- Registro, inicio de sesión y restablecimiento de contraseña con datos locales del navegador.
- Rutas: Inicio, Amigos, Grupos, Marketplace y Recuerdos.
- Solicitudes de amistad persistentes con `localStorage`.
- Membresías de grupos persistentes con `localStorage`.
- Publicación de texto.
- Selección de fotos y videos desde el computador mediante `Foto/video`.
- Vista previa de fotos y videos antes de publicar.
- Almacenamiento de archivos multimedia publicados mediante IndexedDB para no llenar `localStorage` con archivos grandes.
- Video en vivo mediante cámara y micrófono del computador: vista previa, grabación de hasta 60 segundos y publicación del video grabado.
- Likes, comentarios, respuestas y compartir de las publicaciones existentes.

## Instalación

```bash
npm install
npm run dev
```

Luego abre la dirección local que muestre Vite, normalmente `http://localhost:5173/`.

## Backend de autenticación

El backend Node.js/Express y su API están en `backend/`. Para usarlos:

1. Instala MySQL o inicia MySQL desde XAMPP.
2. En `backend/`, copia `.env.example` a `.env` y configura tus credenciales locales de MySQL.
3. Ejecuta `npm install` y `npm run init-db` desde `backend/` para crear y poblar la base de datos. La inicialización conserva cualquier base de datos existente.
4. Inicia la API con `npm run dev` desde `backend/`; estará disponible en `http://localhost:3000`.
5. Inicia el frontend con `npm run dev` desde la raíz del frontend. Opcionalmente, copia `.env.example` a `.env` para configurar `VITE_API_URL`.

El formulario usa `POST /api/auth/register` y `POST /api/auth/login`. La búsqueda global usa `GET /api/busqueda?q=...` y agrupa personas, publicaciones y grupos. Las contraseñas se hashean en el backend con bcrypt; el navegador solo conserva los datos básicos de sesión. La recuperación de contraseña está pendiente de configurar un proveedor de correo.

## Permisos de cámara y micrófono

La función `Video en vivo` solicita permisos del navegador para usar cámara y micrófono. En un entorno local de Vite (`localhost`) los navegadores modernos permiten solicitar estos permisos.

## Nota sobre multimedia

Los datos de las publicaciones se conservan en `localStorage`, mientras que los archivos de foto/video se guardan en IndexedDB del navegador. Esto evita intentar guardar videos directamente en `localStorage`, que tiene un límite de almacenamiento mucho menor.

## Nota sobre autenticación

El inicio de sesión y el registro se validan con la API y MySQL; el frontend conserva únicamente una sesión básica en el navegador. La recuperación de contraseña aún no está disponible porque el backend no tiene configurado un proveedor de correo. No restablezcas contraseñas usando solo el correo sin verificar la identidad.
