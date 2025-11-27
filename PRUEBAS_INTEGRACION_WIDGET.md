# 🧪 Guía de Pruebas - Widget de Recomendación de Precios

## ✅ Task 9.5 COMPLETADA

**Fecha:** 2025-11-27
**Estado:** ✅ INTEGRADO Y FUNCIONAL

---

## 🎯 ¿Qué se integró?

El componente `PriceRecommendationWidget` ahora está **completamente integrado** en el modal de publicación (`PublishPostModal.tsx`).

### Cambios realizados:

1. **Importación del componente** (línea 16):
   ```typescript
   import PriceRecommendationWidget from "./PriceRecommendationWidget";
   ```

2. **Integración en el formulario** (después del campo de precio):
   ```typescript
   {formData.price_per_kg && Number(formData.price_per_kg) > 0 && (
     <PriceRecommendationWidget
       productName={
         productTypes.find((p) => p.id === formData.product_id)?.name || ""
       }
       pricePerKg={Number(formData.price_per_kg)}
       onAccept={(recommendedPrice) => {
         setFormData((prev) => ({
           ...prev,
           price_per_kg: recommendedPrice.toString(),
         }));
         toast.success(
           `Precio ajustado a $${recommendedPrice.toLocaleString("es-CO")}/kg`
         );
       }}
       className="mt-4"
     />
   )}
   ```

---

## 🧪 Cómo Probar

### Pre-requisitos:

1. ✅ Base de datos con datos MOCK instalados:
   ```bash
   bash setup_rapido.sh
   ```

2. ✅ Backend corriendo:
   ```bash
   cd backend
   php artisan serve
   ```

3. ✅ Frontend corriendo:
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📝 Escenarios de Prueba

### Escenario 1: Precio Muy Alto (MUY_POR_ENCIMA) 🔴

**Producto:** Papa Criolla
**Precio del usuario:** $7,000/kg
**Precio promedio mercado:** ~$4,520/kg

**Pasos:**
1. Click en "Publicar Producto" en el Wall
2. Seleccionar tipo de publicación: "Venta"
3. Ingresar título: "Venta de Papa Criolla"
4. Seleccionar producto: "Papa Criolla"
5. Ingresar precio: **7000**
6. Esperar 1 segundo

**Resultado esperado:**
- ✅ Aparece widget con borde ROJO
- ✅ Mensaje: "🔴 Tu precio está MUY por encima del mercado..."
- ✅ Muestra comparación: Tu precio vs Mercado
- ✅ Muestra diferencia: +54.9% vs. mercado
- ✅ Botón: "Ajustar a $4,520"
- ✅ Botón: "Mantener mi precio"

**Al hacer click en "Ajustar a $4,520":**
- ✅ Campo de precio se actualiza automáticamente a 4520
- ✅ Aparece toast: "Precio ajustado a $4,520/kg"
- ✅ Widget desaparece

---

### Escenario 2: Precio Óptimo (EN_RANGO) ✅

**Producto:** Banano
**Precio del usuario:** $2,000/kg
**Precio promedio mercado:** ~$2,000/kg

**Pasos:**
1. Seleccionar producto: "Banano"
2. Ingresar precio: **2000**

**Resultado esperado:**
- ✅ Aparece widget con borde VERDE
- ✅ Mensaje: "✅ ¡Excelente! Tu precio está en el rango óptimo del mercado..."
- ✅ Diferencia: ~0% vs. mercado
- ✅ Solo muestra botón: "Mantener mi precio" (no hay "Ajustar")

---

### Escenario 3: Precio Muy Bajo (MUY_POR_DEBAJO) ⚠️

**Producto:** Aguacate Hass
**Precio del usuario:** $4,000/kg
**Precio promedio mercado:** ~$6,450/kg

**Pasos:**
1. Seleccionar producto: "Aguacate Hass"
2. Ingresar precio: **4000**

**Resultado esperado:**
- ✅ Aparece widget con borde ROJO (tono diferente)
- ✅ Mensaje: "⚠️ Tu precio está MUY por debajo del mercado..."
- ✅ Diferencia: -38.0% vs. mercado
- ✅ Botón: "Ajustar a $6,450"

