import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearchResults }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);

        try {
            const response = await axios.get(`/products/search/`, {
                params: { query: searchQuery },
            });

            // Pass search results to the parent component
            onSearchResults(response.data);
        } catch (error) {
            console.error('Error searching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <button
                onClick={handleSearch}
                className="search-button"
                disabled={isLoading}
            >
                {isLoading ? '...' : 'Search'}
            </button>
        </div>
    );
};

export default SearchBar;
