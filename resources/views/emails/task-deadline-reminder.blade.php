<x-email.layout product="TaskManager" accent="#f59e0b" footer="You're receiving this because this task is due today in Mohi TaskManager.">
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
        <tr>
            <td style="padding:10px 14px;border:1px solid #744719;border-radius:8px;background-color:#352514;">
                <p style="margin:0 0 4px;color:#fbbf6b;font-family:Consolas,'Liberation Mono',monospace;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;">Due today</p>
                <p style="margin:0;color:#f3f7f5;font-family:'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:-0.3px;">{{ $deadlineDate }}</p>
            </td>
        </tr>
    </table>

    <h1 style="margin:0 0 16px;color:#f3f7f5;font-family:'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:27px;font-weight:700;letter-spacing:-0.55px;line-height:1.2;">{{ $isSubtask ? 'A subtask is due today' : 'A task is due today' }}</h1>
    <p style="margin:0 0 28px;color:#a9b8ca;font-size:15px;line-height:1.65;"><strong style="color:#f3f7f5;font-weight:700;">{{ $taskTitle }}</strong> is due today. Open TaskManager to review it and move it forward.</p>

    <x-email.button :url="$taskUrl" color="#f59e0b">View task</x-email.button>
</x-email.layout>
