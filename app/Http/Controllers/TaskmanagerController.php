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
        $tasks = auth()->check()
            ? auth()->user()->tasks()->latest()->get()
            : $this->demoTasks();

        return Inertia::render('Taskmanager/Index', [
            'tasks' => $tasks,
            'demoMode' => auth()->guest(),
        ]);
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
        $taskmanager = $this->ownedTask($taskmanager);

        return Inertia::render('Taskmanager/Show', [
            'task' => $taskmanager,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $taskmanager)
    {
        $taskmanager = $this->ownedTask($taskmanager);

        return Inertia::render('Taskmanager/Edit', [
            'task' => $taskmanager,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Task $taskmanager, Taskrequest $request)
    {
        $taskmanager = $this->ownedTask($taskmanager);
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
        $taskmanager = $this->ownedTask($taskmanager);
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
        $task = $this->ownedTask($task);
        $task->toggleComplete();

        if ($request->expectsJson()) {
            return response()->json([
                'task' => $task,
                'message' => 'Task updated.',
            ]);
        }

        return redirect()->back()
            ->with('success', 'Task updated.');
    }

    public function updateStatus(Task $task, Request $request)
    {
        $task = $this->ownedTask($task);
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
                'task' => $task,
                'message' => 'Task updated.',
            ]);
        }

        return redirect()->back()
            ->with('success', 'Task updated.');
    }

    private function ownedTask(Task $task): Task
    {
        return auth()->user()->tasks()->whereKey($task->id)->firstOrFail();
    }

    private function demoTasks(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Polish portfolio hero copy',
                'description' => '',
                'long_description' => 'Iterate on the headline, subheading, and call-to-action so the first screen explains the portfolio clearly.',
                'complete' => false,
                'status' => Task::STATUS_OPEN,
                'created_at' => '2 days ago',
                'updated_at' => '2 days ago',
            ],
            [
                'id' => 2,
                'title' => 'Refactor BookController filters',
                'description' => '',
                'long_description' => 'Move popular and highest-rated filters into reusable Eloquent scopes.',
                'complete' => true,
                'status' => Task::STATUS_DONE,
                'created_at' => '5 days ago',
                'updated_at' => '5 days ago',
            ],
            [
                'id' => 3,
                'title' => 'Write README for Job Board',
                'description' => '',
                'long_description' => 'Explain the project as a portfolio sample without local setup instructions.',
                'complete' => false,
                'status' => Task::STATUS_IN_PROGRESS,
                'created_at' => '1 week ago',
                'updated_at' => '1 week ago',
            ],
            [
                'id' => 4,
                'title' => 'Add Pest tests for Auth',
                'description' => '',
                'long_description' => '',
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
                'complete' => true,
                'status' => Task::STATUS_DONE,
                'created_at' => 'Today',
                'updated_at' => 'Today',
            ],
        ];
    }
}
