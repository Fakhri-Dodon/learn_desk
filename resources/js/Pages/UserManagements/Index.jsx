import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import {
    faPlus,
    faTrashCan,
    faPencil,
    faMagnifyingGlass,
    faBook,
    faEye,
    faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

export default function UserManagements({ users }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // Inertia Form Hook
    const {
        data,
        setData,
        post,
        patch,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        name: "",
        email: "",
        password: "",
        role: "student", // default role
    });

    // Handle Pencarian Lokal (Bisa juga disesuaikan ke Server-Side jika data ribuan)
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Buka Modal Tambah User
    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditMode(false);
        setIsOpenModal(true);
    };

    // Buka Modal Edit User
    const openEditModal = (user) => {
        clearErrors();
        setEditMode(true);
        setSelectedUserId(user.id);
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: "", // Kosongkan password saat edit kecuali ingin diganti
        });
        setIsOpenModal(true);
    };

    // Submit Handler (Simpan / Update)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            patch(route("users.update", selectedUserId), {
                onSuccess: () => {
                    setIsOpenModal(false);
                    reset();
                },
            });
        } else {
            post(route("users.store"), {
                onSuccess: () => {
                    setIsOpenModal(false);
                    reset();
                },
            });
        }
    };

    // Delete Handler
    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus user "${name}"?`)) {
            destroy(route("users.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manage Users
                </h2>
            }
        >
            <Head title="Manage Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        {/* HEADER & FITUR PENCARIAN */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div className="relative flex-1 max-w-md">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or role..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 transition"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Add New User
                            </button>
                        </div>

                        {/* TABEL USER */}
                        <div className="overflow-x-auto border border-gray-100 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 font-semibold text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50/70 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                            user.role ===
                                                            "admin"
                                                                ? "bg-purple-100 text-purple-800"
                                                                : user.role ===
                                                                    "teacher"
                                                                  ? "bg-blue-100 text-blue-800"
                                                                  : "bg-green-100 text-green-800"
                                                        }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(user)
                                                        }
                                                        className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Edit User"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPencil}
                                                            className="w-4 h-4"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
                                                                user.name,
                                                            )
                                                        }
                                                        className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete User"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrashCan}
                                                            className="w-4 h-4"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-10 text-center text-gray-400"
                                            >
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FORM (TAMBAH & EDIT USER) */}
            {isOpenModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md overflow-hidden bg-white rounded-xl shadow-xl transform transition-all">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editMode
                                    ? "Edit User Information"
                                    : "Create New User"}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Input Nama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Input Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Input Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password{" "}
                                    {editMode && (
                                        <span className="text-xs text-gray-400">
                                            (Leave blank if unchanged)
                                        </span>
                                    )}
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        required={!editMode}
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                showPassword
                                                    ? faEyeSlash
                                                    : faEye
                                            }
                                            className="w-4 h-4"
                                        />
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Input Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.role}
                                    </p>
                                )}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsOpenModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                                >
                                    {processing ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
