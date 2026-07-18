<x-email.layout product="Account" footer="If you didn't create an account on Mohi, you can safely ignore this email.">
    <p style="margin:0 0 12px;color:#42d797;font-family:Consolas,'Liberation Mono',monospace;font-size:11px;font-weight:700;letter-spacing:0.9px;text-transform:uppercase;">Account security</p>
    <h1 style="margin:0 0 16px;color:#f3f7f5;font-family:'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:27px;font-weight:700;letter-spacing:-0.55px;line-height:1.2;">Verify your email address</h1>
    <p style="margin:0 0 8px;color:#a9b8ca;font-size:15px;line-height:1.65;">Hi {{ $name }},</p>
    <p style="margin:0 0 28px;color:#a9b8ca;font-size:15px;line-height:1.65;">Confirm your email address to activate your Mohi account. This secure link expires in <strong style="color:#f3f7f5;font-weight:700;">60 minutes</strong>.</p>

    <x-email.button :url="$verificationUrl">Verify email address</x-email.button>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:28px;border-top:1px solid #293a55;">
        <tr>
            <td style="padding-top:20px;color:#71849d;font-size:12px;line-height:1.55;">If the button doesn&rsquo;t work, copy and paste this link into your browser:</td>
        </tr>
        <tr>
            <td style="padding-top:6px;color:#42d797;font-size:11px;line-height:1.55;word-break:break-all;">{{ $verificationUrl }}</td>
        </tr>
    </table>
</x-email.layout>
