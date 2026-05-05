import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function StudentAssignmentShow({ assignment }) {
    const { data, setData, post, processing, errors } = useForm({
        jawaban_file: null,
        jawaban_link: '',
    });

    const isSubmitted = assignment.status === 'Sudah Mengumpulkan';

    const handleSubmit = (e) => {
        e.preventDefault();
        // Paksa Inertia menggunakan metode POST untuk upload file
        post(`/tugas-saya/${assignment.id}/submit`);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <Head title={`Tugas - ${assignment.materi?.title}`} />

            <div className="max-w-3xl mx-auto">
                <div className="mb-4">
                    <Link href="/tugas-saya" className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                        &larr; Kembali ke Daftar Tugas
                    </Link>
                </div>

                {/* Card Info Tugas */}
                <div className="bg-white p-6 shadow-sm sm:rounded-lg border border-gray-200 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {assignment.materi?.title}
                    </h2>
                    
                    <div className="flex gap-4 mb-6 text-sm">
                        <span className={`px-2 py-1 rounded-md font-semibold ${isSubmitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            Status: {assignment.status}
                        </span>
                        {assignment.due_date && (
                            <span className="px-2 py-1 bg-red-50 text-red-700 rounded-md font-semibold">
                                Tenggat: {new Date(assignment.due_date).toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>

                    <div className="prose max-w-none mb-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-2">Instruksi Tugas:</h4>
                        <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
                            {assignment.description || 'Tidak ada instruksi khusus dari guru.'}
                        </div>
                    </div>
                </div>

                {/* Card Form Pengumpulan (Hanya muncul jika belum mengumpulkan) */}
                {!isSubmitted ? (
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Form Pengumpulan</h3>
                        
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            
                            {/* Input untuk Tipe Foto */}
                            {assignment.submission_type === 'foto' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Foto Jawaban (Maks 5MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('jawaban_file', e.target.files[0])}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {errors.jawaban_file && <span className="text-red-500 text-xs mt-1">{errors.jawaban_file}</span>}
                                </div>
                            )}

                            {/* Input untuk Tipe Link Video */}
                            {assignment.submission_type === 'link_video' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Masukkan Link Video (YouTube/Google Drive)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.jawaban_link}
                                        onChange={(e) => setData('jawaban_link', e.target.value)}
                                        placeholder="https://youtube.com/..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.jawaban_link && <span className="text-red-500 text-xs mt-1">{errors.jawaban_link}</span>}
                                </div>
                            )}

                            {/* Tampilan untuk Google Form */}
                            {assignment.submission_type === 'google_form' && (
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-sm text-blue-800 mb-3">
                                        Silakan kerjakan kuis melalui link Google Form di bawah ini. Jika sudah selesai, jangan lupa kembali ke halaman ini dan klik <strong>"Tandai Sudah Selesai"</strong>.
                                    </p>
                                    <a 
                                        href={assignment.google_form_link} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition"
                                    >
                                        Buka Google Form
                                    </a>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-bold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : (assignment.submission_type === 'google_form' ? 'Tandai Sudah Selesai' : 'Kumpulkan Tugas')}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Jika sudah mengumpulkan, tampilkan rangkuman jawabannya */
                    <div className="bg-green-50 p-6 shadow-sm sm:rounded-lg border border-green-200">
                        <h3 className="text-lg font-bold text-green-900 mb-4">Jawaban Terkirim</h3>
                        
                        {assignment.submission_type === 'foto' && assignment.answer && (
                            <div>
                                <p className="text-sm text-green-800 mb-2">Foto yang kamu unggah:</p>
                                <img 
                                    src={`/storage/${assignment.answer}`} 
                                    alt="Jawaban Tugas" 
                                    className="max-w-full h-auto rounded-md shadow-sm border border-gray-200"
                                />
                            </div>
                        )}

                        {assignment.submission_type === 'link_video' && (
                            <div>
                                <p className="text-sm text-green-800 mb-1">Link video kamu:</p>
                                <a href={assignment.answer} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-semibold break-all">
                                    {assignment.answer}
                                </a>
                            </div>
                        )}

                        {assignment.submission_type === 'google_form' && (
                            <p className="text-sm font-semibold text-green-800">
                                Kamu telah menandai tugas ini selesai melalui Google Form.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}