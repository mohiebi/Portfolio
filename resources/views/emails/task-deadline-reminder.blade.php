@php
    $count = count($tasks);
    $footer = $count === 1
        ? "You're receiving this because this task is due today in Mohi TaskManager."
        : "You're receiving this because these tasks are due today in Mohi TaskManager.";
@endphp
<x-email.layout product="TaskManager" accent="#f59e0b" :footer="$footer">
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
        <tr>
            <td style="padding:10px 14px;border:1px solid #744719;border-radius:8px;background-color:#352514;">
                <p style="margin:0 0 4px;color:#fbbf6b;font-family:Consolas,'Liberation Mono',monospace;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;">Due today</p>
                <p style="margin:0;color:#f3f7f5;font-family:'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:-0.3px;">{{ $deadlineDate }}</p>
            </td>
        </tr>
    </table>

    @if ($count === 1)
        <h1 style="margin:0 0 16px;color:#f3f7f5;font-family:'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:27px;font-weight:700;letter-spacing:-0.55px;line-height:1.2;">{{ $tasks[0]['isSubtask'] ? 'A subtask is due today' : 'A task is due today' }}</h1>
        <p style="margin:0 0 28px;color:#a9b8ca;font-size:15px;line-height:1.65;"><strong style="color:#f3f7f5;font-weight:700;">{{ $tasks[0]['title'] }}</strong> is due today. Open TaskManager to review it and move it forward.</p>

        <x-email.button :url="$tasks[0]['url']" color="#f59e0b">View task</x-email.button>
    @else
        <h1 style="margin:0 0 16px;color:#f3f7f5;font-family:'Space Grotesk',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:27px;font-weight:700;letter-spacing:-0.55px;line-height:1.2;">{{ $count }} tasks are due today</h1>
        <p style="margin:0 0 20px;color:#a9b8ca;font-size:15px;line-height:1.65;">Open TaskManager to review them and move them forward.</p>

        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;border-top:1px solid #293a55;">
            @foreach ($tasks as $task)
                <tr>
                    <td style="padding:14px 0;border-bottom:1px solid #293a55;">
                        <p style="margin:0;font-size:15px;line-height:1.4;"><a href="{{ $task['url'] }}" style="color:#f3f7f5;font-weight:700;text-decoration:none;">{{ $task['title'] }}</a></p>
                        @if ($task['isSubtask'] && $task['parentTitle'])
                            <p style="margin:4px 0 0;color:#71849d;font-size:12px;line-height:1.4;">Subtask of {{ $task['parentTitle'] }}</p>
                        @endif
                    </td>
                </tr>
            @endforeach
        </table>

        <x-email.button :url="$indexUrl" color="#f59e0b">Open TaskManager</x-email.button>
    @endif
</x-email.layout>
