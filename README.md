# UAEERF Equestrian Portal - Technical Assessment

[![Laravel](https://img.shields.io/badge/Laravel-13.17-FF2D20?logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php)](https://php.net)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://typescriptlang.org)

Full-stack equestrian portal replicating key UAEERF functionality with MSSQL, SOAP web services, and PayTabs payment integration.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Architecture](#-architecture)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Implemented

✅ **Task 0: Reconnaissance & Discovery**
- SOAP endpoint testing
- MSSQL connectivity validation
- Complete technical documentation

✅ **Task 1: Identity & Access Management**
- User registration → `UserProfile` (MSSQL)
- User login (Fortify authentication)
- Backend SOAP authentication

✅ **Task 2: Data Orchestration**
- City & Division lists via SOAP
- 24-hour caching strategy
- REST API endpoints

✅ **Task 3: Rider Registration + PayTabs**
- New rider registration (AED 100)
- Rider renewal (AED 50)
- Payment → SOAP → Database flow

✅ **Task 4: Show Jumping Entry System**
- Rider + horse eligibility validation
- Payment-gated entry (AED 150)
- `ClassEntriesWeb` insert with transaction reference

### Architecture Highlights

🔒 **Payment Security:** Webhook verification, payment-before-database-write  
🌐 **SOAP Integration:** 8 services, authenticated calls, response caching  
💾 **Dual Database:** SQLite (auth) + MSSQL (business data)  
⚡ **Modern Stack:** React 19, Inertia.js, Tailwind CSS 4

---

## 🛠 Tech Stack

### Backend
- **Framework:** Laravel 13.17
- **PHP:** 8.3.16
- **Database:** SQLite (local) + MSSQL Server (external)
- **Authentication:** Laravel Fortify + Passkeys
- **SOAP:** Native PHP `SoapClient`
- **HTTP Client:** Guzzle

### Frontend
- **Framework:** React 19.2
- **Language:** TypeScript 5.7
- **Routing:** Inertia.js 3.0
- **Styling:** Tailwind CSS 4.0
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React

### External Services
- **SOAP APIs:** UAEERF Web Services (8 endpoints)
- **Payment Gateway:** PayTabs Sandbox
- **Database:** MSSQL Server ([REDACTED])

---

## 📦 Prerequisites

### Required

- **PHP:** >= 8.3
- **Composer:** >= 2.0
- **Node.js:** >= 20.x
- **npm/pnpm:** Latest
- **Git:** Latest

### MSSQL Driver (Required for production)

```bash
# macOS
brew install msodbcsql18 mssql-tools18
pecl install sqlsrv pdo_sqlsrv

# Ubuntu/Debian
sudo apt-get install msodbcsql18
sudo pecl install sqlsrv pdo_sqlsrv
```

**Full guide:** [`docs/MSSQL-DRIVER-INSTALL.md`](docs/MSSQL-DRIVER-INSTALL.md)

> ⚠️ **Note:** Application works without MSSQL driver (SQLite fallback), but production deployment requires it.

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd uaeerf
```

### 2. Install Dependencies

```bash
# PHP dependencies
composer install

# Node dependencies
npm install
# or
pnpm install
```

### 3. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configure Environment

Edit `.env`:

```bash
# Application
APP_URL=http://localhost:8000

# MSSQL Database
MSSQL_HOST=[REDACTED]\DEVSQL,50441
MSSQL_PORT=50441
MSSQL_DATABASE=EEFRegistration
MSSQL_USERNAME=[REDACTED]
MSSQL_PASSWORD=[REDACTED]

# SOAP Authentication
SOAP_AUTH_USERNAME=[REDACTED]
SOAP_AUTH_PASSWORD=[REDACTED]

# PayTabs Sandbox
PAYTABS_PROFILE_ID=your_profile_id
PAYTABS_SERVER_KEY=your_server_key
```

### 5. Database Migration

```bash
# SQLite (local)
touch database/database.sqlite
php artisan migrate
```

### 6. Build Assets

```bash
npm run build
# or for development
npm run dev
```

---

## ⚙️ Configuration

### PayTabs Setup

1. **Create Sandbox Account:** https://site.paytabs.com/
2. **Get Credentials:** Dashboard → Developers → API Keys
3. **Update `.env`:**
   ```bash
   PAYTABS_PROFILE_ID=12345
   PAYTABS_SERVER_KEY=SJJNxxxxxxxxx
   ```

**Test Cards (Sandbox):**
```
Success: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
```

### SOAP Endpoints

All SOAP services pre-configured in `.env`:

```bash
SOAP_AUTH_URL=http://[REDACTED]/webservices/WSAuthentication.asmx
SOAP_COMMONS_URL=http://[REDACTED]/webservices/WSCommons.asmx
SOAP_REGISTRATIONS_URL=http://[REDACTED]/webservices/WSRegistrations.asmx
SOAP_JUMPING_CRITERIA_URL=http://[REDACTED]/webservices/ShowJumpingCriteria.asmx
```

**Test Connection:**
```bash
php test-soap-auth.php
php test-soap-lists.php
```

---

## 🗄 Database Setup

### SQLite (Local Development)

Used for:
- User authentication (`users`)
- Payment tracking (`payment_transactions`)
- Pending registrations (`rider_registrations`, `show_jumping_entries`)

**Schema:** Auto-created via migrations

### MSSQL (Production Database)

Used for:
- User profiles (`UserProfile`)
- Show jumping entries (`ClassEntriesWeb`)

**Connection String:**
```
Server: [REDACTED]\DEVSQL,50441
Database: EEFRegistration
User: [REDACTED]
Password: [REDACTED]
```

**Test Connection:**
```bash
php test-mssql.php
```

**Expected Output:**
```
✓ Connection successful
=== Available Tables ===
dbo.UserProfile
dbo.ClassEntriesWeb
...
```

---

## 🏃 Running the Application

### Development Server

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server
npm run dev
```

**Access:** http://localhost:8000

### Production Build

```bash
npm run build
php artisan optimize
php artisan config:cache
php artisan route:cache
```

---

## 🌐 API Endpoints

### Public Endpoints

```bash
GET  /api/commons/cities           # City list (cached)
GET  /api/commons/divisions        # Division levels (cached)
GET  /api/commons/categories       # Categories (cached)
GET  /api/commons/countries        # Country list (cached)
GET  /api/commons/all              # All common data
```

**Example:**
```bash
curl http://localhost:8000/api/commons/cities
```

**Response:**
```json
{
  "success": true,
  "data": [
    {"Code": 1, "Name": "Abu Dhabi"},
    {"Code": 2, "Name": "Dubai"},
    {"Code": 3, "Name": "Sharjah"}
  ]
}
```

### Protected Endpoints (Auth Required)

```bash
POST /rider/register              # Rider registration (→ PayTabs AED 100)
POST /rider/renew                 # Rider renewal (→ PayTabs AED 50)
POST /jumping/validate            # Check eligibility
POST /jumping/entry               # Create entry (→ PayTabs AED 150)
```

### Webhooks

```bash
POST /api/paytabs/webhook         # PayTabs IPN (signature verified)
GET|POST /api/payment/return      # User return URL (stateless, PRG)
```

---

## 🧪 Testing

### Automated Tests

```bash
php artisan test
```

**68 tests / 215 assertions** covering:
- Registration validation (phone, city, password, unique email, DOB rules)
- Payment webhook security: HMAC signature (raw body), idempotency, declined vs authorised paths
- SOAP success/rejection handling for registrations **and** renewals (mocked SOAP)
- Payment return pages (PRG redirect, pending/success/failed views)
- Rider search endpoint (auth, validation, SOAP failure handling)
- Login verified against MSSQL `UserProfile` (mismatch denies login)

MSSQL is faked as in-memory SQLite per test — the suite runs with **zero external dependencies**.

### Manual Testing Flow

#### 1. User Registration

```bash
# Web UI
http://localhost:8000/register

# Fields
Name: Test User
Email: test@example.com
Password: password123
Phone: +971501234567
City: Dubai
```

#### 2. Common Lists

```bash
curl http://localhost:8000/api/commons/all | jq
```

#### 3. Rider Registration (with mock payment)

Since PayTabs requires credentials:

```bash
# Create test webhook handler
php artisan tinker

# Simulate successful payment
$webhook = [
    'tran_ref' => 'TEST_'.uniqid(),
    'cart_id' => 'rider_reg_1_test123',
    'cart_amount' => 100,
    'cart_currency' => 'AED',
    'payment_result' => ['response_status' => 'A']
];

app(\App\Http\Controllers\PayTabsController::class)->webhook(
    new \Illuminate\Http\Request($webhook)
);
```

#### 4. SOAP Integration Tests

```bash
# Test SOAP auth
php test-soap-auth.php

# Test common lists
php test-soap-lists.php

# Test MSSQL connection
php test-mssql.php
```

### Automated Tests

```bash
# PHPUnit
php artisan test

# Pest (if configured)
./vendor/bin/pest
```

---

## 🏗 Architecture

**Full documentation:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

### High-Level Flow

```
User → Laravel Controller → Service Layer → External API
                           ↓
                     Database Layer
                     (SQLite + MSSQL)
```

### Payment Flow (Critical)

```
1. User submits form
2. Laravel creates payment (PayTabs)
3. User redirected to PayTabs hosted page
4. User completes payment
5. PayTabs webhook → Laravel (SIGNATURE VERIFIED)
6. Payment confirmed → Database write
7. SOAP call (if applicable)
8. User redirected back (return URL)
```

**Rule:** Database write happens ONLY after webhook confirms payment.

### Directory Structure

```
app/
├── Actions/Fortify/              # User creation actions
├── Http/Controllers/
│   ├── Api/CommonsController.php
│   ├── PayTabsController.php
│   ├── RiderController.php
│   └── ShowJumpingController.php
├── Models/
│   ├── User.php
│   └── UserProfile.php           # MSSQL model
└── Services/
    ├── PayTabsService.php
    └── Soap/                     # SOAP client services
        ├── BaseSoapClient.php
        ├── AuthenticationService.php
        ├── CommonsService.php
        ├── RegistrationsService.php
        └── ShowJumpingCriteriaService.php

database/migrations/              # Schema definitions
docs/                            # Technical documentation
resources/js/                    # React frontend
routes/
├── api.php                      # API routes
└── web.php                      # Web routes
```

---

## 🔒 Security

### Implemented

✅ **Payment Security**
- Webhook signature verification
- Idempotency (same cart_id processed once)
- Payment-before-database-write

✅ **Authentication**
- Laravel Fortify
- Password hashing (bcrypt)
- Session-based auth

✅ **Input Validation**
- Form request validation
- SOAP input sanitization
- SQL injection prevention (Query Builder)

✅ **Configuration**
- No credentials in git (`.env` in `.gitignore`)
- Separate SOAP system credentials

### Best Practices

🔐 **Never commit:**
- `.env` file
- PayTabs credentials
- MSSQL passwords

🔐 **Production checklist:**
- [ ] Enable HTTPS
- [ ] Update `APP_KEY`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure rate limiting
- [ ] Enable CSRF protection
- [ ] Whitelist webhook IPs

---

## 🐛 Troubleshooting

### MSSQL Connection Failed

**Error:** `SQLSTATE[01002] Adaptive Server connection failed`

**Solution:**
```bash
# Check driver installed
php -m | grep sqlsrv

# If missing
pecl install sqlsrv pdo_sqlsrv

# Add to php.ini
extension=sqlsrv.so
extension=pdo_sqlsrv.so

# Restart PHP
sudo systemctl restart php8.3-fpm
```

**See:** [`docs/MSSQL-DRIVER-INSTALL.md`](docs/MSSQL-DRIVER-INSTALL.md)

### SOAP Call Timeout

**Error:** `SoapFault: Could not connect to host`

**Check:**
```bash
# Test SOAP endpoint reachability
curl -I http://[REDACTED]/webservices/WSAuthentication.asmx
```

**Solution:** Increase timeout in `BaseSoapClient.php`:
```php
'connection_timeout' => 30, // increased from 15
```

### PayTabs Webhook Not Received

**Check:**
```bash
# Webhook URL must be publicly accessible
# Use ngrok for local testing
ngrok http 8000

# Update PAYTABS_CALLBACK_URL in .env
PAYTABS_CALLBACK_URL=https://your-ngrok-url.app/api/paytabs/webhook
```

### Cache Issues

```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Clear SOAP common lists cache
curl -X POST http://localhost:8000/api/admin/commons/clear-cache \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Documentation

- **Architecture:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **Reconnaissance:** [`docs/TASK-0-RECONNAISSANCE.md`](docs/TASK-0-RECONNAISSANCE.md)
- **MSSQL Setup:** [`docs/MSSQL-DRIVER-INSTALL.md`](docs/MSSQL-DRIVER-INSTALL.md)
- **SOAP WSDLs:** [`docs/soap-wsdl/`](docs/soap-wsdl/)

---

## 🎯 Assessment Completion Checklist

- [x] Task 0: Reconnaissance & technical discovery
- [x] Task 1: User registration & login
- [x] Task 2: Common lists with caching
- [x] Task 3: Rider registration + renewal (PayTabs)
- [x] Task 4: Show jumping entry system
- [x] SOAP integration (8 services)
- [x] PayTabs integration (webhook + return URL)
- [x] MSSQL configuration
- [x] Architecture diagram
- [x] Security implementation
- [x] Documentation

**Payment Amounts Implemented:**
- ✅ New Rider Registration: AED 100
- ✅ Rider Renewal: AED 50
- ✅ Show Jumping Entry: AED 150

**Critical Rules Followed:**
- ✅ Payment confirmation before database write
- ✅ Webhook as source of truth
- ✅ Transaction reference stored with entries

---

## 🤝 Submission Notes

### What Works (live-verified end-to-end)

✅ SOAP authentication handshake (enforced before every service call, cached 1h)  
✅ Common lists via authenticated SOAP, cached 24h (cities, countries, genders, disciplines, categories, seasons, visa categories)  
✅ User registration (dual-write: Laravel users + MSSQL UserProfile)  
✅ Login verified against MSSQL UserProfile (password mismatch denies login)  
✅ Full PayTabs flow: hosted page → signed webhook → idempotent transaction persistence → SOAP submission → status update  
✅ Portal-parity athlete registration form (visa category, Emirates ID, name split, weight, season/FEI options)  
✅ Rider renewal with live rider lookup (WSRiders SearchRiderList type-ahead)  
✅ Show jumping eligibility validation (real IsRiderEligible/IsHorseEligible parsing)  
✅ 68 automated tests / 215 assertions  

### Known Environment Limitation

⚠️ `Submit_PersonNewRegistration` on WS_TEST returns **"Invalid User ID" for every UserId** —
verified with a fresh server-confirmed session against the assessment portal account
(UserID 6422) and all PersonType values. All other field validations pass. This is
server-side permissioning for the WS_TEST account; rejection messages are captured in
`rider_registrations.error_message`. Raised with the UAEERF technical contact.
See `docs/ARCHITECTURE.md` for full evidence.

Deferred by scope: profile-photo upload (`Submit_Document`).

### What Requires Credentials

⚠️ **PayTabs:** Sandbox account needed for live payment testing  
⚠️ **MSSQL Driver:** Production deployment requires `sqlsrv` extension  

### Testing Without PayTabs

Code complete, can test via:
1. Mock webhook calls (see Testing section)
2. Review payment logic in `PayTabsService.php`
3. Check database schema & flows

---

## 📞 Support

**Technical Questions:**
- Review documentation in `/docs`
- Check test scripts (`test-*.php`)
- See architecture diagrams

**Assessment Contact:**
- Submit via repository
- Include setup instructions
- Note any blockers (e.g., PayTabs signup)

---

## 📄 License

Private assessment project - not for public distribution.

---

**Built with** ❤️ **for UAEERF Technical Assessment**  
**Completion Date:** 2026-07-23
