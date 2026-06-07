import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

export default function WelcomeBanner({
    userName = 'Professor',
    pendingAssignments = 12,
    moduleName = 'Advanced Quantum Mechanics',
    onAction = null,
}) {
    return (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-8 text-white shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">
                        Welcome back, {userName}!
                    </h1>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                        Your students have been busy. There are {pendingAssignments} new assignments ready for your review in the {moduleName} module.
                    </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-lg opacity-80">
                        <FontAwesomeIcon icon={faBook} className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
