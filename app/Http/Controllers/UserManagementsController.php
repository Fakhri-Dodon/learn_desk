<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\User;

class UserManagementsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Mengambil semua user, diurutkan dari yang terbaru dimasukkan
        $users = User::latest()->where('deleted', 0)->get();
        
        return Inertia::render('UserManagements/Index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Kosongkan karena menggunakan Modal di halaman Index
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // Validasi input data user baru
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'teacher', 'student'])],
        ]);

        // Enkripsi password sebelum disimpan ke database
        $validated['password'] = Hash::make($request->password);
        $validated['created_by'] = auth()->id();

        User::create($validated);

        // Redirect kembali ke halaman manajemen user dengan membawa flash message (opsional)
        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Kosongkan jika tidak dipakai
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Kosongkan karena menggunakan Modal di halaman Index
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        // Validasi input edit data user
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // Pastikan email unik, tapi abaikan email milik user ini sendiri saat pengecekan
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            // Password bersifat opsional saat edit (hanya diisi jika ingin diganti)
            'password' => 'nullable|string|min:8',
            'role' => ['required', Rule::in(['admin', 'teacher', 'student'])],
        ]);

        // Cek apakah admin mengisi password baru
        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            // Jika kosong, hapus key password dari array agar tidak menimpa password lama dengan string kosong
            unset($validated['password']);
        }
        $validated['updated_by'] = auth()->id();
        $validated['updated_at'] = now();

        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'Data user berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

       if($user->deleted == 1) {
            return redirect()->route('users.index')->with('error', 'User sudah dihapus sebelumnya.');
        }

        $user->deleted = 1;
        $user->deleted_by = auth()->user()->id; // Menyimpan ID admin yang menghapus user
        $user->deleted_at = now();
        $user->save();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }
}