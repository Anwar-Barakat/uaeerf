# UAEERF Portal - System Architecture

## Overview

Full-stack equestrian portal integrating MSSQL database, SOAP web services, and PayTabs payment gateway.

**Stack:** Laravel 13 + React 19 + Inertia.js + MSSQL + SOAP + PayTabs

---

## High-Level Architecture

```mermaid
graph TB
    User[User Browser]
    
    subgraph "Laravel Application"
        Web[Web Routes<br/>Inertia Pages]
        API[API Routes<br/>REST Endpoints]
        Auth[Fortify Auth]
        Controllers[Controllers]
        Services[Service Layer]
        
        subgraph "Services"
            SOAP[SOAP Services]
            PayTabs[PayTabs Service]
        end
        
        subgraph "Data Layer"
            MSSQL[(MSSQL Database<br/>UserProfile<br/>Payments<br/>Registrations<br/>ClassEntriesWeb)]
        end
    end
    
    subgraph "External Systems"
        SoapAPI[UAEERF SOAP APIs<br/>WSAuthentication<br/>WSRegistrations<br/>WSCommons<br/>ShowJumpingCriteria]
        PayTabsGW[PayTabs Gateway<br/>Payment Processing]
    end
    
    User -->|HTTP/HTTPS| Web
    User -->|AJAX/Fetch| API
    Web --> Auth
    API --> Controllers
    Controllers --> Services
    Services --> SOAP
    Services --> PayTabs
    Services --> MSSQL
    SOAP -->|SOAP/XML| SoapAPI
    PayTabs -->|REST/JSON| PayTabsGW
    PayTabsGW -->|Webhook| API
```

---

## Component Breakdown

### Frontend Layer

**Technology:** React 19 + TypeScript + Inertia.js + Tailwind CSS 4

```
resources/js/
├── Pages/           # Inertia page components
│   ├── welcome.tsx
│   └── dashboard.tsx
└── Components/      # Reusable UI components
    └── ui/          # shadcn/radix components
```

**Responsibilities:**
- User interface rendering
- Form validation (client-side)
- API calls via Inertia/Axios
- Real-time feedback

---

### Backend Layer

#### Controllers

```
app/Http/Controllers/
├── Api/
│   └── CommonsController.php      # City/Division lists
├── PayTabsController.php          # Payment webhook + return
├── RiderController.php            # Rider reg/renewal
└── ShowJumpingController.php      # Entry validation + payment
```

**Responsibilities:**
- Request validation
- Business logic orchestration
- Response formatting

#### Service Layer

```
app/Services/
├── PayTabsService.php             # Payment gateway integration
└── Soap/
    ├── BaseSoapClient.php         # SOAP base class
    ├── AuthenticationService.php  # SOAP auth
    ├── CommonsService.php         # Common lists
    ├── RegistrationsService.php   # Rider/horse registration
    └── ShowJumpingCriteriaService.php # Eligibility validation
```

**Responsibilities:**
- External API integration
- Data transformation
- Error handling
- Caching strategy

---

## Data Flow Diagrams

### Flow 1: User Registration

```mermaid
sequenceDiagram
    participant U as User
    participant L as Laravel
    participant M as MSSQL
    
    U->>L: POST /register
    L->>L: Validate input
    L->>M: Insert User + UserProfile
    M-->>L: User created
    L->>U: Redirect to dashboard
```

**Key Points:**
- Single database (MSSQL only)
- User authentication via Laravel Fortify
- UserProfile stored in MSSQL
- SQLite used only for unit testing

---

### Flow 2: Rider Registration with Payment

```mermaid
sequenceDiagram
    participant U as User
    participant L as Laravel
    participant PT as PayTabs
    participant SOAP as SOAP API
    participant M as MSSQL
    
    U->>L: Submit rider form
    L->>L: Validate + store pending (rider_registrations)
    L->>PT: Create payment (AED 100)
    PT-->>L: Redirect URL
    L->>U: Redirect to PayTabs
    U->>PT: Complete payment
    PT->>L: Webhook (payment success)
    L->>L: Verify signature
    L->>SOAP: Submit_HorseNewRegistration
    SOAP-->>L: Success response
    L->>M: Update status = completed
    L->>PT: HTTP 200 OK
    PT->>U: Redirect to return URL
    L->>U: Show success page
```

**Critical Rule:** Payment MUST succeed before SOAP call.

**Payment Amounts:**
- New Registration: AED 100
- Renewal: AED 50
- Show Jumping Entry: AED 150

---

### Flow 3: Show Jumping Entry

```mermaid
sequenceDiagram
    participant U as User
    participant L as Laravel
    participant SOAP as ShowJumpingCriteria
    participant PT as PayTabs
    participant M as MSSQL ClassEntriesWeb
    
    U->>L: Submit entry (rider + horse + event)
    L->>SOAP: IsRiderEligible + IsHorseEligible
    SOAP-->>L: Eligibility result
    alt Not eligible
        L->>U: Error: Not eligible
    else Eligible
        L->>L: Store pending (show_jumping_entries)
        L->>PT: Create payment (AED 150)
        PT-->>L: Redirect URL
        L->>U: Redirect to PayTabs
        U->>PT: Complete payment
        PT->>L: Webhook (payment confirmed)
        L->>L: Verify signature
        L->>M: INSERT ClassEntriesWeb + tran_ref
        M-->>L: Success
        L->>L: Update status = completed
        L->>PT: HTTP 200 OK
    end
```

