# 🔧 Solución Error 404 - "No pudimos analizar el precio"

## ❌ Problema

El widget de recomendación de precios muestra el siguiente error:

```
⚠️ No pudimos analizar el precio
Request failed with status code 404
```

## 🔍 Causa Raíz

El proxy de Vite estaba configurado para redirigir las peticiones `/api` al puerto **80**, pero Laravel corre en el puerto **8000** por defecto.

**Archivo afectado:** `frontend/vite.config.ts`

**Configuración incorrecta:**
```typescript
proxy: {
  "/api": {
    target: "http://localhost:80",  // ❌ INCORRECTO
    // ...
  }
}
```

**Flujo del error:**
1. Widget hace petición a `/api/recommendations/check-price`
2. Vite proxy redirige a `http://localhost:80/api/recommendations/check-price`
3. Nada corre en puerto 80 → **404 Not Found**

---

## ✅ Solución Aplicada

He actualizado el archivo `frontend/vite.config.ts` para apuntar al puerto correcto:

```typescript
proxy: {
  "/api": {
    target: "http://localhost:8000",  // ✅ CORRECTO
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path,
  },
  "/storage": {
    target: "http://localhost:8000",  // ✅ CORRECTO
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path,
  },
}
```

---

## 🚀 Pasos para Aplicar la Solución

### 1. Verificar que el backend está corriendo en puerto 8000

```bash
cd backend
php artisan serve
```

**Salida esperada:**
```
Starting Laravel development server: http://127.0.0.1:8000
```

### 2. Reiniciar el servidor de desarrollo frontend

⚠️ **IMPORTANTE:** Debes reiniciar Vite para que tome los cambios en `vite.config.ts`

```bash
# Detener el servidor (Ctrl+C)

# Volver a iniciarlo
cd frontend
npm run dev
```

### 3. Probar nuevamente

1. Abrir navegador: `http://localhost:5173`
2. Click en "Publicar Producto"
3. Seleccionar producto: "Verduras"
4. Ingresar precio: **700**
5. **Ahora debería funcionar correctamente** ✅

---

## 🧪 Verificación

### Opción 1: Probar en el navegador

Abrir DevTools (F12) → Network Tab → Ver peticiones a `/api/recommendations/check-price`

**Antes (ERROR 404):**
```
Request URL: http://localhost:5173/api/recommendations/check-price
Proxy target: http://localhost:80/api/recommendations/check-price
Status: 404 Not Found
```

**Después (ÉXITO 200):**
```
Request URL: http://localhost:5173/api/recommendations/check-price
Proxy target: http://localhost:8000/api/recommendations/check-price
Status: 200 OK
```

### Opción 2: Probar con curl

```bash
# Verificar que el backend responde
curl -X POST http://localhost:8000/api/recommendations/check-price \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "product_name": "papa criolla",
    "price_per_kg": 7000
  }'
```

**Respuesta esperada (200 OK):**
```json
{
  "success": true,
  "has_data": true,
  "recommendation_type": "MUY_POR_ENCIMA",
  "market_avg_price": 4520,
  "user_price": 7000,
  "difference_percentage": 54.9,
  "suggestion_text": "🔴 Tu precio está MUY por encima del mercado...",
  ...
}
```

---

## 🎯 Resultado Esperado

Después de aplicar esta solución:

1. ✅ El widget carga correctamente
2. ✅ Muestra la recomendación de precio según el mercado
3. ✅ Los 5 niveles de comparación funcionan:
   - 🔴 MUY_POR_ENCIMA
   - ⬆️ POR_ENCIMA
   - ✅ EN_RANGO
   - ⬇️ POR_DEBAJO
   - ⚠️ MUY_POR_DEBAJO
4. ✅ El botón "Ajustar a $X" actualiza el precio automáticamente

---

## 🔄 Configuraciones Alternativas

### Si usas Docker Compose

Si tu backend corre en Docker, el puerto puede ser diferente. Verifica tu `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "80:80"  # Puerto host:contenedor
```

En este caso, actualiza `vite.config.ts`:
```typescript
target: "http://localhost:80",  // Si backend está en Docker puerto 80
```

### Si usas otro puerto personalizado

```bash
# Backend en puerto 9000
php artisan serve --port=9000
```

Actualizar `vite.config.ts`:
```typescript
target: "http://localhost:9000",
```

---

## 🐛 Otros Problemas Comunes

### Error: "No hay suficientes datos de mercado"

**Causa:** Datos MOCK no insertados en la base de datos.

**Solución:**
```bash
bash setup_rapido.sh
# O manualmente:
mysql -u root -p mai < database/migrations/2025_11_26_seed_MOCK_market_prices.sql
```

---

### Error: "Unauthorized" (401)

**Causa:** Usuario no está autenticado.

**Solución:** Asegúrate de estar logueado. El interceptor de Axios debe agregar el token automáticamente desde `localStorage`.

**Verificar token:**
```javascript
// En consola del navegador (F12)
localStorage.getItem('auth_token')
```

Si no hay token, hacer login nuevamente.

---

### Widget no aparece

**Causas posibles:**
1. Campo de precio está vacío o es 0
2. Producto no está seleccionado
3. Componente no está importado correctamente

**Solución:** Verificar que:
```typescript
// En PublishPostModal.tsx
{formData.price_per_kg && Number(formData.price_per_kg) > 0 && (
  <PriceRecommendationWidget ... />
)}
```

---

## 📋 Checklist de Verificación

Después de aplicar la solución:

- [x] `vite.config.ts` actualizado a puerto 8000
- [ ] Backend corriendo en `http://localhost:8000`
- [ ] Frontend reiniciado (`npm run dev`)
- [ ] Navegador refrescado (Ctrl+F5)
- [ ] Datos MOCK en base de datos
- [ ] Usuario logueado
- [ ] Widget aparece al ingresar precio
- [ ] Recomendación se muestra correctamente
- [ ] Botón "Ajustar" funciona

---

## 🎉 Resultado

Una vez aplicada la solución, el sistema debería funcionar así:

1. **Usuario abre modal** "Publicar Producto"
2. **Selecciona producto:** "Verduras" (cualquier tipo)
3. **Ingresa precio:** $700/kg
4. **Widget analiza automáticamente:**
   - Busca producto en catálogo
   - Compara con precios MOCK del mercado
   - Calcula diferencia porcentual
   - Clasifica en 1 de 5 niveles
5. **Muestra recomendación:**
   ```
   ✅ Análisis de Precio de Mercado
   Tu precio: $700/kg | Mercado: $XXX/kg
   [% de diferencia vs. mercado]
   [Mensaje personalizado según nivel]
   ```
6. **Usuario decide:**
   - Ajustar al precio recomendado → 1 click
   - Mantener su precio → continuar

---

## 📞 Soporte Adicional

Si el problema persiste después de aplicar esta solución:

1. **Verificar logs del backend:**
   ```bash
   tail -f backend/storage/logs/laravel.log
   ```

2. **Verificar consola del navegador:**
   - F12 → Console tab
   - Buscar errores de JavaScript o red

3. **Verificar que las rutas existen:**
   ```bash
   cd backend
   php artisan route:list | grep recommendations
   ```

   Debería mostrar:
   ```
   POST   api/recommendations/check-price
   GET    api/recommendations/suggested-price
   GET    api/recommendations/my-recommendations
   GET    api/recommendations/stats
   ```

---

**Fecha:** 2025-11-27
**Archivo modificado:** `frontend/vite.config.ts`
**Estado:** ✅ SOLUCIONADO
**Versión:** 1.0.0
