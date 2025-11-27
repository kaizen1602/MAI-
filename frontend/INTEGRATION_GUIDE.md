# 🔧 Frontend Integration Guide - Intelligent Pricing Module

## Overview

This guide explains how to integrate the Intelligent Pricing Module into the MAI frontend. The module provides real-time price recommendations when users create or edit posts.

---

## 📦 Files Created

### Types
- `src/data/types/pricing.types.ts` - TypeScript type definitions

### Services
- `src/data/services/PricingService.ts` - API client for pricing endpoints

### Components
- `src/components/PriceRecommendationWidget.tsx` - Inline price recommendation display
- `src/components/MarketInsightsDashboard.tsx` - Full market analytics dashboard

### Hooks
- `src/hooks/usePriceRecommendation.ts` - Custom React hook for price recommendations

---

## 🚀 Integration Steps

### Step 1: Update API Endpoints Configuration

Add intelligent pricing endpoints to `src/data/api/endpoints.ts`:

```typescript
export const ENDPOINTS = {
  // ... existing endpoints

  // Intelligent Pricing Module
  PRICING: {
    // Recommendations
    CHECK_PRICE: '/recommendations/check-price',
    SUGGESTED_PRICE: '/recommendations/suggested-price',
    MY_RECOMMENDATIONS: '/recommendations/my-recommendations',
    RECOMMENDATION_STATS: '/recommendations/stats',

    // Catalog
    CATALOG_SEARCH: '/catalog/search',
    CATALOG_NORMALIZE: '/catalog/normalize',
    CATALOG_PRODUCTS: '/catalog/products',
    CATALOG_CATEGORIES: '/catalog/categories',

    // Market Prices
    MARKET_LATEST: '/market-prices/latest',
    MARKET_HISTORY: '/market-prices/history',

    // Trends
    TRENDS_OVERVIEW: '/trends/market-overview',
    TRENDS_PRODUCT: '/trends/product',
    TRENDS_VOLATILE: '/trends/volatile-products',
    TRENDS_INCREASING: '/trends/increasing-prices',
  },
};
```

---

### Step 2: Integrate into PublishPostModal

Modify `src/components/PublishPostModal.tsx` to include price recommendations:

```tsx
import React, { useState } from 'react';
import PriceRecommendationWidget from './PriceRecommendationWidget';
import { usePriceRecommendation } from '../hooks/usePriceRecommendation';
import { useAuth } from '../data/context/AuthContext';

const PublishPostModal: React.FC<PublishPostModalProps> = ({ ... }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    product_name: '',
    price_per_kg: 0,
    category: '',
    // ... other fields
  });

  // Use the price recommendation hook
  const {
    recommendation,
    isLoading: isCheckingPrice,
    acceptRecommendation,
    dismissRecommendation,
  } = usePriceRecommendation({
    productName: formData.product_name,
    pricePerKg: formData.price_per_kg,
    category: formData.category,
    userId: user?.user_id,
    autoFetch: true, // Auto-fetch when inputs change
    debounceMs: 1000, // Wait 1 second after user stops typing
  });

  const handleAcceptRecommendedPrice = (recommendedPrice: number) => {
    setFormData({
      ...formData,
      price_per_kg: recommendedPrice,
    });
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        {/* Existing form fields */}
        <input
          type="text"
          name="product_name"
          value={formData.product_name}
          onChange={handleInputChange}
          placeholder="Nombre del producto"
        />

        <input
          type="number"
          name="price_per_kg"
          value={formData.price_per_kg}
          onChange={handleInputChange}
          placeholder="Precio por kg"
        />

        {/* Price Recommendation Widget */}
        {formData.product_name && formData.price_per_kg > 0 && (
          <PriceRecommendationWidget
            productName={formData.product_name}
            pricePerKg={formData.price_per_kg}
            category={formData.category}
            userId={user?.user_id}
            onAccept={handleAcceptRecommendedPrice}
            onDismiss={dismissRecommendation}
            className="my-4"
          />
        )}

        {/* Rest of form */}
        <button type="submit">Publicar</button>
      </form>
    </div>
  );
};
```

---

### Step 3: Add Market Insights Page

Create a new page or route for the Market Insights Dashboard:

**Option A: New standalone page** (`src/pages/MarketInsights.tsx`):

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

**Option B: Add to existing Charts page** (`src/pages/Charts.tsx`):

```tsx
import React, { useState } from 'react';
import MarketInsightsDashboard from '../components/MarketInsightsDashboard';

const Charts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'statistics' | 'market'>('statistics');

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('statistics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'statistics'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Estadísticas Generales
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'market'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Insights del Mercado
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'statistics' && (
        <div>
          {/* Existing statistics charts */}
        </div>
      )}

      {activeTab === 'market' && (
        <MarketInsightsDashboard />
      )}
    </div>
  );
};

export default Charts;
```

---

### Step 4: Add Route (if creating new page)

Update `src/App.tsx` to include the new route:

