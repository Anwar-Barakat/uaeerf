<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful - UAEERF</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 48px;
            max-width: 500px;
            text-align: center;
        }
        .icon {
            width: 80px;
            height: 80px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }
        .icon svg {
            width: 48px;
            height: 48px;
            stroke: white;
        }
        h1 {
            color: #1a202c;
            font-size: 28px;
            margin-bottom: 12px;
        }
        p {
            color: #718096;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        .details {
            background: #f7fafc;
            border-radius: 8px;
            padding: 20px;
            text-align: left;
            margin-bottom: 32px;
        }
        .details-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .details-row:last-child {
            border-bottom: none;
        }
        .label {
            color: #718096;
            font-size: 14px;
        }
        .value {
            color: #1a202c;
            font-weight: 600;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: background 0.2s;
        }
        .button:hover {
            background: #5568d3;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully. You will receive a confirmation email shortly.</p>

        <div class="details">
            <div class="details-row">
                <span class="label">Transaction Reference</span>
                <span class="value">{{ $transaction->tran_ref }}</span>
            </div>
            <div class="details-row">
                <span class="label">Amount</span>
                <span class="value">{{ $transaction->currency }} {{ number_format($transaction->amount, 2) }}</span>
            </div>
            <div class="details-row">
                <span class="label">Status</span>
                <span class="value" style="color: #10b981;">✓ Confirmed</span>
            </div>
        </div>

        <a href="{{ route('dashboard') }}" class="button">Go to Dashboard</a>
    </div>
</body>
</html>
