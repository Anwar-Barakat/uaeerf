# DTO Implementation with Spatie Laravel Data

## What Are DTOs?

**Data Transfer Objects** - Type-safe containers for data between layers.

**Benefits:**
- Type safety (PHP 8.3+ typed properties)
- Automatic validation
- IDE autocomplete
- Immutable by default
- Easy transformation

---

## Package Used

**Spatie Laravel Data:** https://github.com/spatie/laravel-data

```bash
composer require spatie/laravel-data
```

---

## DTOs Created

### 1. Request DTOs (from user input)

```php
app/Data/
├── RiderRegistrationData.php      # Rider registration form
├── RiderRenewalData.php           # Rider renewal form
└── ShowJumpingEntryData.php       # Show jumping entry form
```

### 2. Webhook DTOs (from PayTabs)

```php
app/Data/
├── PaymentWebhookData.php         # Webhook payload
└── PaymentResultData.php          # Nested payment result
```

### 3. Repository DTOs (to database layer)

```php
app/Data/
├── CreateRiderRepositoryData.php         # For rider repo
└── CreateShowJumpingEntryRepositoryData.php  # For jumping repo
```

---

## Usage Examples

### Before (array validation)

```php
public function initiateRegistration(Request $request)
{
    $validated = $request->validate([
        'rider_name' => 'required|string|max:255',
        'date_of_birth' => 'required|date',
        'nationality' => 'required|string|max:3',
        // ... 6 more fields
    ]);

    $this->repo->create([
        'user_id' => $user->id,
        'cart_id' => $cartId,
        ...$validated, // array spread - no type safety
    ]);
}
```

**Problems:**
- ❌ No type hints
- ❌ No IDE autocomplete
- ❌ Validation rules duplicated
- ❌ Easy to typo field names

### After (DTO)

```php
public function initiateRegistration(RiderRegistrationData $data)
{
    // ✅ $data is validated automatically
    // ✅ Type-safe: $data->rider_name is string
    // ✅ IDE knows all properties

    $repositoryData = CreateRiderRepositoryData::fromRegistrationData(
        $user->id,
        $cartId,
        $data
    );

    $this->repo->create($repositoryData->toArray());
}
```

**Advantages:**
- ✅ Automatic validation (Spatie Data)
- ✅ Type hints everywhere
- ✅ IDE autocomplete
- ✅ Transformation methods

---

## DTO Anatomy

### Basic DTO

```php
use Spatie\LaravelData\Data;

class RiderRegistrationData extends Data
{
    public function __construct(
        public string $rider_name,      // Public typed property
        public string $date_of_birth,
        public int $discipline_id,
    ) {}
}
```

### With Validation Attributes

```php
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Max;

class RiderRegistrationData extends Data
{
    public function __construct(
        #[Required, Max(255)]
        public string $rider_name,

        #[Required, Date]
        public string $date_of_birth,

        #[Required, Integer]
        public int $discipline_id,
    ) {}
}
```

### With Custom Rules Method

```php
class RiderRegistrationData extends Data
{
    public function __construct(
        public string $rider_name,
        public string $date_of_birth,
    ) {}

    public static function rules(): array
    {
        return [
            'rider_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
        ];
    }
}
```

---

## Controller Type Hints

### Before

```php
public function store(Request $request)
{
    $validated = $request->validate([...]); // Manual validation
    // $validated is array - no type safety
}
```

### After

```php
public function store(RiderRegistrationData $data)
{
    // Laravel automatically:
    // 1. Validates request
    // 2. Creates DTO
    // 3. Injects into controller
    
    // $data->rider_name is typed string
}
```

**Automatic validation** - Laravel resolves the DTO and validates before method call.

---

## Transformation Methods

### Static Factory Methods

```php
class CreateRiderRepositoryData extends Data
{
    public static function fromRegistrationData(
        int $userId,
        string $cartId,
        RiderRegistrationData $data
    ): self {
        return new self(
            user_id: $userId,
            cart_id: $cartId,
            rider_name: $data->rider_name,
            // ... map fields
        );
    }
}
```

**Usage:**
```php
$repositoryData = CreateRiderRepositoryData::fromRegistrationData(
    $user->id,
    $cartId,
    $requestData
);
```

### From Array

```php
// Spatie Data provides this automatically
$webhookData = PaymentWebhookData::from($array);

// Or with validation
$webhookData = PaymentWebhookData::validateAndCreate($array);
```

### To Array

```php
$data = new RiderRegistrationData(...);
$array = $data->toArray();

// Pass to repository
$repo->create($array);
```

---

## Nested DTOs

```php
class PaymentWebhookData extends Data
{
    public function __construct(
        public string $tran_ref,
        public string $cart_id,
        public PaymentResultData $payment_result, // ← Nested DTO
    ) {}
}

class PaymentResultData extends Data
{
    public function __construct(
        public string $response_status,
        public string $response_code,
    ) {}
}
```

**Usage:**
```php
$webhook = PaymentWebhookData::from($request->all());
echo $webhook->payment_result->response_status; // Type-safe access
```

