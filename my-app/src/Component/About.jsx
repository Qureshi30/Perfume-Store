import React from 'react'
import best2 from '../Images/best2.png';

export default function About() {
    return (
        <div className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-xl rounded-lg p-6 md:p-12 flex flex-col md:flex-row items-center justify-center">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <img
                            src={best2}
                            alt="About Us Image"
                            className="rounded-lg shadow-xl transform hover:scale-105 transition duration-300"
                        />
                    </div>
                    <div className="md:w-1/2 md:ml-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 font-serif">About Lelido</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            At Lelido, we believe in the power of fragrance to transform everyday moments into extraordinary experiences. Our journey began with a passion for crafting unique scents that inspire and uplift the senses.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            Each fragrance is meticulously curated using the finest ingredients sourced from around the world. From soothing florals to invigorating spices, every Lelido creation is designed to evoke emotions and memories, making every space a place of joy and serenity.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            Our commitment to quality and sustainability drives everything we do. We prioritize eco-friendly practices and ethical sourcing, ensuring that our products not only enrich lives but also protect our planet for future generations.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed mb-8">
                            Join us on a sensory journey and discover the essence of Lelido – where luxury meets nature, and every fragrance tells a story.
                        </p>
                        <div className="text-center">
                            <a href="#" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300">Explore Our Collections</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
