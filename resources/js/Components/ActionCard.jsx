export default function ActionCard({ children, className = '' }) {
    return (
        <div className={`rounded-xl bg-white shadow-sm p-6 sticky top-6 ${className}`}>
            {children}
        </div>
    );
}
