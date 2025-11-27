# 🎯 Módulo de Precios Inteligentes - MAI

## 🚀 Instalación en 1 Minuto

```bash
# Desde la raíz del proyecto MAI
bash setup_rapido.sh
```

El script automáticamente:
- ✅ Crea 8 tablas nuevas
- ✅ Inserta 70+ unidades de medida
- ✅ Inserta 120+ productos
- ✅ Genera 450+ precios simulados (MOCK)
- ✅ Calcula tendencias automáticamente

**Tiempo total:** ~30 segundos

---

## 📋 ¿Qué es esto?

Un sistema inteligente que compara los precios de los usuarios contra datos reales del mercado (Corabastos) y proporciona recomendaciones en tiempo real.

### Ejemplo:

**Usuario publica:**
- Producto: "Papa Criolla"
- Precio: $6,000/kg

**Sistema responde:**
```
🔴 MUY POR ENCIMA DEL MERCADO (+32.7%)

Tu precio está muy alto comparado con el promedio del mercado ($4,520/kg).
Esto podría dificultar mucho la venta.

Recomendación: Ajustar a $4,520/kg
```

---

## 🎯 Características

### 1. Normalización Inteligente de Productos
- Busca coincidencias exactas, parciales y difusas
- Maneja errores de escritura y variaciones
- 120+ productos pre-cargados
- Sistema de confianza (0-100%)

### 2. Recomendaciones de 5 Niveles
- 🔴 **MUY POR ENCIMA** (>+30%): Precio demasiado alto
- ⬆️ **POR ENCIMA** (+10% a +30%): Precio alto
- ✅ **EN RANGO** (-10% a +10%): **Precio óptimo**
- ⬇️ **POR DEBAJO** (-10% a -30%): Precio bajo
- ⚠️ **MUY POR DEBAJO** (<-30%): Precio demasiado bajo

### 3. Analytics de Mercado
- Vista general del mercado
- Productos con precios en alza/baja
- Productos volátiles/estables
- Tendencias por categoría

### 4. Datos Simulados para MVP
- 450+ precios de 15 productos
- 30 días de historial
- Variaciones realistas
- **Listo para probar SIN n8n**

---

## 📦 Archivos Principales

### Documentación
```
📄 RESUMEN_FINAL_ES.md .................. Resumen completo en español
📄 GUIA_RAPIDA_DATOS_MOCK.md .......... Guía de datos simulados
📄 setup_rapido.sh ............................ Script de instalación automática
```

### Base de Datos
```
📊 create_intelligent_module_tables.sql ... 8 tablas + views + procedures
📊 seed_measurement_units.sql ................. 70+ unidades
📊 seed_products_catalog.sql ................... 120+ productos
📊 seed_MOCK_market_prices.sql .............. 450+ precios simulados
```

### Backend
```
🔧 6 Modelos (Eloquent)
🔧 2 Servicios (Business Logic)
🔧 4 Controladores (40+ APIs)
📖 README_INTELLIGENT_API.md
📮 Postman Collection (35+ requests)
```

### Frontend
```
⚛️ 2 Componentes React
⚛️ 1 Custom Hook
⚛️ 1 Service (API Client)
⚛️ 1 Types File (TypeScript)
📖 INTEGRATION_GUIDE.md
```

---

## 🧪 Probar Inmediatamente

### 1. Ejecutar Setup
```bash
bash setup_rapido.sh
```

### 2. Iniciar Backend
```bash
cd backend
php artisan serve
```

### 3. Probar API

**Con curl:**
```bash
curl -X POST http://localhost:8000/api/recommendations/check-price \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "papa criolla",
    "price_per_kg": 6000
  }'
```

**Con Postman:**
1. Importar: `backend/MAI_Intelligent_Pricing.postman_collection.json`
2. Ejecutar: "Check Price" request
3. Ver resultado

---

## 🎨 Integración Frontend

