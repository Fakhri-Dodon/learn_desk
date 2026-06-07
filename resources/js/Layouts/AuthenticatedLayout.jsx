import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faPlus,
    faEllipsisVertical,
    faTrashCan,
    faPencil,
    faTasks,
    faBook,
    faStar,
    faBars,
    faMagnifyingGlass,
    faBell,
} from "@fortawesome/free-solid-svg-icons";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { auth, materis } = usePage().props;
    const { url } = usePage();

    const canCreateMateri =
        user?.role === "admin" || user?.role === "teacher";

    const StudentTask = user?.role === "student";

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    });

    const { delete: destroy, processing: processingDelete } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post("/materi", {
            onSuccess: () => {
                closeModal();
                reset();
            },
        });
    };

    const openEditModal = (materi) => {
        setSelectedMateriEdit(materi);
        setEditData("title", materi.title);
        clearErrorsEdit();
        setIsEditModalOpen(true);
    };

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

    const openDeleteModal = (materi) => {
        setSelectedMateriDelete(materi);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = (e) => {
        e.preventDefault();
        destroy(`/materi/${selectedMateriDelete.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedMateriDelete(null);
            },
        });
    };

    // Navigation menu items
    const navItems = [
        {
            label: "Dashboard",
            icon: faHouse,
            href: route("dashboard"),
            active: url === route("dashboard"),
        },
        {
            label: "Manage Materials",
            icon: faBook,
            href: "#",
            active: url.includes("materi"),
        },
        {
            label: "Assignments",
            icon: faTasks,
            href: route("assignments.index"),
            active: url.includes("assignment"),
        },
        {
            label: "Grading",
            icon: faStar,
            href: "#",
            active: url.includes("grading"),
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "w-64" : "w-20"
                } flex-shrink-0`}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
                    <Link href="/">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <ApplicationLogo className="h-8 w-auto fill-current text-gray-800 flex-shrink-0" />
                            {isSidebarOpen && (
                                <div className="whitespace-nowrap">
                                    <p className="text-xs font-bold text-gray-900">EduStream</p>
                                    <p className="text-xs text-gray-600">Instructor Portal</p>
                                </div>
                            )}
                        </div>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = item.active;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-sm group ${
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className="w-5 h-5 flex-shrink-0"
                                />
                                {isSidebarOpen && (
                                    <span className="whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    {/* New Materi Button */}
                    {canCreateMateri && (
                        <button
                            onClick={openModal}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-sm mt-4 ${
                                isSidebarOpen
                                    ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                    : "text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="w-5 h-5 flex-shrink-0"
                            />
                            {isSidebarOpen && <span>New Materi</span>}
                        </button>
                    )}
                </nav>

                {/* Footer */}
                <div className="border-t border-gray-200 p-3">
                    <button className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-2">
                        {isSidebarOpen ? "Settings" : "⚙️"}
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
                        >
                            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
                        </button>
                        
                        {/* Search Bar */}
                        <div className="hidden sm:flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2.5 flex-1 max-w-sm">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search students, courses..."
                                className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Notification Button */}
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-700 relative">
                            <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-2 transition">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                                        {user.name}
                                    </span>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="48">
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
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>

            {/* Modals */}
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
                                    setData("description", e.target.value)
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
                                className={`px-4 py-2 bg-indigo-600 text-white rounded-md ${
                                    processing
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {processing ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

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
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processingEdit}
                                className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
                                    processingEdit
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {processingEdit ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

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
                        ? All of its resources and data will be permanently
                        deleted. This action cannot be undone.
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
                            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                                processingDelete
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {processingDelete ? "Deleting..." : "Delete Materi"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
