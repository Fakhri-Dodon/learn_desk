export default function Card({ children, className = '', highlight = false }) {
    return (
        <div className={`rounded-xl shadow-sm p-6 ${highlight ? 'bg-indigo-50 border border-indigo-200' : 'bg-white'} ${className}`}>
            {children}
        </div>
    );
}
