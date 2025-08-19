<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Employer;
use App\Models\Job;
use App\Models\Review;
use App\Models\Task;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //    'name' => 'Mohammad Hosein',
        //    'email' => 'e.mohamadhosein@gmail.com',  
        //]);

        Book::factory(34)->create()->each(function ($book) {
            $numReview = random_int(5, 30);
            Review::factory()->count($numReview)
                ->good()
                ->for($book)
                ->create();
        });

        Book::factory(33)->create()->each(function ($book) {
            $numReviews = random_int(5, 30);

            Review::factory()->count($numReviews)
                ->average()
                ->for($book)
                ->create();
        });

        Book::factory(34)->create()->each(function ($book) {
            $numReviews = random_int(5, 30);

            Review::factory()->count($numReviews)
                ->bad()
                ->for($book)
                ->create();
        });
        
        User::factory()->create
        ([
            'name' =>'Mohammad Hosein',
            'email' => 'e.mohamadhosein@gmail.com',
            // 'email_verified_at' => now(),
            'password' => Hash::make('9375473295h'),
            'remember_token' => '',
            'role'=>'7'
         ]);
         User::factory(300)->create();

         $users = User::all()->shuffle();
 
         for ($i = 0; $i < 20; $i++) {
             Employer::factory()->create([
                 'user_id' => $users->pop()->id
             ]);
         }
 
         $employers = Employer::all();
 
         for ($i = 0; $i < 100; $i++) {
             Job::factory()->create([
                 'employer_id' => $employers->random()->id
             ]);
         }
         foreach ($users as $user) {
             $jobs = \App\Models\Job::inRandomOrder()->take(rand(0, 4))->get();
 
             foreach ($jobs as $job) {
                 \App\Models\JobApplication::factory()->create([
                     'job_id' => $job->id,
                     'user_id' => $user->id
                 ]);
             }
         }
        //  Task::factory(20)->create([
        //     'user_id' => $users->random()->id
        //  ]);
    }
    


    
}
