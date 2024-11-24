import React, { useState, useEffect } from 'react';
import '../styles/SortComponent.css';

const SortComponent = ({ onProductsSorted }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8000/products/');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data); // Save all products to state
        onProductsSorted(data); // Pass products to parent for initial display
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [onProductsSorted]);

  // Handle sorting logic
  const handleSort = (option) => {
    let sortedProducts = [...products];
    if (option === 'popularity_score') {
      sortedProducts.sort((a, b) => b.popularity_score - a.popularity_score); // Descending order
    } else if (option === 'price') {
      sortedProducts.sort((a, b) => a.price - b.price); // Ascending order
    }

    setProducts(sortedProducts); // Update sorted products in state
    onProductsSorted(sortedProducts); // Pass sorted products to parent component
  };

  return (
    <div className="sort-component">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div>
          <div className="sort-buttons">
            <button
              className="sort-option-button"
              onClick={() => handleSort('popularity_score')}
            >
              Sort by Popularity Score
            </button>
            <button
              className="sort-option-button"
              onClick={() => handleSort('price')}
            >
              Sort by Price
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortComponent;
