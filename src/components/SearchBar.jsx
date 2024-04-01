import React from 'react';
import { Form } from "react-bootstrap";
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';

const SearchBar = (props) => {
  const { searchTerm, suggestions, handleChange, handleClick, placeHolder } = props;
  return <div style={{ height: '100%'}}>
    <Form style={{ height: "100%" }}>
      <Form.Control style={{ height: "100%" }} type="text" placeholder={placeHolder} onChange={handleChange} value={searchTerm} />
      {searchTerm && suggestions.length > 0 && (
        <div style={{ zIndex: 9999 }} className='w-100 relative'>
          <div className='absolute top-4 left-0 border rounded-lg py-2 bg-white w-full max-h-36 overflow-y-auto'>
            {suggestions.map((val, idx) => (
              <div key={"suggestion-" + idx} className='hover:bg-gray-300 hover:cursor-pointer py-1 px-4' onClick={() => handleClick(val.value)} >{val.label}</div>
            ))}
          </div>
        </div>
      )}
    </Form>
  </div>
}

export default SearchBar;