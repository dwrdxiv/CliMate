import React, { useState } from "react";
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setQuery('');
        }
    };

    return (
        <header className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <input type="text" placeholder="Looking for a city?" value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
                <button type="submit" className="search-button">🔍</button>
            </form>
        </header>
    );
};

export default SearchBar;