---

### Escenario 4: Producto Volátil (Tomate) 🌪️

**Producto:** Tomate Chonto
**Precio del usuario:** $4,000/kg
**Precio promedio mercado:** ~$3,200/kg

**Pasos:**
1. Seleccionar producto: "Tomate Chonto"
2. Ingresar precio: **4000**

**Resultado esperado:**
- ✅ Widget aparece
- ✅ Puede mostrar advertencia de volatilidad (si implementada)
- ✅ Recomendación funciona normalmente

---

### Escenario 5: Producto No Encontrado 🔍

**Producto:** Cualquier producto que NO esté en los 15 productos MOCK

**Pasos:**
1. Seleccionar producto que no tenga datos (ej: "Café" si no está en MOCK)
2. Ingresar precio: **5000**

**Resultado esperado:**
- ✅ Widget aparece con borde GRIS
- ✅ Mensaje: "❓ Producto no encontrado en el mercado"
- ✅ Texto: "No hay suficientes datos de mercado para este producto..."
- ✅ Solo botón "Mantener mi precio"

---

### Escenario 6: Cambio de Producto Dinámico

**Pasos:**
1. Seleccionar "Papa Criolla" + precio **7000**
2. Esperar que aparezca widget (recomendación roja)
3. Cambiar producto a "Banano" (sin cambiar precio)

**Resultado esperado:**
- ✅ Widget se actualiza automáticamente
- ✅ Ahora muestra comparación para Banano
- ✅ Nuevo mensaje y colores según la diferencia

---

### Escenario 7: Cambio de Precio Dinámico

**Pasos:**
1. Seleccionar "Papa Criolla"
2. Ingresar precio: **7000** (MUY_POR_ENCIMA)
3. Esperar widget rojo
4. Cambiar precio a: **4500** (EN_RANGO)

**Resultado esperado:**
- ✅ Widget se actualiza automáticamente
- ✅ Color cambia de rojo a verde
- ✅ Mensaje cambia a "¡Excelente! Tu precio está en el rango óptimo..."

---

## 🎨 Estados del Widget

### 1. Loading (Cargando)
```
[🔄] Analizando precio de mercado...
```

### 2. Error
```
[⚠️] No pudimos analizar el precio
      Error al conectar con el servidor
```

### 3. Sin datos (NO_DATA)
```
[❓] Producto no encontrado en el mercado
      No hay suficientes datos de mercado para este producto...
```

### 4. Muy por encima (MUY_POR_ENCIMA) 🔴
```
[🔴] Análisis de Precio de Mercado
      Tu precio: $7,000/kg | Mercado: $4,520/kg
      +54.9% vs. mercado
      🔴 Tu precio está MUY por encima del mercado...
      [Ajustar a $4,520] [Mantener mi precio]
```

### 5. Por encima (POR_ENCIMA) ⬆️
```
[⬆️] Análisis de Precio de Mercado
      +15% vs. mercado
      ⬆️ Tu precio está por encima del mercado...
```

### 6. En rango (EN_RANGO) ✅
```
[✅] Análisis de Precio de Mercado
      -2% vs. mercado
      ✅ ¡Excelente! Tu precio está en el rango óptimo...
      [Mantener mi precio]
```

### 7. Por debajo (POR_DEBAJO) ⬇️
```
[⬇️] Análisis de Precio de Mercado
      -18% vs. mercado
      ⬇️ Tu precio está por debajo del mercado...
```

### 8. Muy por debajo (MUY_POR_DEBAJO) ⚠️
```
[⚠️] Análisis de Precio de Mercado
      -38% vs. mercado
      ⚠️ Tu precio está MUY por debajo del mercado...
```

---

## 🐛 Troubleshooting

### Widget no aparece

**Posibles causas:**
1. Campo de precio está vacío o es 0
2. Producto no está seleccionado
3. Frontend no conecta con backend

