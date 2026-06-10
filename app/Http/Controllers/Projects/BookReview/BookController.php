<?php

namespace App\Http\Controllers\Projects\BookReview;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $title= $request->input('title');
        $filter= $request->input('filter', ''); 
        $books= Book::when(
            $title,
            fn($query ,$title) => $query->title($title)
        );
        $books=match($filter)
        {
            'popular_last_month' => $books->popularLastMonth(),
            'popular_last_6_months' => $books->popularLast6Months(),
            'highest_rated_last_month' => $books->highestRatedLastMonth(),
            'highest_rated_last_6_months' => $books->highestRatedLast6Months(),
            default => $books->latest()->withAvgRating()->withReviewCount()
        };

        $books= $books->paginate(12)->withQueryString();
        return Inertia::render('Books/Index', [
            'books' => $books,
            'filters' => [
                'title' => $title,
                'filter' => $filter,
            ],
        ]);



    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $book=Book::with(
            [
                'reviews' => fn($query)=>$query->latest()
            ])->withAvgRating()->withReviewCount()->findOrFail($id);
        return Inertia::render('Books/Show', ['book' => $book]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
