// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header>
      <h1>CS308 Shoe Store</h1>
      <nav>
        <a href="/">Home  </a>
        <a href="/cart">Cart </a>
        <a href="/products">Products</a>
      </nav>
    </header>
  );
};

export default Header;
