import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser, useAuth } from "@clerk/clerk-react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({});
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    // Fetch cart items from the server
    const fetchCartItems = async () => {
        if (!user?.id) return;

        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const response = await axios.get(`http://localhost:5000/api/shopping-cart/get-cart/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const items = response.data.cart || [];
            setCartItems(items);

            // Initialize quantities for each product
            const initialQuantities = {};
            items.forEach(item => {
                initialQuantities[item.productId] = item.quantity || 1;
            });
            setQuantities(initialQuantities);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError('Failed to fetch cart items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Add a product to the cart
    const addToCart = async (product, imageFile) => {
        if (!user?.id) {
            console.error("Cannot add to cart: User not authenticated", user?.id);
            throw new Error('User not authenticated');
        }

        setLoading(true);
        setError(null);

        try {
            // Get auth token
            const token = await getToken();

            // Create the cart data object
            const cartData = {
                userId: user.id,
                productId: Number(product.productId || product._id),
                title: product.title || product.productName,
                price: Number(product.price),
                imageUrl: product.imageUrl || product.image || '', // Add imageUrl field
                quantity: Number(product.quantity) || 1
            };

            console.log('Adding to cart:', cartData);
            console.log('Product data received:', product);

            const response = await axios.post(
                'http://localhost:5000/api/shopping-cart/add-to-cart',
                cartData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('Add to cart response:', response.data);

            if (response.data.success) {
                await fetchCartItems(); // Refresh the cart
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to add to cart');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            console.error("Error adding to cart:", errorMsg);
            setError(`Failed to add item to cart: ${errorMsg}`);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Remove a product from the cart
    const removeFromCart = async (productId) => {
        if (!user?.id) return;

        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            await axios.delete(`http://localhost:5000/api/shopping-cart/remove-from-cart/${user.id}/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            fetchCartItems(); // Refresh the cart after removing
        } catch (err) {
            console.error("Error removing from cart:", err);
            setError('Failed to remove item from cart. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update the quantity of a product in the cart
    const updateQuantity = async (productId, newQuantity) => {
        if (!user?.id || newQuantity < 1) return;

        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            await axios.put(
                `http://localhost:5000/api/shopping-cart/update-quantity/${user.id}/${productId}`,
                { quantity: newQuantity },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setQuantities(prev => ({
                ...prev,
                [productId]: newQuantity
            }));

            fetchCartItems(); // Refresh the cart after updating
        } catch (err) {
            console.error("Error updating quantity:", err);
            setError('Failed to update item quantity. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get the cart total (price * quantity for all items)
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * (quantities[item.productId] || item.quantity || 1));
        }, 0).toFixed(2);
    };

    // Load cart when user data is loaded and user exists
    useEffect(() => {
        if (isLoaded && user?.id) {
            fetchCartItems();
        }
    }, [user, isLoaded]);

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            error,
            quantities,
            addToCart,
            removeFromCart,
            updateQuantity,
            fetchCartItems,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
