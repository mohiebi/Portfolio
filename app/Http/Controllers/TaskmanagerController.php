<?php

namespace App\Http\Controllers;

use App\Http\Requests\Taskrequest;
use App\Models\Task;
use Inertia\Inertia;

class TaskmanagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = auth()->user()->tasks()->latest()->get();

        return Inertia::render('Taskmanager/Index', [
            'tasks' => $tasks,
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
        $data = $request->validated();
        $data['description'] ??= '';

        $taskmanager = Task::create($data);

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

        $taskmanager->update($data);

        return redirect()->route('taskmanager.show', ['taskmanager' => $taskmanager->id])
            ->with('success', 'Task updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $taskmanager)
    {
        $taskmanager = $this->ownedTask($taskmanager);
        $taskmanager->delete();

        return redirect()->route('taskmanager.index')
            ->with('success', 'Task deleted.');
    }

    public function togglecomplete(Task $task)
    {
        $task = $this->ownedTask($task);
        $task->toggleComplete();

        return redirect()->back()
            ->with('success', 'Task updated.');
    }

    private function ownedTask(Task $task): Task
    {
        return auth()->user()->tasks()->whereKey($task->id)->firstOrFail();
    }
}
