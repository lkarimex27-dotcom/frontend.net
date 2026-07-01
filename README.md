# LaTienda — Frontend (React + Vite + MUI + Axios)

Panel de administración para **LaTiendaAPI** (.NET Web API con Entity Framework Core, JWT y arquitectura por capas). Cubre las entidades del `LatiendaContext`: Productos, Categorías, Usuarios y Roles, además del login/registro contra el `AuthController`.

## 1. Instalación

```bash
npm install
```

Dependencias clave que se instalan:

| Paquete | Uso |
|---|---|
| `react`, `react-dom` | Librería base |
| `react-router-dom` | Enrutamiento (login, register, rutas privadas) |
| `axios` | Cliente HTTP hacia la API .NET |
| `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` | UI (Material UI) |
| `jwt-decode` | Leer el payload del JWT (expiración, claims) en el front |
| `vite`, `@vitejs/plugin-react` | Bundler/dev server |

## 2. Configurar la URL de la API

El backend (`LaTiendaAPI`) está publicado en somee.com:

```
http://proyectapi.somee.com/swagger/index.html   ← documentación interactiva (Swagger)
http://proyectapi.somee.com/api                   ← base de la API
```

Copia el archivo de ejemplo (ya viene apuntando a esa URL):

```bash
cp .env.example .env
```

```
VITE_API_URL=http://proyectapi.somee.com/api
```

> ⚠️ **Importante — HTTP, no HTTPS:** el plan gratuito de somee.com sirve este backend por `http://`. Si en algún momento despliegas este frontend en un dominio `https://` (Vercel, Netlify, GitHub Pages, etc.), el navegador bloqueará las peticiones por "contenido mixto" (mixed content). Para producción necesitarás: (a) que el backend tenga certificado SSL en somee, o (b) servir también el frontend por `http://`, o (c) poner un proxy/reverse-proxy con HTTPS delante del backend. En desarrollo local (`http://localhost:5173`) no hay problema.
>
> ⚠️ **Cold start:** el hosting gratuito "duerme" la app cuando no recibe tráfico. La primera petición después de un rato de inactividad puede tardar varios segundos — esto es normal, no es un bug del frontend. Ya configuré un `timeout` de 20s en axios para darle margen.
>
> ⚠️ **CORS:** si al probar ves errores de CORS en la consola del navegador, el backend necesita habilitar tu origen (`http://localhost:5173` en desarrollo) en su configuración de `Program.cs` (`builder.Services.AddCors(...)` + `app.UseCors(...)`). Esto se configura del lado del backend, no del frontend.

Si los nombres de tus rutas en Swagger difieren de las que uso aquí (por ejemplo `/api/Productos` vs `/api/productos` vs `/api/Producto`), revisa `http://proyectapi.somee.com/swagger/index.html` y ajusta las rutas en `src/api/*.js` para que calcen exactamente.

## 3. Ejecutar en desarrollo

```bash
npm run dev
```

Se sirve en `http://localhost:5173`.

## 4. Build de producción

```bash
npm run build
npm run preview
```

## Estructura de carpetas

```
la-tienda-frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── src/
│   ├── api/                     # Llamadas HTTP (axios) por entidad
│   │   ├── axiosConfig.js       # Instancia de axios + interceptor JWT
│   │   ├── apiError.js          # Normaliza errores (string plano vs {msj})
│   │   ├── authService.js       # login / Registrar (AuthController)
│   │   ├── productoService.js   # CRUD Productos
│   │   ├── categoriaService.js  # CRUD Categorias
│   │   ├── usuarioService.js    # listar/editar/eliminar Usuarios
│   │   └── roleService.js       # CRUD Roles
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Layout.jsx       # AppBar + Drawer de navegación
│   │   ├── Common/
│   │   │   ├── PrivateRoute.jsx # Protege rutas según sesión
│   │   │   └── ConfirmDialog.jsx
│   │   ├── Productos/
│   │   │   └── ProductoForm.jsx
│   │   ├── Categorias/
│   │   │   └── CategoriaForm.jsx
│   │   └── Roles/
│   │       └── RoleForm.jsx
│   ├── context/
│   │   └── AuthContext.jsx      # Sesión global (token, usuario, login/logout)
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProductosPage.jsx
│   │   ├── CategoriasPage.jsx
│   │   ├── UsuariosPage.jsx
│   │   └── RolesPage.jsx
│   ├── theme/
│   │   └── theme.js             # Tema MUI personalizado (paleta/tipografía)
│   ├── App.jsx                  # Rutas de la app
│   ├── main.jsx                 # Punto de entrada
│   └── index.css
```

