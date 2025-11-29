# Módulo de Autenticación

Este módulo contiene todas las funcionalidades relacionadas con la autenticación de usuarios.

## Estructura

```
src/auth/
├── components/          # Componentes reutilizables
│   ├── AuthInput.jsx   # Input personalizado para formularios
│   └── AuthButton.jsx  # Botón personalizado para formularios
├── screens/            # Pantallas de autenticación
│   ├── LoginScreen.jsx # Pantalla de inicio de sesión
│   └── RegisterScreen.jsx # Pantalla de registro
├── services/           # Servicios de API
│   └── authService.js  # Servicio de autenticación
└── index.js           # Exportaciones del módulo
```

## Configuración

### Axios

La configuración de axios se encuentra en `src/config/axios.js` y incluye:

- Base URL: `http://10.0.2.2:9090/api/`
- Interceptor para agregar automáticamente el token Bearer
- Interceptor para manejar errores 401 (token expirado)
- Timeout de 10 segundos

### Almacenamiento Seguro

Se utiliza un servicio de almacenamiento que adapta automáticamente según la plataforma:

- **Móvil**: `expo-secure-store` para máxima seguridad
- **Web**: `@react-native-async-storage/async-storage` para compatibilidad

Almacena de forma segura:

- Token de acceso (`access_token`)
- Token de renovación (`refresh_token`)
- Datos del usuario (`user_data`)

## Uso

### Importar componentes y servicios

```javascript
import {
  LoginScreen,
  RegisterScreen,
  AuthInput,
  AuthButton,
  authService,
} from '../auth';
```

### Usar el servicio de autenticación

```javascript
// Login
const result = await authService.login(email, password);

// Registro
const userData = { firstName, lastName, email, password };
const result = await authService.register(userData);

// Logout
await authService.logout();

// Verificar autenticación
const isAuth = await authService.isAuthenticated();

// Obtener datos del usuario
const user = await authService.getUserData();
```

## Características

### Pantallas

- **LoginScreen**: Formulario de inicio de sesión con validación
- **RegisterScreen**: Formulario de registro con validación completa

### Componentes

- **AuthInput**: Input personalizado con validación de errores
- **AuthButton**: Botón con estados de carga y variantes

### Validaciones

- Email válido
- Contraseña mínima de 6 caracteres
- Confirmación de contraseña
- Campos requeridos

### Manejo de errores

- Validación en tiempo real
- Mensajes de error personalizados
- Manejo de errores de red
- Limpieza automática de tokens expirados

## Endpoints del Backend

El servicio espera los siguientes endpoints:

### POST /auth/login

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

### POST /auth/register

```json
{
  "nombre": "Nombre Completo",
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

### Respuesta de registro

```json
{
  "id": "string",
  "nombre": "Nombre Completo",
  "email": "usuario@ejemplo.com",
  "password": "string",
  "foto": "string"
}
```

### Respuesta de login

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "user_Id": "string",
  "username": "string",
  "email": "usuario@ejemplo.com"
}
```
