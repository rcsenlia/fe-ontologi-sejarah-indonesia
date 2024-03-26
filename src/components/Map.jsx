// https://www.youtube.com/watch?v=D4jq5Bd9bTA

import React, { useState, useEffect } from 'react';
import MultiRangeSlider from "multi-range-slider-react";
import Container from "react-bootstrap/Container";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';
import { Link } from 'react-router-dom';

const Map = () => {
    const [datas, setDatas] = useState([]);
    const [minYear, setMinYear] = useState(1600);
    const [maxYear, setMaxYear] = useState(1998);

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

    const filterByYear = (data) => {
        return (data.yearStart >= minYear && data.yearStart <= maxYear) || (data.yearEnd >= minYear && data.yearEnd <= maxYear);
    }

    const filteredDatas = datas.filter(filterByYear);

    const thickDotDivIcon = divIcon({
        className: 'thick-dot-icon'
    })

    return (
        <Container fluid>
            <h1 className='mt-3' style={{ textAlign: "center" }}> Peta Sejarah Indonesia </h1>

            <MapContainer
                style={{ height: "80vh" }}
                zoom={5}
                center={[-2.548926, 118.0148634]}
                maxBounds={maxBounds}
                minZoom={3}
                className='rounded'
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredDatas.map((data, index) => (
                    <Marker
                        key={`${data.iri}_${data.latitude}_${data.longitude}`}
                        position={[data.latitude, data.longitude]}
                        icon={thickDotDivIcon}
                    >
                        <Popup>
                            <h3>{data.name}</h3>
                            <Link to={`/detail/${data.iri}`}
                                className='btn btn-info'>
                                Lihat detail
                            </Link>
                        </Popup>
                    </Marker>
                ))}

            </MapContainer>

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
                className='mt-4'
            />

        </Container>
    )
}

export default Map;