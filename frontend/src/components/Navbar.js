import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';
import jwtDecode from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineHome, AiOutlineInbox, AiOutlineExport, AiOutlineUser, AiFillBulb } from 'react-icons/ai';

const Navbar = () => {
    const [name, setName] = useState('');
    const [expire, setExpire] = useState('');
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState({ masuk: false, keluar: false, settings: false });

    const handleBurgerClick = () => {
        setIsActive(!isActive);
    };

    const handleDropdownClick = (menu) => {
        setIsDropdownOpen({
            ...isDropdownOpen,
            [menu]: !isDropdownOpen[menu],
        });
    };

    const refreshToken = useCallback(async () => {
        try {
            const response = await axios.get(`${apiurl}/token`);
            const newToken = response.data.accessToken;
            setToken(newToken);
            const decoded = jwtDecode(newToken);
            setName(decoded.name);
            setExpire(decoded.exp);
            setRole(decoded.role);
            //localStorage.setItem('token', newToken);
        } catch (error) {
            console.error('Error refreshing token:', error);
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        refreshToken();
    }, [refreshToken]);

    const Logout = async () => {
        try {
            await axios.delete(`${apiurl}/logout`);
            navigate("/");
        } catch (error) {
            //console.log(error);
        }
    }

    return (
        <nav className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a onClick={() => navigate('/home')} className="flex-shrink-0">
                            <img src="cnm.png" alt="logo" className="h-8 w-auto" />
                        </a>
                        <div className="hidden md:flex items-center space-x-4 ml-10">
                            <span className="text-white font-bold text-sm hidden md:inline">
                            <FaUserCircle className="inline-block mr-1 text-navy-500" />
                                Halo, {name} ({role})
                            </span>
                            <a
                                onClick={() => navigate('/home')}
                                className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition duration-300 ease-in-out"
                            >
                                <AiOutlineHome className="inline-block mr-2 font-bold" />
                                Home
                            </a>
                            <div className="relative inline-block text-left">
                                <div>
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-md ring-1 ring-inset ring-gray-300 hover:bg-blue-700 transition duration-300 ease-in-out"
                                        id="menu-button-masuk"
                                        aria-expanded={isDropdownOpen.masuk}
                                        aria-haspopup="true"
                                        onClick={() => handleDropdownClick('masuk')}
                                    >
                                        <AiOutlineInbox className="inline-block mr-2" />
                                        Barang Masuk
                                        <svg
                                            className="-mr-1 h-5 w-5 text-white"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {isDropdownOpen.masuk && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-300 ease-in-out transform opacity-100 scale-100"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="menu-button-masuk"
                                        tabIndex="-1"
                                    >
                                        <div className="py-1" role="none">
                                            <a
                                                onClick={() => navigate('/listbarangmasuk')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                List Barang Masuk
                                            </a>
                                            {role !== 'Staff' && role !== 'User' && (
                                                <>
                                           
                                                    <a
                                                        onClick={() => navigate('/formbarangmasuk')}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                        role="menuitem"
                                                        tabIndex="-1"
                                                    >
                                                        Form Input Barang Masuk
                                                    </a>
                                                    <a
                                                        onClick={() => navigate('/editbarangmasuk')}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                        role="menuitem"
                                                        tabIndex="-1"
                                                    >
                                                        Edit Barang Masuk
                                                    </a>
                                                    </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative inline-block text-left">
                                <div>
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-md ring-1 ring-inset ring-gray-300 hover:bg-blue-700 transition duration-300 ease-in-out"
                                        id="menu-button-keluar"
                                        aria-expanded={isDropdownOpen.keluar}
                                        aria-haspopup="true"
                                        onClick={() => handleDropdownClick('keluar')}
                                    >
                                        <AiOutlineExport className="inline-block mr-2" />
                                        Barang Keluar
                                        <svg
                                            className="-mr-1 h-5 w-5 text-white"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {isDropdownOpen.keluar && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-300 ease-in-out transform opacity-100 scale-100"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="menu-button-keluar"
                                        tabIndex="-1"
                                    >
                                        <div className="py-1" role="none">
                                            <a
                                                onClick={() => navigate('/listbarangkeluar')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                List Barang Keluar
                                            </a>
                                            {role !== 'Staff' && role !== 'User' && (
                                                <>
                                            <a
                                                onClick={() => navigate('/formbarangkeluar')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                Form Input Barang Keluar
                                            </a>
                                            <a
                                                onClick={() => navigate('/editbarangkeluar')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                Edit Barang Keluar
                                            </a>
                                            </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative inline-block text-left">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-md ring-1 ring-inset ring-gray-300 hover:bg-blue-700 transition duration-300 ease-in-out"
                                    id="menu-button-settings"
                                    aria-expanded={isDropdownOpen.settings}
                                    aria-haspopup="true"
                                    onClick={() => handleDropdownClick('settings')}
                                >
                                    <AiOutlineUser className="inline-block mr-2" />
                                    Profile
                                    <svg
                                        className="-mr-1 h-5 w-5 text-white"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {isDropdownOpen.settings && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-300 ease-in-out transform opacity-100 scale-100"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="menu-button-settings"
                                        tabIndex="-1"
                                    >
                                        <div className="py-1" role="none">
                                        <a
                                                onClick={() => navigate('/about')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                About App
                                            </a>
                                            <a
                                                onClick={Logout}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                Logout
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={handleBurgerClick}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={`md:hidden ${isActive ? 'block' : 'hidden'}`}>
                    <div className="space-y-1">
                        <a
                            onClick={() => navigate('/home')}
                            className="block px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <AiOutlineHome className="inline-block mr-2" />
                            Home
                        </a>
                        <div className="relative inline-block text-left">
                            <button
                                type="button"
                                className="block w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
                                aria-expanded={isDropdownOpen.masuk}
                                aria-haspopup="true"
                                onClick={() => handleDropdownClick('masuk')}
                            >
                                <AiOutlineInbox className="inline-block mr-2" />
                                Barang Masuk
                            </button>
                            {isDropdownOpen.masuk && (
                                <div
                                    className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    tabIndex="-1"
                                >
                                    <a
                                        onClick={() => navigate('/listbarangmasuk')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        role="menuitem"
                                        tabIndex="-1"
                                    >
                                        List Barang Masuk
                                    </a>
                                    <a
                                        onClick={() => navigate('/formbarangmasuk')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        role="menuitem"
                                        tabIndex="-1"
                                    >
                                        Form Input Barang Masuk
                                    </a>
                                    <a
                                        onClick={() => navigate('/editbarangmasuk')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        role="menuitem"
                                        tabIndex="-1"
                                    >
                                        Edit Barang Masuk
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="relative inline-block text-left">
                            <button
                                type="button"
                                className="block w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
                                aria-expanded={isDropdownOpen.keluar}
                                aria-haspopup="true"
                                onClick={() => handleDropdownClick('keluar')}
                            >
                                <AiOutlineExport className="inline-block mr-2" />
                                Barang Keluar
                            </button>
                            {isDropdownOpen.keluar && (
                                <div
                                    className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    tabIndex="-1"
                                >
                                    <a
                                        onClick={() => navigate('/listbarangkeluar')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        role="menuitem"
                                        tabIndex="-1"
                                    >
                                        List Barang Keluar
                                    </a>
                                    {role !== 'Staff' && role !== 'User' && (
                                    <>
                                    <a
                                        onClick={() => navigate('/formbarangkeluar')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        role="menuitem"
                                        tabIndex="-1"
                                    >
                                        Form Input Barang Keluar
                                    </a>
                                    <a
                                        onClick={() => navigate('/editbarangkeluar')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        role="menuitem"
                                        tabIndex="-1"
                                    >
                                        Edit Barang Keluar
                                    </a>
                                    </>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            
                            type="button"
                            onClick={() => navigate('/about')}
                            className="block w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <AiFillBulb className="inline-block mr-2" />
                            About App
                        </button>
                        <button
                            
                            type="button"
                            onClick={Logout}
                            className="block w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <AiOutlineUser className="inline-block mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
