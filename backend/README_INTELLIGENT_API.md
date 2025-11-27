# MAI Intelligent Pricing Module - API Documentation

## 📋 Overview

This document provides comprehensive API documentation for the **Intelligent Pricing Module** of MAI (Mercado Agro Inteligente). This module enables real-time price recommendations by comparing user prices against Corabastos market data.

**Base URL**: `http://localhost:8000/api`

**Authentication**: Most endpoints require Sanctum authentication token in header:
```
Authorization: Bearer {token}
```

---

## 🗂️ API Structure

The Intelligent Pricing Module provides 4 main API groups:

1. **Product Catalog** (`/catalog`) - Normalized product management
2. **Market Prices** (`/market-prices`) - Corabastos price data
3. **Recommendations** (`/recommendations`) - Price comparison & suggestions
4. **Trends** (`/trends`) - Market analytics & insights

---

## 1️⃣ Product Catalog API

### 1.1 List Products

**GET** `/api/catalog/products`

List all products in the normalized catalog.

**Query Parameters:**
- `category` (optional): Filter by category
- `is_active` (optional, default: true): Filter by active status
- `limit` (optional, default: 50): Results per page
- `page` (optional, default: 1): Page number

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/catalog/products?category=Frutas&limit=20" \
  -H "Authorization: Bearer {token}"
```

**Response:**
```json
{
  "success": true,
  "total": 45,
  "per_page": 20,
  "current_page": 1,
  "last_page": 3,
  "products": [
    {
      "id": 1,
      "name": "AGUACATE HASS",
      "category": "Frutas",
      "description": "Aguacate variedad Hass",
      "aliases": ["aguacate", "palta hass"],
      "is_active": true,
      "created_at": "2025-11-26T00:00:00.000000Z"
    }
  ]
}
```

---

### 1.2 Search Products (Fuzzy Search)

**GET** `/api/catalog/search`

Intelligent product search with fuzzy matching and similarity scoring.

**Query Parameters:**
- `query` (required): Search term
- `category` (optional): Filter by category
- `limit` (optional, default: 20): Max results

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/catalog/search?query=papa+criolla" \
  -H "Authorization: Bearer {token}"
```

**Response:**
```json
{
  "success": true,
  "query": "PAPA CRIOLLA",
  "total": 3,
  "results": [
    {
      "product": {
        "id": 25,
        "name": "PAPA CRIOLLA",
        "category": "Tubérculos"
      },
      "similarity": "100%",
      "confidence": 1.0
    },
    {
      "product": {
        "id": 26,
        "name": "PAPA PASTUSA",
        "category": "Tubérculos"
      },
      "similarity": "72%",
      "confidence": 0.72
    }
  ]
}
```

---

### 1.3 Normalize Product Name

**POST** `/api/catalog/normalize`

Map a raw product name to the normalized catalog.

**Body Parameters:**
- `product_name` (required): Raw product name
- `category` (optional): Product category

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/catalog/normalize" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "papa criolla lavada",
    "category": "Tubérculos"
  }'
