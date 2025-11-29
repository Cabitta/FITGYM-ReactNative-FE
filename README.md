# FITGYM - React Native Frontend

Una aplicación móvil desarrollada con React Native y Expo para la gestión de gimnasios y fitness.

## 🚀 Tecnologías Utilizadas

- **React Native** - Framework para desarrollo de aplicaciones móviles
- **Expo** - Plataforma y herramientas para desarrollo React Native
- **JavaScript** - Lenguaje de programación principal

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) (aplicación móvil para testing)

## 🛠️ Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/Cabitta/FITGYM-ReactNative-FE.git
   cd FITGYM-ReactNative-FE
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm start
   ```

## 📱 Ejecución

### Desarrollo Web

```bash
npm run web
```

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

**Nota:** Para iOS necesitas macOS. Si no tienes Mac, puedes usar la aplicación Expo Go en tu dispositivo iOS.

## 📂 Estructura del Proyecto

```
FITGYM-ReactNative-FE/
├── App.js                 # Componente principal de la aplicación
├── app.json              # Configuración de Expo
├── package.json          # Dependencias y scripts del proyecto
├── .gitignore           # Archivos a ignorar en Git
├── assets/              # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── images/
│   ├── fonts/
│   └── icon.png
└── node_modules/        # Dependencias instaladas
```

## 🎯 Características Principales

- [ ] Autenticación de usuarios
- [ ] Gestión de perfiles
- [ ] Planes de entrenamiento
- [ ] Seguimiento de progreso
- [ ] Reserva de clases
- [ ] Sistema de notificaciones

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo de Expo
- `npm run android` - Ejecuta la aplicación en Android
- `npm run ios` - Ejecuta la aplicación en iOS
- `npm run web` - Ejecuta la aplicación en el navegador web

## 📱 Testing en Dispositivos

### Usando Expo Go

1. Instala [Expo Go](https://expo.dev/client) en tu dispositivo móvil
2. Ejecuta `npm start`
3. Escanea el código QR con la aplicación Expo Go

### Usando un simulador/emulador

- **Android:** Configura Android Studio y ejecuta un emulador
- **iOS:** Usa Xcode Simulator (solo en macOS)

## 🚀 Despliegue

### Build para producción

```bash
# Para Android
expo build:android

# Para iOS
expo build:ios
```

### Publicación en Expo

```bash
expo publish
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para preguntas o sugerencias, por favor contacta al equipo de desarrollo.

---

## notas joni :

arrancar la aplicación con
npx expo run:android

página para generar qr tipo txt .
(generar solo el id de clase como string, no como json)
https://qr.io/

ver REac native dev tools:
agitar el dispositivo

verificar dispositivos conectados
comando
adb devices

borrar el caché de toda al app
1-npx expo prebuild --clean
2- desinstalar la app desde el dispositivo
para volver a instalar:
3-npx expo run:android

**Desarrollado con ❤️ usando React Native y Expo**
