import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import WelcomeBanner from "@/Components/WelcomeBanner";
import WelcomeCard from "@/Components/WelcomeCard";
import RecentSubmissionsTable from "@/Components/RecentSubmissionsTable";
import GradingProgressCard from "@/Components/GradingProgressCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserGroup,
    faClipboardList,
    faBook,
    faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import React, { useMemo } from "react";

export default function Dashboard() {
    // Get data from Inertia props with fallback to mock data
    const pageProps = usePage().props;
    const auth = pageProps.auth || {};
    const user = auth.user || {
        id: 1,
        name: "Professor",
        email: "professor@example.com",
        role: "teacher",
    };

    const DEFAULT_GRADING = [
        {
            courseId: pageProps.materis?.[0]?.id || 1,
            courseName:
                pageProps.materis?.[0]?.title || "Advanced Quantum Mechanics",
            progress: 82,
        },
        {
            courseId: pageProps.materis?.[1]?.id || 2,
            courseName: pageProps.materis?.[1]?.title || "Quantum Mechanics",
            progress: 45,
        },
    ];

    const usersData = usePage().props.users || [];
    const studentCount = usersData.filter(
        (user) => user.role === "student",
    ).length;
    const teacherCount = usersData.filter(
        (user) => user.role === "teacher",
    ).length;

    const assignmentsData = usePage().props.assigments || [];

    const materisData = usePage().props.materis || [];

    // Mock/Default data as fallback
    const userRole = user?.role || "teacher";

    const DEFAULT_STATS =
        userRole === "admin"
            ? [
                  {
                      label: "TOTAL STUDENTS",
                      value: studentCount || 0, // Pastikan variable studentCount tersedia
                      icon: faUserGroup,
                      bgColor: "bg-blue-50",
                      textColor: "text-indigo-600",
                  },
                  {
                      label: "TOTAL TEACHERS",
                      value: teacherCount || 0,
                      icon: faUserTie,
                      bgColor: "bg-purple-50",
                      textColor: "text-purple-600",
                  },
              ]
            : [
                  {
                      label: "TOTAL STUDENTS",
                      value: studentCount || 0,
                      icon: faUserGroup,
                      bgColor: "bg-blue-50",
                      textColor: "text-indigo-600",
                  },
                  {
                      label: "ASSIGNMENTS TO GRADE",
                      value: assignmentsData?.length || 0,
                      icon: faClipboardList,
                      bgColor: "bg-red-50",
                      textColor: "text-red-600",
                  },
                  {
                      label: "MATERIALS CREATED",
                      value: materisData?.length || 0,
                      icon: faBook,
                      bgColor: "bg-emerald-50",
                      textColor: "text-emerald-600",
                  },
              ];

    // Props from backend with fallback to default data
    const stats = pageProps.stats || DEFAULT_STATS;
    const recentSubmissions =
        pageProps.recentSubmissions || DEFAULT_SUBMISSIONS;
    const assigmentsData = pageProps.assigments || [];

    const materiProgress = (pageProps.materis || []).map((materi) => {
        // 1. Filter assignment yang cocok dengan id materi saat ini
        const totalAssignments = assignmentsData.filter(
            (item) => item.materi_id === materi.id,
        );

        let progress = 0;
        let totalDiberiTugas = totalAssignments.length;
        let totalSudahMengumpulkan = 0;

        if (totalDiberiTugas > 0) {
            totalSudahMengumpulkan = totalAssignments.filter(
                (item) => item.status === "sudah mengumpulkan",
            ).length;

            progress = Math.round(
                (totalSudahMengumpulkan / totalDiberiTugas) * 100,
            );
        }

        return {
            ...materi,
            progress: progress, // Output berupa angka angka: 50
            totalSudahMengumpulkan: totalSudahMengumpulkan, // Output angka: 10
            totalDiberiTugas: totalDiberiTugas, // Output angka: 20
            ratio: `${totalSudahMengumpulkan}/${totalDiberiTugas}`, // Output string: "10/20"
        };
    });

    const totalAssignmentsPending = pageProps.totalAssignmentsPending || 42;

    // Determine user role for conditional rendering
    const isTeacher = user?.role === "teacher";
    const isStudent = user?.role === "student";
    const isAdmin = user?.role === "admin";

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
            window.location.href = "/assignment/1";
        }
    };

    // Transform stats to include icons as components
    const statsWithIcons = stats.map((stat) => ({
        ...stat,
        iconComponent: (
            <FontAwesomeIcon
                icon={stat.icon}
                className={`w-6 h-6 ${stat.textColor}`}
            />
        ),
    }));
    

    const assignmentsCount =
        usePage().props.assignments?.status?.filter(
            (assignment) => assignment.status === "not",
        ).length || 0;

    const [showAllSubmissions, setShowAllSubmissions] = useState(false);

    const handleViewAllSubmissions = () => {
        setShowAllSubmissions(!showAllSubmissions);
    };

    const sortedSubmissions = [...(recentSubmissions || [])].sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB - dateA;
    });

    const displayedSubmissions = showAllSubmissions
        ? sortedSubmissions
        : sortedSubmissions.slice(0, 3);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Banner - Teacher Only */}
                {isTeacher && (
                    <WelcomeBanner
                        userName={user.name}
                        pendingAssignments={assignmentsCount}
                    />
                )}

                {isAdmin && (
                    <WelcomeCard userName={user.name} userRole={user.role} />
                )}

                {/* Stat Cards Grid - Teacher & Admin Only */}
                {isTeacher || isAdmin && (
                    <div className={`grid grid-cols-1 gap-6 ${statsWithIcons.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
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
                                    {/* Sembunyikan tombol jika total data kurang dari atau sama dengan 3 */}
                                    <button
                                        onClick={handleViewAllSubmissions}
                                        disabled={sortedSubmissions.length <= 3}
                                        className={`text-sm font-semibold transition ${
                                            sortedSubmissions.length <= 3
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-indigo-600 hover:text-indigo-700"
                                        }`}
                                    >
                                        {showAllSubmissions
                                            ? "View Less"
                                            : "View All"}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {displayedSubmissions &&
                                    displayedSubmissions.length > 0 ? (
                                        displayedSubmissions.map(
                                            (submission) => {
                                                // Array kombinasi warna latar belakang dan teks Tailwind untuk avatar
                                                const avatarColors = [
                                                    {
                                                        bg: "bg-red-100",
                                                        text: "text-red-700",
                                                    },
                                                    {
                                                        bg: "bg-orange-100",
                                                        text: "text-orange-700",
                                                    },
                                                    {
                                                        bg: "bg-amber-100",
                                                        text: "text-amber-700",
                                                    },
                                                    {
                                                        bg: "bg-emerald-100",
                                                        text: "text-emerald-700",
                                                    },
                                                    {
                                                        bg: "bg-teal-100",
                                                        text: "text-teal-700",
                                                    },
                                                    {
                                                        bg: "bg-sky-100",
                                                        text: "text-sky-700",
                                                    },
                                                    {
                                                        bg: "bg-indigo-100",
                                                        text: "text-indigo-700",
                                                    },
                                                    {
                                                        bg: "bg-fuchsia-100",
                                                        text: "text-fuchsia-700",
                                                    },
                                                    {
                                                        bg: "bg-pink-100",
                                                        text: "text-pink-700",
                                                    },
                                                    {
                                                        bg: "bg-rose-100",
                                                        text: "text-rose-700",
                                                    },
                                                ];

                                                // Menentukan indeks warna berdasarkan ID submission
                                                const colorIndex =
                                                    (submission.id || 0) %
                                                    avatarColors.length;
                                                const selectedColor =
                                                    avatarColors[colorIndex];

                                                // Proteksi judul tugas
                                                let assignmentDisplay =
                                                    "Advanced Quantum Mechanics module";
                                                if (submission?.assignment) {
                                                    if (
                                                        typeof submission.assignment ===
                                                        "string"
                                                    ) {
                                                        assignmentDisplay =
                                                            submission.assignment;
                                                    } else if (
                                                        typeof submission.assignment ===
                                                        "object"
                                                    ) {
                                                        assignmentDisplay =
                                                            submission
                                                                .assignment
                                                                .materi
                                                                ?.title ||
                                                            submission
                                                                .assignment
                                                                .name ||
                                                            `Assignment (ID: ${submission.assignment_id})`;
                                                    }
                                                } else if (
                                                    submission.assignment_id
                                                ) {
                                                    assignmentDisplay = `Assignment (ID: ${submission.assignment_id})`;
                                                }

                                                return (
                                                    <div
                                                        key={submission.id}
                                                        className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 px-2 rounded transition cursor-pointer"
                                                        onClick={() => {
                                                            window.location.href = `/assignment/review/${submission.id}`;
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-4 flex-1">
                                                            {/* Avatar */}
                                                            <div
                                                                className={`flex-shrink-0 w-10 h-10 rounded-full ${selectedColor.bg} ${selectedColor.text} flex items-center justify-center font-bold text-sm shadow-sm`}
                                                            >
                                                                {(
                                                                    submission
                                                                        ?.user
                                                                        ?.name ||
                                                                    submission.name ||
                                                                    "S"
                                                                )
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                {/* Nama Siswa */}
                                                                <p className="font-semibold text-gray-900 text-sm">
                                                                    {submission
                                                                        ?.user
                                                                        ?.name ||
                                                                        submission.name ||
                                                                        `Student (ID: ${submission.user_id})`}
                                                                </p>
                                                                {/* Judul Tugas */}
                                                                <p className="text-xs text-gray-600 truncate">
                                                                    {
                                                                        assignmentDisplay
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-500 mb-1">
                                                                    {submission.time ||
                                                                        (submission.created_at
                                                                            ? new Date(
                                                                                  submission.created_at,
                                                                              ).toLocaleDateString(
                                                                                  "id-ID",
                                                                              )
                                                                            : "Recent")}
                                                                </p>
                                                                <span
                                                                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                                        submission.status ===
                                                                        "Needs Feedback"
                                                                            ? "bg-red-100 text-red-700"
                                                                            : submission.status ===
                                                                                "Reviewing"
                                                                              ? "bg-blue-100 text-blue-700"
                                                                              : "bg-green-100 text-green-700"
                                                                    }`}
                                                                >
                                                                    {
                                                                        submission.status
                                                                    }
                                                                </span>
                                                            </div>
                                                            <svg
                                                                className="w-4 h-4 text-gray-400"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M9 5l7 7-7 7"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">
                                            No recent submissions
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Materi Progress - 1 column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    Materi Progress
                                </h3>

                                <div className="space-y-6 flex-1">
                                    {materiProgress &&
                                    materiProgress.length > 0 ? (
                                        materiProgress.map((course) => (
                                            <div key={course.id}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        {course.title ||
                                                            course.courseName ||
                                                            `Course (ID: ${course.courseId})`}
                                                    </label>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {
                                                            course.totalSudahMengumpulkan
                                                        }
                                                        /
                                                        {
                                                            course.totalDiberiTugas
                                                        }{" "}
                                                        ({course.progress}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="h-2.5 rounded-full bg-indigo-600 transition-all duration-300"
                                                        style={{
                                                            width: `${course.progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">
                                            No Materi data available
                                        </p>
                                    )}
                                </div>

                                {/* <div className="pt-4 border-t border-gray-200 mt-6">
                                    <button
                                        onClick={handleResumeGrading}
                                        disabled={loading}
                                        className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
                                    >
                                        {loading ? 'Loading...' : 'Resume Grading'}
                                    </button>
                                </div> */}
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
                            Check the Assignments section to view your pending
                            tasks.
                        </p>
                        <Link
                            href={route("student.assignments.index")}
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
