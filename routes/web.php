<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\StudentAssignmentController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::post('/materi', [MateriController::class, 'store'])->name('materi.store');
    Route::get('/materi/{slug}', [MateriController::class, 'show'])->name('materi.show');
    Route::patch('/materi/{materi}', [MateriController::class, 'update'])->name('materi.update');
    Route::delete('/materi/{materi}', [MateriController::class, 'destroy'])->name('materi.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/assignment/{materi}', [AssignmentController::class, 'index'])->name('assignment.index');
    Route::post('/assignment/store/{materi}', [AssignmentController::class, 'store'])->name('assignment.store');
    // Route untuk Sisi Murid
    Route::get('/tugas-saya', [StudentAssignmentController::class, 'index'])->name('student.assignments.index');
    Route::get('/tugas-saya/{assignment}', [StudentAssignmentController::class, 'show'])->name('student.assignments.show');
    Route::post('/tugas-saya/{assignment}/submit', [StudentAssignmentController::class, 'submit'])->name('student.assignments.submit');
    // Route untuk Guru mengecek dan menilai tugas
    Route::get('/assignment/review/{assignment}', [AssignmentController::class, 'review'])->name('assignment.review');
    Route::post('/assignment/review/{assignment}', [AssignmentController::class, 'updateScore'])->name('assignment.updateScore');
});

require __DIR__.'/auth.php';
