<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentAssignmentController extends Controller
{
    public function index()
    {
        // Ambil tugas khusus untuk user yang login, beserta data materi-nya
        $assignments = Assignment::with('materi')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Student/Assignment/Index', [
            'assignments' => $assignments
        ]);
    }

    public function show(Assignment $assignment)
    {
        // Keamanan: Pastikan murid tidak bisa melihat tugas murid lain
        if ($assignment->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses ke tugas ini.');
        }

        // Load relasi materi agar judul/info materi bisa ditampilkan
        $assignment->load('materi');

        return Inertia::render('Student/Assignment/Show', [
            'assignment' => $assignment
        ]);
    }

    public function submit(Request $request, Assignment $assignment)
    {
        if ($assignment->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($assignment->submission_type === 'foto') {
            $request->validate([
                'jawaban_file' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            ]);
            $path = $request->file('jawaban_file')->store('jawaban_tugas', 'public');
            $assignment->answer = $path;
        } 
        elseif ($assignment->submission_type === 'link_video') {
            $request->validate([
                'jawaban_link' => 'required|url',
            ]);
            $assignment->answer = $request->jawaban_link;
        }
        elseif ($assignment->submission_type === 'google_form') {
            $assignment->answer = 'Tugas diselesaikan via Google Form';
        }

        $assignment->status = 'Sudah Mengumpulkan';
        $assignment->save();

        return back()->with('success', 'Tugas berhasil dikumpulkan!');
    }
}