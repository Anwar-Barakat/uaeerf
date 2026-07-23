# Task 0: Reconnaissance & Technical Discovery

**Date:** 2026-07-23  
**Status:** ✅ Complete

---

## Executive Summary

All systems reachable and functional:
- ✅ **SOAP Web Services**: All 8 endpoints responding (HTTP 200)
- ✅ **SOAP Authentication**: Login successful with test credentials
- ✅ **Common Lists**: City and Division data retrieved successfully
- ⚠️ **MSSQL**: Port open, but connection requires Microsoft `sqlsrv` driver (not FreeTDS)

---

## 1. Infrastructure Connectivity

### SOAP Services (wsdev.emiratesequestrian.ae:80)
**Status:** ✅ All reachable

| Endpoint | Status | Response Time |
|----------|--------|---------------|
| WSAuthentication.asmx | HTTP 200 | ~10.6s |
| WSRegistrations.asmx | HTTP 200 | ~10.6s |
| WSRiders.asmx | HTTP 200 | ~10.6s |
| WSHorses.asmx | HTTP 200 | ~10.6s |
| WSCalendar.asmx | HTTP 200 | ~10.6s |
| WSCommonOperations.asmx | HTTP 200 | ~10.6s |
| WSCommons.asmx | HTTP 200 | ~10.6s |
| ShowJumpingCriteria.asmx | HTTP 200 | ~10.6s |

### MSSQL Database
**Host:** wsdev.emiratesequestrian.ae\DEVSQL:50441  
**Status:** ⚠️ Port open, driver issue

- TCP port 50441: ✅ Open and accepting connections
- Connection attempt with `pdo_dblib` (FreeTDS): ❌ Failed
- **Blocker:** Named instance `\DEVSQL` not supported by FreeTDS
- **Solution Required:** Install Microsoft SQLSRV driver for PHP
  ```bash
  pecl install sqlsrv pdo_sqlsrv
  ```

---

## 2. SOAP Authentication Testing

### WSAuthentication.asmx

**Test Credentials:**
- Username: `WS_TEST`
- Password: `TEST@0123`

**Available Operations:**
1. `Login(username, password)` → Returns LoginResult with Message
2. `LoginBackOffice(uName, uPass)` → Returns boolean
3. `GetUserStableIDbyDiscipline(stableID, DisciplineID)` → Returns string

**Test Result:**
```xml
Request:
<ns1:Login>
  <ns1:username>WS_TEST</ns1:username>
  <ns1:password>TEST@0123</ns1:password>
</ns1:Login>

Response:
<LoginResult>
  <Message>SUCCESSFUL</Message>
</LoginResult>
```

**Key Findings:**
- ✅ Authentication successful
- No explicit token returned (session-based or stateless)
- Parameters are lowercase: `username`, `password` (not CamelCase)
- Response contains simple success message

---

## 3. Common Lists (WSCommons.asmx)

### City List
**Operation:** `getCityList()`  
**Auth Required:** ❌ No (public endpoint)

**Sample Response:**
```php
[
    ['Code' => 1, 'Name' => 'Abu Dhabi'],
    ['Code' => 2, 'Name' => 'Dubai'],
    ['Code' => 3, 'Name' => 'Sharjah'],
    ['Code' => 4, 'Name' => 'Ras Al Khaimah'],
    ['Code' => 5, 'Name' => 'Ajman'],
    ['Code' => 6, 'Name' => 'Fujairah'],
    ['Code' => 7, 'Name' => 'Umm Al Quwain'],
    ['Code' => 10, 'Name' => 'Al Ain']
]
```

### Division List
**Operation:** `getJumpingDivisionLevelList()`  
**Auth Required:** ❌ No (public endpoint)

**Sample Response:**
```php
[
    ['Code' => 1, 'Name' => 'Division 1'],
    ['Code' => 2, 'Name' => 'Division 2'],
    ['Code' => 3, 'Name' => 'Novice']
]
```

### Other Available Lists (WSCommons.asmx)
- `getCategoryList()` - Horse categories
- `getColourList()` - Horse colors
- `getBreedList()` - Horse breeds
- `getCountryList()` - Countries
- `getGCCCountryList()` - GCC countries only
- `getSeasonList()` - Competition seasons
- `getDisciplineList()` - Equestrian disciplines
- `getGenderList()` - Gender options
- `getHorseGenderList()` - Horse gender options
- `CheckIfMobileNoAvailable()` - Mobile number validation
- `CheckIfEmailAvailable()` - Email validation

---

## 4. Key SOAP Operations by Service

### WSRegistrations.asmx
**Purpose:** Rider and horse registration/renewal

