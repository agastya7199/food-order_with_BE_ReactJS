import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '/logo.jpg';
import CartModal from './CartModal.jsx';
import { useCart } from '../context/CartContextComp.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
    const cartRef = useRef();
    const dropdownRef = useRef();
    const { items } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Get current page name for breadcrumb
    const getPageName = () => {
        const path = location.pathname;
        if (path === '/home') return 'Home';
        if (path === '/orders') return 'Orders';
        if (path === '/profile') return 'Profile';
        return '';
    };

    function openCartHandler() {
        cartRef.current.open();
    }

    function handleLogout() {
        logout();
        navigate('/');
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    }

    function handleHome() {
        navigate('/home');
        setIsMobileMenuOpen(false);
    }

    function handleOrders() {
        navigate('/orders');
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
    }

    function handleProfile() {
        navigate('/profile');
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
    }

    function toggleDropdown() {
        setIsDropdownOpen(!isDropdownOpen);
    }

    function toggleMobileMenu() {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <>
            {/* Desktop Header */}
            <section
                id="main-header"
                className="hidden lg:flex justify-between items-center px-12 py-8"
            >
                <div id="title" className="flex gap-4 items-center">
                    <h1>React Food</h1>
                    <img
                        src={Logo}
                        alt="Logo img"
                        className="w-16 h-16 object-contain rounded-full border-2 border-gold"
                    ></img>
                </div>
                <div className="flex items-center gap-8">
                    <button className="text-button" onClick={handleHome}>
                        Home
                    </button>
                    <button className="text-button" onClick={handleOrders}>
                        Orders
                    </button>
                    <button className="text-button" onClick={openCartHandler}>
                        Cart {items.length ? <span>({items.length})</span> : undefined}
                    </button>
                    {user && (
                        <div ref={dropdownRef} className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="w-12 h-12 rounded-full bg-gold border-none cursor-pointer flex items-center justify-center p-0"
                                aria-label="User menu"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                                        fill="#1f1a09"
                                    />
                                    <path
                                        d="M12 14C7.58172 14 4 16.6863 4 20V22H20V20C20 16.6863 16.4183 14 12 14Z"
                                        fill="#1f1a09"
                                    />
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 bg-dark-bg border border-dark-border rounded-lg shadow-lg w-40 z-50 p-0">
                                    <div className="p-3 border-b border-dark-border text-gold font-lato text-base font-bold">
                                        {user.fullName}
                                    </div>
                                    <div className="border-b border-dark-border">
                                        <button
                                            className="text-button w-full text-left p-3 border-b border-dark-border bg-transparent cursor-pointer font-lato text-base"
                                            onClick={handleProfile}
                                        >
                                            Profile
                                        </button>
                                    </div>
                                    <button
                                        className="text-button w-full text-left p-3 bg-transparent cursor-pointer font-lato text-base"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Mobile Header */}
            <section className="lg:hidden flex justify-between items-center px-4 py-4 bg-dark-bg border-b border-dark-border">
                <div id="title" className="flex gap-2 items-center">
                    <h1 className="text-lg">React Food</h1>
                    <img
                        src={Logo}
                        alt="Logo img"
                        className="w-10 h-10 object-contain rounded-full border-2 border-gold"
                    ></img>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-button text-sm" onClick={openCartHandler}>
                        Cart {items.length ? <span>({items.length})</span> : undefined}
                    </button>
                    <button
                        onClick={toggleMobileMenu}
                        className="w-10 h-10 rounded-full bg-gold border-none cursor-pointer flex items-center justify-center p-0"
                        aria-label="Menu"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 6H21M3 12H21M3 18H21"
                                stroke="#1f1a09"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </section>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-dark-bg border-b border-dark-border p-4">
                    <button className="text-button w-full text-left p-3 mb-2" onClick={handleHome}>
                        Home
                    </button>
                    <button
                        className="text-button w-full text-left p-3 mb-2"
                        onClick={handleOrders}
                    >
                        Orders
                    </button>
                    {user && (
                        <button
                            className="text-button w-full text-left p-3 mb-2"
                            onClick={handleProfile}
                        >
                            Profile
                        </button>
                    )}
                    {user && (
                        <button className="text-button w-full text-left p-3" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            )}

            {/* Mobile Breadcrumb */}
            {getPageName() && (
                <div className="lg:hidden bg-dark-card px-4 py-3 border-b border-dark-border flex items-center gap-2 text-sm">
                    {location.pathname !== '/home' && (
                        <>
                            <button
                                onClick={handleHome}
                                className="text-gold hover:text-gold-hover transition"
                            >
                                Home
                            </button>
                            <span className="text-text-muted">/</span>
                        </>
                    )}
                    <span className="text-text-light">{getPageName()}</span>
                </div>
            )}

            <CartModal ref={cartRef} />
        </>
    );
}
