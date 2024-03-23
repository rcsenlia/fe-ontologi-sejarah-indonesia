// https://www.youtube.com/watch?v=D4jq5Bd9bTA

import React, { useState, useEffect } from 'react';
import MultiRangeSlider from "multi-range-slider-react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { MapContainer, GeoJSON, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import indonesia from '../data/indonesia.json';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';
import {Link, useParams} from 'react-router-dom';

const MapTimelineClick = () => {
    const {eventName} = useParams();

    const [selectedOption, setSelectedOption] = useState('geojson');
    const [datas, setDatas] = useState();
    const [minYear, setMinYear] = useState(1600);
    const [maxYear, setMaxYear] = useState(1966);

    useEffect(() => {
        let url = `http://127.0.0.1:8000/timeline/location/Negara%20Bagian%20Sumatra%20Selatan/`;
        fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data)
                setDatas(data)
            })
            .catch((error) => console.error(error))
    }, [datas]);

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


    const changeProvinceColor = (event) => {
        event.target.options.originalColor = event.target.options.fillColor;
        event.target.setStyle({
            fillColor: 'green'
        });
    }

    const resetProvinceColor = (event) => {
        event.target.setStyle({
            fillColor: event.target.options.originalColor
        });
    }

    const onEachProvince = (province, layer) => {
        const provinceName = province.properties.state;
        layer.bindPopup(provinceName);

        layer.on({
            mouseover: changeProvinceColor,
            mouseout: resetProvinceColor
        })
    }

    return (
        <Container fluid>
            <h1 className='mt-3' style={{ textAlign: "center" }}> Peta Sejarah Indonesia </h1>

            <Row className='my-3'>
                <Col md={{ span: 2, offset: 10 }}>
                    <Form>
                        <Form.Group controlId="form.select">
                            <Form.Select
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}
                            >
                                <option value="geojson">Berdasarkan Provinsi</option>
                                <option value="latlong">Berdasarkan Peristiwa</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>

            <MapContainer
                style={{ height: "80vh"}}
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
                {selectedOption === 'geojson' ? (
                    <GeoJSON
                        data={indonesia}
                        onEachFeature={onEachProvince}
                    />
                ) : (
                    filteredDatas.map((data, index) => (
                        <Marker
                            position={[data.latitude, data.longitude]}
                            icon={thickDotDivIcon}
                        >
                            <Popup>
                                <h3>{data.name}</h3>
                                <Link to={`/detail/${data.name}`}
                                      className='btn btn-info'>
                                    Lihat detail
                                </Link>
                            </Popup>
                        </Marker>
                    ))
                )}
            </MapContainer>

            <MultiRangeSlider
                min={1600}
                max={1966}
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

export default MapTimelineClick;