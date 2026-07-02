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
    public function index(Request $request)
    {
        $search = $request->input('search');

        $materis = Materi::query()
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->where('deleted', 0)
            ->latest()
            ->get();

        return Inertia::render('Materi/Index', [
            'materis' => $materis,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'link' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'class' => 'required|integer'
        ]);

        $slug = Str::slug($request->title);

        $request->user()->materis()->create([
            'title' => $request->title,
            'url' => $slug,
            'link' => $request->link,
            'description' => $request->description,
            'class' => $request->class,
            'created_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Materi created successfully.');
    }

    public function show($slug)
    {
        // Cari data
        $materi = Materi::where('url', $slug)->where('deleted', 0)->first();

        // Jika data tidak ketemu, kita gagalkan dengan pesan custom, bukan firstOrFail()
        if (!$materi) {
            return response()->json([
                'error' => 'Data materi dengan slug ' . $slug . ' tidak ditemukan di database!'
            ], 404);
        }

        return Inertia::render('Materi/Show', [
            'materi' => $materi
        ]);
    }

    public function update(Request $request, Materi $materi): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'class' => 'required|integer'
        ]);

        $materi->title = $request->title;
        $materi->description = $request->description;
        $materi->class = $request->class;

        $materi->url = Str::slug($request->title);

        $materi->save();

        return redirect()->back()->with('success', 'Materi updated successfully.');
    }

    public function destroy(Materi $materi): RedirectResponse
    {
        try {
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
