import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function RecentSubmissionsTable() {
    const submissions = [
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

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Recent Submissions
                </h3>
                <a href="#" className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">
                    View All
                </a>
            </div>

            <div className="space-y-4">
                {submissions.map((submission) => (
                    <div
                        key={submission.id}
                        className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 px-2 rounded transition"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <img
                                src={submission.avatar}
                                alt={submission.name}
                                className="w-10 h-10 rounded-full"
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
                            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
