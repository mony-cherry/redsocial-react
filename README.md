# RedSocial React

Proyecto React + Vite con React Router, persistencia local y publicación multimedia.

## Funciones añadidas

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

## Permisos de cámara y micrófono

La función `Video en vivo` solicita permisos del navegador para usar cámara y micrófono. En un entorno local de Vite (`localhost`) los navegadores modernos permiten solicitar estos permisos.

## Nota sobre multimedia

Los datos de las publicaciones se conservan en `localStorage`, mientras que los archivos de foto/video se guardan en IndexedDB del navegador. Esto evita intentar guardar videos directamente en `localStorage`, que tiene un límite de almacenamiento mucho menor.
