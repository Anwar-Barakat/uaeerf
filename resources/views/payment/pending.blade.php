<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Processing - UAEERF</title>
    <meta http-equiv="refresh" content="3">
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
        .spinner {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            border: 6px solid #e2e8f0;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
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
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="spinner"></div>
        <h1>Processing Payment</h1>
        <p>{{ $message }}</p>
        <p style="margin-top: 24px; font-size: 14px;">This page will refresh automatically...</p>
    </div>
</body>
</html>
