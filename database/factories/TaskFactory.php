<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $complete = fake()->boolean;

        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph,
            'long_description' => fake()->paragraph(5, true),
            'deadline' => fake()->optional()->dateTimeBetween('-1 week', '+2 weeks'),
            'complete' => $complete,
            'status' => $complete ? Task::STATUS_DONE : Task::STATUS_OPEN,
            'done_at' => $complete ? now() : null,
        ];
    }
}
