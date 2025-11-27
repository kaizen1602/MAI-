# 🔄 n8n Setup Guide - MAI Intelligent Pricing Module

## 📋 Overview

This guide explains how to configure n8n workflows for the MAI Intelligent Pricing Module. We use two main workflows:

1. **Daily Corabastos Ingestion** - Automated PDF extraction and data insertion
2. **Real-Time Price Recommendation** - Triggered when users create posts

---

## 🚀 Prerequisites

- n8n installed (self-hosted or cloud)
- Claude API credentials (Anthropic)
- MAI backend accessible from n8n
- Email SMTP credentials (for notifications)
- Slack webhook (optional, for monitoring)

---

## 📦 Installation

### Step 1: Import Workflows

1. Open n8n web interface
2. Go to **Workflows** → **Import from File**
3. Import both JSON files:
   - `corabastos_daily_ingestion.json`
   - `realtime_price_recommendation.json`

### Step 2: Configure Credentials

#### 2.1 Claude API (Anthropic)

1. Go to **Settings** → **Credentials** → **Create New**
2. Select **Anthropic API**
3. Enter your credentials:
   - **Name**: `Claude API - MAI`
   - **API Key**: `sk-ant-api03-...` (from Anthropic Console)

**Getting Claude API Key:**
1. Visit https://console.anthropic.com/
2. Navigate to **API Keys**
3. Create new key with name "MAI Production"
4. Copy the key (starts with `sk-ant-`)

#### 2.2 HTTP Header Auth (MAI Backend)

1. Create new credential: **HTTP Header Auth**
2. Enter:
   - **Name**: `MAI Backend Auth`
   - **Header Name**: `Authorization`
   - **Header Value**: `Bearer {your_backend_api_token}`

**Generating Backend API Token:**
```bash
# SSH into backend container
docker exec -it mai-backend bash

# Generate token via tinker
php artisan tinker

# In tinker console:
$user = User::where('email', 'admin@mai.com')->first();
$token = $user->createToken('n8n-integration')->plainTextToken;
echo $token;
```

Copy the generated token and use it in the credential.

#### 2.3 Email Send (SMTP)

1. Create new credential: **SMTP**
2. Enter your SMTP details:
   - **Host**: `smtp.gmail.com` (or your provider)
   - **Port**: `587`
   - **User**: `your-email@gmail.com`
   - **Password**: `your-app-password`
   - **From Email**: `noreply@mai.com`

**Gmail App Password Setup:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to **App Passwords**
4. Generate password for "n8n MAI"
5. Copy the 16-character password

#### 2.4 Slack (Optional)

1. Create new credential: **Slack API**
2. Enter:
   - **Access Token**: `xoxb-...` (Slack Bot Token)
   - **Base URL**: `https://slack.com/api`

**Getting Slack Token:**
1. Go to https://api.slack.com/apps
2. Create new app "MAI Alerts"
3. Enable **Bot Token Scopes**: `chat:write`, `chat:write.public`
4. Install app to workspace
5. Copy **Bot User OAuth Token**

---

## ⚙️ Workflow 1: Daily Corabastos Ingestion

### Overview

This workflow runs daily at 8:00 AM to:
1. Download latest Corabastos PDF bulletin
2. Extract all product prices using Claude AI
3. Insert data into MAI database
4. Calculate price trends
5. Send alerts if errors occur

### Configuration Steps

#### Node 1: Schedule Trigger

- **Trigger Type**: Cron
- **Cron Expression**: `0 8 * * *` (every day at 8:00 AM)
- **Timezone**: `America/Bogota`

#### Node 2: Download Latest PDF

**Important**: Update the URL to match Corabastos actual download link.

Current configuration:
```
URL: https://www.corabastos.com.co/BoletinesDiarios/
Method: GET
Response Format: File (binary)
```

**Finding the correct URL:**
1. Visit Corabastos website
2. Navigate to daily bulletins section
3. Inspect the download link
4. Update the URL in the node

Alternative: If PDF is received via email, replace this node with an **Email Trigger** node.

#### Node 3: Claude - Extract Prices

**Credential**: Select `Claude API - MAI`

**Model**: `claude-sonnet-4-5-20250929`

**Prompt**: (Already configured in JSON)

The prompt instructs Claude to:
- Extract ALL products from PDF
- Identify 10 categories
- Return ONLY valid JSON (no explanations)
- Include price variations (Estable/Bajo/Subio)

