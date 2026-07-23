# UAEERF Portal - System Architecture

## Overview

Full-stack equestrian portal integrating MSSQL database, SOAP web services, and PayTabs payment gateway.

**Stack:** Laravel 13 + React 19 + Inertia.js + MSSQL + SOAP + PayTabs

---

## System Architecture

```mermaid
graph TB
    User[User Browser]

    subgraph "Laravel Application"
        Web[Web Routes<br/>Inertia Pages]
        API[API Routes<br/>REST Endpoints]
        Auth[Fortify Auth<br/>+ UserProfile verify]
        Controllers[Controllers]
        Services[Service Layer]

        subgraph "Services"
            SOAP[SOAP Services<br/>auth handshake enforced]
            PayTabs[PayTabs Service]
        end

        subgraph "Data Layer"
            MSSQL[(MSSQL Database<br/>UserProfile<br/>Payments<br/>Registrations<br/>ClassEntriesWeb)]
        end
    end

    subgraph "External Systems"
        SoapAPI[UAEERF SOAP APIs<br/>WSAuthentication<br/>WSRegistrations<br/>WSRiders<br/>WSCommons<br/>ShowJumpingCriteria]
        PayTabsGW[PayTabs Gateway<br/>Payment Processing]
    end

    User -->|HTTP/HTTPS| Web
    User -->|AJAX/Fetch| API
    Web --> Auth
    API --> Controllers
    Web --> Controllers
    Controllers --> Services
    Services --> SOAP
    Services --> PayTabs
    Controllers --> MSSQL
    SOAP -->|SOAP/XML| SoapAPI
    PayTabs -->|REST/JSON| PayTabsGW
    PayTabsGW -->|Webhook IPN + Return| API
```

---

## SOAP Authentication Handshake (Evaluation Criterion)

Every SOAP operation passes through `BaseSoapClient::call()`, which enforces a
login against `WSAuthentication.asmx` **before** any other service is invoked
(result cached 1 hour):

```mermaid
graph LR
    A[Any SOAP call] --> B{Auth cached?}
    B -->|no| L[WSAuthentication.asmx<br/>Login system credentials]
    L -->|SUCCESSFUL| CACHE[Cache 1h] --> CALL[__soapCall]
    B -->|yes| CALL
    L -->|failure| X[Throw SoapFault<br/>operation aborted]
```

| Service class | Endpoint | Purpose |
|---|---|---|
| `AuthenticationService` | WSAuthentication.asmx | System login handshake |
| `CommonsService` | WSCommons.asmx | Cities, countries, genders, disciplines, categories, seasons, visa categories — **cached 24 h** |
| `RegistrationsService` | WSRegistrations.asmx | `Submit_PersonNewRegistration` / `Submit_PersonRenewal` (full WSDL `PersonRegEntries` struct) |
| `RidersService` | WSRiders.asmx | `SearchRiderList` — renewal rider lookup |
| `ShowJumpingCriteriaService` | ShowJumpingCriteria.asmx | `IsRiderEligible` / `IsHorseEligible` |

---

## Payment Flow (webhook is source of truth)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant L as Laravel
    participant DB as MSSQL
    participant PT as PayTabs
    participant WS as UAEERF SOAP

    U->>L: POST /rider/register (athlete form)
    L->>DB: INSERT rider_registrations (pending_payment)
    L->>PT: Create hosted payment (cart_id, callback, return)
    PT-->>L: redirect_url + tran_ref
    L-->>U: Inertia::location(redirect_url)
    U->>PT: Card payment (hosted page)

    par Server-to-server webhook (IPN)
        PT->>L: POST /api/paytabs/webhook (Signature header)
        L->>L: HMAC-SHA256 verify of raw body (400 on mismatch)
        L->>DB: INSERT payment_transactions (idempotent on tran_ref)
        alt authorised (response_status = A)
            L->>WS: Auth handshake → Submit_PersonNewRegistration
            alt SOAP accepted
                L->>DB: registration → completed + tran_ref
            else SOAP rejected
                L->>DB: registration → failed + server messages
            end
        else declined
            L->>DB: transaction → failed (registration untouched)
        end
    and Browser return
        PT->>U: POST /api/payment/return (stateless route)
        U->>L: 302 PRG redirect → GET with query params
        L-->>U: success / failed / pending page (app-styled)
    end
