<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MateriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Contoh data materi
        $materis = [
            [
                'user_id' => 1, // Ganti dengan ID user yang sesuai
                'title' => 'Materi Matematika',
                'url' => 'materi-matematika',
                'link' => 'https://youtu.be/hU7c6IzqZUY?si=y9YIxcR93zLr2ud2',
                'description' => 'Deskripsi materi matematika',
                'created_by' => 1, // Ganti dengan ID user yang sesuai
                'updated_by' => 1, // Ganti dengan ID user yang sesuai
                'class' => 11, // Ganti dengan kelas yang sesuai
            ],
            [
                'user_id' => 1, // Ganti dengan ID user yang sesuai
                'title' => 'Materi Bahasa Indonesia',
                'url' => 'materi-bahasa-indonesia',
                'link' => 'https://youtu.be/hU7c6IzqZUY?si=y9YIxcR93zLr2ud2',
                'description' => 'Deskripsi materi bahasa indonesia',
                'class' => 11, // Ganti dengan kelas yang sesuai
                'created_by' => 1, // Ganti dengan ID user yang sesuai
                'updated_by' => 1, 
            ],
        ];

        foreach ($materis as $materi) {
            \App\Models\Materi::create($materi);
        }
    }
}