**Testing the extraction:**
1. Manually trigger workflow
2. Check execution log
3. Verify JSON output structure
4. Ensure all ~175 products are extracted

#### Node 4: Transform Data

JavaScript code that:
- Parses Claude's JSON response
- Handles cases where Claude adds explanation text
- Transforms to database-ready format
- Validates data types (parseFloat for numbers)

No configuration needed.

#### Node 5: Split Products

Splits the array of products into individual items for batch insertion.

**Mode**: Raw JSON
**Path**: `products`

#### Node 6: Insert to Database

**Credential**: Select `MAI Backend Auth`

**URL**: `http://backend:8000/api/market-prices`
(Update host if MAI backend is on different server)

**Important**: Each product is normalized automatically by the backend API using the `ProductNormalizationService`.

**Error Handling**: The API returns success/failure for each product. Failed products are collected in the next node.

#### Node 7: Aggregate Results

Collects all insertion responses and creates a summary:
- Total processed
- Successful insertions
- Failed insertions
- Success rate
- List of failed products with errors

#### Node 8: Check Failures

Conditional logic: If `failed_insertions > 0`, branch to alert node.

#### Node 9: Send Slack Alert (Optional)

**Credential**: Select `Slack API`

**Channel**: `#mai-alerts` (create this channel in Slack)

Sends formatted message with error details.

To disable: Simply delete this node and the "Check Failures" node.

#### Node 10: Calculate Trends

Triggers the trend calculation endpoint after data insertion.

**URL**: `http://backend:8000/api/market-prices/calculate-trends`

This calculates:
- Average prices (30-day)
- Price volatility
- Trend direction (UP/DOWN/STABLE)
- Price change percentages

#### Node 11: Log to Airtable (Optional)

**Credential**: Create **Airtable** credential

Logs ingestion results to Airtable for tracking and dashboards.

To disable: Delete this node.

**Airtable Setup:**
1. Create base "MAI Ingestion Logs"
2. Create table with columns: date, total_products, successful, failed, success_rate, errors
3. Get API key from Airtable account settings
4. Get base ID from URL

---

## ⚡ Workflow 2: Real-Time Price Recommendation

### Overview

This workflow triggers when users create product posts to:
1. Receive webhook from MAI backend
2. Get price recommendation from API
3. Send email notification to user (if price not optimal)
4. Update post with recommendation
5. Log to Slack (optional)

### Configuration Steps

#### Node 1: Webhook - Post Created

**Path**: `mai-post-created`

**Authentication**: Header Auth

**Full Webhook URL**: `https://your-n8n-instance.com/webhook/mai-post-created`

**Expected Payload:**
```json
{
  "post_id": 123,
  "user_id": 456,
  "user_email": "user@example.com",
  "user_name": "Juan Pérez",
  "product_name": "Papa criolla",
  "price_per_kg": 5000,
  "category": "Tubérculos"
}
```

**Backend Integration:**

Add this to `PostController.php` after post creation:

```php
// After successful post creation
try {
    Http::timeout(5)->post(env('N8N_WEBHOOK_URL'), [
        'post_id' => $post->post_id,
        'user_id' => $user->user_id,
        'user_email' => $user->email,
        'user_name' => $user->name,
        'product_name' => $post->product_name,
        'price_per_kg' => $post->price_per_kg,
        'category' => $post->category
    ]);
} catch (\Exception $e) {
    // Log error but don't fail post creation
    Log::warning('n8n webhook failed: ' . $e->getMessage());
}
```

Add to `.env`:
```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/mai-post-created
```

#### Node 2: Extract Post Data

No configuration needed. Validates and extracts webhook data.

#### Node 3: Get Price Recommendation

**Credential**: Select `MAI Backend Auth`

**URL**: `http://backend:8000/api/recommendations/check-price`

Calls the recommendation API with product name and price.

#### Node 4: Check Success

Validates API response. If successful, proceeds to notification. If failed, returns error.

#### Node 5: Prepare Notification

Combines post data with recommendation for email template.

#### Node 6: Should Send Alert?

Only sends email if recommendation type is NOT "EN_RANGO" (optimal).

Skips email for optimal prices to avoid spam.

#### Node 7: Send Email Recommendation

**Credential**: Select `SMTP`

**Email Template**: Beautiful HTML email with:
- Price comparison card
- Recommendation message
- Color-coded alert level
- CTA button to view post

