export default function StatBox({ label, value, icon = null, color = 'indigo' }) {
    const colorClasses = {
        indigo: 'text-indigo-600',
        green: 'text-green-600',
        blue: 'text-blue-600',
        amber: 'text-amber-600',
        red: 'text-red-600',
    };

    return (
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">{label}</p>
            <p className={`text-2xl font-bold ${colorClasses[color] || colorClasses.indigo}`}>
                {value}
            </p>
            {icon && (
                <div className="mt-2 flex justify-center">
                    {icon}
                </div>
            )}
        </div>
    );
}
