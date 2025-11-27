# 🚀 Guía Rápida - Datos Mock para MVP

## ✅ ¿Qué hace este script?

Inserta **datos simulados realistas** de precios de Corabastos para que puedas probar las recomendaciones de precios **SIN necesidad de tener n8n activo**.

### Datos generados:
- ✅ **~450 registros de precios** (15 productos × 30 días)
- ✅ **Precios realistas** basados en mercado colombiano
- ✅ **Variaciones diarias** (Subio, Bajo, Estable)
- ✅ **Tendencias calculadas** automáticamente
- ✅ **Listo para usar** inmediatamente

---

## 📦 Paso 1: Insertar Datos Mock

```bash
cd backend

# Ejecutar script de datos simulados
mysql -u root -p mai < database/migrations/2025_11_26_seed_MOCK_market_prices.sql
```

**Tiempo estimado:** 10-15 segundos

**Salida esperada:**
```
✅ Datos MOCK insertados correctamente!
total_precios: 450
productos_con_precios: 15
tendencias_calculadas: 15
```

---

## 🧪 Paso 2: Verificar Datos

```sql
-- Ver productos con precios
SELECT
    pc.name,
    COUNT(*) as dias_datos,
    AVG(mp.price_unit) as precio_promedio,
    MIN(mp.price_unit) as precio_minimo,
    MAX(mp.price_unit) as precio_maximo
FROM market_prices mp
JOIN products_catalog pc ON mp.product_catalog_id = pc.id
WHERE mp.source = 'MOCK_DATA'
GROUP BY pc.name
ORDER BY precio_promedio DESC;
```

**Verás algo como:**
```
+------------------+-----------+------------------+---------------+---------------+
| name             | dias_datos| precio_promedio  | precio_minimo | precio_maximo |
+------------------+-----------+------------------+---------------+---------------+
| FRIJOL           | 30        | 7450             | 7200          | 8600          |
| AGUACATE HASS    | 30        | 6450             | 6200          | 7800          |
| PAPA CRIOLLA     | 30        | 4520             | 4300          | 5400          |
| MANGO TOMMY      | 30        | 3380             | 3200          | 4300          |
+------------------+-----------+------------------+---------------+---------------+
```

---

## 🎯 Paso 3: Probar Recomendación de Precio

### Con Postman:

**POST** `http://localhost:8000/api/recommendations/check-price`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer tu_token_aqui"
}
```

**Body (prueba con precio ALTO):**
```json
{
  "product_name": "papa criolla",
  "price_per_kg": 6000,
  "category": "Tubérculos"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "has_data": true,
  "product": {
    "id": 25,
    "name": "PAPA CRIOLLA",
    "category": "Tubérculos"
  },
  "user_price": 6000,
  "market_avg_price": 4520,
  "market_min_price": 4300,
  "market_max_price": 5400,
  "difference_percentage": 32.74,
  "recommendation_type": "MUY_POR_ENCIMA",
  "suggestion_text": "🔴 Tu precio está MUY por encima del mercado (+32.7%). Esto podría dificultar mucho la venta. Te recomendamos bajarlo cerca de $4,520 para ser competitivo.",
  "recommendation_color": "darkred",
  "icon": "🔴",
  "data_points": 30,
  "period_days": 30
}
```

### Con CURL:

```bash
curl -X POST http://localhost:8000/api/recommendations/check-price \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token" \
  -d '{
    "product_name": "tomate chonto",
    "price_per_kg": 3500
  }'
