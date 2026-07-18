<x-email.layout product="Real Estate" footer="You're receiving this because you have an active listing on Mohi Real Estate.">
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
        <tr>
            <td style="padding:10px 14px;border:1px solid #236143;border-radius:8px;background-color:#112b25;">
                <p style="margin:0 0 4px;color:#8cbda5;font-family:Consolas,'Liberation Mono',monospace;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;">Offer amount</p>
                <p style="margin:0;color:#42d797;font-family:'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:28px;font-weight:700;letter-spacing:-0.65px;">${{ $amount }}</p>
            </td>
        </tr>
    </table>

    <h1 style="margin:0 0 16px;color:#f3f7f5;font-family:'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:27px;font-weight:700;letter-spacing:-0.55px;line-height:1.2;">New offer on your listing</h1>
    <p style="margin:0 0 28px;color:#a9b8ca;font-size:15px;line-height:1.65;">Someone has made an offer of <strong style="color:#f3f7f5;font-weight:700;">${{ $amount }}</strong> on one of your listings. Log in to review and respond.</p>

    <x-email.button :url="$listingUrl">View listing</x-email.button>
</x-email.layout>