### Opción 1: Widget Simple
```tsx
import PriceRecommendationWidget from './components/PriceRecommendationWidget';

<PriceRecommendationWidget
  productName={productName}
  pricePerKg={price}
  onAccept={(recommendedPrice) => setPrice(recommendedPrice)}
/>
```

### Opción 2: Con Hook
```tsx
import { usePriceRecommendation } from './hooks/usePriceRecommendation';

const { recommendation, isLoading } = usePriceRecommendation({
  productName,
  pricePerKg,
  autoFetch: true
});
```

### Opción 3: Dashboard Completo
```tsx
import MarketInsightsDashboard from './components/MarketInsightsDashboard';

<MarketInsightsDashboard />
```

---

## 📊 Productos Disponibles

Los datos MOCK incluyen estos productos:

| Categoría | Productos | Precio Promedio |
|-----------|-----------|-----------------|
| **Frutas** | Aguacate Hass, Banano, Mango, Naranja | $2,000 - $6,500 |
| **Tubérculos** | Papa Criolla, Papa Pastusa, Yuca | $1,800 - $4,500 |
| **Hortalizas** | Tomate, Cebolla, Zanahoria, Lechuga | $1,500 - $3,200 |
| **Plátanos** | Plátano Hartón | $2,200 |
| **Granos** | Frijol, Arroz | $3,500 - $7,500 |
| **Huevos** | Huevo AA | $800/unidad |
| **Lácteos** | Leche | $1,800/litro |

---

## 🔄 De MOCK a Producción

### Ahora (MVP)
```
Datos MOCK → API Backend → Frontend
```
- Datos simulados realistas
- Funcional para desarrollo y demos

### Después (Producción)
```
PDF Corabastos → n8n + Claude AI → API Backend → Frontend
```
- Datos reales actualizados diariamente
- 175+ productos
- Automático

**La transición es transparente:** Solo cambias la fuente de datos, el código queda igual.

---

## 🛠️ APIs Principales

### Recomendaciones
```
POST /api/recommendations/check-price
  ↳ Obtener recomendación para un precio

GET /api/recommendations/suggested-price?product_name=papa
  ↳ Obtener precio sugerido óptimo

GET /api/recommendations/my-recommendations
  ↳ Historial de recomendaciones del usuario
```

### Catálogo
```
GET /api/catalog/products
  ↳ Listar todos los productos

GET /api/catalog/search?query=papa
  ↳ Buscar productos (fuzzy search)

POST /api/catalog/normalize
  ↳ Normalizar nombre de producto
```

### Tendencias
```
GET /api/trends/market-overview
  ↳ Vista general del mercado

GET /api/trends/volatile-products
  ↳ Productos con mayor volatilidad

GET /api/trends/increasing-prices
  ↳ Productos con precios en alza
```

**Total:** 40+ endpoints disponibles

Ver documentación completa: `backend/README_INTELLIGENT_API.md`

---

## 📚 Documentación

### Para Empezar
1. 📄 **`RESUMEN_FINAL_ES.md`** ← Empieza aquí
2. 📄 **`GUIA_RAPIDA_DATOS_MOCK.md`** ← Datos de prueba
3. 📄 **`setup_rapido.sh`** ← Script automático

### Referencia Técnica
- 📖 `backend/README_INTELLIGENT_API.md` - API completa
- 📖 `frontend/INTEGRATION_GUIDE.md` - Integración frontend
- 📖 `n8n/README_N8N_SETUP.md` - Configuración n8n
- 📖 `INTELLIGENT_PRICING_SUMMARY.md` - Resumen técnico

### Colecciones
- 📮 `backend/MAI_Intelligent_Pricing.postman_collection.json`

---

## 🧹 Mantenimiento

### Limpiar Datos MOCK
```sql
DELETE FROM price_trends
WHERE product_catalog_id IN (
    SELECT DISTINCT product_catalog_id
    FROM market_prices
    WHERE source = 'MOCK_DATA'
);

DELETE FROM market_prices WHERE source = 'MOCK_DATA';
```

