export default function WelcomeCard({ userName, userRole }) {
    const roleLabel = {
        teacher: 'Guru',
        student: 'Murid',
        admin: 'Administrator'
    }[userRole] || userRole;

    return (
        <div className="rounded-xl bg-white shadow-sm p-6">
            <h1 className="text-2xl font-semibold text-gray-900">
                Selamat datang, {userName}!
            </h1>
            <p className="mt-2 text-sm text-gray-600">
                Anda login sebagai <span className="font-medium">{roleLabel}</span>
            </p>
        </div>
    );
}
