@extends('Projects.Taskmanager.layouts.master')
@section('title', $task->title )

@section('content')
    <div>
        <a href="{{route('taskmanager.index')}}" class="link">Go back to Tasklist</a>
    </div>
    <div>
        <p class="mb-4 text-slate-700">{{$task->description}}</p>
        <p class="mb-4 text-slate-700">{{$task->long_description}}</p>
        <div>
            <p class="mb-4 text-sm text-slate-500">
                Created {{$task->created_at->diffForHumans()}} <br>
                Last updated {{$task->updated_at->diffForHumans()}}</p>
            <p>
                @if($task->complete)
                    <span class="font-medium text-green-400">Completed</span> 
                @else
                    <span class="font-medium text-red-400">Not Completed</span>
                @endif
            </p>
            <div class="flex gap-2">
            <a href="{{route('taskmanager.edit', ['taskmanager'=>$task])}}"
                class="btn">Edit</a>
            
                <form action="{{route('taskmanager-toggle', ['task'=>$task])}}" method="POST">
                    @csrf
                    @method('PUT')
                    <button  class="btn" type="submit"> 
                        mark as {{$task->complete ? 'not completed' : 'completed' }}
                    </button>
                </form>

                <form action="{{route('taskmanager.destroy', ['taskmanager'=>$task])}}" method="POST">
                    @csrf
                    @method('DELETE')
                    <button class="btn" type="submit">Delete</button>
                </form>
            </div>
        </div>
    </div>
@endsection