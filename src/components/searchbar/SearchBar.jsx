import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="search-container">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search here..."
      />
      {value && (
        <>
          <button className="clear-btn" onClick={onClear}>Clear Search</button>
          <span className="close-icon" onClick={onClear}>❌</span>
        </>
      )}
    </div>
  );
}

export default SearchBar;