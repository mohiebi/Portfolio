@extends('Projects.Taskmanager.layouts.master')

@section('title', 'Add Task')

@section('content')

    <div>
        <form action="{{route('taskmanager.store')}}" method="POST">
            @csrf
            <div class="mb-4">
                <label for="title">Title</label>
                <input type="text" name="title" id="title" 
                    @class(['border-red-500'=>$errors->has('title')])
                    value="{{old('title')}}">
                @error('title')
                    <p class="error">{{$message}}</p>
                @enderror
            </div>
            <div class="mb-4">
                <label for="description">Description</label>
                <textarea name="description" id="description" rows="5" @class(['border-red-500'=>$errors->has('description')])>{{old('description')}}</textarea>
                @error('description')
                    <p class="error">{{$message}}</p>
                @enderror
            </div>
            <div class="mb-4">
                <label for="long_description">Long Description</label>
                <textarea name="long_description" id="long_description" rows="10" @class(['border-red-500'=>$errors->has('long_description')])>{{old('long_description')}}</textarea>
                @error('long_description')
                    <p class="error">{{$message}}</p>
                @enderror
                
            </div>
            <div class="flex gap-2 items-center">
                <button class="btn" type="submit">Add Task</button>
                <a class="link" href="{{route('taskmanager.index')}}">Cancel</a>
            </div>
        </form>
    </div>

@endsection