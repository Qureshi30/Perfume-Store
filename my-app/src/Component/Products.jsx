import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser, useSession } from '@clerk/clerk-react';
import { CartContext } from '../CartContextProvider';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [sortOrder, setSortOrder] = useState('default');
    const { user } = useUser();
    const { session } = useSession();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [addingToCart, setAddingToCart] = useState(false);

    // Fetch products from the database
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/products/get-products');
                console.log('Raw response:', response);
                console.log('Response data:', response.data);

                if (response.data && response.data.status === true && Array.isArray(response.data.products)) {
                    console.log('Setting products:', response.data.products);
                    setProducts(response.data.products);
                    setError(null);
                } else {
                    console.error('Invalid data format:', response.data);
                    setError('Invalid data format received from server');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (pid) => {
        if (!session?.userId) {
            // Redirect to login if user is not authenticated
            navigate('/login');
            return;
        }

        // Find the product in our products array
        const product = products.find(product => product.productId === pid);

        if (!product) {
            console.error('Product not found with ID:', pid);
            return;
        }

        try {
            setAddingToCart(true);

            // Create a cart item with all necessary fields
            const cartItem = {
                userId: session.userId,
                productId: Number(product.productId),
                title: product.productName,
                description: product.description || '',
                price: Number(product.price),
                imageUrl: product.imageUrl || '',
                brand: product.brand || 'Lelido',
                altText: product.altText || product.productName,
                quantity: 1
            };

            console.log('Attempting to add to cart:', cartItem);

            try {
                // Call the addToCart function from CartContext
                const result = await addToCart(cartItem);

                if (result && result.status) {
                    console.log('Successfully added to cart:', result);

                    // Show success message (you could add a toast notification here)

                    // Navigate to cart page after a short delay
                    setTimeout(() => {
                        navigate('/cart');
                    }, 300);
                } else {
                    throw new Error(result?.message || 'Unknown error occurred');
                }
            } catch (apiError) {
                console.error('API error:', apiError);
                // Handle API error (show a notification to the user)
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            // Handle general error
        } finally {
            setAddingToCart(false);
        }
    }

    console.log('Current products state:', products);

    const filteredProducts = products
        .filter(product => selectedBrand === 'All' || product.brand === selectedBrand)
        .filter(product => {
            return product.price >= priceRange[0] && product.price <= priceRange[1];
        })
        .sort((a, b) => {
            if (sortOrder === 'default') return 0;
            return sortOrder === 'low-to-high' ? a.price - b.price : b.price - a.price;
        });

    console.log('Filtered products:', filteredProducts);

    const brands = ['All', ...new Set(products.map(product => product.brand))];

    console.log('Creating product list from filtered products:', filteredProducts);
    console.log('Sample image URL:', filteredProducts[0]?.imageUrl);

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

    const productList = filteredProducts.map((product) => {
        const imageUrl = getImageUrl(product.imageUrl);
        console.log(`Processing image for ${product.productName}:`, imageUrl);

        return (
            <div key={product.productId} className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl overflow-hidden">
                <a href={`/product/${product.productId}`}>
                    <img
                        src={imageUrl}
                        alt={product.altText || product.productName}
                        className="h-80 w-72 object-cover"
                        onError={(e) => {
                            console.error('Image failed to load:', imageUrl);
                            e.target.src = '/images/placeholder-image.png';
                        }}
                    />
                </a>
                <div className="px-4 py-3 w-72">
                    <span className="text-purple-600 mr-3 uppercase text-xs font-semibold">{product.brand}</span>
                    <p className="text-lg font-bold text-black truncate block capitalize">
                        {product.productName}
                    </p>
                    <div className="flex items-center">
                        <p className="text-lg font-semibold text-black cursor-auto my-3">
                            ${product.price}
                        </p>
                        <del>
                            <p className="text-sm text-gray-600 cursor-auto ml-2">$199</p>
                        </del>
                        <div className="ml-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(Number(product.productId));
                                }}
                                disabled={addingToCart}
                                className={`bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors ${addingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {addingToCart ? (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-bag-plus" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    });


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold">Explore Our Collection</h1>
                {user?.publicMetadata?.role === 'admin' && (
                    <a
                        href="/add-product"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Add Product
                    </a>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters sidebar */}
                <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="font-bold text-xl mb-4">Filters</h2>

                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Brand</h3>
                        <div className="space-y-2">
                            {brands.map(brand => (
                                <div key={brand} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={brand}
                                        name="brand"
                                        checked={selectedBrand === brand}
                                        onChange={() => setSelectedBrand(brand)}
                                        className="mr-2 accent-purple-600"
                                    />
                                    <label htmlFor={brand}>{brand}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Sort By</h3>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                            <option value="default">Featured</option>
                            <option value="low-to-high">Price: Low to High</option>
                            <option value="high-to-low">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Products grid */}
                <div className="w-full md:w-3/4">
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-600 text-xl mb-4">{error}</div>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-purple-600 hover:text-purple-700 underline"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-14 mt-10 mb-5 justify-items-center">
                            {productList.length > 0 ? productList : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-lg text-gray-600">No products found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
