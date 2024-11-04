// components/CategoryLink.js

import React from 'react';
import { Link } from 'react-router-dom';

const CategoryLink = ({ category }) => (
    <Link 
        to={`/products?category=${category.query}`} 
        className={`btn ${category.buttonClass} btn-lg mx-2`}
    >
        {category.label}
    </Link>
);

export default CategoryLink;
