# 🧪 Test de Normalización de Productos

## Problema Identificado

El formulario de "Publicar Producto" usa **product_types** genéricos (Verduras, Frutas, Granos, etc.), pero el sistema de recomendación de precios necesita **productos específicos** del catálogo (PAPA CRIOLLA, AGUACATE HASS, etc.).

## ✅ Solución Implementada

### 1. Aliases Agregados

Se agregaron aliases a los productos con datos MOCK para que coincidan con búsquedas genéricas:

| Producto | Aliases |
|----------|---------|
| PAPA CRIOLLA | papa, papas, tuberculo, tubérculos, verdura, verduras |
| AGUACATE HASS | aguacate, fruta, frutas |
| NARANJA | naranja, naranjas, citrico, citricos, fruta, frutas |
| BANANO URABÁ | banano, bananos, platano, platanos, fruta, frutas |
| MANGO | mango, mangos, fruta, frutas |

### 2. Widget Mejorado

El widget ahora muestra un mensaje informativo cuando no encuentra el producto, listando los productos disponibles.

---

## 🧪 Pruebas para Realizar

### Test 1: Búsqueda por Alias "verduras"

```bash
curl -X POST http://localhost/api/catalog/normalize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "product_name": "verduras"
  }'
```

**Resultado esperado:**
```json
{
  "success": true,
  "found": true,
  "product": {
    "id": 1,
    "name": "PAPA CRIOLLA",
    "category": "Tubérculos"
  },
  "confidence": 0.7,
  "match_type": "alias"
}
```

### Test 2: Búsqueda por Alias "frutas"

```bash
curl -X POST http://localhost/api/catalog/normalize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "product_name": "frutas"
  }'
```

**Resultado esperado:**
Debería encontrar uno de: AGUACATE HASS, NARANJA, BANANO URABÁ, o MANGO

---

## 🎯 Siguientes Pasos

### Para el Usuario:

1. **Refrescar la página** del navegador (Ctrl+F5)
2. **Probar nuevamente** con "Verduras" en el formulario
3. Si aún no funciona, **probar con un nombre más específico** en el título:
   - Título: "PAPA CRIOLLA" ← El widget debería capturar esto
   - Producto: Verduras

### Alternativa: Modificar el título temporalmente

En lugar de:
```
Título: PAPA CRIOLLA
Producto: Verduras
Precio: 400
```

El sistema debería intentar normalizar primero el título "PAPA CRIOLLA" y luego el tipo "Verduras".

---

## 🔧 Si Sigue Sin Funcionar

El problema puede ser que el widget está usando directamente el `product_type.name` sin intentar normalizarlo.

Verificar en `PublishPostModal.tsx`:

```typescript
<PriceRecommendationWidget
  productName={
    productTypes.find((p) => p.id === formData.product_id)?.name || ""
  }
  // ...
/>
```

Esto está pasando "Verduras" directamente. Necesitaríamos:

1. **Opción A:** Cambiar el widget para que use el `title` si el `productName` es muy genérico
2. **Opción B:** Agregar un campo de producto específico en el formulario
3. **Opción C:** Hacer que el backend sea más inteligente y busque cualquier producto de esa categoría

---

## 💡 Recomendación Inmediata

**Prueba escribiendo el nombre del producto en el TÍTULO:**

```
Título: papa criolla
Descripción: venta de papa
Producto: Verduras
Precio: 7000
```

Si el backend normaliza correctamente, debería encontrar "PAPA CRIOLLA" a partir del título.

---

**Estado:** Widget mejorado + Aliases agregados
**Siguiente paso:** Probar en el navegador
