import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate, useParams } from 'react-router-dom';
import DetailCard from './DetailCard';

const Detail = () => {
  const navigate = useNavigate();
  const { iri_peristiwa } = useParams();
  const [datas, setDatas] = useState([]);
  const [response, setResponse] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const placeHolder = "Ketikkan nama peristiwa, tokoh, atau tempat sejarah...";

  const handleClick = (val) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate("/detail/" + val);
  };

  const handleChange = (trigger) => {
    setSearchTerm(trigger.target.value);
    setSuggestions(Object.values(datas)
      .map(data => ({ value: data.iri, label: data.name }))
      .filter(data => data.value.toLowerCase().includes(trigger.target.value.toLowerCase()))
      .sort((a, b) => a.label > b.label ? 1 : -1));
  }

  useEffect(() => {
    let url = 'http://127.0.0.1:8000/map/detail/' + iri_peristiwa;
    // console.log(url)
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => { setResponse(data) })
      .catch((error) => console.error(error))
  }, [iri_peristiwa]);

  return (
    <div className='container mx-auto px-4'>
      <div className='my-4 w-1/2 mx-auto h-12'>
        {/* <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} suggestions={suggestions} handleChange={handleChange} handleClick={handleClick} placeHolder={placeHolder} /> */}
      </div>

      {!response?.detail &&
        <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Loading detail... </h1>}

      {response?.detail && !response?.detail?.name &&
        <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Data {iri_peristiwa} tidak tersedia </h1>}

      {response?.detail?.name && (<DetailCard response={response} />)}
    </div>
  )
}

export default Detail;
