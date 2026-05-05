<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Materi;
use Illuminate\Support\Facades\Auth;

class MateriController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'link' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $slug = Str::slug($request->title);

        $request->user()->materis()->create([
            'title' => $request->title,
            'url' => $slug,
            'link' => $request->link,
            'description' => $request->description,
            'created_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Materi created successfully.');
    }

    public function show($slug)
    {
        // Cari materi berdasarkan slug.

        $materi = Materi::where('url', $slug)->where('deleted', 0)->firstOrFail();

        return Inertia::render('Materi/Show', [
            'materi' => $materi
        ]);
    }

    public function update(Request $request, Materi $materi): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $materi->title = $request->title;

        $materi->url = Str::slug($request->title);

        $materi->save();

        return redirect()->back()->with('success', 'Materi updated successfully.');
    }

    public function destroy(Materi $materi): RedirectResponse
    {
        try {
            // Cek apakah quotation sudah dihapus
            if ($materi->deleted == 1) {
                return redirect()->route('materi.index')
                    ->with('error', 'Materi sudah dihapus sebelumnya.');
            }

            $user = Auth::user();

            $materi->update([
                'deleted' => 1,
                'deleted_by' => $user->id,
                'deleted_at' => now(),
                'updated_by' => $user->id,
            ]);

            return redirect()->route('dashboard')
                ->with('success', 'Materi berhasil dihapus!');
        } catch (\Exception $e) {
            return redirect()->route('dashboard')
                ->with('error', 'Gagal menghapus materi: ' . $e->getMessage());
        }
    }
}
