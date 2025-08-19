<?php

namespace App\Http\Controllers\Projects\JobBoard;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class myJobApplicationController extends Controller
{
    public function index()
    {
        return view(
            'my_job_application.index',
            [
                'applications' => auth()->user()->jobApplications()

                    ->with([
                        'job' => fn($query) => $query->withCount('jobApplications')
                            ->withAvg('jobApplications', 'expected_salary'),
                        'job.employer'
                    ])
                    ->latest()->get()
            ]
        );
    }
    

    public function destroy(JobApplication $myJobApplication)
    {

        $myJobApplication->delete();

        return redirect()->back()->with(
            'success',
            'Job application removed.'
        );
    }
}