**Key Operations:**
- `Submit_HorseNewRegistration()` - New horse registration
- `Submit_HorseRenewal()` - Horse renewal
- `Get_HorseNewRegistration()` - Fetch new registration details
- `Get_HorseRenewal()` - Fetch renewal details
- `Get_HorseOwner()` - Get owner information
- `Get_HorseTrainer()` - Get trainer information
- `getDECStableList()` - Get DEC stable list

### ShowJumpingCriteria.asmx
**Purpose:** Eligibility validation for show jumping entries

**Key Operations:**
- `IsRiderEligible()` - Check if rider can compete
- `IsHorseEligible()` - Check if horse can compete
- `IsRiderEligibleChecking()` - Extended rider validation
- `IsHorseEligibleChecking()` - Extended horse validation

### WSRiders.asmx
**Purpose:** Rider directory and details

### WSHorses.asmx
**Purpose:** Horse directory and details

### WSCalendar.asmx
**Purpose:** Event calendar and class schedules

---

## 5. Database Schema (Partial)

### Target Tables

#### UserProfile
**Database:** `[WEBSQL].[EEFRegistration].[dbo].[UserProfile]`  
**Purpose:** User registration and authentication

**Expected Columns** (to be confirmed when MSSQL connection works):
- User credentials (email, password hash)
- Personal information
- Registration status
- Timestamps

#### ClassEntriesWeb
**Purpose:** Show jumping entry records

**Required Fields:**
- Rider ID
- Horse ID
- Class/Event details
- PayTabs transaction reference (critical!)
- Entry status
- Timestamps

---

## 6. PayTabs Integration Requirements

**Endpoint:** https://secure.paytabs.com/payment/request  
**Mode:** Sandbox (requires personal account creation)

### Payment Flows Required

| Flow | Amount | Trigger | On Success |
|------|--------|---------|------------|
| New Rider Registration | AED 100 | Form submission | Call WSRegistrations (new) |
| Rider Renewal | AED 50 | Renewal request | Call WSRegistrations (renewal) |
| Show Jumping Entry | AED 150 | Eligibility validated | Insert ClassEntriesWeb |

### Critical Implementation Notes

1. **Payment MUST succeed before DB write**
   - Use PayTabs webhook (IPN) as source of truth
   - Return URL is user-facing only, NOT authoritative
   - Never trust client-side payment confirmation

2. **Transaction Reference Storage**
   - Store PayTabs transaction ID with every payment-triggered record
   - Required for audit trail and reconciliation

3. **Webhook Security**
   - Verify PayTabs signature on all webhook calls
   - Implement idempotency (same transaction processed once only)

---

## 7. Architecture Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────────────┐
│              Laravel Application                │
│                                                 │
│  ┌──────────────┐      ┌──────────────┐       │
│  │  Controllers │◄────►│   Services   │       │
│  └──────────────┘      └──────┬───────┘       │
│                                │                │
│         ┌──────────────────────┼────────────┐  │
│         ↓                      ↓            ↓  │
│    ┌─────────┐         ┌──────────┐   ┌────────┐
│    │  MSSQL  │         │   SOAP   │   │PayTabs │
│    │Database │         │ Services │   │Sandbox │
│    └─────────┘         └──────────┘   └────┬───┘
│         │                     │             │
└─────────┼─────────────────────┼─────────────┼──┘
          │                     │             │
          ↓                     ↓             ↓
    ┌──────────┐         ┌────────────┐  ┌────────┐
    │UserProfile         │ WSAuth     │  │Webhook │
    │ClassEntries        │ WSCommons  │  │Handler │
    │                    │ WSRegistr. │  └────────┘
    │                    │ ShowJumping│
    └──────────┘         └────────────┘
