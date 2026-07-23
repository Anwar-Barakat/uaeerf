<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed - UAEERF</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
            background: #ef4444;
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
            background: #fef2f2;
            border-radius: 8px;
            padding: 20px;
            text-align: left;
            margin-bottom: 32px;
        }
        .details-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #fee2e2;
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
            margin-right: 12px;
        }
        .button:hover {
            background: #5568d3;
        }
        .button-secondary {
            background: #e2e8f0;
            color: #1a202c;
        }
        .button-secondary:hover {
            background: #cbd5e0;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </div>
        <h1>Payment Failed</h1>
        <p>Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.</p>

        <div class="details">
            <div class="details-row">
                <span class="label">Transaction Reference</span>
                <span class="value">{{ $transaction->tran_ref }}</span>
            </div>
            <div class="details-row">
                <span class="label">Error Code</span>
                <span class="value">{{ $transaction->response_code }}</span>
            </div>
            <div class="details-row">
                <span class="label">Message</span>
                <span class="value">{{ $transaction->response_message }}</span>
            </div>
        </div>

        <a href="{{ route('dashboard') }}" class="button">Back to Dashboard</a>
        <a href="#" class="button button-secondary">Try Again</a>
    </div>
</body>
</html>
