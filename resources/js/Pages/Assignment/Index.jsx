import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";

export default function AssignmentIndex({ materi, students = [] }) {
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [submissionType, setSubmissionType] = useState("");
    const [googleFormLink, setGoogleFormLink] = useState("");
    const [dueDate, setDueDate] = useState("");

    // State BARU: untuk Keterangan/Instruksi Tugas
    const [description, setDescription] = useState("");

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(students.map((student) => student.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelect = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(
                selectedStudents.filter((muridId) => muridId !== id),
            );
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const handleAssign = () => {
        if (selectedStudents.length === 0) {
            alert("Pilih minimal satu murid untuk diberikan penugasan!");
            return;
        }
        if (submissionType === "") {
            alert("Silakan pilih bentuk pengumpulan tugas terlebih dahulu!");
            return;
        }
        if (submissionType === "google_form" && googleFormLink.trim() === "") {
            alert("Silakan masukkan link Google Form / Kuis!");
            return;
        }
        if (dueDate === "") {
            alert("Silakan tentukan batas waktu pengumpulan!");
            return;
        }

        if (
            confirm(
                `Berikan tugas format ${submissionType.toUpperCase()} kepada ${selectedStudents.length} murid?`,
            )
        ) {
            router.post(
                `/assignment/store/${materi.id}`,
                {
                    student_ids: selectedStudents,
                    submission_type: submissionType,
                    google_form_link:
                        submissionType === "google_form"
                            ? googleFormLink
                            : null,
                    due_date: dueDate,
                    description: description, // <--- Kirim keterangan ke backend
                },
                {
                    onSuccess: () => {
                        setSelectedStudents([]);
                        setSubmissionType("");
                        setGoogleFormLink("");
                        setDueDate("");
                        setDescription(""); // Reset form keterangan
                        alert("Penugasan berhasil diberikan!");
                    },
                },
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <Head title={`Penugasan - ${materi.title}`} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/materi/${materi.url}`}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none transition"
                        >
                            &larr; Kembali
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Penugasan: {materi.title}
                        </h2>
                    </div>

                    <button
                        onClick={handleAssign}
                        className="inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-bold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 shadow-md transition"
                    >
                        Beri Tugas Terpilih ({selectedStudents.length})
                    </button>
                </div>

                {/* Bagian Pengaturan Tugas */}
                <div className="bg-white p-6 mb-6 shadow-sm sm:rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Pengaturan Tugas
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mb-6">
                        {/* Kolom Kiri: Tipe Tugas */}
                        <div>
                            <label
                                htmlFor="submissionType"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Bentuk Pengumpulan{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="submissionType"
                                value={submissionType}
                                onChange={(e) =>
                                    setSubmissionType(e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer"
                            >
                                <option value="" disabled>
                                    -- Pilih Bentuk Pengumpulan --
                                </option>
                                <option value="link_video">
                                    Link Video (YouTube / Google Drive)
                                </option>
                                <option value="foto">
                                    Upload Foto / Gambar
                                </option>
                                <option value="google_form">
                                    Link Google Form / Kuis
                                </option>
                            </select>

                            {submissionType === "google_form" && (
                                <div className="mt-4 p-4 bg-indigo-50 rounded-md border border-indigo-100">
                                    <label
                                        htmlFor="googleFormLink"
                                        className="block text-sm font-medium text-indigo-800 mb-1"
                                    >
                                        Link Google Form / Kuis{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        id="googleFormLink"
                                        value={googleFormLink}
                                        onChange={(e) =>
                                            setGoogleFormLink(e.target.value)
                                        }
                                        placeholder="https://docs.google.com/forms/d/e/..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Kolom Kanan: Batas Waktu */}
                        <div>
                            <label
                                htmlFor="dueDate"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Batas Waktu Pengumpulan{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="dueDate"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* BAGIAN BARU: Input Keterangan Tugas */}
                    <div className="max-w-4xl">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Keterangan / Instruksi Tugas (Opsional)
                        </label>
                        <textarea
                            id="description"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Contoh: Kerjakan soal nomor 1 sampai 5 di buku tulis, lalu foto dan upload di sini. Pastikan tulisan terbaca dengan jelas."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                </div>

                {/* Container Tabel (Tetap Sama) */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            {/* ... thead dan tbody sama persis dengan yang sebelumnya ... */}
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                                    >
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 cursor-pointer"
                                            onChange={handleSelectAll}
                                            checked={
                                                selectedStudents.length ===
                                                    students.length &&
                                                students.length > 0
                                            }
                                        />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Nama Siswa
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status Tugas
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 cursor-pointer"
                                                checked={selectedStudents.includes(
                                                    student.id,
                                                )}
                                                onChange={() =>
                                                    handleSelect(student.id)
                                                }
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {student.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {student.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    student.status_tugas ===
                                                    "Belum Diberikan"
                                                        ? "bg-gray-100 text-gray-800"
                                                        : student.status_tugas ===
                                                            "Belum Mengumpulkan"
                                                          ? "bg-yellow-100 text-yellow-800"
                                                          : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {student.status_tugas}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {student.has_submitted ? (
                                                <Link
                                                    href={`/assignment/review/${student.assignment_id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 font-bold transition-colors cursor-pointer"
                                                    >
                                                        Cek Hasil
                                                    </Link>
                                                ) : (
                                                    <span className="text-gray-400 font-semibold cursor-not-allowed">
                                                        Belum Ada Hasil
                                                    </span>
                                                )}
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center text-sm text-gray-500"
                                        >
                                            Tidak ada data murid ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