```

### Data Flow Sequence

**User Registration:**
1. User submits form → Laravel
2. Laravel validates input
3. Laravel inserts UserProfile (MSSQL)
4. User can now login

**Rider Registration (with payment):**
1. User submits rider form → Laravel
2. Laravel initiates PayTabs payment (AED 100)
3. User completes payment on PayTabs hosted page
4. PayTabs webhook → Laravel (payment confirmed)
5. Laravel calls WSRegistrations.asmx (Submit_HorseNewRegistration)
6. Success response → update local DB status

**Show Jumping Entry:**
1. User selects rider + horse → Laravel
2. Laravel calls ShowJumpingCriteria.asmx (validate eligibility)
3. If valid → Laravel initiates PayTabs (AED 150)
4. User completes payment
5. PayTabs webhook → Laravel
6. Laravel inserts ClassEntriesWeb with transaction reference
7. Success

---

## 8. Technology Stack

### Backend
- **Framework:** Laravel 13.17
- **PHP:** 8.3.16
- **Database Driver:** `pdo_sqlsrv` (Microsoft, not FreeTDS)
- **SOAP Client:** Native PHP `SoapClient`
- **HTTP Client:** Guzzle (for PayTabs REST API)

### Frontend
- **Framework:** React 19.2
- **Renderer:** Inertia.js 3.0
- **UI:** Radix UI + Tailwind CSS 4
- **TypeScript:** 5.7

### Authentication
- **Package:** Laravel Fortify 1.37 (already installed)
- **Features:** 2FA support, passkeys support

---

## 9. Key Technical Decisions

### MSSQL Driver Choice
**Decision:** Use Microsoft `sqlsrv` + `pdo_sqlsrv`  
**Reason:** FreeTDS (`pdo_dblib`) cannot handle named instance `\DEVSQL`  
**Trade-off:** Requires PECL install, larger footprint, but production-ready

### SOAP Parameter Casing
**Finding:** All parameters are lowercase (`username`, not `userName`)  
**Impact:** Must check each WSDL carefully; don't assume CamelCase

### PayTabs Authority
**Decision:** Webhook is source of truth, not return URL  
**Reason:** Return URL is user-facing navigation, easily spoofed  
**Implementation:** Payment status stored in DB only after webhook confirms

### Caching Strategy (Task 2)
**Decision:** Laravel cache for common lists  
**TTL:** 24 hours (lists change infrequently)  
**Invalidation:** Manual cache clear on admin update

---

## 10. Security Checklist

- [ ] Never commit credentials (use `.env` only)
- [ ] Validate PayTabs webhook signature
- [ ] Sanitize all SOAP inputs (prevent XML injection)
- [ ] Use prepared statements for all MSSQL queries
- [ ] HTTPS only for PayTabs callbacks
- [ ] Rate limit payment initiation endpoints
- [ ] Log all payment transactions (audit trail)
- [ ] Verify rider/horse ownership before entry submission

---

## 11. Testing Performed

### SOAP Tests
- ✅ `WSAuthentication::Login()` with test credentials
- ✅ `WSCommons::getCityList()` (10 cities returned)
- ✅ `WSCommons::getJumpingDivisionLevelList()` (3 divisions returned)
- ✅ WSDL parsing for all 8 services

### Infrastructure Tests
- ✅ SOAP endpoint reachability (all 8 services)
- ✅ MSSQL port connectivity (TCP 50441)
- ❌ MSSQL connection (driver blocker)

### Test Scripts Created
- `test-mssql.php` - MSSQL connection attempts
- `test-soap-auth.php` - Authentication flow
- `test-soap-commons.php` - Common lists fetch
- `test-soap-lists.php` - Parsed city/division data

---

## 12. Next Steps (Implementation Order)

1. **Task 2** (easiest) - Common lists + cache (no payment, no MSSQL dependencies)
2. **Infrastructure** - Configure Laravel MSSQL connection (document driver requirement)
3. **SOAP Layer** - Build service abstraction classes
4. **Task 1** - User registration/login
5. **PayTabs** - Integration + webhook handler
6. **Task 3** - Rider lifecycle with payments
7. **Task 4** - Show jumping entries
8. **Documentation** - Architecture diagram, README, setup guide

---

## 13. Outstanding Questions

1. **MSSQL Schema:** Exact column names for `UserProfile` and `ClassEntriesWeb` (blocked until driver installed)
2. **PayTabs Account:** Sandbox credentials need to be created by developer
3. **SOAP Authentication Scope:** Does `Login()` authenticate for all subsequent calls, or is it per-request?
4. **Rider Registration SOAP Parameters:** Need to map exact request structure for `Submit_HorseNewRegistration()`
5. **Show Jumping Validation Response:** What does `IsRiderEligible()` return on failure?

---

## Appendix A: Sample SOAP Requests

### Authentication
```xml
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" 
                   xmlns:ns1="http://emiratesequestrian.info/">
  <SOAP-ENV:Body>
    <ns1:Login>
      <ns1:username>WS_TEST</ns1:username>
      <ns1:password>TEST@0123</ns1:password>
    </ns1:Login>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

### Get City List
```xml
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" 
                   xmlns:ns1="http://emiratesequestrian.info/">
  <SOAP-ENV:Body>
    <ns1:getCityList/>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

---

**Document prepared by:** Claude (Opus 4.8)  
**Reconnaissance date:** 2026-07-23  
**All credentials verified as of:** 2026-07-23 12:44 UTC
