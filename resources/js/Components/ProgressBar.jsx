export default function ProgressBar({ value = 0, label = '', variant = 'primary', showPercentage = true }) {
    const variantClasses = {
        primary: 'bg-indigo-600',
        success: 'bg-green-600',
        warning: 'bg-amber-600',
        danger: 'bg-red-600',
    };

    return (
        <div className="space-y-2">
            {label && (
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    {showPercentage && (
                        <p className="text-sm font-semibold text-gray-900">{value}%</p>
                    )}
                </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${variantClasses[variant] || variantClasses.primary}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
