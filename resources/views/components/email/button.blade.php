@props([
    'color' => '#1eaf6d',
    'url',
])
<table cellpadding="0" cellspacing="0" role="presentation" style="margin:0;">
    <tr>
        <td style="border-radius:8px;background-color:{{ $color }};">
            <a href="{{ $url }}" style="display:inline-block;padding:14px 22px;border-radius:8px;color:#081b12;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.1px;text-decoration:none;">{{ $slot }}</a>
        </td>
    </tr>
</table>
