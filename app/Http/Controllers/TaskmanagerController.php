<?php

namespace App\Http\Controllers;

use App\Http\Requests\Taskrequest;
use App\Models\Task;
use App\Models\User;
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
        $taskmanager= Task::create($request->validated());
        return redirect()->route('taskmanager.show',['taskmanager' => $taskmanager->id])
        ->with('success', 'Task Added Successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $taskmanager)
    {
        return Inertia::render('Taskmanager/Show', [
            'task'=> $taskmanager
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $taskmanager )
    {
        return Inertia::render('Taskmanager/Edit', [
            'task'=> $taskmanager
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Task $taskmanager, Taskrequest $request)
    {
        $taskmanager->update($request->validated());
        return redirect()->route('taskmanager.show',['taskmanager' => $taskmanager->id]) ->with('success', 'Task Edited Successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $taskmanager)
    {
        $taskmanager->delete();
        return redirect()->route('taskmanager.index');
    }

    public function togglecomplete(Task $task)
    {
        $task->toggleComplete();
        return redirect()->back()
        ->with('success', 'Task Updated Successfully!');
    }
}
