import{ useState } from 'react';
import search from '../assets/images/search.png';
import './styles/searchbar.css'


const searchbar = ({ placeholder, onSearch }) => {
  const [query, setQuery] = useState(''); // Manage input value with useState

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(query); // Pass the current input value to the parent component
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        value={query}
        onChange={handleInputChange} // Update state on input change
        placeholder={placeholder || 'Search...'}
      />
      <button className="search-button" onClick={handleSearchClick}>
        <img src={search} alt="Search" className="search-icon" />
      </button>
    </div>
  );
};

export default searchbar;



