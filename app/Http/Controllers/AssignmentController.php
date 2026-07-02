<?php

namespace App\Http\Controllers;

use App\Models\assignment;
use App\Models\Materi;
use App\Models\User;
use App\Models\recentSubmissions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AssignmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Materi $materi) 
    {
        $students = User::where('role', 'student')->where('class', $materi->class)->get()->map(function($student) use ($materi) {
            
            $tugas = Assignment::where('user_id', $student->id)
                                        ->where('materi_id', $materi->id)
                                        ->first();

            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'status_tugas' => $tugas ? $tugas->status : 'Belum Diberikan',
                'has_submitted' => $tugas && $tugas->status !== 'Belum Mengumpulkan',
                'assignment_id' => $tugas ? $tugas->id : null,
            ];
        });

        return \Inertia\Inertia::render('Assignment/Index', [
            'materi' => $materi,
            'students' => $students
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Materi $materi)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:users,id',
            'submission_type' => 'required|string|in:link_video,foto,google_form',
            'google_form_link' => 'nullable|url',
            'due_date' => 'required|date',
            'description' => 'nullable|string'
        ]);

        foreach ($request->student_ids as $studentId) {
            Assignment::updateOrCreate(
                [
                    'materi_id' => $materi->id,
                    'user_id' => $studentId,
                ],
                [
                    'submission_type' => $request->submission_type,
                    'google_form_link' => $request->submission_type === 'google_form' ? $request->google_form_link : null,
                    'due_date' => $request->due_date,
                    'description' => $request->description,
                    'status' => 'Belum Mengumpulkan',
                ]
            );
            recentSubmissions::create([
                'assignment_id' => Assignment::where('materi_id', $materi->id)->where('user_id', $studentId)->first()->id,
                'user_id' => $studentId,
                'due_date' => $request->due_date,
                'status' => 'Needs Feedback',
                'created_by' => Auth::id(),
                'created_at' => now(),
            ]);
        }

        return back()->with('success', 'Tugas berhasil diberikan kepada murid terpilih!');
    }

    public function review(Assignment $assignment)
    {
        $assignment->load(['user', 'materi']);

        return \Inertia\Inertia::render('Assignment/Review', [
            'assignment' => $assignment
        ]);
    }

    public function updateScore(Request $request, Assignment $assignment)
    {
        $request->validate([
            'score' => 'required|integer|min:0|max:100',
        ]);

        $assignment->score = $request->score;
        $assignment->save();

        $recentSubmission = recentSubmissions::where('assignment_id', $assignment->id)->first();
        if ($recentSubmission) {
            $recentSubmission->status = 'Reviewed';
            $recentSubmission->due_date = now();
            $recentSubmission->updated_by = Auth::id();
            $recentSubmission->updated_at = now();
            $recentSubmission->save();
        }

        return back()->with('success', 'Nilai berhasil disimpan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(assignment $assignment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(assignment $assignment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, assignment $assignment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(assignment $assignment)
    {
        //
    }
}
