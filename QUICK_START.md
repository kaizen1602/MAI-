# ⚡ Quick Start Guide - MAI Intelligent Pricing Module

**Get the intelligent pricing module running in 15 minutes!**

---

## 🎯 Prerequisites

- ✅ MAI backend running (Laravel)
- ✅ MAI frontend running (React)
- ✅ MySQL database accessible
- ✅ Claude API key (from Anthropic)
- ✅ n8n instance (local or cloud)

---

## 📦 Step 1: Database Setup (5 minutes)

```bash
cd backend

# Run migrations
mysql -u root -p mai < database/migrations/2025_11_26_create_intelligent_module_tables.sql
mysql -u root -p mai < database/migrations/2025_11_26_seed_measurement_units.sql
mysql -u root -p mai < database/migrations/2025_11_26_seed_products_catalog.sql

# Verify tables created
mysql -u root -p mai -e "SHOW TABLES LIKE '%catalog%'"
```

**Expected Output:**
```
products_catalog
market_prices
price_trends
recommendations
```

---

## 🔧 Step 2: Test Backend API (3 minutes)

```bash
# Make sure backend is running
cd backend
php artisan serve

# In another terminal, test the API
curl http://localhost:8000/api/catalog/categories

# Should return JSON with 10 categories
```

**Import Postman Collection:**
1. Open Postman
2. Import `backend/MAI_Intelligent_Pricing.postman_collection.json`
3. Update `{{base_url}}` to `http://localhost:8000/api`
4. Test "Get Categories" request

---

## 🎨 Step 3: Frontend Integration (5 minutes)

### Install Dependencies
```bash
cd frontend
npm install
```

### Copy Files
The following files are already created in `frontend/src/`:

```
data/
  types/pricing.types.ts ✅
  services/PricingService.ts ✅

components/
  PriceRecommendationWidget.tsx ✅
  MarketInsightsDashboard.tsx ✅

hooks/
  usePriceRecommendation.ts ✅
```

### Update Imports

Add to `frontend/src/data/services/index.ts`:
```typescript
export { default as PricingService } from './PricingService';
```

Add to `frontend/src/data/types/index.ts`:
```typescript
export * from './pricing.types';
```

### Add to Navigation

Edit `frontend/src/components/Navbar.tsx`:
```tsx
<Link to="/market-insights" className="nav-link">
  📊 Insights del Mercado
</Link>
```

### Create Page

Create `frontend/src/pages/MarketInsights.tsx`:
```tsx
import React from 'react';
import MarketInsightsDashboard from '../components/MarketInsightsDashboard';
import MainLayout from '../layouts/MainLayout';

const MarketInsightsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <MarketInsightsDashboard />
      </div>
    </MainLayout>
  );
};

export default MarketInsightsPage;
```

Add route in `frontend/src/App.tsx`:
```tsx
import MarketInsightsPage from './pages/MarketInsights';

// In your Routes:
<Route path="/market-insights" element={<MarketInsightsPage />} />
```

### Start Frontend
```bash
npm run dev
```

Visit: `http://localhost:5173/market-insights`

---

## 🧪 Step 4: Test Recommendation (2 minutes)

Open browser console and test:

```javascript
// Test product search
fetch('http://localhost:8000/api/catalog/search?query=papa')
  .then(r => r.json())
  .then(console.log);

// Test price recommendation
fetch('http://localhost:8000/api/recommendations/check-price', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    product_name: 'papa criolla',
    price_per_kg: 5000,
    category: 'Tubérculos'
  })
})
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "success": false,
  "recommendation_type": "NO_DATA",
  "message": "No hay suficientes datos de mercado para este producto."
}
```

This is normal! You need to add price data first.

---

## 📊 Step 5: Add Sample Data (Optional)

To test with real data, manually insert a few prices:

```sql
-- Sample market prices
INSERT INTO market_prices (product_catalog_id, measurement_unit_id, quantity, price_unit, price_variation, date, source, raw_name, created_at, updated_at)
VALUES
(25, 1, 1, 4300, 'Estable', '2025-11-20', 'Manual', 'Papa Criolla', NOW(), NOW()),
(25, 1, 1, 4500, 'Subio', '2025-11-21', 'Manual', 'Papa Criolla', NOW(), NOW()),
(25, 1, 1, 4400, 'Bajo', '2025-11-22', 'Manual', 'Papa Criolla', NOW(), NOW()),
(25, 1, 1, 4600, 'Subio', '2025-11-23', 'Manual', 'Papa Criolla', NOW(), NOW()),
(25, 1, 1, 4500, 'Bajo', '2025-11-24', 'Manual', 'Papa Criolla', NOW(), NOW());

-- Calculate trends
-- (Your backend endpoint will do this automatically)
```

Then test recommendation again - should work!

---

## 🔄 Step 6: n8n Setup (Optional - For Production)

### Install n8n
```bash
npm install -g n8n

# Or with Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Import Workflows
1. Open n8n at `http://localhost:5678`
2. Go to Workflows → Import from File
3. Import `n8n/workflows/corabastos_daily_ingestion.json`
4. Import `n8n/workflows/realtime_price_recommendation.json`

### Configure Credentials
1. Add **Anthropic API** credential with your Claude key
2. Add **HTTP Header Auth** for MAI backend
3. Add **SMTP** for email notifications (optional)

### Test Manually
1. Open "Corabastos Daily Ingestion" workflow
2. Click "Execute Workflow"
3. Monitor execution
4. Check database for new prices

For detailed n8n setup, see: `n8n/README_N8N_SETUP.md`

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Database tables exist and are populated
- [ ] Backend API responds at `/api/catalog/categories`
- [ ] Frontend loads without errors
- [ ] Market Insights page displays
- [ ] Can search for products
- [ ] Postman collection works
- [ ] (Optional) n8n workflows execute

---

## 🐛 Troubleshooting

### "Categories not found"
**Solution:** Run seed files again:
```bash
mysql -u root -p mai < database/migrations/2025_11_26_seed_products_catalog.sql
```

### "CORS error" in browser console
**Solution:** Add to `backend/.env`:
```bash
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

### "Widget not showing"
**Solution:** Check browser console for errors. Ensure:
- Product name is not empty
- Price is greater than 0
- Backend API is running

### "No market data available"
**Solution:** Insert sample data (Step 5) or run n8n ingestion workflow

---

## 📖 Next Steps

1. **Read Full Documentation:**
   - `INTELLIGENT_PRICING_SUMMARY.md` - Complete overview
   - `backend/README_INTELLIGENT_API.md` - API reference
   - `frontend/INTEGRATION_GUIDE.md` - Integration details

2. **Customize:**
   - Add more products to catalog
   - Configure n8n for your environment
   - Adjust recommendation thresholds
   - Customize widget styling

3. **Deploy:**
   - Set up production database
   - Configure production URLs
   - Deploy n8n workflows
   - Set up monitoring

---

## 🆘 Getting Help

- **API Issues:** Check `backend/README_INTELLIGENT_API.md`
- **Integration Questions:** See `frontend/INTEGRATION_GUIDE.md`
- **n8n Setup:** Read `n8n/README_N8N_SETUP.md`
- **General Questions:** Review `INTELLIGENT_PRICING_SUMMARY.md`

---

## 🎉 Success!

If you can:
1. ✅ See categories in the API response
2. ✅ Load the Market Insights page
3. ✅ Search for products
4. ✅ Get price recommendations

**You're all set!** The intelligent pricing module is now integrated into MAI.

---

**Time to complete:** ~15 minutes
**Difficulty:** Easy
**Next:** Configure n8n for automated data ingestion

**Happy coding! 🚀**
