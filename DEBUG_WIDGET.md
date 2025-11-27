# 🐛 Guía de Debugging - Widget de Recomendación

## ❌ Problema Reportado

1. **Widget no aparece** - Después de ingresar precio 1200
2. **Precio cambia solo** - De 1200 → 900 sin intervención del usuario

---

## ✅ Mejoras Aplicadas

### 1. Debounce Agregado (800ms)

El widget ahora espera 800ms antes de hacer la petición, evitando múltiples llamadas mientras el usuario escribe.

### 2. Logs de Debugging Completos

Agregué logs en cada paso para rastrear qué está pasando:

```javascript
🔍 = Inicio de búsqueda
📡 = Llamada al API
✅ = Respuesta exitosa
❌ = Error
🎯 = Click en botón "Aceptar"
💰 = Callback onAccept ejecutado
⏸️ = Widget no se ejecuta (faltan datos)
```

---

## 🧪 Pasos para Debugging

### 1. Abrir DevTools del Navegador

1. Presiona **F12** (o **Cmd+Option+I** en Mac)
2. Ve a la pestaña **Console**
3. Limpia la consola (botón 🚫)

### 2. Llenar el Formulario

```
Título: Papa Criolla
Descripción: (cualquier cosa)
Tipo de Producto: Verduras
Cantidad: 100
Precio: 1200 ← Después de escribir esto, espera 1 segundo
```

### 3. Revisar la Consola

Deberías ver esta secuencia de logs:

#### ✅ Caso Exitoso:

```
🔍 PriceRecommendationWidget - Fetching recommendation:
  { productName: "Papa Criolla", pricePerKg: 1200, category: undefined }

📡 PriceRecommendationWidget - Calling API with:
  { product_name: "Papa Criolla", price_per_kg: 1200, ... }

✅ PriceRecommendationWidget - API Response:
  { success: true, recommendation_type: "MUY_POR_DEBAJO", market_avg_price: 4500, ... }
```

Luego el widget debería aparecer mostrando:
```
⚠️ MUY POR DEBAJO DEL MERCADO (-73.3%)
Tu precio: $1,200/kg
Mercado: $4,500/kg
[Ajustar a $4,500]
```

#### ❌ Caso de Error:

Si ves:
```
❌ PriceRecommendationWidget - Error: Request failed with status code 404
```

**Causa:** Backend no está respondiendo o ruta incorrecta.

**Solución:** Verificar que el backend esté corriendo en puerto 80 (nginx).

---

## 🔍 Diagnóstico del Precio que Cambia Solo

Si el precio cambia de 1200 → 900 **sin que hagas click en nada**, busca en la consola:

```
🎯 PriceRecommendationWidget - User clicked ACCEPT button
💰 PriceRecommendationWidget - Calling onAccept with: 900
```

### Si VES estos logs:

**Causa:** El botón "Ajustar" se está ejecutando automáticamente (bug).

**Solución temporal:** Comenta el `onAccept` en `PublishPostModal.tsx`:

```typescript
<PriceRecommendationWidget
  productName={formData.title || ...}
  pricePerKg={Number(formData.price_per_kg)}
  // onAccept={(recommendedPrice) => {  // ← Comentar temporalmente
  //   setFormData((prev) => ({
  //     ...prev,
  //     price_per_kg: recommendedPrice.toString(),
  //   }));
  // }}
  className="mt-4"
/>
```

### Si NO VES esos logs:

**Causa:** Algo más está modificando el precio (otro componente, validación, etc.).

**Solución:** Buscar en la consola por otros logs relacionados con "price" o "precio".

---

## 🧪 Test Manual Paso a Paso

### Test 1: Verificar que el Widget se Renderiza

1. **Abre el modal** "Publicar Producto"
2. **Inspecciona el elemento** (Click derecho → Inspeccionar)
3. **Busca en el HTML** por `PriceRecommendationWidget` o textos como "Análisis de Precio"

**Si NO aparece en el HTML:**
- El componente no se está renderizando
- Verificar la condición: `{formData.price_per_kg && Number(formData.price_per_kg) > 0 && (...`

**Si SÍ aparece en el HTML pero no se ve:**
- Problema de CSS (display: none, opacity: 0, etc.)
- Verificar clases de Tailwind

### Test 2: Verificar Petición HTTP

1. **DevTools → Network tab**
2. **Filtrar por:** `check-price`
3. **Llenar formulario** y ver si aparece la petición

**Si aparece la petición:**
- Click en ella
- Ver **Request Headers** → debe tener `Authorization: Bearer ...`
- Ver **Request Payload** → debe tener `product_name`, `price_per_kg`
- Ver **Response** → debe retornar JSON con recomendación

**Si NO aparece la petición:**
- El `useEffect` no se está ejecutando
- Verificar que `productName` y `pricePerKg` tienen valores
- Revisar logs de consola `⏸️`

---

## 🔧 Soluciones Rápidas

### Problema: Widget no aparece después de 2 segundos

**Solución 1:** Aumentar timeout del debounce

```typescript
// En PriceRecommendationWidget.tsx, línea ~54
const timer = setTimeout(() => {
  fetchRecommendation();
}, 1500); // ← Cambiar de 800 a 1500
```

**Solución 2:** Deshabilitar debounce temporalmente

```typescript
// Comentar el setTimeout:
// const timer = setTimeout(() => {
  fetchRecommendation();
// }, 800);
```

### Problema: Error 401 Unauthorized

**Causa:** Token no válido o expirado.

**Solución:**
1. Hacer logout
2. Volver a hacer login
3. Intentar nuevamente

### Problema: Error 404 Not Found

**Causa:** Ruta `/api/recommendations/check-price` no existe.

**Solución:**
1. Verificar que el proxy de Vite está correcto:
   ```bash
   cat frontend/vite.config.ts | grep target
   # Debe mostrar: target: "http://localhost:80"
   ```

2. Verificar que nginx está corriendo:
   ```bash
   docker ps | grep nginx
   # Debe mostrar: nginx_server ... Up ... 0.0.0.0:80->80/tcp
   ```

3. Probar la ruta directamente:
   ```bash
   curl http://localhost/api/ping
   # Debe responder: {"message":"API ON"}
   ```

---

## 📊 Datos para el Reporte

Después de hacer las pruebas, copia estos datos:

### 1. Logs de Consola (DevTools → Console)

```
[Pegar aquí todos los logs que aparecen]
```

### 2. Network Request (DevTools → Network → check-price)

**Request URL:**
```
[Pegar URL]
```

**Status Code:**
```
[Pegar código: 200, 404, 401, etc.]
```

**Response:**
```json
[Pegar respuesta JSON completa]
```

### 3. Estado del Componente

**¿El widget aparece en el HTML?** Sí / No

**¿El widget es visible?** Sí / No

**¿El precio cambia solo?** Sí / No

**¿Cuándo cambia?** (Al escribir, al hacer blur, al cargar el modal, etc.)

---

## 🎯 Próximos Pasos

1. **Reiniciar el frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Refrescar navegador:** Ctrl+F5

3. **Abrir DevTools:** F12 → Console tab

4. **Probar el formulario** con:
   - Título: "Papa Criolla"
   - Precio: 1200

5. **Capturar todos los logs** y compartirlos

---

**Fecha:** 2025-11-27
**Archivos modificados:** PriceRecommendationWidget.tsx
**Cambios:** Agregados logs de debugging + debounce de 800ms
