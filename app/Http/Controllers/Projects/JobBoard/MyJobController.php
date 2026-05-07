<?php

namespace App\Http\Controllers\Projects\JobBoard;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobRequest;
use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyJobController extends Controller
{
    public function index()
    {
        $this->authorize('viewAnyEmployer', Job::class);
        return Inertia::render('MyJobs/Index', [
            'jobs' => auth()->user()->employer
                ->jobs()
                ->with('employer')
                ->withCount('jobApplications')
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Job::class);
        return Inertia::render('MyJobs/Create', [
            'options' => [
                'categories' => Job::$category,
                'experiences' => Job::$experience,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(JobRequest $request)
    {
        $this->authorize('create', Job::class);
        auth()->user()->employer->jobs()->create($request->validated());

        return redirect()->route('my-jobs.index')
            ->with('success', 'Job created successfully.');
    }


    public function edit(Job $myJob)
    {
        $this->authorize('update', $myJob);
        return Inertia::render('MyJobs/Edit', [
            'job' => $myJob,
            'options' => [
                'categories' => Job::$category,
                'experiences' => Job::$experience,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(JobRequest $request, Job $myJob)
    {
        $this->authorize('update', $myJob);
        $myJob->update($request->validated());

        return redirect()->route('my-jobs.index')
            ->with('success', 'Job updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
