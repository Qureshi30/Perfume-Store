import React, { useState, useEffect } from 'react';
import holder from '../Images/holder.png'; // Ensure this path is correct
import PopularProducts from './PopularProducts';
import fallbackImage from '../Images/holder.png';
import Review from './Review';
import { ReactTyped } from "react-typed";

export default function ImageWithText() {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        // Handle image loading errors
        setImageError(true);
    };

    return (
        <div>
            <div>
                <div
                    className="relative h-fit w-fit"
                    style={{
                        backgroundImage: ` linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${holder})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '100vh', // Adjust as needed
                        width: '100%', // Adjust as needed
                    }}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <h1 className="text-pretty text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
                            <ReactTyped
                                strings={[
                                    "Your Fragrance, Your Identity",
                                    "Scents That Define You",
                                    "Make Every Moment Fragrant",
                                    "Wherever You Go, Let the Fragrance Follow",
                                    "Unforgettable Moments, Incredible Scents",
                                    "A World Full of Fragrance",
                                ]}
                                showCursor={true}
                                typeSpeed={40}
                                backSpeed={50}
                                loop
                                cursorChar="|"
                                className="text-white"
                            >
                                <p></p>
                            </ReactTyped>
                        </h1>

                        <p className="text-white text-lg mt-4 max-w-2xl">
                            Discover premium fragrances that capture the essence of your personality. Our collection brings you the finest scents from around the world.
                        </p>

                        <a href="/Products">
                            <button className="bg-purple-600 mt-8 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:translate-y-1">
                                Explore Collection
                            </button>
                        </a>
                    </div>
                </div>

                {/* New featured categories section */}
                <div className="py-16 px-4 bg-gray-50">
                    <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="h-48 bg-purple-100 flex items-center justify-center">
                                <span className="text-5xl">🌸</span>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-2">For Her</h3>
                                <p className="text-gray-600 mb-4">Elegant and enchanting fragrances for women</p>
                                <a href="/Products" className="text-purple-600 font-semibold hover:text-purple-800">Browse Collection →</a>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="h-48 bg-blue-100 flex items-center justify-center">
                                <span className="text-5xl">🌊</span>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-2">For Him</h3>
                                <p className="text-gray-600 mb-4">Bold and sophisticated scents for men</p>
                                <a href="/Products" className="text-purple-600 font-semibold hover:text-purple-800">Browse Collection →</a>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="h-48 bg-green-100 flex items-center justify-center">
                                <span className="text-5xl">🌿</span>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-2">Unisex</h3>
                                <p className="text-gray-600 mb-4">Universal fragrances for everyone</p>
                                <a href="/Products" className="text-purple-600 font-semibold hover:text-purple-800">Browse Collection →</a>
                            </div>
                        </div>
                    </div>
                </div>

                <PopularProducts />

                <h2 className="font-manrope mx-4 sm:mx-10 lg:mx-20 xl:mx-44 font-bold text-3xl sm:text-4xl text-black mb-8 text-center">
                    Customer Reviews
                </h2>
                <Review />
            </div>
        </div>
    );
}
