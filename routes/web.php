<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\StudentAssignmentController;
use App\Http\Controllers\UserManagementsController;

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
    Route::get('/materi', [MateriController::class, 'index'])->name('materi.index');
    Route::get('/materi/create', [MateriController::class, 'create'])->name('materi.create');
    Route::post('/materi/store', [MateriController::class, 'store'])->name('materi.store');
    Route::patch('/materi/{materi}/update', [MateriController::class, 'update'])->name('materi.update');
    Route::delete('/materi/{materi}/delete', [MateriController::class, 'destroy'])->name('materi.destroy');
    Route::get('/materi/{slug}', [MateriController::class, 'show'])->name('materi.show');
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

Route::middleware('auth')->group(function () {
    Route::get('/users-managements', [UserManagementsController::class, 'index'])->name('users.index');
    Route::post('/users-managements/store', [UserManagementsController::class, 'store'])->name('users.store');
    Route::patch('/users-managements/{user}/update', [UserManagementsController::class, 'update'])->name('users.update');
    Route::delete('/users-managements/{user}/delete', [UserManagementsController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/auth.php';
