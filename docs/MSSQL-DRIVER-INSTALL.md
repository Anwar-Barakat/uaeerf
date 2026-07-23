# Microsoft SQL Server Driver Installation

## Requirement

This project connects to MSSQL with a **named instance** (`\DEVSQL`), which requires Microsoft's official `sqlsrv` and `pdo_sqlsrv` PHP extensions. FreeTDS (`pdo_dblib`) does not support this configuration.

## Prerequisites

- PHP 8.3+
- PECL (PHP Extension Community Library)
- UnixODBC (macOS/Linux)
- Microsoft ODBC Driver for SQL Server

## macOS Installation

### Step 1: Install Microsoft ODBC Driver

```bash
# Install via Homebrew
brew tap microsoft/mssql-release https://github.com/Microsoft/homebrew-mssql-release
brew update
brew install msodbcsql18 mssql-tools18
```

### Step 2: Install UnixODBC (if not already installed)

```bash
brew install unixodbc
```

### Step 3: Install PHP extensions via PECL

```bash
pecl install sqlsrv
pecl install pdo_sqlsrv
```

### Step 4: Enable extensions in php.ini

Find your php.ini location:
```bash
php --ini
```

Add these lines:
```ini
extension=sqlsrv.so
extension=pdo_sqlsrv.so
```

### Step 5: Verify installation

```bash
php -m | grep sqlsrv
```

Expected output:
```
pdo_sqlsrv
sqlsrv
```

## Linux Installation (Ubuntu/Debian)

### Step 1: Install Microsoft ODBC Driver

```bash
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
curl https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/prod.list | sudo tee /etc/apt/sources.list.d/mssql-release.list

sudo apt-get update
sudo ACCEPT_EULA=Y apt-get install -y msodbcsql18
sudo ACCEPT_EULA=Y apt-get install -y mssql-tools18
sudo apt-get install -y unixodbc-dev
```

### Step 2: Install PHP extensions

```bash
sudo pecl install sqlsrv
sudo pecl install pdo_sqlsrv
```

### Step 3: Enable extensions

```bash
sudo bash -c "echo 'extension=sqlsrv.so' > /etc/php/8.3/mods-available/sqlsrv.ini"
sudo bash -c "echo 'extension=pdo_sqlsrv.so' > /etc/php/8.3/mods-available/pdo_sqlsrv.ini"
sudo phpenmod sqlsrv pdo_sqlsrv
```

### Step 4: Restart PHP-FPM

```bash
sudo systemctl restart php8.3-fpm
```

## Windows Installation

### Step 1: Download drivers

Download from: https://docs.microsoft.com/en-us/sql/connect/php/download-drivers-php-sql-server

### Step 2: Extract DLLs

Copy `php_sqlsrv_83_ts.dll` and `php_pdo_sqlsrv_83_ts.dll` to your PHP extensions directory (e.g., `C:\php\ext\`)

### Step 3: Update php.ini

Add:
```ini
extension=php_sqlsrv_83_ts.dll
extension=php_pdo_sqlsrv_83_ts.dll
```

### Step 4: Restart web server

## Testing Connection

Run the test script:

```bash
php test-mssql.php
```

Expected output:
```
✓ Connection successful

=== Available Tables ===
dbo.UserProfile
dbo.ClassEntriesWeb
...
```

## Troubleshooting

### Error: "SQLSTATE[IMSSP]: Invalid value type for option SQLSRV_ATTR_QUERY_TIMEOUT"
**Solution:** Update to latest sqlsrv version (5.12+)

### Error: "SQLSTATE[08001]: [Microsoft][ODBC Driver 18 for SQL Server]SSL Provider: [error:1416F086]"
**Solution:** Set `trust_server_certificate=true` in `.env` (already configured)

### Error: "Can't open lib 'ODBC Driver 18 for SQL Server'"
**Solution:** Install Microsoft ODBC Driver (Step 1 above)

### macOS: pecl install fails with "phpize: command not found"
**Solution:** Install Xcode Command Line Tools:
```bash
xcode-select --install
```

## Alternative: Docker

If native installation is problematic, use Docker:

```dockerfile
FROM php:8.3-fpm

# Install MSSQL dependencies
RUN apt-get update && apt-get install -y \
    unixodbc-dev \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && pecl install sqlsrv pdo_sqlsrv \
    && docker-php-ext-enable sqlsrv pdo_sqlsrv
```

## References

- [Microsoft PHP Drivers Documentation](https://docs.microsoft.com/en-us/sql/connect/php/microsoft-php-driver-for-sql-server)
- [Laravel SQLSRV Configuration](https://laravel.com/docs/11.x/database#configuration)
- [PECL sqlsrv Package](https://pecl.php.net/package/sqlsrv)
