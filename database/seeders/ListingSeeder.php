<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ListingSeeder extends Seeder
{
    public function run(): void
    {
        $realtor = User::firstOrCreate(
            ['email' => 'realtor@example.com'],
            [
                'name' => 'Demo Realtor',
                'password' => Hash::make('password'),
                'role' => 1,
            ]
        );

        $listings = [
            ['beds' => 3, 'baths' => 2, 'area' => 120, 'city' => 'Austin', 'code' => '78701', 'street' => '123 Main St', 'price' => 480000],
            ['beds' => 2, 'baths' => 1, 'area' => 80, 'city' => 'Denver', 'code' => '80203', 'street' => '456 Oak Ave', 'price' => 320000],
            ['beds' => 4, 'baths' => 3, 'area' => 200, 'city' => 'Seattle', 'code' => '98101', 'street' => '789 Pine Rd', 'price' => 650000],
            ['beds' => 1, 'baths' => 1, 'area' => 55, 'city' => 'Miami', 'code' => '33101', 'street' => '10 Beach Blvd', 'price' => 275000],
            ['beds' => 5, 'baths' => 4, 'area' => 300, 'city' => 'Los Angeles', 'code' => '90001', 'street' => '22 Sunset Dr', 'price' => 1200000],
        ];

        foreach ($listings as $data) {
            $realtor->listings()->create($data);
        }
    }
}
