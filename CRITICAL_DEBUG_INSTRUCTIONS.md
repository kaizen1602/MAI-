# 🚨 INSTRUCCIONES CRÍTICAS DE DEBUGGING

**Fecha:** 2025-11-27 06:08
**Estado:** Widget no aparece - Necesitamos logs de consola

---

## ✅ Cambios Aplicados

### 1. Dev Server Reiniciado

El servidor de desarrollo está corriendo en:
- **URL:** http://localhost:5173
- **Estado:** ✅ ACTIVO

### 2. Logs de Debugging Agregados

Se agregaron logs **MUY VISIBLES** en dos puntos:

#### A) PublishPostModal.tsx
Cada vez que cambies el precio, verás:
```
📊 PublishPostModal - Widget render check: {
  shouldRenderWidget: true/false,
  price_per_kg: "2500",
  priceNumber: 2500,
  productName: "papa criolla",
  title: "papa criolla",
  product_id: 1
}
```

#### B) PriceRecommendationWidget.tsx
Si el componente se carga, verás:
```
🚀 PriceRecommendationWidget - COMPONENT LOADED { productName: "papa criolla", pricePerKg: 2500 }
```

---

## 🎯 PASOS EXACTOS A SEGUIR

### 1. Abrir el Navegador

**IMPORTANTE:** Debes usar **http://localhost:5173** (NO :3000, NO :80)

```
http://localhost:5173
```

### 2. Abrir DevTools

- Presiona **F12** (Windows) o **Cmd+Option+I** (Mac)
- Ve a la pestaña **Console**
- **LIMPIA LA CONSOLA** haciendo click en el icono 🚫 o presionando **Cmd+K**

### 3. Probar el Formulario

1. Login en la app
2. Click en **"Publicar Producto"**
3. Llena el formulario:
   ```
   Título: papa criolla
   Descripción: deliciosa
   Producto: Verduras (o cualquiera)
   Cantidad: 100
   Precio: 2500  ← Escribe esto y ESPERA
   ```

### 4. Observar la Consola

Deberías ver **INMEDIATAMENTE** después de escribir el precio:

```
📊 PublishPostModal - Widget render check: { ... }
```

Y luego (después de 1 segundo):

```
🚀 PriceRecommendationWidget - COMPONENT LOADED { ... }
🔍 PriceRecommendationWidget - Fetching recommendation: { ... }
📡 PriceRecommendationWidget - Calling API with: { ... }
✅ PriceRecommendationWidget - API Response: { ... }
```

---

## 🔍 DIAGNÓSTICO POR ESCENARIOS

### Escenario A: VEO el log 📊 pero NO veo 🚀

**Significado:**
- El modal está intentando renderizar el widget
- Pero el componente PriceRecommendationWidget NO se está cargando

**Causa Probable:**
- Error de importación
- Error de TypeScript en PriceRecommendationWidget.tsx
- Error en el build

**Solución:**
Mira la consola del navegador por errores en rojo que NO sean de chrome-extension.

---

### Escenario B: NO veo NINGÚN log (ni 📊 ni 🚀)

**Significado:**
- El modal NO está intentando renderizar el widget
- La condición `formData.price_per_kg && Number(formData.price_per_kg) > 0` es `false`

**Causas Probables:**
1. El precio no se está guardando en el estado
2. El tipo de dato es string vacío
3. El formulario no está actualizando correctamente

**Solución:**
En la consola, escribe:
```javascript
// Esto te mostrará el estado del formulario
console.log(document.querySelector('input[name="price_per_kg"]').value)
```

---

### Escenario C: VEO 📊 y 🚀 pero NO veo 🔍

**Significado:**
- El widget se está cargando
- Pero el `useEffect` NO se está ejecutando

**Causas Probables:**
1. `productName` está vacío
2. `pricePerKg` es 0 o negativo
3. El componente se desmonta inmediatamente

**Solución:**
Mira los valores en el log 🚀:
```
🚀 PriceRecommendationWidget - COMPONENT LOADED {
  productName: "",  ← Si está vacío, ahí está el problema
  pricePerKg: 0     ← Si es 0, ahí está el problema
}
```

---

### Escenario D: VEO 🔍 pero NO veo 📡

**Significado:**
- El debounce está funcionando (esperando 800ms)
- Pero la función `fetchRecommendation` NO se ejecuta

**Causa Probable:**
- El componente se desmonta antes de que termine el timeout

**Solución:**
Reduce el debounce a 100ms temporalmente:
1. Abre `PriceRecommendationWidget.tsx`
2. Busca la línea:
   ```typescript
   const timer = setTimeout(() => {
     fetchRecommendation();
   }, 800);
   ```
3. Cambia `800` a `100`

---

### Escenario E: VEO 📡 pero NO veo ✅

**Significado:**
- La petición se está haciendo
- Pero el backend NO está respondiendo o hay un error

**Solución:**
1. Abre la pestaña **Network** en DevTools
2. Busca la petición `check-price`
3. Mira el **Status Code**:
   - **404:** Backend no está corriendo o ruta incorrecta
   - **401:** Token no válido
   - **500:** Error en el servidor

---

## 📸 INFORMACIÓN QUE NECESITO

Por favor, captura y envía:

### 1. Screenshot de la Consola COMPLETA

Después de escribir el precio 2500, captura **TODA** la consola (incluidos errores).

### 2. Valores del Log 📊

Si ves el log 📊, copia y pega aquí:
```
[PEGAR LOG COMPLETO AQUÍ]
```

### 3. Network Tab

Si ves la petición `check-price`:
- Status Code: _____
- Response: _____

### 4. Errores en Rojo

Si hay errores en rojo (que NO sean de chrome-extension), copia:
```
[PEGAR ERRORES AQUÍ]
```

---

## 🛠️ VERIFICACIONES ADICIONALES

### Verificar que el archivo existe

```bash
ls -la /Users/kaizen1602/MAI-/frontend/src/components/PriceRecommendationWidget.tsx
```

Debe mostrar:
```
-rw-------@ 1 kaizen1602 staff 12XXX Nov 27 06:XX PriceRecommendationWidget.tsx
```

### Verificar que el servidor está corriendo

En la terminal donde ejecutaste `npm run dev`, debes ver:
```
VITE v7.1.7  ready in 219 ms

➜  Local:   http://localhost:5173/
```

Si NO ves esto, el servidor NO está corriendo.

### Verificar que estás en el puerto correcto

En el navegador, la URL debe ser:
```
http://localhost:5173
```

**NO:**
- ~~http://localhost:3000~~
- ~~http://localhost:80~~
- ~~http://localhost:8000~~

---

## 🚀 PRÓXIMO PASO

1. **Abre** http://localhost:5173
2. **Limpia** la consola (Cmd+K)
3. **Llena** el formulario con precio 2500
4. **Captura** todos los logs que aparezcan
5. **Envíame** el screenshot

Con esa información podré identificar exactamente dónde está fallando.

---

**Última modificación:** 2025-11-27 06:08
**Archivos modificados:**
- `PriceRecommendationWidget.tsx` - Agregado log 🚀
- `PublishPostModal.tsx` - Agregado log 📊
