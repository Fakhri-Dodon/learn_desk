import ProgressBar from './ProgressBar';
import PrimaryButton from './PrimaryButton';
import { useState } from 'react';

export default function GradingProgressCard({
    gradingData = [
        { courseId: 1, courseName: 'Advanced Physics', progress: 82 },
        { courseId: 2, courseName: 'Quantum Mechanics', progress: 45 },
    ],
    onResumeGrading = null,
}) {
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleResumeGrading = async () => {
        setLoading(true);
        if (onResumeGrading) {
            await onResumeGrading(selectedCourse);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Grading Progress
            </h3>

            <div className="space-y-6 flex-1">
                {gradingData && gradingData.length > 0 ? (
                    gradingData.map((course) => (
                        <ProgressBar
                            key={course.courseId}
                            value={course.progress}
                            label={course.courseName}
                            variant="primary"
                            showPercentage={true}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">
                        No grading data available
                    </p>
                )}
            </div>

            <div className="pt-4 border-t border-gray-200 mt-6">
                <PrimaryButton
                    variant="indigo"
                    className="w-full justify-center"
                    onClick={handleResumeGrading}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Resume Grading'}
                </PrimaryButton>
            </div>
        </div>
    );
}
