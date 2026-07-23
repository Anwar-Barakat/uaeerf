#!/bin/bash

echo "=== MSSQL Driver Installation for macOS ==="
echo

# Check if Homebrew installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Install from https://brew.sh"
    exit 1
fi

echo "Step 1: Install Microsoft ODBC Driver..."
brew tap microsoft/mssql-release https://github.com/Microsoft/homebrew-mssql-release
brew update
HOMEBREW_NO_ENV_FILTERING=1 ACCEPT_EULA=Y brew install msodbcsql18 mssql-tools18

echo
echo "Step 2: Install UnixODBC (if needed)..."
brew install unixodbc

echo
echo "Step 3: Install PHP sqlsrv extensions..."
pecl install sqlsrv
pecl install pdo_sqlsrv

echo
echo "Step 4: Find php.ini location..."
PHP_INI=$(php --ini | grep "Loaded Configuration File" | cut -d: -f2 | xargs)
echo "php.ini: $PHP_INI"

echo
echo "Step 5: Add extensions to php.ini..."
if [ -f "$PHP_INI" ]; then
    if ! grep -q "extension=sqlsrv.so" "$PHP_INI"; then
        echo "extension=sqlsrv.so" >> "$PHP_INI"
        echo "✓ Added sqlsrv.so"
    else
        echo "✓ sqlsrv.so already in php.ini"
    fi

    if ! grep -q "extension=pdo_sqlsrv.so" "$PHP_INI"; then
        echo "extension=pdo_sqlsrv.so" >> "$PHP_INI"
        echo "✓ Added pdo_sqlsrv.so"
    else
        echo "✓ pdo_sqlsrv.so already in php.ini"
    fi
else
    echo "⚠️  Could not find php.ini automatically"
    echo "Add these lines manually to your php.ini:"
    echo "  extension=sqlsrv.so"
    echo "  extension=pdo_sqlsrv.so"
fi

echo
echo "Step 6: Verify installation..."
php -m | grep sqlsrv

echo
echo "=== Installation Complete ==="
echo "Test connection: php test-mssql.php"
