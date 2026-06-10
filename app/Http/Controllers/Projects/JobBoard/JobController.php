<?php

namespace App\Http\Controllers\Projects\JobBoard;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //$this->authorize('viewAny', Job::class);
        $filters = request()->only(
            'search',
            'min_salary',
            'max_salary',
            'experience',
            'category'
        );
        return Inertia::render('Jobs/Index', [
            'jobs' => Job::with('employer')->latest()->filter($filters)->paginate(10)->withQueryString(),
            'filters' => $filters,
            'options' => [
                'categories' => Job::$category,
                'experiences' => Job::$experience,
            ],
        ]);
    }

    public function show(Request $request, Job $job)
    {
        //$this->authorize('view', $job);
        $job->load('employer.jobs')->loadCount('jobApplications');

        return Inertia::render('Jobs/Show', [
            'job' => $job->setAttribute(
                'has_applied',
                $request->user() ? $job->hasUserApplied($request->user()) : false
            ),
        ]);
        
    }    

}