```

**Response:**
```json
{
  "success": true,
  "raw_name": "papa criolla lavada",
  "normalized": {
    "product": {
      "id": 25,
      "name": "PAPA CRIOLLA",
      "category": "Tubérculos"
    },
    "variation": {
      "id": 5,
      "variation_name": "LAVADA"
    },
    "confidence": "95%",
    "confidence_score": 0.95
  }
}
```

---

### 1.4 Get Product Details

**GET** `/api/catalog/products/{id}`

Get detailed product information including recent prices.

**Example Response:**
```json
{
  "success": true,
  "product": {
    "id": 25,
    "name": "PAPA CRIOLLA",
    "category": "Tubérculos",
    "variations": [
      {"id": 5, "variation_name": "LAVADA"},
      {"id": 6, "variation_name": "SUCIA"}
    ]
  },
  "latest_price": {
    "price_unit": 4500,
    "date": "2025-11-25"
  },
  "price_statistics": {
    "avg_price": 4300,
    "min_price": 3800,
    "max_price": 5200,
    "data_points": 156
  }
}
```

---

### 1.5 Get Categories

**GET** `/api/catalog/categories`

List all product categories with counts.

**Example Response:**
```json
{
  "success": true,
  "total": 10,
  "categories": [
    {"category": "Frutas", "product_count": 45},
    {"category": "Hortalizas", "product_count": 38},
    {"category": "Tubérculos", "product_count": 12}
  ]
}
```

---

## 2️⃣ Market Prices API

### 2.1 Get Latest Market Prices

**GET** `/api/market-prices/latest`

Get latest market prices grouped by product.

**Query Parameters:**
- `days` (optional, default: 7): Days to look back

**Example Response:**
```json
{
  "success": true,
  "period": "7 days",
  "from": "2025-11-19",
  "to": "2025-11-26",
  "total_products": 120,
  "products": [
    {
      "product": {
        "id": 1,
        "name": "AGUACATE HASS"
      },
      "latest_price": {
        "price_unit": 6500,
        "date": "2025-11-25",
        "price_variation": "Subio"
      },
      "price_history": [...]
    }
  ]
}
```

---

### 2.2 Get Product Price History

**GET** `/api/market-prices/history/{productId}`

Get aggregated daily price history for a product.

**Query Parameters:**
- `days` (optional, default: 30): Historical period

**Example Response:**
```json
{
  "success": true,
  "product": {
    "id": 25,
    "name": "PAPA CRIOLLA"
  },
  "period_days": 30,
  "from": "2025-10-27",
  "to": "2025-11-26",
  "data_points": 28,
  "history": [
    {
      "date": "2025-11-25",
      "avg_price": 4500,
      "min_price": 4200,
      "max_price": 4800,
      "data_points": 5
    }
  ]
}
```

---

### 2.3 Create Market Price (n8n Integration)

**POST** `/api/market-prices`

Store new market price data (used by n8n workflow).

**Body Parameters:**
- `product_name` (required): Product name
- `category` (optional): Product category
- `measurement_unit_name` (required): Unit name
- `quantity` (required): Quantity
- `price_unit` (required): Price per unit
- `price_variation` (required): "Estable" | "Bajo" | "Subio"
- `date` (required): Date (YYYY-MM-DD)
- `price_extra` (optional): Extra quality price
- `price_first` (optional): First quality price
- `source` (optional, default: "Corabastos")
- `raw_name` (optional): Original name from source

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/market-prices" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "PAPA CRIOLLA LAVADA",
    "category": "Tubérculos",
    "measurement_unit_name": "KILO",
    "quantity": 1,
    "price_unit": 4500,
    "price_variation": "Estable",
    "date": "2025-11-26",
    "source": "Corabastos"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Market price created successfully",
  "data": {
    "id": 1234,
    "product_catalog_id": 25,
    "price_unit": 4500,
    "date": "2025-11-26"
  },
  "normalization": {
    "confidence": 0.95,
    "product_id": 25,
    "product_name": "PAPA CRIOLLA",
    "variation": "LAVADA"
  }
}
```

---

### 2.4 Calculate Trends

**POST** `/api/market-prices/calculate-trends`

Trigger trend calculation for all products.

**Query Parameters:**
- `days` (optional, default: 30): Analysis period

**Example Response:**
```json
{
  "success": true,
  "message": "Price trends calculated successfully",
  "period_days": 30,
  "products_processed": 120,
  "trends_created": 45,
  "trends_updated": 75,
  "errors_count": 0
}
```

---

## 3️⃣ Recommendations API

### 3.1 Check Price (Core Recommendation)

**POST** `/api/recommendations/check-price`

Compare user price against market and get recommendation.

**Body Parameters:**
- `product_name` (required): Product name
- `price_per_kg` (required): User's price per kg
- `user_id` (optional): User ID to save recommendation
- `category` (optional): Product category

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/recommendations/check-price" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "papa criolla",
    "price_per_kg": 5500,
    "user_id": 123,
    "category": "Tubérculos"
  }'
