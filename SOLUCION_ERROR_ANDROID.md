# Solución al Error de Build Android

## Problema
El error `ninja: error: manifest 'build.ninja' still dirty after 100 tries` ocurre cuando CMake/ninja tiene referencias a rutas antiguas del proyecto en su caché, incluso después de mover el proyecto a una nueva ubicación.

**Error típico:**
```
ninja: error: manifest 'build.ninja' still dirty after 100 tries
```

**Causa:** Los directorios `.cxx` en `node_modules` y `android` contienen caché de CMake con rutas absolutas a la ubicación anterior del proyecto.

## Solución: Limpiar Caché de CMake (RECOMENDADO)

Si has movido el proyecto a una nueva ubicación o sigues teniendo errores, sigue estos pasos:

### Paso 1: Eliminar todos los directorios .cxx

En PowerShell (Windows):
```powershell
Get-ChildItem -Path . -Recurse -Directory -Filter ".cxx" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
```

O manualmente elimina:
- `android\.cxx`
- `android\app\.cxx`
- `node_modules\**\.cxx` (todos los directorios .cxx dentro de node_modules)

### Paso 2: Limpiar builds de Android

```powershell
# Eliminar directorios de build
if (Test-Path "android\build") { Remove-Item -Path "android\build" -Recurse -Force }
if (Test-Path "android\app\build") { Remove-Item -Path "android\app\build" -Recurse -Force }
```

### Paso 3: Ejecutar Gradle Clean

```bash
cd android
.\gradlew.bat clean
cd ..
```

### Paso 4: Reintentar el build

```bash
npx expo run:android
```

## Solución Alternativa: Usar Expo Go

Si el problema persiste, puedes usar Expo Go para desarrollo:

```bash
npm start
```

Luego escanea el QR con la app Expo Go en tu dispositivo Android.

## Nota Importante

- **Siempre limpia el caché de CMake** después de mover un proyecto a una nueva ubicación
- El problema ocurre porque CMake almacena rutas absolutas en su caché
- La ruta actual del proyecto (`C:\Users\Public\Documents\CursorFRONT\FITGYMReactNativeFE`) no tiene espacios ni caracteres especiales, pero el caché antiguo puede seguir referenciando la ruta anterior

