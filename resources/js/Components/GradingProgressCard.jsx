import ProgressBar from './ProgressBar';
import PrimaryButton from './PrimaryButton';

export default function GradingProgressCard() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Grading Progress
            </h3>

            <div className="space-y-6">
                <ProgressBar
                    value={82}
                    label="Advanced Physics"
                    variant="primary"
                    showPercentage={true}
                />

                <ProgressBar
                    value={45}
                    label="Quantum Mechanics"
                    variant="primary"
                    showPercentage={true}
                />

                <div className="pt-4 border-t border-gray-200">
                    <PrimaryButton variant="indigo" className="w-full justify-center">
                        Resume Grading
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}
