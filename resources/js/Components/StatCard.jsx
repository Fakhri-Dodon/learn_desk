export default function StatCard({ label, value = 0, icon = null }) {
    return (
        <div className="rounded-xl bg-white shadow-sm p-6 flex items-start">
            {icon && (
                <div className="mr-4 flex-shrink-0">
                    {icon}
                </div>
            )}
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                    {label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {value}
                </p>
            </div>
        </div>
    );
}
