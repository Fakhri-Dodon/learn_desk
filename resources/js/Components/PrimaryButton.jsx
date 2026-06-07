export default function PrimaryButton({
    className = '',
    disabled,
    children,
    variant = 'default',
    ...props
}) {
    const variantClasses = {
        default: 'bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900',
        indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800',
    };

    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    variantClasses[variant] || variantClasses.default
                } ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
