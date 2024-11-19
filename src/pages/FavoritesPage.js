import React, { useEffect, useState } from 'react';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const customerId = 1; // Replace with logged-in customer ID
        fetch(`http://localhost:8000/favorites/${customerId}/`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch favorites');
                return response.json();
            })
            .then(data => {
                setFavorites(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading favorites...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="favorites-page">
            <h1>Your Favorites</h1>
            <ul>
                {favorites.map(item => (
                    <li key={item.product_id}>
                        {item.product_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FavoritesPage;
