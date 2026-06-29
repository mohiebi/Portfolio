<?php

namespace App\Http\Controllers;

use App\Http\Requests\Taskrequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskmanagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $doneTaskCount = 0;
        $doneCleanupEnabled = false;

        if ($user) {
            $doneTaskCount = $user->tasks()
                ->topLevel()
                ->done()
                ->count();
            $doneCleanupEnabled = (bool) $user->task_done_cleanup_enabled;

            $tasksQuery = $user->tasks()
                ->topLevel()
                ->with('subtasks')
                ->latest();

            if ($doneCleanupEnabled) {
                $tasksQuery->visibleOnTaskBoard();
            }

            $tasks = $tasksQuery->get();
        } else {
            $tasks = $this->demoTasks();
        }

        return Inertia::render('Taskmanager/Index', [
            'tasks' => $tasks,
            'demoMode' => auth()->guest(),
            'doneCleanup' => [
                'enabled' => $doneCleanupEnabled,
                'available' => $user && ($doneTaskCount >= 10 || $doneCleanupEnabled),
                'doneTaskCount' => $doneTaskCount,
                'hideAfterDays' => Task::DONE_BOARD_TTL_DAYS,
                'removeAfterDays' => Task::DONE_RETENTION_DAYS,
            ],
        ]);
    }

    public function updateDoneCleanup(Request $request)
    {
        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
        ]);

        $user = $request->user();
        $enabled = (bool) $data['enabled'];
        $doneTaskCount = $user->tasks()
            ->topLevel()
            ->done()
            ->count();

        if ($enabled && $doneTaskCount < 10 && ! $user->task_done_cleanup_enabled) {
            return redirect()->back()->withErrors([
                'done_cleanup' => 'Done task cleanup becomes available after you have 10 completed tasks.',
            ]);
        }

        $user->forceFill([
            'task_done_cleanup_enabled' => $enabled,
        ])->save();

        $deletedCount = 0;

        if ($enabled) {
            $deletedCount = $user->tasks()
                ->prunableDone()
                ->delete();
        }

        $message = $enabled
            ? 'Done task cleanup enabled. Old completed tasks are now hidden, and month-old inactive ones were removed.'
            : 'Done task cleanup disabled. Older completed tasks will stay visible.';

        if ($deletedCount > 0) {
            $message .= " Removed {$deletedCount} old done task(s).";
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Taskmanager/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Taskrequest $request)
    {
        $returnToIndex = $request->boolean('return_to_index');
        $data = $request->validated();
        $data['description'] ??= '';
        $data['status'] = ($data['complete'] ?? false)
            ? Task::STATUS_DONE
            : ($data['status'] ?? Task::STATUS_OPEN);
        $data['complete'] = $data['status'] === Task::STATUS_DONE;

        $taskmanager = Task::create($data);

        if ($request->expectsJson()) {
            return response()->json([
                'task' => $taskmanager,
                'message' => 'Task created.',
            ], 201);
        }

        if ($returnToIndex) {
            return redirect()->route('taskmanager.index')
                ->with('success', 'Task created.');
        }

        return redirect()->route('taskmanager.show', ['taskmanager' => $taskmanager->id])
            ->with('success', 'Task created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $taskmanager)
    {
        $taskmanager = $this->ownedParentTask($taskmanager)->load('subtasks');

        return Inertia::render('Taskmanager/Show', [
            'task' => $taskmanager,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $taskmanager)
    {
        $taskmanager = $this->ownedParentTask($taskmanager)->load('subtasks');

        return Inertia::render('Taskmanager/Edit', [
            'task' => $taskmanager,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Task $taskmanager, Taskrequest $request)
    {
        $taskmanager = $this->ownedParentTask($taskmanager);
        $data = $request->validated();
        $data['description'] ??= '';

        if (array_key_exists('complete', $data)) {
            $data['status'] = $data['complete'] ? Task::STATUS_DONE : Task::STATUS_OPEN;
        } elseif (array_key_exists('status', $data)) {
            $data['complete'] = $data['status'] === Task::STATUS_DONE;
        }

        $taskmanager->update($data);

        return redirect()->route('taskmanager.show', ['taskmanager' => $taskmanager->id])
            ->with('success', 'Task updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $taskmanager, Request $request)
    {
        $taskmanager = $this->ownedParentTask($taskmanager);
        $deletedTaskId = $taskmanager->id;
        $taskmanager->delete();

        if ($request->expectsJson()) {
            return response()->json([
                'id' => $deletedTaskId,
                'message' => 'Task deleted.',
            ]);
        }

        return redirect()->route('taskmanager.index')
            ->with('success', 'Task deleted.');
    }

    public function togglecomplete(Task $task, Request $request)
    {
        $task = $this->ownedParentTask($task);
        $task->toggleComplete();

        if ($request->expectsJson()) {
            return response()->json([
                'task' => $this->freshTask($task),
                'message' => 'Task updated.',
            ]);
        }

        return redirect()->back()
            ->with('success', 'Task updated.');
    }

    public function updateStatus(Task $task, Request $request)
    {
        $task = $this->ownedParentTask($task);
        $data = $request->validate([
            'status' => ['required', 'in:'.implode(',', [
                Task::STATUS_OPEN,
                Task::STATUS_IN_PROGRESS,
                Task::STATUS_DONE,
            ])],
        ]);

        $task->moveToStatus($data['status']);

        if ($request->expectsJson()) {
            return response()->json([
                'task' => $this->freshTask($task),
                'message' => 'Task updated.',
            ]);
        }

        return redirect()->back()
            ->with('success', 'Task updated.');
    }

    public function storeSubtask(Task $task, Request $request)
    {
        $task = $this->ownedParentTask($task);
        $data = $this->validatedSubtaskData($request, true);

        $subtask = $task->subtasks()->create([
            ...$data,
            'user_id' => auth()->id(),
            'description' => $data['description'] ?? '',
        ]);

        $task->syncStatusFromSubtasks();

        if ($request->expectsJson()) {
            return response()->json([
                'task' => $this->freshTask($task),
                'subtask' => $subtask->fresh(),
                'message' => 'Subtask created.',
            ], 201);
        }

        return redirect()->back()
            ->with('success', 'Subtask created.');
    }

    public function updateSubtask(Task $task, Task $subtask, Request $request)
    {
        $task = $this->ownedParentTask($task);
        $subtask = $this->ownedSubtask($task, $subtask);
        $data = $this->validatedSubtaskData($request);

        $subtask->update($data);
        $task->syncStatusFromSubtasks();

        if ($request->expectsJson()) {
            return response()->json([
                'task' => $this->freshTask($task),
                'subtask' => $subtask->fresh(),
                'message' => 'Subtask updated.',
            ]);
        }

        return redirect()->back()
            ->with('success', 'Subtask updated.');
    }

    public function destroySubtask(Task $task, Task $subtask, Request $request)
    {
        $task = $this->ownedParentTask($task);
        $subtask = $this->ownedSubtask($task, $subtask);
        $deletedSubtaskId = $subtask->id;

        $subtask->delete();
        $task->syncStatusFromSubtasks();

        if ($request->expectsJson()) {
            return response()->json([
                'id' => $deletedSubtaskId,
                'task' => $this->freshTask($task),
                'message' => 'Subtask deleted.',
            ]);
        }

        return redirect()->back()
            ->with('success', 'Subtask deleted.');
    }

    private function ownedParentTask(Task $task): Task
    {
        return auth()->user()->tasks()
            ->topLevel()
            ->whereKey($task->id)
            ->firstOrFail();
    }

    private function ownedSubtask(Task $parent, Task $subtask): Task
    {
        return auth()->user()->tasks()
            ->where('parent_id', $parent->id)
            ->whereKey($subtask->id)
            ->firstOrFail();
    }

    private function freshTask(Task $task): Task
    {
        return $task->fresh()->load('subtasks');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedSubtaskData(Request $request, bool $creating = false): array
    {
        $data = $request->validate([
            'title' => [$creating ? 'required' : 'sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'long_description' => ['nullable', 'string'],
            'deadline' => ['nullable', 'date'],
            'complete' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'in:'.implode(',', [
                Task::STATUS_OPEN,
                Task::STATUS_IN_PROGRESS,
                Task::STATUS_DONE,
            ])],
        ]);

        if (array_key_exists('complete', $data)) {
            $data['status'] = $data['complete'] ? Task::STATUS_DONE : Task::STATUS_OPEN;
        } elseif (array_key_exists('status', $data)) {
            $data['complete'] = $data['status'] === Task::STATUS_DONE;
        } elseif ($creating) {
            $data['status'] = Task::STATUS_OPEN;
            $data['complete'] = false;
        }

        return $data;
    }

    private function demoTasks(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Polish portfolio hero copy',
                'description' => '',
                'long_description' => 'Iterate on the headline, subheading, and call-to-action so the first screen explains the portfolio clearly.',
                'deadline' => now()->addHours(10)->toJSON(),
                'complete' => false,
                'status' => Task::STATUS_OPEN,
                'created_at' => '2 days ago',
                'updated_at' => '2 days ago',
            ],
            [
                'id' => 3,
                'title' => 'Write README for Job Board',
                'description' => '',
                'long_description' => 'Explain the project as a portfolio sample without local setup instructions.',
                'deadline' => now()->addDays(4)->toJSON(),
                'complete' => false,
                'status' => Task::STATUS_IN_PROGRESS,
                'created_at' => '1 week ago',
                'updated_at' => '1 week ago',
                'subtasks' => [
                    [
                        'id' => 301,
                        'title' => 'Outline project setup',
                        'description' => '',
                        'long_description' => 'List the framework, local services, and first-run commands.',
                        'deadline' => now()->subDays(2)->toJSON(),
                        'complete' => true,
                        'status' => Task::STATUS_DONE,
                        'created_at' => '1 week ago',
                        'updated_at' => '1 week ago',
                    ],
                    [
                        'id' => 302,
                        'title' => 'Add screenshots',
                        'description' => '',
                        'long_description' => 'Capture the job listing and application screens.',
                        'deadline' => now()->addHours(18)->toJSON(),
                        'complete' => false,
                        'status' => Task::STATUS_OPEN,
                        'created_at' => '3 days ago',
                        'updated_at' => '3 days ago',
                    ],
                ],
            ],
            [
                'id' => 4,
                'title' => 'Add Pest tests for Auth',
                'description' => '',
                'long_description' => '',
                'deadline' => now()->subDay()->toJSON(),
                'complete' => false,
                'status' => Task::STATUS_OPEN,
                'created_at' => '1 week ago',
                'updated_at' => '1 week ago',
            ],
            [
                'id' => 5,
                'title' => 'Review task manager demo flow',
                'description' => '',
                'long_description' => 'Guest interactions should feel real, but only authenticated users can persist their own tasks.',
                'deadline' => null,
                'complete' => true,
                'status' => Task::STATUS_DONE,
                'created_at' => 'Today',
                'updated_at' => 'Today',
            ],
        ];
    }
}
