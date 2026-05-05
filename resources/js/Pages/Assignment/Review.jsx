import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function AssignmentReview({ assignment }) {
    const { data, setData, post, processing, errors } = useForm({
        score: assignment.score || '', 
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/assignment/review/${assignment.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <Head title={`Penilaian - ${assignment.user?.name}`} />

            <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                    <Link 
                        href={`/assignment/${assignment.materi_id}`} 
                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                    >
                        &larr; Kembali ke Daftar Tugas
                    </Link>
                </div>

                <div className="bg-white p-6 shadow-sm sm:rounded-lg border border-gray-200 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Review Tugas: {assignment.user?.name}
                            </h2>
                            <p className="text-gray-500 mt-1">Materi: {assignment.materi?.title}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-bold text-sm">
                            {assignment.status}
                        </span>
                    </div>

                    {/* Menampilkan Jawaban Murid */}
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Jawaban Murid:</h3>
                        
                        {assignment.submission_type === 'foto' && assignment.answer && (
                            <img 
                                src={`/storage/${assignment.answer}`} 
                                alt="Jawaban Murid" 
                                className="max-w-full h-auto rounded-md shadow-sm border border-gray-300"
                            />
                        )}

                        {assignment.submission_type === 'link_video' && assignment.answer && (
                            <a 
                                href={assignment.answer} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-indigo-600 hover:underline font-semibold text-lg break-all"
                            >
                                {assignment.answer} &rarr;
                            </a>
                        )}

                        {assignment.submission_type === 'google_form' && (
                            <p className="text-gray-700 italic">
                                Murid telah menandai tugas ini selesai melalui Google Form. Silakan cek nilai aslinya di spreadsheet Google Form Anda.
                            </p>
                        )}

                        {!assignment.answer && (
                            <p className="text-red-500 italic">Murid belum mengirimkan jawaban.</p>
                        )}
                    </div>

                    {/* Form Penilaian */}
                    <form onSubmit={handleSubmit} className="bg-indigo-50 p-6 rounded-md border border-indigo-100">
                        <label htmlFor="score" className="block text-sm font-bold text-indigo-900 mb-2">
                            Berikan Nilai (0 - 100)
                        </label>
                        <div className="flex gap-4 items-start">
                            <div className="w-1/3">
                                <input
                                    type="number"
                                    id="score"
                                    min="0"
                                    max="100"
                                    value={data.score}
                                    onChange={(e) => setData('score', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg text-center font-bold"
                                    placeholder="0"
                                />
                                {errors.score && <span className="text-red-500 text-xs mt-1 block">{errors.score}</span>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center items-center px-6 py-3 bg-indigo-600 border border-transparent rounded-md font-bold text-sm text-white uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Nilai'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}