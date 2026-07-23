#!/bin/bash

echo "🚀 PayTabs Testing Setup"
echo "========================"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok not installed"
    echo "Install: brew install ngrok"
    echo "Or download: https://ngrok.com/download"
    exit 1
fi

echo "✅ ngrok found"
echo ""

# Start Laravel server
echo "Starting Laravel server..."
php artisan serve > /dev/null 2>&1 &
LARAVEL_PID=$!
echo "✅ Laravel running (PID: $LARAVEL_PID)"
sleep 2

# Start ngrok
echo "Starting ngrok tunnel..."
ngrok http 8000 > /dev/null 2>&1 &
NGROK_PID=$!
echo "✅ ngrok running (PID: $NGROK_PID)"
sleep 3

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL"
    kill $LARAVEL_PID $NGROK_PID 2>/dev/null
    exit 1
fi

echo ""
echo "✅ Public URL: $NGROK_URL"
echo ""
echo "📝 Next steps:"
echo "1. Update .env:"
echo "   PAYTABS_CALLBACK_URL=${NGROK_URL}/api/paytabs/webhook"
echo "   APP_URL=${NGROK_URL}"
echo ""
echo "2. Clear config: php artisan config:clear"
echo ""
echo "3. Test payment:"
echo "   - Open: ${NGROK_URL}/register"
echo "   - Create account and login"
echo "   - Go to: ${NGROK_URL}/rider/registration"
echo "   - Fill form and submit"
echo "   - Use test card: 4111 1111 1111 1111 / CVV: 123"
echo ""
echo "4. Monitor logs: tail -f storage/logs/laravel.log"
echo ""
echo "Press Ctrl+C to stop servers"

# Keep script running
trap "kill $LARAVEL_PID $NGROK_PID 2>/dev/null; exit" INT TERM
wait