**Customization:**
- Update logo URL
- Adjust colors to match MAI branding
- Modify text as needed

#### Node 8: Update Post with Recommendation

Stores the recommendation type back in the post record for future reference.

**Fields Updated:**
- `price_recommendation_type`
- `market_comparison_performed`

#### Node 9: Log to Slack (Optional)

Logs all recommendations to Slack for monitoring user behavior and recommendation effectiveness.

#### Node 10: Respond Success/Error

Returns response to webhook caller to confirm processing.

---

## 🧪 Testing Workflows

### Test Daily Ingestion

1. Open workflow "Corabastos Daily Price Ingestion"
2. Click **Execute Workflow** (manual trigger)
3. Use a sample PDF bulletin
4. Monitor execution logs
5. Verify data in database:

```sql
SELECT COUNT(*) FROM market_prices WHERE DATE(created_at) = CURDATE();
```

Expected: ~175 new records

### Test Real-Time Recommendation

**Using Postman:**

```bash
POST https://your-n8n-instance.com/webhook/mai-post-created
Content-Type: application/json

{
  "post_id": 999,
  "user_id": 1,
  "user_email": "test@example.com",
  "user_name": "Test User",
  "product_name": "papa criolla",
  "price_per_kg": 6000,
  "category": "Tubérculos"
}
```

**Expected Results:**
1. Email received (if price not optimal)
2. Recommendation logged in database
3. Webhook returns success response
4. Slack notification (if enabled)

---

## 📊 Monitoring & Maintenance

### Execution History

View in n8n:
1. Go to **Executions**
2. Filter by workflow
3. Check success/failure rates

### Common Issues

**Issue: Claude returns invalid JSON**

Solution: The "Transform Data" node handles this with regex extraction. If persisting, refine the Claude prompt.

**Issue: Products not matching catalog**

Solution: Check normalization confidence scores. Add aliases to products in catalog:

```bash
POST /api/catalog/products/{id}/aliases
{
  "aliases": ["papa criolla sucia", "criolla"]
}
```

**Issue: Webhook not triggering**

Solutions:
- Check n8n logs: `docker logs n8n`
- Verify webhook URL in backend .env
- Test with Postman first
- Check firewall/network settings

**Issue: Email not sending**

Solutions:
- Verify SMTP credentials
- Check spam folder
- Test SMTP connection separately
- Use service like SendGrid for production

### Performance Optimization

**Daily Ingestion:**
- Runs once daily: Low resource usage
- Average execution time: 2-3 minutes
- Claude API calls: 1 per execution
- Database inserts: ~175 per execution

**Real-Time Recommendation:**
- Triggered per post creation
- Average execution time: 2-5 seconds
- API calls: 1 per trigger
- Email sends: Only for non-optimal prices (~60% of posts)

### Scaling Considerations

If processing > 1000 posts/day:
- Consider queuing webhook calls
- Batch email notifications
- Cache product normalization results
- Use dedicated n8n instance

---

## 🔒 Security Best Practices

1. **API Tokens**: Rotate every 90 days
2. **Webhook Auth**: Always use header authentication
3. **SMTP**: Use app-specific passwords, never main password
4. **Environment Variables**: Store sensitive data in n8n credentials, not hardcoded
5. **Network**: Restrict n8n access to backend via firewall rules
6. **Backups**: Export workflows weekly

---

## 📈 Advanced Features

### Add SMS Notifications

Install Twilio node:
1. Add Twilio credential
2. Add SMS node after email node
3. Send SMS for VERY_HIGH/VERY_LOW recommendations

### Add WhatsApp Integration

Use Twilio WhatsApp or Meta Business API:
1. Configure WhatsApp credential
2. Send rich media messages with price charts
3. Allow users to respond directly

### Integrate Analytics

Forward recommendation data to Google Analytics or Mixpanel:
1. Add HTTP Request node
2. Track events: recommendation_sent, recommendation_accepted
3. Analyze conversion rates

---

## 🆘 Support & Troubleshooting

**n8n Community**: https://community.n8n.io/
**Claude API Docs**: https://docs.anthropic.com/
**MAI Team**: Contact backend team for API issues

---

## 📝 Changelog

- **2025-11-26**: Initial workflow creation
- Add future updates here

---

**Next Steps**: After setup, proceed to frontend integration (Phase 3).