## Cómo se conecta con tu API real

Tu backend **no usa rutas REST estándar** — cada controlador expone acciones con nombre propio, y las respuestas vienen envueltas en `{ msj: "ok", response: ... }`. Esto es lo que confirmé a partir de tu código:

| Entidad | Método | Ruta real | Notas |
|---|---|---|---|
| Producto | GET | `/api/Producto/Lista` | — |
| Producto | GET | `/api/Producto/Obtener/{idProducto}` | — |
| Producto | POST | `/api/Producto/Guardar` | body: `ProductoCreateDto` |
| Producto | PUT | `/api/Producto/Editar/{idProducto}` | solo responde `{msj:"ok"}` |
| Producto | DELETE | `/api/Producto/Eliminar/{idProducto}` | — |
| Categoria | GET | `/api/Categoria/Lista` | sin endpoint "Obtener" individual |
| Categoria | POST | `/api/Categoria/Guardar` | body: `{ nombre, estado }` |
| Categoria | PUT | `/api/Categoria/Editar/{idCategoria}` | body: `{ nombre, estado }` |
| Categoria | DELETE | `/api/Categoria/Eliminar/{idCategoria}` | — |
| Auth | POST | `/api/Auth/login` | body `{ email, password }` → `{ token, nombre, roles }` |
| Auth | POST | `/api/Auth/Registrar` | **con R mayúscula**. body `{ tipoDoc, nroDoc, nombre, email, password, roles: number[] }` — `roles` es obligatorio |

### ⚠️ Sin confirmar — `Role` y `Usuario`

No compartiste el código de `RoleController` ni de un `UsuarioController`, así que `src/api/roleService.js` y `src/api/usuarioService.js` **asumen** el mismo patrón (`/api/Role/Lista`, `/api/Role/Guardar`, etc. y `/api/Usuario/Lista`, `/api/Usuario/Editar/{id}`, `/api/Usuario/Eliminar/{id}`). Hay dos pantallas que dependen de esto:

- **RegisterPage** necesita `GET /api/Role/Lista` para mostrar las casillas de roles (el registro exige al menos un rol)
- **RolesPage** y **UsuariosPage** dependen de esas rutas para listar/crear/editar/eliminar

Si esas rutas no existen tal cual en tu backend, esas pantallas mostrarán un mensaje de error al cargar (no se rompen, pero no van a funcionar). Pásame el código de esos controladores cuando los tengas y ajusto las rutas exactas.

### Manejo de errores

El `AuthController` no siempre devuelve `{msj: "..."}`: en el login, `Unauthorized("Usuario no encontrado")` devuelve un **string plano**. Agregué `src/api/apiError.js` con un helper `extractErrorMessage()` que reconoce ambos formatos (string plano y `{msj}`) y lo uso en `LoginPage` y `RegisterPage`.

## Notas

- El JWT se guarda en `localStorage` y se adjunta automáticamente a cada request vía interceptor de Axios.
- Si la API responde `401`, la sesión se limpia y el usuario es redirigido a `/login`.
- Todas las pantallas CRUD (Productos, Categorías, Roles) usan diálogos modales para crear/editar y un diálogo de confirmación antes de eliminar.
- Usuarios solo permite editar/eliminar desde el panel, ya que su creación pasa por el flujo de registro con contraseña.
