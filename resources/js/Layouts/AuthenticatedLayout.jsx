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
    faCircleUser,
    faMagnifyingGlass,
    faBell,
    faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function AuthenticatedLayout({ header, children }) {
    const pageProps = usePage().props;
    const user = pageProps.auth?.user || {
        name: "Guest User",
        role: "student",
        email: "user@example.com",
    };
    const { auth, materis = [] } = pageProps;
    const { url } = usePage();

    const canCreateMateri = user?.role === "admin" || user?.role === "teacher";

    const StudentTask = user?.role === "student";

    // State for interactive elements
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMateriEdit, setSelectedMateriEdit] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMateriDelete, setSelectedMateriDelete] = useState(null);

    // Navigation menu items with dynamic active states
    const navItems = [
        {
            label: "Dashboard",
            icon: faHouse,
            href: route("dashboard"),
            active: url === "/dashboard" || url.endsWith("/dashboard"),
        },
        (user?.role === "teacher") && {
            label: "Manage Materials",
            icon: faBook,
            href: "/materi",
            active: url.startsWith("/materi"),
        },
        (user?.role === "student") && {
            label: "Assignments",
            icon: faTasks,
            href: route("student.assignments.index"),
            active: url.includes("tugas-saya") || url.includes("assignment"),
        },
        (user?.role === "admin") && { 
            label: "Manage Users",
            icon: faCircleUser,
            href: "/users-managements",
            active: url.startsWith("/users-managements"),
        }
        // {
        //     label: "Grading",
        //     icon: faStar,
        //     href: "/grading",
        //     active: url.includes("grading"),
        // },
    ].filter(Boolean);

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
                            <ApplicationLogo className="h-9 w-auto fill-current text-gray-800 flex-shrink-0" />
                            {isSidebarOpen && (
                                <div className="whitespace-nowrap">
                                    <p className="text-xs font-bold text-gray-900">
                                        Learn Desk
                                    </p>
                                    {user?.role === "teacher" && (
                                        <p className="text-xs text-gray-600">
                                            Instructor Portal
                                        </p>
                                    )}
                                    {user?.role === "student" && (
                                        <p className="text-xs text-gray-600">
                                            Student Portal
                                        </p>
                                    )}
                                    {user?.role === "admin" && (
                                        <p className="text-xs text-gray-600">
                                            Admin Portal
                                        </p>
                                    )}
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
                    {/* {canCreateMateri && (
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
                    )} */}
                </nav>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 bg-gray-50/50">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button" // PENTING: Memberitahu Inertia untuk merender ini sebagai tombol secara internal
                        type="button"
                        className="w-full flex items-center justify-center sm:justify-start gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                        <FontAwesomeIcon
                            icon={faArrowRightFromBracket}
                            className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors"
                        />
                        {/* Jika Anda memiliki state isSidebarOpen, bungkus teks 'Logout' ini dengan kondisi tersebut */}
                        <span className="whitespace-nowrap">Logout</span>
                    </Link>
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
                            <FontAwesomeIcon
                                icon={faBars}
                                className="w-5 h-5"
                            />
                        </button>

                        {/* Search Bar */}
                        {/* <div className="hidden sm:flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2.5 flex-1 max-w-sm">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search students, courses..."
                                className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-500"
                            />
                        </div> */}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Notification Button */}
                        {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-700 relative">
                            <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button> */}

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
        </div>
    );
}