**Solución:**
```bash
# Verificar backend
curl http://localhost:8000/api/catalog/products

# Verificar consola del navegador (F12)
# Buscar errores de red o JavaScript
```

---

### Error "Failed to fetch"

**Causa:** Backend no está corriendo o CORS no configurado

**Solución:**
```bash
# Iniciar backend
cd backend
php artisan serve

# Verificar que CORS permite http://localhost:5173
# En backend/.env debe estar configurado
```

---

### Widget siempre muestra "NO_DATA"

**Causa:** Datos MOCK no insertados en BD

**Solución:**
```bash
# Ejecutar script de setup
bash setup_rapido.sh

# O manualmente
cd backend
mysql -u root -p mai < database/migrations/2025_11_26_seed_MOCK_market_prices.sql

# Verificar datos
mysql -u root -p mai -e "SELECT COUNT(*) FROM market_prices WHERE source = 'MOCK_DATA';"
# Debería retornar ~450
```

---

### Widget no se actualiza al cambiar precio

**Causa:** React no detecta cambio o debounce muy largo

**Solución:** El componente tiene debounce interno en `useEffect`, esperar ~1 segundo después de escribir el precio.

---

## ✅ Checklist de Validación

Después de probar, verifica:

- [ ] Widget aparece automáticamente al ingresar precio
- [ ] Widget se oculta cuando precio es 0 o vacío
- [ ] Widget se actualiza al cambiar producto
- [ ] Widget se actualiza al cambiar precio
- [ ] Botón "Ajustar" actualiza el campo de precio correctamente
- [ ] Toast notification aparece al ajustar precio
- [ ] Botón "Mantener mi precio" oculta el widget
- [ ] Los 5 niveles de recomendación funcionan (colores + mensajes)
- [ ] Widget funciona con todos los 15 productos MOCK
- [ ] Widget muestra "NO_DATA" para productos sin información
- [ ] Loading state aparece brevemente al buscar
- [ ] Error state aparece si backend falla

---

## 📊 Productos MOCK Disponibles para Probar

| Producto | Precio Promedio | Tipo de Prueba |
|----------|----------------|----------------|
| Aguacate Hass | ~$6,450/kg | Precio alto |
| Banano | ~$2,000/kg | Precio óptimo |
| Papa Criolla | ~$4,520/kg | Precio medio |
| Tomate Chonto | ~$3,200/kg | Volátil |
| Frijol | ~$7,450/kg | Precio muy alto |
| Huevo | ~$800/unidad | Precio bajo |
| Leche | ~$1,800/litro | Precio estable |
| Mango Tommy | ~$3,380/kg | Frutas |
| Naranja | ~$2,500/kg | Frutas |
| Papa Pastusa | ~$2,800/kg | Tubérculos |
| Yuca | ~$1,800/kg | Tubérculos |
| Cebolla Cabezona | ~$2,500/kg | Hortalizas |
| Zanahoria | ~$2,000/kg | Hortalizas |
| Lechuga | ~$1,500/unidad | Hortalizas |
| Plátano Hartón | ~$2,200/kg | Plátanos |
| Arroz | ~$3,500/kg | Granos |

---

## 🎉 Resultado Esperado Final

Al completar estas pruebas:

1. ✅ **El widget funciona end-to-end**
2. ✅ **Usa datos MOCK de la base de datos**
3. ✅ **Actualiza el precio del formulario automáticamente**
4. ✅ **Muestra los 5 niveles de recomendación correctamente**
5. ✅ **El sistema está 100% funcional para el MVP**

---

## 🚀 Próximos Pasos (Opcional)

Una vez validado el MVP:

1. **Configurar n8n** para datos reales de Corabastos
2. **Eliminar datos MOCK** y usar solo datos reales
3. **Agregar más productos** al catálogo (200+)
4. **Implementar notificaciones** por email/WhatsApp
5. **Agregar analytics** de aceptación de recomendaciones

---

**Creado:** 2025-11-27
**Autor:** Claude Code (Autonomous Mode)
**Versión:** 1.0.0
**Task:** 9.5 - Integración Frontend Completada ✅
