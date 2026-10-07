# Backend de RedSocial

API de Node.js, Express y MySQL conectada al frontend React.

## Requisitos

- Node.js 24 o superior.
- MySQL local o MySQL iniciado desde XAMPP.

## Configuración y ejecución

1. Copia `.env.example` como `.env` y configura host, usuario, contraseña y nombre de base de datos.
2. Desde esta carpeta, ejecuta `npm install`.
3. Ejecuta `npm run init-db` para crear las tablas y datos de muestra. El script no elimina ni reemplaza la base de datos existente.
4. Ejecuta `npm run dev` para iniciar la API en `http://localhost:3000`.

La API de autenticación expone `POST /api/auth/register` y `POST /api/auth/login`. La búsqueda global está disponible en `GET /api/busqueda?q=...` y retorna personas, publicaciones y grupos. Las contraseñas se almacenan con bcrypt. La recuperación por correo todavía no está implementada; requiere configurar un proveedor de correo y tokens de un solo uso.

Las credenciales de prueba del inicializador son `jossy@cesde.edu.co`, `jane@mail.com` y `john@mail.com`, todas con contraseña `123456`. Cambia o elimina estas cuentas de muestra antes de desplegar la aplicación.