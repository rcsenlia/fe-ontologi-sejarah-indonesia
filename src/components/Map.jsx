// https://www.youtube.com/watch?v=D4jq5Bd9bTA

import React, { useState, useEffect } from 'react';
import MultiRangeSlider from "multi-range-slider-react";
import { Container } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Map = () => {
  const [datas, setDatas] = useState([]);
  const [minYear, setMinYear] = useState(1600);
  const [maxYear, setMaxYear] = useState(1998);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchIRI, setSearchIRI] = useState("");
  const [activeMarker, setActiveMarker] = useState(null);
  const placeHolder = "Ketikkan nama peristiwa sejarah...";

  const handleClick = (val) => {
    setSearchTerm(val.label)
    setSuggestions([])
  };

  const handleChange = (trigger) => {
    setSearchTerm(trigger.target.value)
    const labelsMap = {};
    setSuggestions(Object.values(datas)
      .map(data => ({ value: data.iri, label: data.name }))
      .filter(data => {
        const labelLower = data.label.toLowerCase();
        if (labelLower.includes(trigger.target.value.toLowerCase()) && !labelsMap[labelLower]) {
          labelsMap[labelLower] = true;
          return true;
        }
        return false;
      })
      .sort((a, b) => a.label > b.label ? 1 : -1));
  }
  

  useEffect(() => {
    let url = 'http://127.0.0.1:8000/map/';
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => setDatas(data))
      .catch((error) => console.error(error))
  }, []);

  const maxBounds = [
    [-90, -180],
    [90, 180],
  ];

  const filterData = (data) => {
    const isYearInRange = (data.yearStart >= minYear && data.yearStart <= maxYear) ||
      (data.yearEnd >= minYear && data.yearEnd <= maxYear)

    if (searchTerm) {
      const doesNameContainSearch = data.name.toLowerCase().includes(searchTerm.toLowerCase());
      return isYearInRange && doesNameContainSearch
    }

    return isYearInRange
  }

  const filteredDatas = datas.filter(filterData);

  const thickDotDivIcon = divIcon({
    className: 'thick-dot-icon',
    iconSize: [15, 15]
  })

  const activeThickDotDivIcon = divIcon({
    className: 'active-thick-dot-icon',
    iconSize: [20, 20]
  })

  return (
    <Container fluid>
      <h1 className='mt-3' style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Peta Sejarah Indonesia </h1>

      <div className="flex my-3 gap-4">
        <div className='w-1/2 grow'>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchIRI={searchIRI}
            setSearchIRI={setSearchIRI}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            handleChange={handleChange}
            handleClick={handleClick}
            handleEnter={() => { }}
            placeHolder={placeHolder} />
        </div>
        <div className='w-1/2 grow'>
          <MultiRangeSlider
            min={1600}
            max={1998}
            step={1}
            minValue={minYear}
            maxValue={maxYear}
            onInput={(e) => {
              setMinYear(e.minValue);
              setMaxYear(e.maxValue);
            }}
            barInnerColor='blue'
            ruler={false}
          />
        </div>
      </div>


      <MapContainer
        style={{ height: "80vh" }}
        zoom={5}
        center={[-2.548926, 118.0148634]}
        maxBounds={maxBounds}
        minZoom={3}
        className='rounded'
        whenReady={(map) => {
          map.target.on('popupclose', () => {
            setActiveMarker(null);
          });
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredDatas.map((data, index) => (
          <Marker
            key={`${data.iri}_${data.latitude}_${data.longitude}`}
            position={[data.latitude, data.longitude]}
            icon={activeMarker === data.iri ? activeThickDotDivIcon : thickDotDivIcon}
            eventHandlers={{
              click: () => {
                setActiveMarker(activeMarker === data.iri ? null : data.iri);
              }
            }}
          >
            <Popup>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{data.name}</h3>
              <Link to={`/detail/${data.iri}`}
                className='btn btn-info btn-sm mt-2'
                style={{ display: 'block' }}>
                Lihat detail
              </Link>
            </Popup>
          </Marker>
        ))}

      </MapContainer>



    </Container>
  )
}

export default Map;