```

**Critical rules:**

- ✅ Webhook is the source of truth (return URL is display-only)
- ✅ Database completion / SOAP submission ONLY after confirmed payment
- ✅ Signature = HMAC-SHA256 of the **raw request body** with the server key
- ✅ Idempotency: duplicate webhooks short-circuit on existing `tran_ref`
- ✅ `cart_id` prefix routes processing: `rider_reg_` / `rider_renewal_` / `jumping_`
- ✅ Return route is **stateless** (API group) so PayTabs' cross-site POST cannot
  rotate the authenticated session cookie
- ✅ Transaction reference stored with every entry

---

## Show Jumping Entry (AED 150)

```mermaid
graph LR
    F[Entry form] --> V[ShowJumpingCriteria.asmx<br/>IsRiderEligible + IsHorseEligible]
    V -->|both eligible| P[PayTabs AED 150]
    V -->|ineligible| E[Back with errors]
    P -->|webhook authorised| I[INSERT ClassEntriesWeb<br/>incl. PayTabs tran_ref]
```

---

## Identity & Access (Task 1)

- **Registration** — Fortify `CreateNewUser` dual-writes: local `users` row
  (Laravel auth) **and** MSSQL `UserProfile` row.
- **Login** — custom `Fortify::authenticateUsing`: local credential check
  **plus** verification against `UserProfile.Password`. A profile password
  mismatch denies login; MSSQL being unreachable logs an error and degrades
  gracefully (no lockout on infrastructure failure).

---

## Rider Renewal Lookup (Task 3 "Query rider")

`GET /api/riders/search?q=` (authenticated, validated) → `RidersService::searchRiders()`
→ `SearchRiderList` on WSRiders.asmx → mapped to
`{rider_id, name, dob, nationality, registered_current_season}`.
The renewal page uses a debounced type-ahead; real federation rider IDs
(`E00xxxxx`, nvarchar) flow through to `Submit_PersonRenewal.PersonID`.

---

## Security Features

- Webhook signature verification (HMAC-SHA256, raw body)
- Idempotency checks (duplicate webhook prevention)
- Rate limiting (10 req/min on payment initiation endpoints)
- Payment-before-database-write flow
- SOAP system credentials via environment only (never hardcoded)
- Session-safe stateless payment return route
- Mass-assignment protection, LIKE-wildcard escaping, no `dangerouslySetInnerHTML`

---

## API Endpoints

### Public
```
GET  /api/commons/*             # Cached SOAP lists (cities, countries, genders, ...)
```

### Protected (auth)
```
POST /rider/register            # Registration → PayTabs (AED 100)
POST /rider/renew               # Renewal → PayTabs (AED 50)
POST /jumping/validate          # Eligibility check (AJAX)
POST /jumping/entry             # Entry → PayTabs (AED 150)
GET  /api/riders/search?q=      # Rider lookup for renewals
```

### Payment (no auth — verified by signature / display-only)
```
POST     /api/paytabs/webhook   # PayTabs IPN (HMAC verified)
GET|POST /api/payment/return    # User return URL (stateless, PRG)
```

---

## Testing

68 automated tests (Pest) covering registration validation, payment webhook
security (signature, idempotency, declined/authorised paths, SOAP
success/rejection for registrations **and** renewals), payment return pages,
rider search endpoint, and UserProfile-verified login. MSSQL is faked as an
in-memory SQLite connection per test — the suite runs with no external
dependencies.

---

## Known Environment Limitation

`Submit_PersonNewRegistration` on the WS_TEST environment returns
**"Invalid User ID" for every UserId value** — verified with a fresh,
server-side-confirmed session (`WSUserAuth` row present for our IP) against the
assessment portal account `testings@uaeerf.ae` (UserID 6422), existing users,
`0`, and all `PersonType` values. Every other field validation passes (name,
DOB ≥ 11y, nationality/gender/city/country IDs, email, mobile, address, PO box,
weight, EID format). The blocker is server-side permissioning for the WS_TEST
account; the service's rejection messages are captured verbatim in
`rider_registrations.error_message`. Raised with the UAEERF technical contact.

Deferred by scope: profile-photo upload (`Submit_Document`).

---

**Built for:** UAEERF Technical Assessment
