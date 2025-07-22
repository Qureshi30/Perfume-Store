import React, { useContext } from 'react';
import { CartContext } from '../CartContextProvider';

const Cart = () => {
    const { cartItems, loading, error, quantities, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);

    // Helper function to get the correct image URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '/images/placeholder-image.png';
        
        // If it's already a full URL (http/https), return as is
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        
        // If it's a data URL (base64), return as is
        if (imageUrl.startsWith('data:image')) {
            return imageUrl;
        }
        
        // For relative paths, construct the full URL pointing to backend server
        const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/uploads/${imageUrl.replace(/^uploads[/\\]/, '')}`;
        return `http://localhost:5000${cleanPath}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading your cart...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-lg">{error}</div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>
                <div className="text-center">
                    <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
                    <a href="/products" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                        Continue Shopping
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between border-b py-4">
                        <div className="flex items-center space-x-4">
                            {item.imageUrl && (
                                <img
                                    src={getImageUrl(item.imageUrl)}
                                    alt={item.title}
                                    className="w-16 h-16 object-cover rounded"
                                    onError={(e) => {
                                        console.error('Image failed to load:', getImageUrl(item.imageUrl));
                                        e.target.src = '/images/placeholder-image.png';
                                    }}
                                />
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                <p className="text-gray-600">${item.price}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => updateQuantity(item.productId, Math.max(1, (quantities[item.productId] || item.quantity) - 1))}
                                    className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                                >
                                    -
                                </button>
                                <span className="px-3 py-1 bg-gray-100 rounded">
                                    {quantities[item.productId] || item.quantity || 1}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.productId, (quantities[item.productId] || item.quantity) + 1)}
                                    className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                                >
                                    +
                                </button>
                            </div>

                            <div className="text-lg font-semibold">
                                ${(item.price * (quantities[item.productId] || item.quantity || 1)).toFixed(2)}
                            </div>

                            <button
                                onClick={() => removeFromCart(item.productId)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold">Total: ${getCartTotal()}</span>
                    </div>

                    <div className="flex justify-between">
                        <a href="/products" className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                            Continue Shopping
                        </a>
                        <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
