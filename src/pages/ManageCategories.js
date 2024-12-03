import React, { useState, useEffect } from 'react';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Add a new category
    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            alert('Category name cannot be empty.');
            return;
        }

        setLoading(true);
        fetch('http://localhost:8000/category/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newCategory }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to add category');
                return response.json();
            })
            .then(() => {
                setCategories((prev) => [...prev, { name: newCategory }]);
                setNewCategory('');
                alert(`Category "${newCategory}" added successfully.`);
            })
            .catch((err) => alert(`Error: ${err.message}`))
            .finally(() => setLoading(false));
    };

    // Remove a category
    const handleRemoveCategory = (categoryName) => {
        if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
            return;
        }

        setLoading(true);
        fetch(`http://localhost:8000/category/remove/${categoryName}/`, {
            method: 'PUT',
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to remove category');
                return response.json();
            })
            .then(() => {
                setCategories((prev) => prev.filter((cat) => cat.name !== categoryName));
                alert(`Category "${categoryName}" removed successfully.`);
            })
            .catch((err) => alert(`Error: ${err.message}`))
            .finally(() => setLoading(false));
    };

    return (
        <div style={styles.container}>
            <h1>Manage Categories</h1>
            {error && <p style={styles.error}>Error: {error}</p>}
            <div style={styles.addCategoryContainer}>
                <input
                    type="text"
                    placeholder="Enter category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleAddCategory} disabled={loading} style={styles.addButton}>
                    Add Category
                </button>
            </div>
            <h2>Existing Categories</h2>
            {categories.length === 0 ? (
                <p>No categories available.</p>
            ) : (
                <ul style={styles.categoryList}>
                    {categories.map((category) => (
                        <li key={category.name} style={styles.categoryItem}>
                            {category.name}
                            <button
                                onClick={() => handleRemoveCategory(category.name)}
                                disabled={loading}
                                style={styles.deleteButton}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    addCategoryContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginRight: '10px',
        flex: 1,
    },
    addButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    categoryList: {
        listStyleType: 'none',
        padding: 0,
    },
    categoryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    deleteButton: {
        padding: '5px 10px',
        fontSize: '14px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
    },
};

export default ManageCategories;
