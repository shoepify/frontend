import React, { useState } from 'react';

const FavoritesPage = () => {
    // Mock data for demonstration
    const [favorites] = useState([
        { id: 1, name: 'High-Top Sneaker', price: 79.99, img: 'path/to/image1.jpg' },
        { id: 2, name: 'Leather Boot', price: 129.99, img: 'path/to/image2.jpg' },
        { id: 3, name: 'Sporty Running Shoe', price: 99.99, img: 'path/to/image3.jpg' }
    ]);

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Your Favorites</h2>
            <div className="row">
                {favorites.length > 0 ? (
                    favorites.map(item => (
                        <div key={item.id} className="col-md-4 mb-3">
                            <div className="card h-100 text-center">
                                <img src={item.img} className="card-img-top" alt={item.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">${item.price.toFixed(2)}</p>
                                    {/* Add "Remove from Favorites" or other actions as needed */}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">You have no favorites yet.</p>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
