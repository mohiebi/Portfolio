<?php

namespace App\Http\Controllers;

use App\Http\Requests\Taskrequest;
use App\Models\Task;
use App\Models\User;

class TaskmanagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        // Fetch the authenticated user's tasks and paginate them
        $tasks = auth()->user()->tasks()->latest()->paginate(10);
    
        return view('Projects.Taskmanager.tasks', [
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
       return view('Projects.Taskmanager.create');
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
        return view('Projects.Taskmanager.show', [
            'task'=> $taskmanager
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $taskmanager )
    {
        return view('Projects.Taskmanager.edit', [
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
