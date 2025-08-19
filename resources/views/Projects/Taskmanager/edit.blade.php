@extends('Projects.Taskmanager.layouts.master')

@section('title', 'Edit Task')

@section('content')

    <div class="mb-4">
        <form action="{{route('taskmanager.update',['taskmanager'=>$task->id])}}" method="POST">
            @csrf
            @method('PUT')
            <div class="mb-4">
                <label for="title">Title</label>
                <input type="text" name="title" id="title" 
                @class(['border-red-500'=>$errors->has('title')])
                    value="{{$task->title}}">
                @error('title')
                    <p class="error">{{$message}}</p>
                @enderror
            </div>
            <div class="mb-4">
                <label for="description">Description</label>
                <textarea name="description" id="description" rows="5" @class(['border-red-500'=>$errors->has('description')])>{{$task->description}}</textarea>
                @error('description')
                    <p class="error">{{$message}}</p>
                @enderror
            </div>
            <div>
                <label for="long_description">Long Description</label>
                <textarea name="long_description" id="long_description" rows="10" @class(['border-red-500'=>$errors->has('long_description')])>{{$task->long_description}}</textarea>
                @error('long_description')
                    <p class="error">{{$message}}</p>
                @enderror
            </div>
            <div>
                <button class="btn" type="submit">Edit Task</button>
            </div>
        </form>
    </div>

@endsection