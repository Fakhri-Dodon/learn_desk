export default function RichTextDisplay({ content, className = '' }) {
    if (!content) return null;

    return (
        <div className={`text-gray-700 whitespace-pre-wrap leading-relaxed ${className}`}>
            {content}
        </div>
    );
}