---

## Custom Methods on DTOs

```php
class PaymentWebhookData extends Data
{
    public function __construct(
        public PaymentResultData $payment_result,
    ) {}

    public function isSuccessful(): bool
    {
        return strtoupper($this->payment_result->response_status) === 'A';
    }
}
```

**Usage:**
```php
if ($webhookData->isSuccessful()) {
    // Process payment
}
```

---

## Validation Flow

### 1. Request → DTO (automatic)

```php
// Controller
public function store(RiderRegistrationData $data)
{
    // If validation fails, Laravel returns 422 automatically
    // If passes, $data is populated DTO
}
```

### 2. Manual Creation with Validation

```php
try {
    $data = RiderRegistrationData::validateAndCreate($array);
} catch (ValidationException $e) {
    // Handle validation errors
}
```

### 3. Skip Validation (from trusted source)

```php
$data = RiderRegistrationData::from($array); // No validation
```

---

## API Transformation

### Output DTOs (API responses)

```php
class RiderResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $status,
    ) {}

    public static function fromModel($rider): self
    {
        return new self(
            id: $rider->id,
            name: $rider->rider_name,
            status: $rider->status,
        );
    }
}

// Controller
return RiderResource::from($rider)->toJson();
```

---

## Type Safety Example

### Without DTO

```php
function process(array $data) {
    $name = $data['rider_name']; // Could be missing, wrong type
    // IDE doesn't know what's in $data
}
```

### With DTO

```php
function process(RiderRegistrationData $data) {
    $name = $data->rider_name; // ✅ Always string
    // ✅ IDE autocompletes all properties
    // ✅ PHPStan/Psalm can analyze
}
```

---

## Testing with DTOs

### Unit Tests

```php
test('creates rider registration DTO', function () {
    $data = new RiderRegistrationData(
        rider_name: 'John Doe',
        date_of_birth: '1990-01-01',
        nationality: 'AE',
        passport_number: null,
        discipline_id: 1,
        category_id: 1,
    );

    expect($data->rider_name)->toBe('John Doe');
    expect($data->discipline_id)->toBe(1);
});
```

### Controller Tests

```php
test('validates rider registration', function () {
    $response = $this->postJson('/api/rider/register', [
        'rider_name' => '', // Invalid
        'date_of_birth' => 'invalid-date',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['rider_name', 'date_of_birth']);
});
```

---

## Comparison: Before vs After

| Aspect | Before (arrays) | After (DTOs) |
|--------|----------------|--------------|
| Type Safety | ❌ None | ✅ Full |
| IDE Support | ❌ No autocomplete | ✅ Full autocomplete |
| Validation | Manual `$request->validate()` | ✅ Automatic |
| Refactoring | ❌ Find/replace strings | ✅ IDE refactor |
| Documentation | Comments | ✅ Type declarations |
| Errors | Runtime | ✅ Compile-time (static analysis) |

---

## Architecture Flow with DTOs

```
Request
  ↓
[Automatic Validation]
  ↓
RequestDTO (RiderRegistrationData)
  ↓
Controller
  ↓
Transform to RepositoryDTO
  ↓
Repository
  ↓
Database
```

**Layers:**
1. **Request DTO** - User input validation
2. **Repository DTO** - Database operation params
3. **Response DTO** - API output formatting

---

## Best Practices

### 1. One DTO per Purpose

```php
// ✅ Good - separate DTOs
RiderRegistrationData         // For creating
RiderUpdateData              // For updating
RiderResource                // For output

// ❌ Bad - one DTO for everything
RiderData // Used for create, update, and output
```

### 2. Immutable DTOs

```php
// ✅ Good - construct once
$data = new RiderRegistrationData(...);

// ❌ Bad - mutable properties
$data->rider_name = 'New Name'; // Should create new DTO instead
```

### 3. Validation in DTO, Business Logic in Service

```php
// ✅ Good
class RiderRegistrationData extends Data
{
    public static function rules(): array
    {
        return ['rider_name' => 'required']; // Validation only
    }
}

class RiderService
{
    public function register(RiderRegistrationData $data)
    {
        // Business logic here
    }
}
```

### 4. Transform at Boundaries

```php
// ✅ Good - transform at layer boundary
public function store(RiderRegistrationData $requestData)
{
    $repoData = CreateRiderRepositoryData::fromRegistrationData(...);
    $this->repo->create($repoData->toArray());
}

// ❌ Bad - passing DTOs through all layers
$this->repo->create($requestData); // Wrong layer
```

---

## Files Modified

| File | Change |
|------|--------|
| `RiderController.php` | Type-hint DTOs instead of Request |
| `ShowJumpingController.php` | Type-hint DTOs |
| `PayTabsController.php` | Use PaymentWebhookData |

---

## Summary

**DTOs provide:**
- ✅ Type safety
- ✅ Automatic validation
- ✅ IDE support
- ✅ Self-documenting code
- ✅ Easy testing
- ✅ Transformation methods

**Result:** More robust, maintainable, professional code.

---

**DTO implementation complete.** All request handling type-safe.