**Critical:** `ClassEntriesWeb` insert happens ONLY after payment webhook confirms success.

---

### Flow 4: Common Lists (Cached)

```mermaid
sequenceDiagram
    participant U as User
    participant L as Laravel
    participant C as Cache
    participant SOAP as WSCommons
    
    U->>L: GET /api/commons/cities
    L->>C: Check cache (key: soap_cities)
    alt Cache hit
        C-->>L: Return cached data
        L->>U: JSON response (cached)
    else Cache miss
        L->>SOAP: getCityList()
        SOAP-->>L: City data (XML/JSON)
        L->>C: Store (TTL: 24h)
        L->>U: JSON response (fresh)
    end
```

**Cache Strategy:**
- TTL: 24 hours
- Keys: `soap_cities`, `soap_divisions`, `soap_disciplines`, etc.
- Manual invalidation: `POST /api/admin/commons/clear-cache`

---

## Database Schema

### MSSQL (Production Database)

**Note:** SQLite is used only for unit testing. All production data is stored in MSSQL.

```sql
-- UserProfile (user master data)
-- [WEBSQL].[EEFRegistration].[dbo].[UserProfile]
CREATE TABLE UserProfile (
    UserID INT PRIMARY KEY IDENTITY,
    Email NVARCHAR(255) UNIQUE,
    Password NVARCHAR(255),
    FullName NVARCHAR(255),
    MobileNumber NVARCHAR(20),
    City NVARCHAR(100),
    Country NVARCHAR(3),
    RegistrationDate DATETIME,
    Status NVARCHAR(50)
);

-- ClassEntriesWeb (show jumping entries)
-- CRITICAL: Only written after payment confirmed
CREATE TABLE ClassEntriesWeb (
    EntryID INT PRIMARY KEY IDENTITY,
    RiderID INT,
    HorseID INT,
    EventID INT,
    ClassID INT,
    TransactionReference NVARCHAR(255), -- PayTabs tran_ref
    EntryDate DATETIME,
    Status NVARCHAR(50),
    PaymentAmount DECIMAL(10,2),
    PaymentCurrency NVARCHAR(3),
    CreatedAt DATETIME
);

-- payment_transactions (payment tracking)
CREATE TABLE payment_transactions (
    id INT PRIMARY KEY IDENTITY,
    tran_ref NVARCHAR(255) UNIQUE,
    cart_id NVARCHAR(255) UNIQUE,
    amount DECIMAL(10,2),
    currency NVARCHAR(3),
    status NVARCHAR(50),
    response_code NVARCHAR(50),
    response_message NVARCHAR(MAX),
    webhook_payload NVARCHAR(MAX),
    processed BIT DEFAULT 0,
    processed_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);

-- rider_registrations (pending + completed)
CREATE TABLE rider_registrations (
    id INT PRIMARY KEY IDENTITY,
    user_id INT,
    cart_id NVARCHAR(255) UNIQUE,
    rider_name NVARCHAR(255),
    date_of_birth DATE,
    nationality NVARCHAR(3),
    passport_number NVARCHAR(50),
    discipline_id INT,
    category_id INT,
    status NVARCHAR(50),
    tran_ref NVARCHAR(255),
    soap_response NVARCHAR(MAX),
    completed_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);

-- rider_renewals
CREATE TABLE rider_renewals (
    id INT PRIMARY KEY IDENTITY,
    user_id INT,
    cart_id NVARCHAR(255) UNIQUE,
    rider_id INT,
    season_id INT,
    status NVARCHAR(50),
    tran_ref NVARCHAR(255),
    soap_response NVARCHAR(MAX),
    completed_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);

-- show_jumping_entries
CREATE TABLE show_jumping_entries (
    id INT PRIMARY KEY IDENTITY,
    user_id INT,
    cart_id NVARCHAR(255) UNIQUE,
    rider_id INT,
    horse_id INT,
    event_id INT,
    class_id INT,
    event_name NVARCHAR(255),
    status NVARCHAR(50),
    tran_ref NVARCHAR(255),
    completed_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);
```

---

## SOAP Integration

### Endpoints

| Service | WSDL | Purpose |
|---------|------|---------|
| WSAuthentication | http://wsdev.emiratesequestrian.ae/webservices/WSAuthentication.asmx?WSDL | System login |
| WSCommons | http://wsdev.emiratesequestrian.ae/webservices/WSCommons.asmx?WSDL | Common lists |
| WSRegistrations | http://wsdev.emiratesequestrian.ae/webservices/WSRegistrations.asmx?WSDL | Rider/horse reg |
| ShowJumpingCriteria | http://wsdev.emiratesequestrian.ae/webservices/ShowJumpingCriteria.asmx?WSDL | Eligibility |

