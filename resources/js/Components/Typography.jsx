export default function Typography({ variant = 'body', children, className = '' }) {
    const variantClasses = {
        h1: 'text-3xl font-bold text-gray-900',
        h2: 'text-2xl font-bold text-gray-900',
        h3: 'text-xl font-bold text-gray-900',
        h4: 'text-lg font-bold text-gray-900',
        body: 'text-base text-gray-700',
        bodySmall: 'text-sm text-gray-600',
    };

    return (
        <div className={`${variantClasses[variant] || variantClasses.body} ${className}`}>
            {children}
        </div>
    );
}
