import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; // Adjust the import path if necessary
import '../styles/FavoritesPage.css';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFavorites = async () => {
        let endpointUrl; // To hold the correct URL
        let userId;
    
        // Check if the user is a guest or logged-in customer
        if (!localStorage.getItem('userId')) {
            // Guest user logic
            userId = localStorage.getItem('guestId'); // Retrieve guestId from localStorage
    
            if (!userId) {
                // If no guestId exists, show error and stop execution
                setError('Unable to fetch favorites. Please log in or continue as a guest.');
                setLoading(false);
                return;
            }
    
            // Construct endpoint for guest
            endpointUrl = `http://localhost:8000/wishlist/${userId}/`; // Use userId (guestId) here
        } else {
            // Logged-in customer logic
            userId = localStorage.getItem('userId'); // Retrieve customerId from localStorage
    
            // Construct endpoint for customer
            endpointUrl = `http://localhost:8000/wishlist/${userId}/`;
        }
    
        try {
            // Fetch favorites from the backend
            const response = await fetch(endpointUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch favorites: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log('Fetched data:', data);
    
            // Ensure data is properly formatted as an array
            const favoritesList = Array.isArray(data) ? data : data.favorites || [];
            setFavorites(favoritesList); // Update state with fetched favorites
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError('Error fetching favorites. Please try again later.');
        } finally {
            setLoading(false); // Ensure the loading state is updated
        }
    };
    
    useEffect(() => {
        fetchFavorites();
    }, []);

    // Loading State
    if (loading) {
        return <p>Loading favorites...</p>;
    }

    // Error State
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="favorites-page">
            <h1>Your Favorites</h1>
            {favorites.length > 0 ? (
                <div className="favorites-list">
                    {favorites.map((product) => (
                        <ProductCard key={product.product_id} product={product} />
                    ))}
                </div>
            ) : (
                <p>No favorites added yet. Start adding products to your favorites!</p>
            )}
        </div>
    );
};

export default FavoritesPage;
