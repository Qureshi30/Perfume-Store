import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { IoCartSharp } from "react-icons/io5";
import { UserButton, useUser, useAuth } from "@clerk/clerk-react";
import { CartContext } from "../CartContextProvider";

export default function Component() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const { cartItems } = useContext(CartContext);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    return (
        <div className="sticky top-0 z-50">
            <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="navbar-default"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 17 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1h15M1 7h15M1 13h15"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center space-x-3">
                        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white font-serif text-purple-700">Lelido</span>
                        </a>
                    </div>

                    <div className={`w-full md:flex md:items-center md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">

                            <li>
                                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Home</a>
                            </li>
                            <li>
                                <a href="/Products" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Products</a>
                            </li>
                            <li>
                                <a href="/About" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a>
                            </li>
                            <li>
                                <a href="/Contact" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contact</a>
                            </li>
                            {isLoaded && isSignedIn && (
                                <li>
                                    <Link
                                        to="/dashboard"
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            )}
                            {/* {isLoaded && isSignedIn && user?.publicMetadata?.role === 'admin' && (
                                <li>
                                    <Link
                                        to="/admin/register"
                                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                    >
                                        Register Admin
                                    </Link>
                                </li>
                            )} */}
                            {isLoaded && !isSignedIn && (
                                <>
                                    <li>
                                        <Link
                                            to="/signup"
                                            className="block py-2 px-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                        >
                                            Sign Up
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/login"
                                            className="block py-2 px-4 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                                        >
                                            Login
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div className="flex cursor-pointer items-center space-x-6 mt-2 md:mt-0">
                        <div className="relative">
                            <GoSearch
                                onClick={toggleSearch}
                                className="text-2xl text-gray-700 dark:text-gray-200 hover:scale-125 transition-transform duration-200 hover:text-purple-700"
                            />
                            {isSearchOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
                                    <div className="flex items-center border rounded-lg overflow-hidden">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="w-full px-3 py-2 focus:outline-none dark:bg-gray-700 dark:text-white"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button className="bg-purple-600 text-white px-3 py-2 hover:bg-purple-700">
                                            <GoSearch />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Link to="/cart" className="relative">
                            <IoCartSharp className="text-2xl text-gray-700 dark:text-gray-200 hover:scale-125 transition-transform duration-200 hover:text-purple-700" />
                            {cartItems && cartItems.length > 0 ? (
                                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            ) : (
                                <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    0
                                </span>
                            )}
                        </Link>

                        {/* User Button from Clerk */}
                        <div className="relative">
                            {isLoaded && isSignedIn && (
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10 rounded-full hover:scale-110 transition-transform duration-200",
                                            userButtonPopup: "top-12 right-0",
                                        },
                                    }}
                                    afterSignOutUrl="/"
                                    showName={false}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