### Authentication

```php
// System credentials (not user credentials)
Username: WS_TEST
Password: TEST@0123

// Usage
$authService->login('WS_TEST', 'TEST@0123');
// Response: { Message: "SUCCESSFUL" }
```

### Key Operations

**WSCommons:**
- `getCityList()` → Cities (Abu Dhabi, Dubai, etc.)
- `getJumpingDivisionLevelList()` → Divisions
- `getDisciplineList()` → Disciplines
- `getSeasonList()` → Seasons

**WSRegistrations:**
- `Submit_HorseNewRegistration()` → New rider
- `Submit_HorseRenewal()` → Renew rider
- `Get_HorseOwner()` → Owner details

**ShowJumpingCriteria:**
- `IsRiderEligible()` → Validate rider
- `IsHorseEligible()` → Validate horse

---

## PayTabs Integration

### Payment Flow

```
1. User submits form
2. Laravel creates payment request
3. PayTabs returns redirect_url
4. User redirected to PayTabs hosted page
5. User completes payment
6. PayTabs sends webhook to /api/paytabs/webhook
7. Laravel verifies signature, processes
8. PayTabs redirects user to return_url
```

### Webhook Security

```php
// Signature verification
$signature = hash_hmac('sha256', json_encode($payload), $serverKey);
if (!hash_equals($signature, $requestSignature)) {
    return 401; // Reject
}
```

### Payment Types

| Type | Amount | cart_id Format | On Success |
|------|--------|----------------|------------|
| Rider Registration | AED 100 | `rider_reg_{userId}_{unique}` | Call WSRegistrations |
| Rider Renewal | AED 50 | `rider_renewal_{userId}_{unique}` | Call WSRegistrations |
| Show Jumping Entry | AED 150 | `jumping_{userId}_{unique}` | Insert ClassEntriesWeb |

---

## Security Considerations

### Payment Security

✅ **Webhook is source of truth** (not return URL)  
✅ **Signature verification** on all webhooks  
✅ **Idempotency** - same cart_id processed once  
✅ **Payment before DB write** - never write on payment initiation  

### SOAP Security

✅ **System credentials** stored in `.env`  
✅ **Input sanitization** before SOAP calls  
✅ **XML injection prevention**  

### General

✅ **No credentials in git** (`.env` in `.gitignore`)  
✅ **HTTPS only** for webhooks  
✅ **Rate limiting** on payment endpoints  
✅ **CSRF protection** on web routes  
✅ **SQL injection protection** (Eloquent/Query Builder)  

---

## Deployment Topology

```
┌─────────────────────────────────────────────┐
│            Production Environment            │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐      ┌─────────────┐     │
│  │   Nginx     │─────▶│   PHP-FPM   │     │
│  │  (Reverse   │      │  (Laravel)  │     │
│  │   Proxy)    │      └──────┬──────┘     │
│  └─────────────┘             │             │
│                              │             │
│         ┌────────────────────┼────────┐   │
│         │                    │        │   │
│    ┌────▼────┐              ┌──────▼──┐  ┌─▼──┐│
│    │  MSSQL  │              │  Redis  │││
│    │ Database│              │  Cache  │││
│    └─────────┘              └─────────┘│
│                                             │
└─────────────────────────────────────────────┘
          │                    │
          │                    │
   ┌──────▼──────┐      ┌──────▼──────┐
   │SOAP Services│      │   PayTabs   │
   │   (UAEERF)  │      │   Gateway   │
   └─────────────┘      └─────────────┘
```

---

## Performance Optimizations

1. **SOAP Response Caching** - Common lists cached 24h
2. **Database Connection Pooling** - MSSQL persistent connections
3. **Queue Processing** - Async SOAP calls (future)
4. **CDN for Assets** - Static files served from edge
5. **Opcode Cache** - OPcache enabled for PHP

---

## Monitoring & Logging

**Log Channels:**
```
storage/logs/laravel.log
├── SOAP requests/responses
├── PayTabs webhooks
├── Payment status changes
├── MSSQL connection errors
└── Authentication failures
```

**Key Metrics:**
- Payment success rate
- SOAP API response time
- MSSQL connection failures
- Webhook processing time

---

## Error Handling Strategy

```php
// Graceful degradation
try {
    $result = $soapService->call();
} catch (SoapFault $e) {
    Log::error('SOAP call failed', ['error' => $e->getMessage()]);
    return response()->json(['error' => 'Service temporarily unavailable'], 503);
}

// Create user in MSSQL
UserProfile::create($data);
```

---

## Future Enhancements

- [ ] Queue system for async SOAP calls
- [ ] Admin dashboard for payment reconciliation
- [ ] Email notifications on payment success
- [ ] Rider/Horse management UI
- [ ] Event calendar integration
- [ ] PDF receipt generation
- [ ] Multi-language support (Arabic/English)
- [ ] Mobile app (React Native)

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-23  
**Author:** Development Team
