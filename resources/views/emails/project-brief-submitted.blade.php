@php
    $summary = array_filter([
        'From' => $brief->name.($brief->company ? ' ('.$brief->company.')' : ''),
        'Email' => $brief->email,
        'Project' => $brief->projectTypeLabel(),
        'Budget' => $brief->budgetLabel(),
        'Timeline' => str_replace('_', ' ', $brief->timeline),
        'Contact via' => $brief->preferred_contact.($brief->phone ? ' ('.$brief->phone.')' : ''),
        'Language' => $brief->localeLabel(),
    ]);
@endphp
<x-email.layout product="Project Brief" footer="You're receiving this because someone submitted the project brief on your portfolio.">
    <h1 style="margin:0 0 16px;color:#f3f7f5;font-family:'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:27px;font-weight:700;letter-spacing:-0.55px;line-height:1.2;">New project brief</h1>
    <p style="margin:0 0 24px;color:#a9b8ca;font-size:15px;line-height:1.65;"><strong style="color:#f3f7f5;font-weight:700;">{{ $brief->name }}</strong> just filled out the brief. Reply to this email to answer them directly.</p>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;border:1px solid #223049;border-radius:8px;">
        @foreach ($summary as $label => $value)
            <tr>
                <td style="padding:10px 14px;border-bottom:1px solid #223049;color:#71849d;font-family:Consolas,'Liberation Mono',monospace;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;width:110px;">{{ $label }}</td>
                <td style="padding:10px 14px;border-bottom:1px solid #223049;color:#f3f7f5;font-size:14px;">{{ $value }}</td>
            </tr>
        @endforeach
    </table>

    <x-email.button :url="$briefUrl">Open the full brief</x-email.button>
</x-email.layout>