```tsx
import MarketInsightsPage from './pages/MarketInsights';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/charts" element={<Charts />} />

        {/* New Market Insights route */}
        <Route path="/market-insights" element={<MarketInsightsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### Step 5: Add Navigation Link

Update `src/components/Navbar.tsx` to include link to Market Insights:

```tsx
const Navbar: React.FC = () => {
  return (
    <nav>
      {/* Existing nav items */}
      <Link to="/" className="nav-link">Inicio</Link>
      <Link to="/charts" className="nav-link">Estadísticas</Link>

      {/* New Market Insights link */}
      <Link to="/market-insights" className="nav-link">
        📊 Insights del Mercado
      </Link>
    </nav>
  );
};
```

---

### Step 6: Update Service Index

Add PricingService to `src/data/services/index.ts`:

```typescript
export { default as AuthService } from './AuthService';
export { default as PostService } from './PostService';
export { default as ProductService } from './ProductService';
export { default as PricingService } from './PricingService'; // Add this
// ... other services
```

---

### Step 7: Export Types

Update `src/data/types/index.ts`:

```typescript
export * from './auth.types';
export * from './post.types';
export * from './product.types';
export * from './pricing.types'; // Add this
// ... other types
```

---

## 🎨 Styling Considerations

The components use Tailwind CSS classes. Ensure your `tailwind.config.js` includes:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          // ... full purple palette
          600: '#9333ea',
          700: '#7e22ce',
        },
      },
    },
  },
  plugins: [],
};
```

---

## 🧪 Testing the Integration

### 1. Test Price Recommendation Widget

```bash
# Start frontend dev server
cd frontend
npm run dev
```

1. Navigate to create post page
2. Enter product name (e.g., "papa criolla")
3. Enter price (e.g., 6000)
4. Widget should appear with recommendation after 1 second
5. Try clicking "Ajustar a [price]" button
6. Verify price updates in form

### 2. Test Market Insights Dashboard

1. Navigate to `/market-insights` (or Charts tab)
2. Verify all data loads correctly
3. Check tab switching works
4. Verify categories display properly
5. Test responsive design on mobile

### 3. Test API Connectivity

Open browser console and run:

```javascript
import PricingService from './data/services/PricingService';

// Test price check
PricingService.checkPrice({
  product_name: 'papa criolla',
  price_per_kg: 5000,
  category: 'Tubérculos'
}).then(console.log);

// Test market overview
PricingService.getMarketOverview(30).then(console.log);
```

---

## 🔒 Environment Variables

Add to frontend `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ENABLE_PRICE_RECOMMENDATIONS=true
```

Check in code:

```typescript
const isPricingEnabled = import.meta.env.VITE_ENABLE_PRICE_RECOMMENDATIONS === 'true';

{isPricingEnabled && (
  <PriceRecommendationWidget ... />
)}
```

---

## 📱 Mobile Responsiveness

The components are designed to be responsive. Key breakpoints:

- **Mobile** (< 768px): Stacked layout, full-width cards
- **Tablet** (768px - 1024px): 2-column grid
- **Desktop** (> 1024px): 3-4 column grid

Test on various devices or use browser dev tools.

---

## ⚡ Performance Optimization

### 1. Debouncing

The `usePriceRecommendation` hook includes debouncing (1000ms default) to avoid excessive API calls while user is typing.

### 2. Lazy Loading

Lazy load the Market Insights Dashboard:

```tsx
import { lazy, Suspense } from 'react';

const MarketInsightsDashboard = lazy(() => import('./components/MarketInsightsDashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MarketInsightsDashboard />
    </Suspense>
  );
}
```

### 3. Caching

Consider using React Query for caching:

```bash
npm install @tanstack/react-query
```

```tsx
import { useQuery } from '@tanstack/react-query';
import PricingService from './services/PricingService';

const useMarketOverview = (days: number = 30) => {
  return useQuery({
    queryKey: ['market-overview', days],
    queryFn: () => PricingService.getMarketOverview(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

---

## 🐛 Common Issues & Solutions

### Issue: Widget not appearing

**Solution**: Check console for errors. Verify:
1. Product name is not empty
2. Price is > 0
3. Backend API is running
4. CORS is configured

### Issue: "Product not found" errors

**Solution**:
1. Check product exists in catalog
2. Try different product names
3. Check normalization confidence score
4. Add aliases to products in backend

### Issue: Slow API responses

**Solution**:
1. Check database indexes are created
2. Verify trend calculation ran
3. Consider caching with React Query
4. Check backend logs for slow queries

### Issue: Styling broken

**Solution**:
1. Verify Tailwind CSS is configured
2. Run `npm run build:css` to regenerate styles
3. Check purple color palette is defined
4. Clear browser cache

---

## 📊 Analytics Integration

Track recommendation acceptance rate:

```tsx
import { useEffect } from 'react';

const PriceRecommendationWidget = ({ ... }) => {
  const handleAcceptRecommendation = () => {
    // Google Analytics
    gtag('event', 'recommendation_accepted', {
      'event_category': 'pricing',
      'event_label': productName,
      'value': recommendation.market_avg_price
    });

    // Mixpanel
    mixpanel.track('Recommendation Accepted', {
      product: productName,
      user_price: pricePerKg,
      recommended_price: recommendation.market_avg_price,
      difference_percentage: recommendation.difference_percentage
    });

    if (onAccept) {
      onAccept(recommendation.market_avg_price);
    }
  };

  return (
    // ...
  );
};
```

---

## 🚀 Next Steps

1. ✅ Complete integration in PublishPostModal
2. ✅ Test all API endpoints
3. ✅ Add Market Insights to navigation
4. ⬜ Add user feedback mechanism
5. ⬜ Implement A/B testing for recommendation display
6. ⬜ Add price history charts to product details
7. ⬜ Create email notifications for price alerts
8. ⬜ Build admin dashboard for monitoring

---

## 📚 Additional Resources

- **API Documentation**: `backend/README_INTELLIGENT_API.md`
- **Postman Collection**: `backend/MAI_Intelligent_Pricing.postman_collection.json`
- **Type Definitions**: `frontend/src/data/types/pricing.types.ts`
- **Service Methods**: `frontend/src/data/services/PricingService.ts`

---

**Questions?** Check the backend API documentation or contact the development team.
