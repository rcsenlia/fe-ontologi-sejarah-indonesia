import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, OverlayTrigger, Popover, ListGroup } from "react-bootstrap";
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SearchBar from './SearchBar';
import DetailCard from './DetailCard';

const ChangeMapView = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds]);

  return null;
}

const Detail = () => {
  const navigate = useNavigate();
  const { iri_peristiwa } = useParams();
  const [datas, setDatas] = useState([]);
  const [response, setResponse] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const placeHolder = "Ketikkan nama peristiwa, tokoh, atau tempat sejarah...";

  const handleClick = (val) => {
    console.log(val)
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
    let url = 'http://127.0.0.1:8000/map/all';
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => { setDatas(data) })
      .catch((error) => console.error(error))
  }, [])

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

  const maxBounds = [
    [-90, -180],
    [90, 180],
  ];

  return (
    <Container fluid>
      <div className='my-4 w-1/2 mx-auto h-12'>
        <SearchBar searchTerm={searchTerm} suggestions={suggestions} handleChange={handleChange} handleClick={handleClick} placeHolder={placeHolder} />
      </div>

      {!response?.detail &&
        <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Loading detail... </h1>}

      {response?.detail && !response?.detail?.name &&
        <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Tidak ada data </h1>}

      {response?.detail?.name && (<>
        <DetailCard response={response} />

        {response?.location != null &&
        <MapContainer
          style={{ height: "40vh" }}
          maxBounds={maxBounds}
          minZoom={3}
          className='rounded my-3'
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON
            data={response?.location}
          />
          <ChangeMapView bounds={response?.bounds} />
        </MapContainer>}
      </>)}
    </Container>
  )
}

export default Detail;