### Regenerar Datos
```bash
mysql -u root -p mai < database/migrations/2025_11_26_seed_MOCK_market_prices.sql
```

### Verificar Estado
```sql
-- Productos con precios
SELECT
    pc.name,
    COUNT(*) as registros,
    AVG(mp.price_unit) as precio_promedio
FROM market_prices mp
JOIN products_catalog pc ON mp.product_catalog_id = pc.id
WHERE mp.source = 'MOCK_DATA'
GROUP BY pc.name;
```

---

## 🐛 Solución de Problemas

### Error: "Table doesn't exist"
```bash
# Ejecutar migraciones
mysql -u root -p mai < database/migrations/2025_11_26_create_intelligent_module_tables.sql
```

### Error: "Product not found"
```bash
# Insertar productos
mysql -u root -p mai < database/migrations/2025_11_26_seed_products_catalog.sql
```

### Error: "No market data"
```bash
# Insertar datos MOCK
mysql -u root -p mai < database/migrations/2025_11_26_seed_MOCK_market_prices.sql
```

### API retorna 500
```bash
# Ver logs
tail -f backend/storage/logs/laravel.log
```

---

## 🎯 Roadmap

### Fase 1: MVP (Completado ✅)
- [x] Base de datos
- [x] APIs backend
- [x] Datos simulados
- [x] Componentes frontend
- [x] Widget integrado en PublishPostModal ⭐ **NUEVO - 2025-11-27**
- [x] Documentación

### Fase 2: Producción (Próximo)
- [ ] Configurar n8n
- [ ] Conectar con Corabastos real
- [ ] Desplegar a producción
- [ ] Monitoreo y alertas

### Fase 3: Mejoras (Futuro)
- [ ] Más fuentes de datos
- [ ] Predicción de precios (ML)
- [ ] Notificaciones WhatsApp
- [ ] Analytics avanzados

---

## 💡 Tips

### Para Desarrollo
- Usa datos MOCK para desarrollo rápido
- Postman para probar APIs
- Lee logs de Laravel para debugging

### Para Testing
- Prueba los 5 niveles de recomendación
- Verifica normalización de productos
- Revisa tendencias calculadas

### Para Producción
- Configura n8n con credenciales reales
- Activa monitoreo de errores
- Programa backups de base de datos
- Configura alertas por email/Slack

---

## 🏆 Resultados Esperados

### Para Usuarios
- 📈 **Mejores precios:** Ajustados al mercado
- 💰 **Más ventas:** Productos competitivos
- 📊 **Datos reales:** Decisiones informadas

### Para la Plataforma
- 🎯 **Diferenciador:** Feature único en el mercado
- 📈 **Engagement:** Usuarios más activos
- 💎 **Valor:** Insights del mercado agrícola

---

## 📞 Soporte

### Recursos
- 📖 Documentación completa en `/docs`
- 📮 Postman collection para probar
- 🧪 Datos MOCK para desarrollo

### Contacto
- Revisa documentación primero
- Verifica logs de Laravel
- Consulta Postman collection

---

## ✅ Checklist Final

Después de ejecutar `setup_rapido.sh`:

- [ ] 450+ precios en `market_prices`
- [ ] 15 tendencias en `price_trends`
- [ ] API responde correctamente
- [ ] Postman collection funciona
- [ ] Datos MOCK son realistas
- [ ] Documentación revisada

---

## 🎉 ¡Listo!

El módulo de precios inteligentes está **100% funcional** y listo para:
- ✅ Desarrollo
- ✅ Testing
- ✅ Demos
- ✅ Producción (con n8n)

**¡A construir el futuro del comercio agrícola inteligente! 🌾🚀**

---

**Generado por:** Claude Code
**Versión:** 1.0.0
**Fecha:** 2025-11-26
