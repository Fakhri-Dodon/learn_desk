import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

// Fungsi bantuan untuk mengubah link YouTube atau GDrive menjadi link Embed
const getVideoEmbedUrl = (url) => {
    if (!url) return null;

    // 1. Cek apakah ini link YouTube
    const ytRegExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = url.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
        return `https://www.youtube.com/embed/${ytMatch[2]}`;
    }

    // 2. Cek apakah ini link Google Drive
    // Mencari ID unik dokumen (kumpulan huruf dan angka acak) di tengah link
    const gdriveRegExp = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const gdriveMatch = url.match(gdriveRegExp);
    if (gdriveMatch && gdriveMatch[1]) {
        // Mengubah formatnya menjadi preview agar bisa diputar di iframe
        return `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`;
    }

    // 3. Jika bukan keduanya, kembalikan URL aslinya
    // (Bisa digunakan jika kamu memasukkan link berakhiran .mp4 langsung)
    return url;
};

export default function Show({ materi }) {
    // Jalankan fungsinya untuk mendapatkan link yang siap diputar
    const embedUrl = getVideoEmbedUrl(materi.link);

    return (
        <AuthenticatedLayout>
            <Head title={materi.title} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Membuat Grid: 1 kolom di HP, 3 kolom di layar besar (Desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* BAGIAN KIRI (Video, Judul, Deskripsi) - Mengambil porsi 2 kolom */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                {/* 1. Video Player */}
                                {embedUrl && (
                                    <div className="relative w-full aspect-video bg-black">
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={embedUrl}
                                            title={materi.title}
                                            frameBorder="0"
                                            // Menambahkan allow="fullscreen" yang lebih general untuk berbagai platform
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}

                                {/* 2. Judul & Deskripsi */}
                                <div className="p-6 text-gray-900">
                                    <h3 className="text-2xl font-bold mb-4">
                                        {materi.title}
                                    </h3>

                                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed line-clamp-2">
                                        {materi.description}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BAGIAN KANAN (Tombol Penugasan) - Mengambil porsi 1 kolom */}
                        <div className="md:col-span-1">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 sticky top-6">
                                <h4 className="text-lg font-bold text-gray-900 mb-2">
                                    Penugasan Materi
                                </h4>
                                {/* <p className="text-sm text-gray-600 mb-6">
                                    Setelah memahami video dan materi di samping, silakan kerjakan penugasan untuk menguji pemahamanmu.
                                </p> */}

                                <Link
                                    href={`/assignment/${materi.id}`}
                                    className="w-full inline-flex justify-center items-center px-4 py-3 bg-indigo-600 border border-transparent rounded-md font-bold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-md"
                                >
                                    Beri Penugasan
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
