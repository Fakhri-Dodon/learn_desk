import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { useForm, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import {
    faPlus,
    faTrashCan,
    faPencil,
    faMagnifyingGlass,
    faVideo,
    faFilePdf,
    faFileLines,
    faFileCode,
    faBook,
} from "@fortawesome/free-solid-svg-icons";

export default function Index() {
    const [searchTerm, setSearchTerm] = useState("");
    const isInitialRender = useRef(true);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            router.get(
                window.location.pathname,
                { search: searchTerm },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Mengambil data materi yang dikirim dari backend Laravel Controller
    const { materis = [] } = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMateriEdit, setSelectedMateriEdit] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMateriDelete, setSelectedMateriDelete] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        link: "",
        description: "",
        class: "", 
    });

    const {
        data: editData,
        setData: setEditData,
        patch: patchEdit,
        processing: processingEdit,
        errors: errorsEdit,
        reset: resetEdit,
        clearErrors: clearErrorsEdit,
    } = useForm({
        title: "",
        link: "",
        description: "",
        class: "",
    });

    const { delete: destroy, processing: processingDelete } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post("/materi/store", {
            onSuccess: () => {
                closeModal();
                reset();
            },
        });
    };

    const openEditModal = (materi) => {
        setSelectedMateriEdit(materi);
        setEditData({
            title: materi.title || "",
            description: materi.description || "",
            link: materi.link || "",
            class: materi.class || "",
        });
        clearErrorsEdit();
        setIsEditModalOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        patchEdit(`/materi/${selectedMateriEdit.id}/update`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedMateriEdit(null);
                resetEdit();
            },
        });
    };

    const openDeleteModal = (materi) => {
        setSelectedMateriDelete(materi);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = (e) => {
        e.preventDefault();
        destroy(`/materi/${selectedMateriDelete.id}/delete`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedMateriDelete(null);
            },
        });
    };

    const getVideoEmbedUrl = (url) => {
        if (!url) return null;

        const ytRegExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const ytMatch = url.match(ytRegExp);

        if (ytMatch && ytMatch[2].length === 11) {
            // Mengembalikan gambar resolusi HQ standar dari ID video YouTube
            return `https://img.youtube.com/vi/${ytMatch[2]}/hqdefault.jpg`;
        }

        const gdriveRegExp = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
        const gdriveMatch = url.match(gdriveRegExp);
        if (gdriveMatch && gdriveMatch[1]) {
            return `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`;
        }

        return url;
    };

    return (
        <>
            <Head title="Manage Materials" />
            <AuthenticatedLayout>
                <div className="p-8 max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                Course Materials
                            </h2>
                            <p className="text-gray-600">
                                Manage and organize your course content
                            </p>
                        </div>
                        <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 h-10 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm"
                            type="button"
                            onClick={openModal}
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="w-4 h-4 flex-shrink-0"
                            />
                            Add Material
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="hidden sm:flex items-center gap-3 bg-white border border-gray-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 rounded-xl px-4 py-2.5 w-full max-w-xs transition-all duration-300 ease-in-out focus-within:max-w-md shadow-sm group">
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200"
                            />
                            <input
                                type="text"
                                value={searchTerm} // Hubungkan nilai input ke state
                                onChange={(e) => setSearchTerm(e.target.value)} // Update state saat mengetik
                                placeholder="Search materials by title or description..."
                                className="bg-transparent border-none outline-none p-0 focus:ring-0 flex-1 text-sm text-gray-800 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Cards Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materis.map((materi) => {
                            const thumbnailUrl = getVideoEmbedUrl(materi.link);

                            return (
                                <div
                                    key={materi.id}
                                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md hover:border-indigo-200 transition-all duration-300 group"
                                >
                                    {/* Area Kartu Utama yang Bisa Diklik */}
                                    <Link
                                        href={`/materi/${materi.url}`}
                                        className="flex-1 flex flex-col cursor-pointer"
                                    >
                                        {/* Bagian Atas: Area Video Thumbnail / Fallback */}
                                        <div className="h-44 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                                            {thumbnailUrl ? (
                                                <div className="w-full h-full relative">
                                                    <img
                                                        src={thumbnailUrl}
                                                        alt={materi.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                                        // PENTING: Jika gambar gagal dimuat dari YouTube, sembunyikan gambar broken dan paksa ganti ke gaya fallback
                                                        onError={(e) => {
                                                            e.target.style.display =
                                                                "none";
                                                            e.target.nextSibling.style.display =
                                                                "flex";
                                                        }}
                                                    />
                                                    {/* Overlay & Tombol Play Konten Utama */}
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                                        <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-md transform group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
                                                            <svg
                                                                className="w-5 h-5 text-gray-900 translate-x-0.5 group-hover:text-white transition-colors"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    {/* Hidden Fallback Container (Akan muncul otomatis via onError jika link gambar rusak) */}
                                                    <div className="absolute inset-0 hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex-col items-center justify-center gap-2 text-white">
                                                        <FontAwesomeIcon
                                                            icon={faVideo}
                                                            className="w-10 h-10 opacity-80"
                                                        />
                                                        <span className="text-xs font-medium tracking-wide opacity-70">
                                                            Watch Video
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* Fallback Standar jika kolom link memang kosong dari awal */
                                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center gap-2 text-white">
                                                    <FontAwesomeIcon
                                                        icon={faVideo}
                                                        className="w-10 h-10 opacity-80 group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <span className="text-xs font-medium tracking-wide opacity-70">
                                                        Watch Video
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bagian Tengah: Teks Konten */}
                                        <div className="p-5 flex-1 flex flex-col justify-between bg-white relative z-10">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">
                                                    {materi.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                                                    {materi.description ||
                                                        "No description provided."}
                                                </p>
                                            </div>

                                            {/* Metadata Info */}
                                            <div className="border-t border-gray-100 pt-3 text-xs text-gray-500">
                                                Uploaded:{" "}
                                                {materi.created_at
                                                    ? new Date(
                                                          materi.created_at,
                                                      ).toLocaleDateString(
                                                          "id-ID",
                                                      )
                                                    : "-"}
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Bagian Bawah: Tombol Aksi */}
                                    <div className="px-5 pb-5 grid grid-cols-2 gap-3 z-10 bg-white">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(materi);
                                            }}
                                            className="inline-flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <FontAwesomeIcon
                                                icon={faPencil}
                                                className="w-3.5 h-3.5 text-gray-500"
                                            />
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteModal(materi);
                                            }}
                                            className="inline-flex items-center justify-center gap-2 border border-red-200 rounded-lg py-2 text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-colors duration-200"
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrashCan}
                                                className="w-3.5 h-3.5"
                                            />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Modals Add */}
                    <Modal show={isModalOpen} onClose={closeModal}>
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Add New Materi
                            </h2>
                            <form onSubmit={submit}>
                                <div className="mt-4">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Title{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        required
                                        placeholder="Seni Musik"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors.title && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <label
                                        htmlFor="link"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Link
                                    </label>
                                    <input
                                        type="text"
                                        name="link"
                                        id="link"
                                        placeholder="https://www.youtube.com/watch?v=example"
                                        value={data.link}
                                        onChange={(e) =>
                                            setData("link", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors.link && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.link}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <label
                                        htmlFor="class"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Class
                                    </label>
                                    <select
                                        name="class"
                                        id="class"
                                        value={data.class}
                                        onChange={(e) =>
                                            setData("class", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">Select Class</option>
                                        <option value="10">Class 10</option>
                                        <option value="11">Class 11</option>
                                        <option value="12">Class 12</option>
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        rows="4"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    ></textarea>
                                    {errors.description && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`px-4 py-2 bg-indigo-600 text-white rounded-md ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {processing ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>

                    {/* Modals Edit */}
                    <Modal
                        show={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                    >
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Rename Materi
                            </h2>
                            <form onSubmit={submitEdit}>
                                <div className="mt-4">
                                    <label
                                        htmlFor="edit-title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Title{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="edit-title"
                                        required
                                        value={editData.title}
                                        onChange={(e) =>
                                            setEditData("title", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errorsEdit.title && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errorsEdit.title}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <label
                                        htmlFor="class"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Class
                                    </label>
                                    <select
                                        name="class"
                                        id="class"
                                        value={editData.class}
                                        onChange={(e) =>
                                            setEditData("class", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">Select Class</option>
                                        <option value="10">Class 10</option>
                                        <option value="11">Class 11</option>
                                        <option value="12">Class 12</option>
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <label
                                        htmlFor="edit-description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Description{" "}
                                    </label>
                                    <textarea
                                        name="edit-description"
                                        id="edit-description"
                                        rows="4"
                                        value={editData.description}
                                        onChange={(e) =>
                                            setEditData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    ></textarea>
                                    {errorsEdit.description && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errorsEdit.description}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsEditModalOpen(false)
                                        }
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingEdit}
                                        className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${processingEdit ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {processingEdit
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>

                    {/* Modals Delete */}
                    <Modal
                        show={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                    >
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Delete Confirmation
                            </h2>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete{" "}
                                <span className="font-bold text-gray-900">
                                    "{selectedMateriDelete?.title}"
                                </span>
                                ? All of its resources and data will be
                                permanently deleted. This action cannot be
                                undone.
                            </p>
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={processingDelete}
                                    className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${processingDelete ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {processingDelete
                                        ? "Deleting..."
                                        : "Delete Materi"}
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
