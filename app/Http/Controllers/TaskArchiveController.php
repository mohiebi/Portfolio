<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskArchiveController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'created_from' => ['nullable', 'date'],
            'created_to' => ['nullable', 'date'],
            'done_from' => ['nullable', 'date'],
            'done_to' => ['nullable', 'date'],
            'include_subtasks' => ['nullable', 'boolean'],
        ]);

        $filters = [
            'q' => $validated['q'] ?? '',
            'created_from' => $validated['created_from'] ?? '',
            'created_to' => $validated['created_to'] ?? '',
            'done_from' => $validated['done_from'] ?? '',
            'done_to' => $validated['done_to'] ?? '',
            'include_subtasks' => $request->boolean('include_subtasks'),
        ];

        $tasksQuery = $request->user()
            ->tasks()
            ->topLevel()
            ->with(['subtasks' => function ($query) {
                $query->done()
                    ->latest('done_at')
                    ->latest();
            }]);

        if ($filters['include_subtasks']) {
            $tasksQuery->where(function ($query) use ($filters) {
                $query->where(function ($query) use ($filters) {
                    $this->applyArchiveFilters($query, $filters);
                })->orWhereHas('subtasks', function ($query) use ($filters) {
                    $this->applyArchiveFilters($query, $filters);
                });
            });
        } else {
            $this->applyArchiveFilters($tasksQuery, $filters);
        }

        $tasks = $tasksQuery
            ->latest('done_at')
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Taskmanager/Archive', [
            'tasks' => $tasks,
            'filters' => $filters,
        ]);
    }

    /**
     * @param  Builder<Task>|Relation<Task, *, *>  $query
     * @param  array{q: string, created_from: string, created_to: string, done_from: string, done_to: string, include_subtasks: bool}  $filters
     */
    private function applyArchiveFilters(Builder|Relation $query, array $filters): void
    {
        $query->done();

        if ($filters['q'] !== '') {
            $keyword = addcslashes($filters['q'], '\\%_');

            $query->where(function ($query) use ($keyword) {
                $query->where('title', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if ($filters['created_from'] !== '') {
            $query->whereDate('created_at', '>=', $filters['created_from']);
        }

        if ($filters['created_to'] !== '') {
            $query->whereDate('created_at', '<=', $filters['created_to']);
        }

        if ($filters['done_from'] !== '') {
            $query->whereDate('done_at', '>=', $filters['done_from']);
        }

        if ($filters['done_to'] !== '') {
            $query->whereDate('done_at', '<=', $filters['done_to']);
        }
    }
}
