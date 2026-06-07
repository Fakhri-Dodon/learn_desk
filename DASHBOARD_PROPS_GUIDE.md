# Dashboard Props & Inertia Integration Guide

## Overview
The Dashboard page now supports dynamic data through Inertia props from the Laravel backend. All components have fallback mock data for development.

## Props Structure

### 1. Dashboard Page Props (`resources/js/Pages/Dashboard.jsx`)

The Dashboard component expects the following props from the Laravel controller:

```php
// In your DashboardController or route handler
return Inertia::render('Dashboard', [
    // User authentication (already handled by middleware)
    'auth' => [
        'user' => $user, // Current authenticated user
    ],
    
    // Stats cards data
    'stats' => [
        [
            'label' => 'TOTAL STUDENTS',
            'value' => '1,284',
            'icon' => 'faUserGroup',
            'bgColor' => 'bg-blue-50',
            'textColor' => 'text-indigo-600',
        ],
        [
            'label' => 'ASSIGNMENTS TO GRADE',
            'value' => '42',
            'icon' => 'faClipboardList',
            'bgColor' => 'bg-red-50',
            'textColor' => 'text-red-600',
        ],
        [
            'label' => 'MATERIALS CREATED',
            'value' => '156',
            'icon' => 'faBook',
            'bgColor' => 'bg-emerald-50',
            'textColor' => 'text-emerald-600',
        ],
    ],
    
    // Recent submissions
    'recentSubmissions' => [
        [
            'id' => 1,
            'name' => 'Liam Carter',
            'assignment' => 'Quantum Field Theory - Lab 4',
            'time' => '2 hours ago',
            'status' => 'Reviewing',
            'statusBg' => 'bg-blue-100',
            'statusText' => 'text-blue-700',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
        ],
        // ... more submissions
    ],
    
    // Grading progress
    'gradingProgress' => [
        [
            'courseId' => 1,
            'courseName' => 'Advanced Physics',
            'progress' => 82,
        ],
        [
            'courseId' => 2,
            'courseName' => 'Quantum Mechanics',
            'progress' => 45,
        ],
    ],
    
    // Banner data
    'totalAssignmentsPending' => 12,
]);
```

### 2. Component Props

#### WelcomeBanner Component
```jsx
<WelcomeBanner
    userName={user.name}              // string
    pendingAssignments={12}           // number
    moduleName="Advanced Quantum Mechanics" // string
    onAction={() => {}}               // optional callback
/>
```

#### RecentSubmissionsTable Component
```jsx
<RecentSubmissionsTable
    submissions={recentSubmissions}   // array of submission objects
    onViewAll={() => {}}              // callback for "View All" button
    onSubmissionClick={(id) => {}}    // callback for clicking a submission
/>
```

#### GradingProgressCard Component
```jsx
<GradingProgressCard
    gradingData={gradingProgress}     // array of course progress objects
    onResumeGrading={(courseId) => {}} // callback for resume button
/>
```

## Props Interface Examples

### Stats Card Object
```javascript
{
    label: string,          // e.g., "TOTAL STUDENTS"
    value: string | number, // e.g., "1,284"
    icon: IconType,         // FontAwesome icon import
    bgColor: string,        // Tailwind class, e.g., "bg-blue-50"
    textColor: string,      // Tailwind class, e.g., "text-indigo-600"
}
```

### Submission Object
```javascript
{
    id: number,
    name: string,              // Student name
    assignment: string,        // Assignment title
    time: string,              // e.g., "2 hours ago"
    status: string,            // e.g., "Reviewing" | "Needs Feedback"
    statusBg: string,          // Tailwind class for badge background
    statusText: string,        // Tailwind class for badge text
    avatar: string,            // Avatar URL or data URI
}
```

### Grading Progress Object
```javascript
{
    courseId: number,
    courseName: string,        // e.g., "Advanced Physics"
    progress: number,          // 0-100 percentage
}
```

## Fallback / Mock Data

All components have built-in mock data that displays when props are not provided:

- **Stats Cards**: Default 1,284 students, 42 assignments to grade, 156 materials
- **Recent Submissions**: 3 sample submissions (Liam Carter, Sophia Martinez, Ethan Wright)
- **Grading Progress**: Physics (82%) and Quantum Mechanics (45%)

This ensures the UI doesn't break during development while waiting for backend data.

## State Management

### Local Component State
Components use React `useState` for interactive features:

