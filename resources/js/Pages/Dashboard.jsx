import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import WelcomeCard from '@/Components/WelcomeCard';
import StatCard from '@/Components/StatCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
    const isStudent = user?.role === 'student';

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl">
                {/* Welcome Card */}
                <div className="mb-8">
                    <WelcomeCard userName={user.name} userRole={user.role} />
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isTeacher && (
                        <StatCard
                            label="Tugas Menunggu Penilaian"
                            value={0}
                            icon={<FontAwesomeIcon icon={faClipboardList} className="w-6 h-6 text-indigo-600" />}
                        />
                    )}

                    {isStudent && (
                        <StatCard
                            label="Tugas Mendatang"
                            value={0}
                            icon={<FontAwesomeIcon icon={faClipboardList} className="w-6 h-6 text-indigo-600" />}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
