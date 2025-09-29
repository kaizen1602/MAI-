<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        for ($i = 0; $i < 50; $i++) {
            $reviewer = $users->random();
            $reviewed = $users->where('id', '!=', $reviewer->id)->random();

            Review::create([
                'rating' => rand(1, 5),
                'comment' => 'Esta es una reseña de prueba.',
                'reviewer_id' => $reviewer->id,
                'reviewed_id' => $reviewed->id,
            ]);
        }
    }
}
