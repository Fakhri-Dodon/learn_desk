import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import WelcomeBanner from '@/Components/WelcomeBanner';
import RecentSubmissionsTable from '@/Components/RecentSubmissionsTable';
import GradingProgressCard from '@/Components/GradingProgressCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faClipboardList, faBook } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

// Mock/Default data as fallback
const DEFAULT_STATS = [
    {
        label: 'TOTAL STUDENTS',
        value: '1,284',
        icon: faUserGroup,
        bgColor: 'bg-blue-50',
        textColor: 'text-indigo-600',
    },
    {
        label: 'ASSIGNMENTS TO GRADE',
        value: '42',
        icon: faClipboardList,
        bgColor: 'bg-red-50',
        textColor: 'text-red-600',
    },
    {
        label: 'MATERIALS CREATED',
        value: '156',
        icon: faBook,
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
    },
];

const DEFAULT_SUBMISSIONS = [
    {
        id: 1,
        name: 'Liam Carter',
        assignment: 'Quantum Field Theory - Lab 4',
        time: '2 hours ago',
        status: 'Reviewing',
        statusBg: 'bg-blue-100',
        statusText: 'text-blue-700',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    },
    {
        id: 2,
        name: 'Sophia Martinez',
        assignment: 'Astrophysics - Final Project',
        time: '5 hours ago',
        status: 'Needs Feedback',
        statusBg: 'bg-red-100',
        statusText: 'text-red-700',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    },
    {
        id: 3,
        name: 'Ethan Wright',
        assignment: 'General Relativity - Essay',
        time: 'Yesterday',
        status: 'Reviewing',
        statusBg: 'bg-blue-100',
        statusText: 'text-blue-700',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
    },
];

const DEFAULT_GRADING = [
    {
        courseId: 1,
        courseName: 'Advanced Physics',
        progress: 82,
    },
    {
        courseId: 2,
        courseName: 'Quantum Mechanics',
        progress: 45,
    },
];

export default function Dashboard() {
    // Get data from Inertia props with fallback to mock data
    const pageProps = usePage().props;
    const auth = pageProps.auth || {};
    const user = auth.user || {
        id: 1,
        name: 'Professor',
        email: 'professor@example.com',
        role: 'teacher',
    };

    // Props from backend with fallback to default data
    const stats = pageProps.stats || DEFAULT_STATS;
    const recentSubmissions = pageProps.recentSubmissions || DEFAULT_SUBMISSIONS;
    const gradingProgress = pageProps.gradingProgress || DEFAULT_GRADING;
    const totalAssignmentsPending = pageProps.totalAssignmentsPending || 42;

    // Determine user role for conditional rendering
    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
    const isStudent = user?.role === 'student';

    // Local state for interactive features
    const [selectedGradingCourse, setSelectedGradingCourse] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handler: Resume Grading - Navigate to grading page
    const handleResumeGrading = () => {
        if (selectedGradingCourse) {
            // Navigate to grading page with course filter
            window.location.href = `/assignment/review/${selectedGradingCourse}`;
        } else {
            // Navigate to general assignment review
            window.location.href = '/assignment/1';
        }
    };

    // Handler: Navigate to view all submissions
    const handleViewAllSubmissions = () => {
        window.location.href = '/assignment/submissions';
    };

    // Transform stats to include icons as components
    const statsWithIcons = stats.map((stat) => ({
        ...stat,
        iconComponent: (
            <FontAwesomeIcon icon={stat.icon} className={`w-6 h-6 ${stat.textColor}`} />
        ),
    }));

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Banner - Teacher Only */}
                {isTeacher && (
                    <WelcomeBanner userName={user.name} />
                )}

                {/* Stat Cards Grid - Teacher Only */}
                {isTeacher && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {statsWithIcons.map((stat, index) => (
                            <div
                                key={index}
                                className={`rounded-xl shadow-sm p-6 ${stat.bgColor} hover:shadow-md transition-shadow`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {stat.iconComponent}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Section: Two Column Layout - Teacher Only */}
                {isTeacher && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Submissions - 2 columns */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Recent Submissions
                                    </h3>
                                    <button
                                        onClick={handleViewAllSubmissions}
                                        className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition"
                                    >
                                        View All
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {recentSubmissions && recentSubmissions.length > 0 ? (
                                        recentSubmissions.map((submission) => (
                                            <div
                                                key={submission.id}
                                                className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 px-2 rounded transition cursor-pointer"
                                                onClick={() => {
                                                    // Navigate to review submission
                                                    window.location.href = `/assignment/review/${submission.id}`;
                                                }}
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <img
                                                        src={submission.avatar}
                                                        alt={submission.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 text-sm">
                                                            {submission.name}
                                                        </p>
                                                        <p className="text-xs text-gray-600 truncate">
                                                            {submission.assignment}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">
                                                            {submission.time}
                                                        </p>
                                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${submission.statusBg} ${submission.statusText}`}>
                                                            {submission.status}
                                                        </span>
                                                    </div>
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">
                                            No recent submissions
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Grading Progress - 1 column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    Grading Progress
                                </h3>

                                <div className="space-y-6 flex-1">
                                    {gradingProgress && gradingProgress.length > 0 ? (
                                        gradingProgress.map((course) => (
                                            <div key={course.courseId}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {course.courseName}
                                                    </label>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {course.progress}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="h-2.5 rounded-full bg-indigo-600 transition-all duration-300"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">
                                            No grading data available
                                        </p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-200 mt-6">
                                    <button
                                        onClick={handleResumeGrading}
                                        disabled={loading}
                                        className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
                                    >
                                        {loading ? 'Loading...' : 'Resume Grading'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Student View */}
                {isStudent && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome, {user.name}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Check the Assignments section to view your pending tasks.
                        </p>
                        <Link
                            href={route('student.assignments.index')}
                            className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                        >
                            View My Assignments
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
