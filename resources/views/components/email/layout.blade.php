@props([
    'accent' => '#1eaf6d',
    'footer' => null,
    'product' => 'Portfolio',
])
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="dark">
</head>
<body style="margin:0;padding:0;background-color:#0c1625;color:#f3f7f5;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;background-color:#0c1625;">
        <tr>
            <td align="center" style="padding:40px 16px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;">
                    <tr>
                        <td style="padding:0 0 22px;">
                            <table cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td style="width:30px;height:30px;border-radius:8px;background-color:{{ $accent }};color:#081b12;font-family:Consolas,'Liberation Mono',monospace;font-size:12px;font-weight:700;line-height:30px;text-align:center;">&lt;/&gt;</td>
                                    <td style="padding-left:9px;color:#f3f7f5;font-family:'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:-0.35px;">Mohi</td>
                                    <td style="padding-left:8px;color:#71849d;font-family:Consolas,'Liberation Mono',monospace;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;">{{ $product }}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="border:1px solid #293a55;border-top:2px solid {{ $accent }};border-radius:16px;background-color:#17223a;box-shadow:0 14px 34px rgba(0,0,0,0.24);">
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td style="padding:40px;">
                                        {{ $slot }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @if ($footer)
                        <tr>
                            <td style="padding:20px 8px 0;color:#6f829a;font-size:12px;line-height:1.55;text-align:center;">
                                {{ $footer }}
                            </td>
                        </tr>
                    @endif
                    <tr>
                        <td style="padding:16px 8px 0;color:#52677f;font-size:11px;line-height:1.5;text-align:center;">
                            &copy; {{ date('Y') }} Mohi &middot; <a href="https://mohiebi.com" style="color:#71849d;text-decoration:none;">mohiebi.com</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
