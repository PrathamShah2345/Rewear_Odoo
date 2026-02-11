import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#F5F5F5] pt-16 pb-8 border-t border-gray-200 text-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Column 1: Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wide">About Us</h4>
                        <div className="flex flex-col space-y-2 text-sm text-gray-600">
                            <Link to="/" className="hover:underline">Our Story</Link>
                            <Link to="/" className="hover:underline">Sustainability</Link>
                            <Link to="/" className="hover:underline">Careers</Link>
                            <Link to="/" className="hover:underline">Press</Link>
                        </div>
                    </div>

                    {/* Column 2: Customer Care */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wide">Customer Care</h4>
                        <div className="flex flex-col space-y-2 text-sm text-gray-600">
                            <Link to="/" className="hover:underline">Contact Us</Link>
                            <Link to="/" className="hover:underline">Shipping & Returns</Link>
                            <Link to="/" className="hover:underline">FAQ</Link>
                            <Link to="/admin" className="hover:underline">Admin Login</Link>
                        </div>
                    </div>

                    {/* Column 3: Newsletter */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wide">Get Email Updates</h4>
                        <p className="text-sm text-gray-600">Sign up for the latest news, offers and styles.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 bg-white border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
                            />
                            <button className="bg-white border border-gray-300 px-6 py-2 text-sm font-semibold hover:bg-black hover:text-white transition-colors uppercase">
                                Sign Up
                            </button>
                        </div>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>© 2026 ReWear Design Store. All Rights Reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/" className="hover:text-black">Privacy Policy</Link>
                        <Link to="/" className="hover:text-black">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
