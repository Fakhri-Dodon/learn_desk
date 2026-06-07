import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import WelcomeBanner from '@/Components/WelcomeBanner';
import RecentSubmissionsTable from '@/Components/RecentSubmissionsTable';
import GradingProgressCard from '@/Components/GradingProgressCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faClipboardList, faBook } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
    const isStudent = user?.role === 'student';

    const stats = [
        {
            label: 'TOTAL STUDENTS',
            value: '1,284',
            icon: <FontAwesomeIcon icon={faUserGroup} className="w-6 h-6 text-indigo-600" />,
            bgColor: 'bg-blue-50',
        },
        {
            label: 'ASSIGNMENTS TO GRADE',
            value: '42',
            icon: <FontAwesomeIcon icon={faClipboardList} className="w-6 h-6 text-red-600" />,
            bgColor: 'bg-red-50',
        },
        {
            label: 'MATERIALS CREATED',
            value: '156',
            icon: <FontAwesomeIcon icon={faBook} className="w-6 h-6 text-emerald-600" />,
            bgColor: 'bg-emerald-50',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Banner */}
                {isTeacher && (
                    <WelcomeBanner userName={user.name} />
                )}

                {/* Stat Cards Grid */}
                {isTeacher && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`rounded-xl shadow-sm p-6 ${stat.bgColor}`}
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
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Section: Two Column Layout */}
                {isTeacher && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Submissions - 2 columns */}
                        <div className="lg:col-span-2">
                            <RecentSubmissionsTable />
                        </div>

                        {/* Grading Progress - 1 column */}
                        <div className="lg:col-span-1">
                            <GradingProgressCard />
                        </div>
                    </div>
                )}

                {/* Student View */}
                {isStudent && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome, {user.name}
                        </h2>
                        <p className="text-gray-600">
                            Check the Assignments section to view your pending tasks.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
