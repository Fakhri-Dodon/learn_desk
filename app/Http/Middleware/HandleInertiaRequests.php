<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\User;
use App\Models\assignment;
use App\Models\materi;
use App\Models\recentSubmissions;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'users' => $request->user() ? User::where('deleted', 0)->get() : [],

            'assigments' => $request->user() ? assignment::where('deleted', 0)
                ->with(['materi', 'user'])
                ->get() : [],

            'materis' => $request->user() ? materi::where('deleted', 0)
                ->with('user')
                ->get() : [],

            'recentSubmissions' => $request->user() ? recentSubmissions::where('deleted', 0)
                ->with(['user', 'assignment.materi'])
                ->latest()
                ->take(5)
                ->get() : [],
            ];
    }
}
