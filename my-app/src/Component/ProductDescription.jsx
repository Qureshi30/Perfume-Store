import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSession } from "@clerk/clerk-react";
import { CartContext } from '../CartContextProvider';

const ProductDescription = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const { session } = useSession();
    const userId = session?.userId;
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/products/get-products`);
                const foundProduct = response.data.products.find(p => p.productId === Number(id));

                if (foundProduct) {
                    setProduct(foundProduct);
                    setError(null);
                    console.log('Product fetched:', foundProduct);
                    console.log('Image URL:', foundProduct.imageUrl);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Error loading product');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {


        try {
            setAddingToCart(true);

            // Map product data to the format expected by our cart API
            const productToAdd = {
                _id: product.productId,
                title: product.productName,
                price: product.price,
                imageUrl: product.imageUrl
            };

            await addToCart(productToAdd);
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setAddingToCart(false);
        }
    }

    // Function to handle image URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '/images/placeholder-image.png';

        // If it's already a full URL, use it
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }

        // If it's a base64 image, use it directly
        if (imageUrl.startsWith('data:image')) {
            return imageUrl;
        }

        // Clean the path and ensure it starts with /uploads/
        const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/uploads/${imageUrl.replace(/^uploads[/\\]/, '')}`;
        return `http://localhost:5000${cleanPath}`;
    };

    // Fallback image from public folder
    const fallbackImage = '/images/placeholder-image.png';

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : error ? (
                <div className="text-center p-8 bg-red-50 rounded-lg shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="mt-4 text-lg text-red-800">{error}</p>
                </div>
            ) : product ? (
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
                                <div className="relative group">
                                    {product.imageUrl ? (
                                        <img
                                            src={getImageUrl(product.imageUrl)}
                                            alt={product.productName}
                                            className="w-full h-[400px] object-cover rounded-lg shadow-lg transform transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                console.error('Image failed to load:', getImageUrl(product.imageUrl));
                                                setImageError(true);
                                                // Try with fallback image from public folder
                                                e.target.src = fallbackImage;
                                                // If even that fails, use a data URI
                                                e.target.onerror = () => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNzc3Ij5ObyBpbWFnZTwvdGV4dD48L3N2Zz4=';
                                                };
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-[400px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-500">No image available</span>
                                        </div>
                                    )}
                                    {imageError && (
                                        <div className="absolute bottom-2 left-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                                            Using placeholder image
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="md:w-1/2 p-8">
                                <div className="h-full flex flex-col">
                                    <div className="flex-grow">
                                        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">{product.productName}</h1>
                                        <div className="flex items-center mb-6">
                                            <p className="text-3xl font-bold text-purple-600">Rs {product.price.toLocaleString()}</p>
                                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">Premium</span>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Product Description</h2>
                                                <p className="text-gray-600 leading-relaxed">{product.description || 'No description available'}</p>
                                            </div>
                                            <div className="border-t border-gray-200 pt-6">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Premium Quality</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={addingToCart}
                                            className={`w-full ${addingToCart ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} text-white px-8 py-3 rounded-lg transform transition-all duration-300 ${!addingToCart && 'hover:scale-105 hover:shadow-lg'} flex items-center justify-center space-x-2`}
                                        >
                                            {addingToCart ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Adding to Cart...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span>Add to Cart</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-4 text-lg text-gray-600">No product found</p>
                </div>
            )}
        </div>
    );
};

export default ProductDescription;