```

**Response:**
```json
{
  "success": true,
  "has_data": true,
  "product": {
    "id": 25,
    "name": "PAPA CRIOLLA",
    "category": "Tubérculos"
  },
  "user_price": 5500,
  "market_avg_price": 4300,
  "market_min_price": 3800,
  "market_max_price": 5200,
  "difference_percentage": 27.91,
  "recommendation_type": "POR_ENCIMA",
  "suggestion_text": "⬆️ Tu precio está algo alto (+27.9%). Promedio de mercado: $4,300. Podrías tener dificultades para vender.",
  "recommendation_color": "yellow",
  "icon": "⬆️",
  "data_points": 156,
  "period_days": 30,
  "normalization": {
    "confidence": 1.0,
    "matched_name": "PAPA CRIOLLA",
    "variation": null
  },
  "recommendation_id": 567
}
```

**Recommendation Types:**
- `MUY_POR_DEBAJO`: User price < -30% vs market (very low)
- `POR_DEBAJO`: User price -30% to -10% vs market (low)
- `EN_RANGO`: User price -10% to +10% vs market (optimal) ✅
- `POR_ENCIMA`: User price +10% to +30% vs market (high)
- `MUY_POR_ENCIMA`: User price > +30% vs market (very high)
- `NO_DATA`: No market data available

---

### 3.2 Get Suggested Price

**GET** `/api/recommendations/suggested-price`

Get optimal price recommendation for a product.

**Query Parameters:**
- `product_name` (required): Product name
- `category` (optional): Product category

**Example Response:**
```json
{
  "success": true,
  "product": {
    "id": 25,
    "name": "PAPA CRIOLLA",
    "category": "Tubérculos"
  },
  "recommended_price": 4300,
  "price_range": {
    "min": 3800,
    "max": 5200,
    "avg": 4300,
    "range": 1400,
    "volatility": 350
  },
  "trend": {
    "trend": "UP",
    "change_percentage": 7.5,
    "recent_avg": 4500,
    "older_avg": 4200,
    "message": "El precio está subiendo (+7.5% en los últimos 7 días)"
  },
  "normalization_confidence": 1.0
}
```

---

### 3.3 Get My Recommendations

**GET** `/api/recommendations/my-recommendations`

Get user's recommendation history.

**Query Parameters:**
- `limit` (optional, default: 20): Results per page
- `page` (optional, default: 1): Page number

**Example Response:**
```json
{
  "success": true,
  "user_id": 123,
  "acceptance_rate": {
    "total_recommendations": 45,
    "accepted": 32,
    "rejected": 13,
    "acceptance_rate": 71.11
  },
  "recommendations": {
    "data": [
      {
        "id": 567,
        "product_catalog": {
          "id": 25,
          "name": "PAPA CRIOLLA"
        },
        "user_price": 5500,
        "market_avg_price": 4300,
        "recommendation_type": "POR_ENCIMA",
        "was_accepted": true,
        "final_price": 4500,
        "created_at": "2025-11-26T10:30:00.000000Z"
      }
    ]
  }
}
```

---

### 3.4 Get Recommendation Statistics

**GET** `/api/recommendations/stats`

Get recommendation statistics (global or per user).

**Query Parameters:**
- `user_id` (optional): Filter by user

**Example Response (Global):**
```json
{
  "success": true,
  "stats": {
    "total_recommendations": 1250,
    "by_type": {
      "EN_RANGO": 450,
      "POR_ENCIMA": 320,
      "POR_DEBAJO": 280,
      "MUY_POR_ENCIMA": 120,
      "MUY_POR_DEBAJO": 80
    },
    "acceptance_rate": {
      "total_recommendations": 856,
      "accepted": 623,
      "rejected": 233,
      "acceptance_rate": 72.78
    }
  }
}
```

---

## 4️⃣ Trends & Analytics API

### 4.1 Market Overview

**GET** `/api/trends/market-overview`

Get comprehensive market statistics.

**Query Parameters:**
- `days` (optional, default: 30): Analysis period

**Example Response:**
```json
{
  "success": true,
  "period_days": 30,
  "from": "2025-10-27",
  "to": "2025-11-26",
  "latest_ingestion": "2025-11-25",
  "overview": {
    "total_products": 120,
    "total_price_records": 3450,
    "average_price": 5600,
    "price_variation_distribution": {
      "Estable": 1850,
      "Subio": 950,
      "Bajo": 650
    },
    "trend_distribution": {
      "STABLE": 65,
      "UP": 35,
      "DOWN": 20
    }
  },
  "categories": [
    {
      "category": "Frutas",
      "product_count": 45
    }
  ]
}
```

---

### 4.2 Product Trend

**GET** `/api/trends/product/{productId}`

Get detailed trend analysis for a specific product.

**Query Parameters:**
- `days` (optional, default: 30): Analysis period

**Example Response:**
```json
{
  "success": true,
  "product": {
    "id": 25,
    "name": "PAPA CRIOLLA"
  },
  "period_days": 30,
  "latest_trend": {
    "id": 123,
    "avg_price": 4300,
    "min_price": 3800,
    "max_price": 5200,
    "price_volatility": 350,
    "trend_direction": "UP",
    "price_change_percentage": 7.5,
    "data_points": 156
  },
  "historical_trends": [...],
  "daily_prices": [...]
}
```

---

### 4.3 Volatile Products

**GET** `/api/trends/volatile-products`

Get products with highest price volatility.

**Query Parameters:**
- `days` (optional, default: 30): Analysis period
- `limit` (optional, default: 20): Max results

**Example Response:**
```json
{
  "success": true,
  "period_days": 30,
  "total": 20,
  "volatile_products": [
    {
      "product": {
        "id": 8,
        "name": "TOMATE CHONTO"
      },
      "avg_volatility": 1250,
      "max_volatility": 2100,
      "avg_change_percentage": 45.5,
      "trend_records": 28
    }
  ]
}
```

---

### 4.4 Increasing/Decreasing Prices

**GET** `/api/trends/increasing-prices`
**GET** `/api/trends/decreasing-prices`

Get products with trending prices.

**Query Parameters:**
- `days` (optional, default: 30): Analysis period
- `limit` (optional, default: 20): Max results

**Example Response:**
```json
{
  "success": true,
  "period_days": 30,
  "total": 15,
  "increasing_products": [
    {
      "product": {
        "id": 25,
        "name": "PAPA CRIOLLA"
      },
      "avg_increase": "12.5%",
      "max_increase": "18.3%",
      "avg_price": 4500
    }
  ]
}
```

---

## 🔐 Authentication

All endpoints require Sanctum authentication except public catalog search.

**Login to get token:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "1|xyz123abc...",
  "user": {...}
}
```

