import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useForm } from "@inertiajs/react";

import Modal from "@/Components/Modal";

// fontawesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faPlus,
    faEllipsisVertical,
    faTrashCan,
    faPencil,
    faTasks,
} from "@fortawesome/free-solid-svg-icons";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { auth, materis } = usePage().props;
    const { url } = usePage();

    const canCreateMateri =
        user?.role === "admin" || user?.role === "teacher";

    const StudentTask = user?.role === "student";

    // State untuk mengontrol buka/tutup sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // State untuk Modal Edit (Rename)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMateriEdit, setSelectedMateriEdit] = useState(null);

    // State untuk Modal Delete (Konfirmasi)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMateriDelete, setSelectedMateriDelete] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        link: "",
        description: "",
    });

    // Form Edit (Gunakan alias agar tidak bentrok dengan form create)
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
    });

    // Form Delete (Hanya untuk memanfaatkan state 'processing')
    const { delete: destroy, processing: processingDelete } = useForm();

    const submit = (e) => {
        e.preventDefault(); // Mencegah browser melakukan reload halaman
        post("/materi", {
            onSuccess: () => {
                closeModal(); // Tutup modal jika berhasil disimpan
                reset(); // Kosongkan isian form kembali
            },
        });
    };

    // Handler Buka Modal Edit
    const openEditModal = (materi) => {
        setSelectedMateriEdit(materi);
        setEditData("title", materi.title);
        clearErrorsEdit();
        setIsEditModalOpen(true);
    };

    // Handler Submit Edit
    const submitEdit = (e) => {
        e.preventDefault();
        patchEdit(`/materi/${selectedMateriEdit.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedMateriEdit(null);
                resetEdit();
            },
        });
    };

    // Handler Buka Modal Delete
    const openDeleteModal = (materi) => {
        setSelectedMateriDelete(materi);
        setIsDeleteModalOpen(true);
    };

    // Handler Submit Delete
    const confirmDelete = (e) => {
        e.preventDefault();
        destroy(`/materi/${selectedMateriDelete.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedMateriDelete(null);
            },
        });
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "w-64" : "w-20" // Ubah w-0 menjadi w-20 saat tertutup
                }`}
            >
                {/* Logo Area */}
                <div className="flex h-16 items-center justify-center border-b border-gray-100 px-4 overflow-hidden">
                    <Link href="/">
                        <ApplicationLogo
                            className={`block w-auto fill-current text-gray-800 transition-all duration-300 ${
                                isSidebarOpen ? "h-9" : "h-6" // Logo sedikit mengecil saat sidebar ditutup
                            }`}
                        />
                    </Link>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                    {canCreateMateri && (
                        <button
                            onClick={openModal}
                            type="button"
                            title="New Materi"
                            className={`bg-indigo-50 text-indigo-600 flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-all overflow-hidden`}
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="w-6 h-6 flex-shrink-0 text-lg"
                            />

                            {/* Teks Menu */}
                            <span
                                className={`whitespace-nowrap transition-all duration-300 ${
                                    isSidebarOpen
                                        ? "ml-3 opacity-100"
                                        : "w-0 opacity-0 hidden"
                                }`}
                            >
                                New Materi
                            </span>
                        </button>
                    )}

                    {StudentTask && (
                        <Link
                            href={route("student.assignments.index")}
                            className={`bg-indigo-50 text-indigo-600 flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-all overflow-hidden ${
                                url === route("student.assignments.index")
                                    ? "text-indigo-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={faTasks}
                                className="w-6 h-6 flex-shrink-0 text-lg"
                            />

                            {/* Teks Menu */}
                            <span
                                className={`whitespace-nowrap transition-all duration-300 ${
                                    isSidebarOpen
                                        ? "ml-3 opacity-100"
                                        : "w-0 opacity-0 hidden"
                                }`}
                            >
                                Tugas Saya
                            </span>
                        </Link>
                    )}

                    {/* Looping Data Materi dari Database */}
                    <div className="pt-4 mt-4 border-t border-gray-100 space-y-1">
                        {materis &&
                            materis.map((materi) => {
                                // 1. Buat variabel url untuk menu ini
                                const itemUrl = `/materi/${materi.url}`;
                                // 2. Cek apakah URL yang sedang dibuka sama dengan URL menu ini
                                const isActive = url === itemUrl;

                                const shouldHighlight =
                                    isActive && isSidebarOpen;

                                return (
                                    <div
                                        key={materi.id}
                                        className={`relative group flex justify-between items-center rounded-md transition-all ${
                                            shouldHighlight
                                                ? "bg-indigo-50"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {/* Bagian Kiri: Link Utama Menu */}
                                        <Link
                                            href={itemUrl}
                                            title={materi.title}
                                            className={`flex-1 flex items-center px-3 py-2.5 text-sm font-medium overflow-hidden rounded-md transition-colors ${
                                                isActive
                                                    ? "text-indigo-600"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            <span
                                                className={`whitespace-nowrap transition-all duration-300 ${
                                                    !isSidebarOpen
                                                        ? "w-0 opacity-0 hidden"
                                                        : "ml-3 opacity-100"
                                                }`}
                                            >
                                                {materi.title}
                                            </span>
                                        </Link>

                                        {/* Bagian Kanan: Tombol Titik Tiga & Dropdown */}
                                        <div
                                            className={`absolute right-2 transition-opacity duration-200 ${isSidebarOpen ? "opacity-0 group-hover:opacity-100 focus-within:opacity-100" : "hidden"}`}
                                        >
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <button
                                                        type="button"
                                                        className={`p-1 rounded-md focus:outline-none transition-colors ${isActive ? "text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100" : "text-gray-400 hover:text-gray-700 hover:bg-gray-200"}`}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={
                                                                faEllipsisVertical
                                                            }
                                                            className="w-4 h-4"
                                                        />
                                                    </button>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content
                                                    align="right"
                                                    width="32"
                                                >
                                                    {/* Tombol Edit */}
                                                    <Dropdown.Link
                                                        as="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            openEditModal(
                                                                materi,
                                                            );
                                                        }}
                                                        className="text-gray-700 font-medium flex items-center gap-2 w-full text-left"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPencil}
                                                            className="w-4 h-4 flex-shrink-0 text-lg"
                                                        />
                                                        Rename
                                                    </Dropdown.Link>

                                                    {/* Tombol Delete */}
                                                    <Dropdown.Link
                                                        as="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            openDeleteModal(
                                                                materi,
                                                            );
                                                        }}
                                                        className="text-red-600 font-medium flex items-center gap-2 w-full text-left"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrashCan}
                                                            className="w-4 h-4 flex-shrink-0 text-lg"
                                                        />
                                                        Delete
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    <Modal show={isModalOpen} onClose={closeModal}>
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Add New Materi
                            </h2>

                            {/* Gunakan onSubmit memanggil fungsi submit kita */}
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
                                        value={data.title} // Binding data Inertia
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        } // Update state Inertia
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {/* Tampilkan pesan error dari Laravel jika ada */}
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
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        rows="6"
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
                                        type="button" // Beri type button agar tidak ikut men-submit form
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit" // Pastikan type-nya submit
                                        disabled={processing} // Disable tombol saat sedang loading (mencegah double click)
                                        className={`px-4 py-2 bg-indigo-600 text-white rounded-md ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {processing ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>

                    {/* 2. Modal Rename Materi */}
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
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Title{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
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

                    {/* 3. Modal Konfirmasi Delete */}
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
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="flex h-16 items-center justify-between bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 z-10">
                    <div className="flex items-center">
                        {/* Toggle Sidebar Button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:bg-gray-100 p-2 rounded-md transition-colors"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={
                                        isSidebarOpen
                                            ? "M4 6h16M4 12h16M4 18h16"
                                            : "M4 6h16M4 12h16M4 18h16"
                                    } // Ikon hamburger tetap sama
                                />
                            </svg>
                        </button>
                    </div>

                    {/* User Dropdown */}
                    <div className="flex items-center">
                        <div className="relative ms-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                        >
                                            {user.name}

                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Page Header (Opsional dari Breeze) */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
