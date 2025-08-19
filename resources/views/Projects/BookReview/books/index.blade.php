@extends('Projects.BookReview.layouts.app')

@section('content')
    <h1 class="mb-10 text-2xl">Books</h1>
   
    <form action="{{route('books.index')}}" method="GET" class="flex mb-4 items-center space-x-2">
        <input type="text" name="title" placeholder="Search by title" class="input h-10" value="{{request('title')}}">
        <input type="hidden" name="filter" value="{{request('filter')}}">
        <button type="submit" class="btn h-10">Search</button>
        <a href="{{route('books.index')}}" class="btn h-10">clear</a>
    </form>
    <div class="filter-container mb-4 flex" >
        @php
            $filters=[
                '' => 'latest' ,
                'popular_last_month' => 'popular last month' ,
                'popular_last_6_months' => 'popular last 6 months',
                'highest_rated_last_month' => 'highest rated last month',
                'highest_rated_last_6_monthS' => 'highest rated last 6 months'
            ]
        @endphp

        @foreach ($filters as $key=> $lable )
            <a href="{{route('books.index' , [...request()->query(),'filter'=> $key])}}" 
                class="{{request('filter') === $key || (request('filter')=== null && $key==='')  ? 'filter-item-active'  : 'filter-item' }}">
                    {{$lable}}
            </a>
            
        @endforeach
    </div>
    <ul>
        @forelse ($books as $book)
            <li class="mb-4">
                <div class="book-item">
                    <div class="flex flex-wrap items-center justify-between">
                        <div class="w-full flex-grow sm:w-auto">
                            <a href="{{route('books.show', $book)}}" class="book-title">{{$book->title}}</a>
                            <span class="book-author">by {{$book->author}}</span>
                        </div>
                        <div>
                            <div class="book-rating">
                                <x-star-rating :rating="$book->reviews_avg_rating"/>
                            </div>
                            <div class="book-review-count">
                                out of {{$book->reviews_count}} {{Str::plural('review', $book->reviews_count)}}
                            </div>
                        </div>
                    </div>
                </div>
            </li>            
        @empty
            <li class="mb-4">
                <div class="empty-book-item">
                <p class="empty-text">No books found</p>
                <a href="{{route('books.index')}}" class="reset-link">Reset criteria</a>
                </div>
            </li>  
        @endforelse
    </ul>
@endsection