@extends('Projects.Taskmanager.layouts.master')
@section('title', "Tasks" )
   
   
@section('content')
    <nav class="mb-4">
        <a href="{{route('taskmanager.create')}}" class="link">Add Task</a>
    </nav>
    <div>
        @forelse ($tasks as $task)
        <div>
            <a href="{{route('taskmanager.show' , ['taskmanager'=>$task->id])}}" 
                @class(['line-through'=>$task->complete]) >
                {{$task->title}}
            </a> 
        </div>
        @empty
            <div>no task</div> 
        @endforelse
    
    </div>
    <nav class="mt-4">
        @if($tasks->count())
        {{ $tasks->links()}}

        @endif
    </nav>
@endsection