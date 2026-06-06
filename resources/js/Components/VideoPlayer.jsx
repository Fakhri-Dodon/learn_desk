export default function VideoPlayer({ videoUrl, title }) {
    if (!videoUrl) return null;

    return (
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-sm">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={videoUrl}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
            />
        </div>
    );
}