```

---

## 📊 Productos Disponibles para Probar

### Frutas
- ✅ **Aguacate Hass** - Precio promedio: ~$6,450/kg
- ✅ **Banano** - Precio promedio: ~$2,000/kg
- ✅ **Mango Tommy** - Precio promedio: ~$3,380/kg
- ✅ **Naranja** - Precio promedio: ~$2,500/kg

### Tubérculos
- ✅ **Papa Criolla** - Precio promedio: ~$4,520/kg
- ✅ **Papa Pastusa** - Precio promedio: ~$2,800/kg
- ✅ **Yuca** - Precio promedio: ~$1,800/kg

### Hortalizas
- ✅ **Tomate Chonto** - Precio promedio: ~$3,200/kg (VOLÁTIL)
- ✅ **Cebolla Cabezona** - Precio promedio: ~$2,500/kg
- ✅ **Zanahoria** - Precio promedio: ~$2,000/kg
- ✅ **Lechuga** - Precio promedio: ~$1,500/unidad

### Plátanos
- ✅ **Plátano Hartón** - Precio promedio: ~$2,200/kg

### Granos
- ✅ **Frijol** - Precio promedio: ~$7,450/kg
- ✅ **Arroz** - Precio promedio: ~$3,500/kg

### Huevos
- ✅ **Huevo** - Precio promedio: ~$800/unidad

### Lácteos
- ✅ **Leche** - Precio promedio: ~$1,800/litro

---

## 🎨 Pruebas de Escenarios

### Escenario 1: Precio Muy Alto
```json
{
  "product_name": "papa criolla",
  "price_per_kg": 7000
}
```
**Resultado:** `MUY_POR_ENCIMA` 🔴

### Escenario 2: Precio Muy Bajo
```json
{
  "product_name": "aguacate hass",
  "price_per_kg": 4000
}
```
**Resultado:** `MUY_POR_DEBAJO` ⚠️

### Escenario 3: Precio Óptimo
```json
{
  "product_name": "banano",
  "price_per_kg": 2000
}
```
**Resultado:** `EN_RANGO` ✅

### Escenario 4: Precio Alto
```json
{
  "product_name": "tomate chonto",
  "price_per_kg": 4000
}
```
**Resultado:** `POR_ENCIMA` ⬆️

### Escenario 5: Precio Bajo
```json
{
  "product_name": "zanahoria",
  "price_per_kg": 1500
}
```
**Resultado:** `POR_DEBAJO` ⬇️

---

## 🔍 Ver Tendencias

```bash
# Ver tendencias calculadas
curl http://localhost:8000/api/trends/market-overview?days=30
```

```bash
# Ver productos volátiles
curl http://localhost:8000/api/trends/volatile-products?limit=5
```

```bash
# Ver precios en alza
curl http://localhost:8000/api/trends/increasing-prices?limit=5
```

---

## 🎯 Integración Frontend

Una vez tengas datos, el widget funcionará automáticamente:

```tsx
import PriceRecommendationWidget from './components/PriceRecommendationWidget';

// En tu componente de publicación:
<PriceRecommendationWidget
  productName={formData.product_name}
  pricePerKg={formData.price_per_kg}
  category={formData.category}
  userId={user?.user_id}
  onAccept={(recommendedPrice) => {
    setFormData({ ...formData, price_per_kg: recommendedPrice });
  }}
/>
```

**El widget mostrará:**
- ✅ Comparación de precios
- ✅ Porcentaje de diferencia
- ✅ Recomendación específica
- ✅ Botón para ajustar al precio de mercado

---

## 🧹 Limpiar Datos Mock (Opcional)

Si quieres empezar de cero:

```sql
-- Eliminar solo datos MOCK
DELETE FROM price_trends
WHERE product_catalog_id IN (
    SELECT DISTINCT product_catalog_id
    FROM market_prices
    WHERE source = 'MOCK_DATA'
);

DELETE FROM market_prices WHERE source = 'MOCK_DATA';

-- Volver a ejecutar el script para regenerar
```

---

## 🔄 Cuando n8n esté listo

Una vez tengas n8n configurado, simplemente:

1. **Elimina datos mock:**
   ```sql
   DELETE FROM market_prices WHERE source = 'MOCK_DATA';
   ```

2. **Ejecuta el workflow de n8n** que insertará datos reales

3. **¡Listo!** La API seguirá funcionando igual, pero con datos reales

**No necesitas cambiar NADA en el código** - solo cambias la fuente de datos.

---

## ✅ Checklist de Prueba

- [ ] Script ejecutado sin errores
- [ ] 450+ registros en `market_prices`
- [ ] 15 tendencias en `price_trends`
- [ ] API responde correctamente
- [ ] Postman collection funciona
- [ ] Frontend muestra widget (si integrado)
- [ ] Recomendaciones tienen sentido

---

## 🐛 Troubleshooting

### Error: "Table doesn't exist"
**Solución:** Ejecuta primero las migraciones principales:
```bash
mysql -u root -p mai < database/migrations/2025_11_26_create_intelligent_module_tables.sql
```

### Error: "Product not found"
**Solución:** Ejecuta el seed de productos:
```bash
mysql -u root -p mai < database/migrations/2025_11_26_seed_products_catalog.sql
```

### Precios parecen incorrectos
**Solución:** Los datos son aleatorios dentro de rangos realistas. Cada ejecución genera valores ligeramente diferentes.

### No hay datos
**Solución:** Verifica que el script se ejecutó completamente:
```sql
SELECT COUNT(*) FROM market_prices WHERE source = 'MOCK_DATA';
-- Debería retornar ~450
```

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que las tablas existen
2. Revisa los logs de MySQL
3. Prueba con Postman primero
4. Revisa la consola del navegador

---

## 🎉 ¡Listo para Probar!

Con estos datos mock puedes:
- ✅ Probar todas las APIs
- ✅ Ver recomendaciones en tiempo real
- ✅ Testear el frontend completo
- ✅ Demostrar el MVP a stakeholders
- ✅ Desarrollar sin depender de n8n

**Cuando n8n esté listo, solo cambias la fuente de datos y todo sigue funcionando igual.**

---

**¡Disfruta probando el módulo de precios inteligentes!** 🚀
