# PayTabs Testing Guide

## Prerequisites

1. **Install ngrok** (if not installed):
   ```bash
   brew install ngrok
   # OR download from: https://ngrok.com/download
   ```

2. **PayTabs credentials configured** in `.env`:
   ```
   PAYTABS_PROFILE_ID=your_profile_id
   PAYTABS_SERVER_KEY=your_server_key
   ```

## Quick Start (Automated)

```bash
./test-paytabs.sh
```

Follow the instructions printed by the script.

## Manual Testing

### 1. Start Services

```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: ngrok
ngrok http 8000
```

### 2. Get ngrok URL

Copy the HTTPS URL from ngrok output (e.g., `https://abc123.ngrok.io`)

### 3. Update .env

```bash
# Replace YOUR-NGROK-URL with actual URL
PAYTABS_CALLBACK_URL=https://YOUR-NGROK-URL.ngrok.io/api/paytabs/webhook
APP_URL=https://YOUR-NGROK-URL.ngrok.io
```

### 4. Clear Config

```bash
php artisan config:clear
```

### 5. Test Payment Flow

#### Registration Test (AED 100)
1. Open: `https://YOUR-NGROK-URL.ngrok.io/register`
2. Create account
3. Login
4. Navigate to: **Rider Registrations** (sidebar)
5. Click **Create New**
6. Fill form:
   - Rider Name: Test Rider
   - Date of Birth: 1990-01-01
   - Nationality: ARE
   - Discipline & Category: Select any
7. Submit
8. **PayTabs payment page** opens
9. Use test card:
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date
10. Complete payment
11. Should redirect back
12. Check **Rider Registrations** list - status should be "Completed"

#### Renewal Test (AED 50)
1. Sidebar → **Rider Renewals** → **Create New**
2. Select Rider & Season
3. Submit → Pay with test card
4. Verify in list

#### Show Jumping Test (AED 150)
1. Sidebar → **Competition Entries** → **Create New**
2. Select Rider, Horse, Event, Class
3. Submit → Pay with test card
4. Verify in list

### 6. Monitor Logs

```bash
# Terminal 3: Logs
tail -f storage/logs/laravel.log
```

Watch for:
- Payment initiation logs
- PayTabs webhook callback
- SOAP service calls
- Database inserts

## Test Cards

### Successful Payment
- **Card**: 4111 1111 1111 1111
- **CVV**: 123
- **Expiry**: 12/25 (any future date)

### Failed Payment
- **Card**: 4000 0000 0000 0002
- **CVV**: 123
- **Expiry**: 12/25

More test cards: https://support.paytabs.com/en/support/solutions/articles/60000710214

## Search Testing

1. Create multiple registrations
2. Go to **Rider Registrations** list
3. Use search box:
   - Search by rider name: "Ahmed"
   - Search by transaction: "TST1784"
4. Results update in real-time (300ms debounce)

## Expected Behavior

### Success Flow
1. Form submission → Pending record created in DB
2. Redirect to PayTabs payment page
3. Payment completed → PayTabs sends webhook
4. Webhook verified → SOAP service called
5. Record updated to "Completed"
6. User redirected to return URL

### Webhook Logs (Success)
```
[info] PayTabs webhook received cart_id=rider_reg_123 tran_ref=TST...
[info] Processing rider registration...
[info] SOAP service returned success
[info] Registration marked as completed
```

### Failure Flow
1. If payment fails → Status remains "Pending"
2. If webhook signature invalid → 400 error logged
3. If duplicate webhook → "already_processed" response

## Troubleshooting

### Webhook not receiving
- Check ngrok is running: `http://localhost:4040`
- Verify APP_URL and PAYTABS_CALLBACK_URL in .env
- Run `php artisan config:clear`
- Check PayTabs dashboard webhook logs

### Payment page not loading
- Verify credentials in .env
- Check logs for API errors
- Confirm profile ID is correct

### Database errors
- Ensure MSSQL connection is configured
- Check tables exist
- Verify user_id foreign keys

## Clean Up

```bash
# Stop ngrok
pkill ngrok

# Stop Laravel
pkill -f "php artisan serve"
```

## Production Checklist

Before going live:
- [ ] Replace test credentials with production keys
- [ ] Update PAYTABS_CALLBACK_URL to production domain
- [ ] Update PAYTABS_RETURN_URL to production domain
- [ ] Remove test card numbers from code
- [ ] Enable HTTPS only
- [ ] Set up proper error monitoring
- [ ] Test with real MSSQL database
- [ ] Verify SOAP endpoints are production URLs
