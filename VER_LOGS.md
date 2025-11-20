# Cómo Ver Logs de Consola en Development Build

## Método 1: Terminal de Metro Bundler (Recomendado)

Cuando ejecutas `npm start` o `npx expo run:android`, los logs aparecen automáticamente en la terminal:

```bash
npm start
# o
npx expo run:android
```

Los `console.log()` y `console.error()` aparecerán directamente en la terminal.

## Método 2: Dev Menu de Expo

1. **Abre el Dev Menu:**
   - **Android físico:** Agita el dispositivo
   - **Android emulador:** Presiona `Ctrl+M` o `Cmd+M`
   - **iOS simulador:** Presiona `Cmd+D`

2. **Opciones disponibles:**
   - **"Show Performance Monitor"** - Muestra métricas de rendimiento
   - **"Debug Remote JS"** - Abre Chrome DevTools (los logs aparecen en la consola del navegador)

## Método 3: Android Logcat (Para logs nativos y JS)

Ver todos los logs del dispositivo Android:

```bash
# Ver todos los logs
adb logcat

# Filtrar solo logs de React Native/Expo
adb logcat | grep -i "ReactNative\|Expo\|console"

# Filtrar por tag específico
adb logcat ReactNativeJS:V ReactNative:V *:S

# Limpiar logs anteriores y ver solo nuevos
adb logcat -c && adb logcat
```

## Método 4: React Native Debugger

1. Instala React Native Debugger:
   ```bash
   npm install -g react-native-debugger
   ```

2. Abre React Native Debugger

3. En el Dev Menu de tu app, selecciona "Debug Remote JS"

4. Los logs aparecerán en React Native Debugger

## Método 5: Flipper (Avanzado)

Flipper es una herramienta de debugging de Facebook que permite ver logs, network requests, y más.

1. Instala Flipper: https://fbflipper.com/
2. Conecta tu dispositivo
3. Abre Flipper y selecciona tu app

## Método 6: Chrome DevTools (Cuando usas "Debug Remote JS")

1. Abre el Dev Menu en tu app
2. Selecciona "Debug Remote JS"
3. Se abrirá Chrome con DevTools
4. Ve a la pestaña "Console" para ver los logs

## Consejos Útiles

### Filtrar logs en la terminal:
```bash
# En PowerShell (Windows)
npm start | Select-String "reservas_confirmadas"

# En Bash/Linux/Mac
npm start | grep "reservas_confirmadas"
```

### Ver logs en tiempo real con colores:
```bash
# Android logcat con colores
adb logcat -v color
```

### Limpiar logs antes de ejecutar:
```bash
# Limpiar y ver solo nuevos logs
adb logcat -c
npm start
```

## Ejemplo de Código para Debugging

```javascript
// Usa diferentes niveles de log según la importancia
console.log("Info general:", data);
console.warn("Advertencia:", warning);
console.error("Error:", error);

// Para objetos complejos, usa JSON.stringify
console.log("Objeto completo:", JSON.stringify(data, null, 2));

// Para ver el stack trace
console.trace("Stack trace aquí");
```

## Solución de Problemas

**Si no ves logs en la terminal:**
- Asegúrate de que Metro Bundler esté corriendo
- Verifica que la app esté conectada al servidor de desarrollo
- Revisa que no haya errores de conexión

**Si los logs no aparecen:**
- Reinicia Metro Bundler: `npm start -- --reset-cache`
- Reinicia la app en el dispositivo
- Verifica que estés usando `console.log()` y no solo `console` sin métodos