- `isSidebarOpen`: Toggle sidebar visibility
- `selectedGradingCourse`: Track selected course for grading
- `loading`: Handle async operations
- `selectedSubmissionId`: Track selected submission

### Dynamic Active Menu
The sidebar automatically highlights the active menu item based on the current URL:

```javascript
const navItems = [
    {
        label: "Dashboard",
        href: route("dashboard"),
        active: url === "/dashboard", // Auto-detected
    },
    // ... more items
];
```

## Routing & Navigation

### Navigation Methods

1. **Sidebar Links**: Use Inertia `Link` component for client-side navigation
   ```jsx
   <Link href={route("dashboard")}>Dashboard</Link>
   ```

2. **Direct Navigation**: Use `window.location.href` for external redirects
   ```javascript
   window.location.href = '/assignment/review/1';
   ```

3. **Route Helpers**: Use Laravel `route()` helper in Blade-rendered components
   ```javascript
   href={route("student.assignments.index")}
   ```

## Example Backend Integration

```php
// app/Http/Controllers/DashboardController.php
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Assignment;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Fetch real data from database
        $totalStudents = User::where('role', 'student')->count();
        $assignmentsToGrade = Assignment::where('status', 'submitted')->count();
        $materialsCreated = $user->materis()->count();
        
        $recentSubmissions = Assignment::with('student')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($assignment) => [
                'id' => $assignment->id,
                'name' => $assignment->student->name,
                'assignment' => $assignment->title,
                'time' => $assignment->submitted_at->diffForHumans(),
                'status' => $assignment->status,
                'statusBg' => $this->getStatusBgClass($assignment->status),
                'statusText' => $this->getStatusTextClass($assignment->status),
                'avatar' => "https://api.dicebear.com/7.x/avataaars/svg?seed=" . urlencode($assignment->student->name),
            ]);
        
        $stats = [
            [
                'label' => 'TOTAL STUDENTS',
                'value' => number_format($totalStudents),
                'bgColor' => 'bg-blue-50',
                'textColor' => 'text-indigo-600',
            ],
            [
                'label' => 'ASSIGNMENTS TO GRADE',
                'value' => $assignmentsToGrade,
                'bgColor' => 'bg-red-50',
                'textColor' => 'text-red-600',
            ],
            [
                'label' => 'MATERIALS CREATED',
                'value' => $user->materis()->count(),
                'bgColor' => 'bg-emerald-50',
                'textColor' => 'text-emerald-600',
            ],
        ];
        
        $gradingProgress = $user->courses()
            ->with('assignments')
            ->get()
            ->map(fn($course) => [
                'courseId' => $course->id,
                'courseName' => $course->name,
                'progress' => $this->calculateGradingProgress($course),
            ]);
        
        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentSubmissions' => $recentSubmissions,
            'gradingProgress' => $gradingProgress,
        ]);
    }
    
    private function getStatusBgClass($status)
    {
        return match($status) {
            'reviewing' => 'bg-blue-100',
            'needs_feedback' => 'bg-red-100',
            'graded' => 'bg-green-100',
            default => 'bg-gray-100',
        };
    }
    
    private function getStatusTextClass($status)
    {
        return match($status) {
            'reviewing' => 'text-blue-700',
            'needs_feedback' => 'text-red-700',
            'graded' => 'text-green-700',
            default => 'text-gray-700',
        };
    }
    
    private function calculateGradingProgress($course)
    {
        $total = $course->assignments->count();
        if ($total === 0) return 0;
        
        $graded = $course->assignments->where('status', 'graded')->count();
        return (int)(($graded / $total) * 100);
    }
}
```

## Current Route Behavior

### Available Routes
- `route("dashboard")` → `/dashboard`
- `route("student.assignments.index")` → `/tugas-saya`
- `route("student.assignments.show", $id)` → `/tugas-saya/{id}`
- `route("profile.edit")` → `/profile`

### Navigation Fallbacks
- If props not provided, components use mock data
- Buttons navigate to default routes if handlers not provided
- Sidebar active state updates based on current URL

## Testing Props Locally

To test with custom props in development, you can pass them in your web.php routes:

```php
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'stats' => [...],
        'recentSubmissions' => [...],
        'gradingProgress' => [...],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');
```

## Notes

1. **Performance**: Props are passed once on page load. For real-time updates, consider polling or WebSockets
2. **Security**: All data is passed through Inertia, which handles escaping and CSRF protection
3. **Type Safety**: Consider using TypeScript interfaces for strict type checking
4. **Error Handling**: Components gracefully handle missing or malformed props with sensible defaults
