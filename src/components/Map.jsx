// https://www.youtube.com/watch?v=D4jq5Bd9bTA

import React, { useState, useEffect, useMemo } from 'react';
import MultiRangeSlider from "multi-range-slider-react";
import { Container } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Map = () => {
  const [datas, setDatas] = useState({});
  const [minYear, setMinYear] = useState(1600);
  const [maxYear, setMaxYear] = useState(2024);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchIRI, setSearchIRI] = useState("");
  const [activeMarker, setActiveMarker] = useState();
  const placeHolder = "Ketikkan nama peristiwa sejarah...";

  const handleClick = (val) => {
    setSearchTerm(val.label)
    setSuggestions([])
  };

  const handleChange = (trigger) => {
    setSearchTerm(trigger.target.value)
    setSuggestions(Object.values(datas)
      .flatMap((latitudeEvents) =>
        Object.values(latitudeEvents)
          .flatMap((events) =>
            events
              .filter((event) => event.name.toLowerCase().includes(trigger.target.value.toLowerCase()))
              .map((event) => ({ value: event.iri, label: event.name }))
          )
      ).sort((a, b) => a.label > b.label ? 1 : -1))
  }


  useEffect(() => {
    let url = '/api/map/';
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

  const filteredData = useMemo(() => {
    return Object.entries(datas).reduce((result, [latitude, latitudeEvents]) => {
      result[latitude] = Object.entries(latitudeEvents).reduce((eachResult, [longitude, events]) => {
        const filteredEvents = events.filter((event) => {
          const isYearInRange =
            (event.yearStart >= minYear && event.yearStart <= maxYear) ||
            (event.yearEnd >= minYear && event.yearEnd <= maxYear);

          const doesNameContainSearch = !searchTerm || event.name.toLowerCase().includes(searchTerm.toLowerCase());

          return isYearInRange && doesNameContainSearch;
        });

        if (filteredEvents.length > 0) {
          eachResult[longitude] = filteredEvents;
        }

        return eachResult;
      }, {});

      return result;
    }, {});
  }, [datas, minYear, maxYear, searchTerm]);

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
      <h1 className='mt-3' style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}> Peta Sejarah Indonesia </h1>

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
            max={2024}
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
        className='rounded my-2'
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
        {Object.entries(filteredData).map(([latitude, latitudeEvents]) => (
          Object.entries(latitudeEvents).map(([longitude, events]) => (
            <Marker
              key={`${latitude}+${longitude}`}
              position={[latitude, longitude]}
              icon={activeMarker === `${latitude}+${longitude}` ? activeThickDotDivIcon : thickDotDivIcon}
              eventHandlers={{
                click: () => {
                  setActiveMarker(activeMarker === `${latitude}+${longitude}` ? null : `${latitude}+${longitude}`)
                }
              }}
            >
              <Popup className='w-84'>
                <div className='max-h-60 overflow-y-auto'>
                  {events.map((event, index) => (<div key={`${latitude}+${longitude}+${index}`}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{event.name}</h3>
                    <Link to={`/detail/${event.iri}`}
                      className='btn btn-info btn-lg mt-2'
                      style={{ display: 'block' }}>
                      Lihat detail
                    </Link>
                    {index !== events.length - 1 && <><br /><hr /><br /></>}
                  </div>))
                  }
                </div>
              </Popup>
            </Marker>
          ))
        ))}


      </MapContainer>



    </Container>
  )
}

export default Map;