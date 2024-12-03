import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagerCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  const baseURL = "http://127.0.0.1:8000"; // Adjust to your API base URL

  // Fetch categories from the server
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/category/view/`); // Replace with your endpoint
      console.log("Fetched Categories:", response.data.categories);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add a new category
  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/category/add/`, {
        name: newCategoryName,
        description: newCategoryDescription || "No description available",
      });
      setCategories((prevCategories) => [...prevCategories, response.data.category]);
      setNewCategoryName(""); // Clear input fields
      setNewCategoryDescription("");
    } catch (error) {
      console.error("Error adding category:", error);
      alert(error.response?.data?.error || "Failed to add category.");
    }
  };

  // Remove a category
  const removeCategory = async (categoryName) => {
    try {
      await axios.delete(`${baseURL}/category/remove/${categoryName}/`);
      setCategories((prevCategories) => prevCategories.filter((cat) => cat.name !== categoryName));
    } catch (error) {
      console.error("Error removing category:", error);
      alert(error.response?.data?.error || "Failed to remove category.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
      <h1>Product Categories</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <li
              key={category.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
              }}
            >
              <span>{category.name}</span>
              <button
                onClick={() => removeCategory(category.name)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "3px",
                }}
              >
                -
              </button>
            </li>
          ))
        ) : (
          <p>No categories available. Add one using the "+" button below.</p>
        )}
      </ul>
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2>Add Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={{
            padding: "5px",
            marginBottom: "10px",
            width: "80%",
            maxWidth: "300px",
          }}
        />
        <textarea
          placeholder="Category Description (optional)"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
          style={{
            padding: "5px",
            marginBottom: "10px",
            width: "80%",
            maxWidth: "300px",
            height: "80px",
          }}
        />
        <button
          onClick={addCategory}
          style={{
            backgroundColor: "green",
            color: "white",
            border: "none",
            padding: "10px 20px",
            marginTop: "10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductManagerCategories;
