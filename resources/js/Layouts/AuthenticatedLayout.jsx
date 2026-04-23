import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

// fontawesome import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    
    // State untuk mengontrol buka/tutup sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'w-64' : 'w-20' // Ubah w-0 menjadi w-20 saat tertutup
                }`}
            >
                {/* Logo Area */}
                <div className="flex h-16 items-center justify-center border-b border-gray-100 px-4 overflow-hidden">
                    <Link href="/">
                        <ApplicationLogo 
                            className={`block w-auto fill-current text-gray-800 transition-all duration-300 ${
                                isSidebarOpen ? 'h-9' : 'h-6' // Logo sedikit mengecil saat sidebar ditutup
                            }`} 
                        />
                    </Link>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                    <Link
                        href={route('dashboard')}
                        // Tambahkan title agar saat ditutup, user bisa hover untuk melihat nama menu
                        title="Dashboard" 
                        className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all overflow-hidden ${
                            route().current('dashboard')
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } ${!isSidebarOpen && 'justify-center px-0'}`} // Pusatkan ikon saat ditutup
                    >
                        <FontAwesomeIcon 
                            icon={faPlus} 
                            className="w-6 h-6 flex-shrink-0 text-lg" 
                        />

                        {/* Teks Menu */}
                        <span 
                            className={`whitespace-nowrap transition-all duration-300 ${
                                isSidebarOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0 hidden'
                            }`}
                        >
                            New Materi
                        </span>
                    </Link>
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
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={isSidebarOpen ? "M4 6h16M4 12h16M4 18h16" : "M4 6h16M4 12h16M4 18h16"} // Ikon hamburger tetap sama
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

                                            <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
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