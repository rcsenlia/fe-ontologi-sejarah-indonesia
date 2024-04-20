import React, { useState } from 'react';
import { Form, Button } from "react-bootstrap";
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';

const SearchBar = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (e) => {
    if (e.keyCode === 40) {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex));

      setTimeout(() => {
        const activeItem = document.querySelector('.suggestion-active');
        const suggestionBox = document.querySelector('.suggestions-box');
        if (activeItem && suggestionBox) {
          const activeItemRect = activeItem.getBoundingClientRect();
          const suggestionBoxRect = suggestionBox.getBoundingClientRect();
          if (activeItemRect.bottom + activeItemRect.height > suggestionBoxRect.bottom) {
            suggestionBox.scrollTop += activeItemRect.height;
          }
        }
      }, 0)

    } else if (e.keyCode === 38) {
      e.preventDefault();
      setSelectedIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : 0);

      setTimeout(() => {
        const activeItem = document.querySelector('.suggestion-active');
        const suggestionBox = document.querySelector('.suggestions-box');
        if (activeItem && suggestionBox) {
          const activeItemRect = activeItem.getBoundingClientRect();
          const suggestionBoxRect = suggestionBox.getBoundingClientRect();
          if (activeItemRect.top - activeItemRect.height < suggestionBoxRect.top) {
            suggestionBox.scrollTop -= activeItemRect.height;
          }
        }
      }, 0)
    } else if (e.keyCode === 13) {
      e.preventDefault();
      const activeSuggestion = suggestions[selectedIndex]

      if (activeSuggestion) {
        setSearchTerm(activeSuggestion.label)
        setSearchIRI(activeSuggestion.value)
        setSuggestions([])
      }
    }

    handleEnter(e)
  };

  const handleAdditionalChange = (trigger) => {
    handleChange(trigger)
    setSelectedIndex(0)
  }

  const {
    searchTerm,
    setSearchTerm,
    searchIRI,
    setSearchIRI,
    suggestions,
    setSuggestions,
    handleChange,
    handleClick,
    handleEnter,
    placeHolder 
  }
    = props;

  return <div style={{ height: '100%' }}>
    <Form style={{ height: "100%" }}>
      <Form.Control
        className='me-2'
        style={{ height: "100%" }}
        type="text"
        placeholder={placeHolder}
        onChange={handleAdditionalChange}
        value={searchTerm}
        onKeyDown={handleKeyDown}
      />
      {searchTerm && suggestions.length > 0 && (
        <div style={{ zIndex: 9999 }} className='w-100 relative'>
          <div className='absolute top-4 left-0 border rounded-lg py-2 bg-white w-full max-h-42 overflow-y-auto suggestions-box'>
            {suggestions.map((val, idx) => (
              <div key={"suggestion-" + idx} className={`hover:bg-gray-300 hover:cursor-pointer py-1 px-4 ${selectedIndex === idx ? 'suggestion-active bg-gray-300' : ''}`} onClick={() => handleClick(val)} >{val.label}</div>
            ))}
          </div>
        </div>
      )}
    </Form>
  </div>
}

export default SearchBar;