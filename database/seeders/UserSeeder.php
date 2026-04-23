<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
            ],
            [
                'name' => 'Teacher',
                'email' => 'teacher@gmail.com',
                'password' => bcrypt('teacher123'),
                'role' => 'teacher',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