**Use token in subsequent requests:**
```bash
curl -X GET "http://localhost:8000/api/recommendations/my-recommendations" \
  -H "Authorization: Bearer 1|xyz123abc..."
```

---

## 📊 Common Response Codes

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid parameters
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

---

## 🧪 Testing Workflow

### 1. Search for a product:
```bash
GET /api/catalog/search?query=papa+criolla
```

### 2. Get suggested price:
```bash
GET /api/recommendations/suggested-price?product_name=papa+criolla
```

### 3. Check your price:
```bash
POST /api/recommendations/check-price
{
  "product_name": "papa criolla",
  "price_per_kg": 5000
}
```

### 4. View market trends:
```bash
GET /api/trends/market-overview
```

---

## 📝 Notes

- All prices are in COP (Colombian Pesos)
- Dates are in ISO 8601 format (YYYY-MM-DD)
- Product names are normalized to uppercase
- Similarity scores range from 0.0 to 1.0
- Confidence thresholds: ≥0.9 (high), 0.7-0.9 (medium), <0.7 (low)

---

## 🚀 Next Steps

1. Import Postman collection: `MAI_Intelligent_Pricing.postman_collection.json`
2. Configure environment variables
3. Test core recommendation flow
4. Integrate with frontend components

**Support**: For issues, contact the MAI development team.
