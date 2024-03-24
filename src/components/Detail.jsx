import React, { useState, useEffect } from 'react';
import { Container, Card } from "react-bootstrap";
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';
import { useParams } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';

function ChangeMapView({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [bounds]);

    return null;
}

function Detail() {
    const { iri_peristiwa } = useParams();
    const [response, setResponse] = useState(null);

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
            .catch((error) => console.error(error));
    }, []);

    const maxBounds = [
        [-90, -180],
        [90, 180],
    ];

    return (
        <Container fluid>
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

            <div className='p-5 text-center'>
                <h1 style={{ textAlign: "center" }}>Detail {response?.detail.name[1]}</h1>
            </div>

            {response?.detail ? (
                <Card className="my-3">
                    <Card.Header as="h5">Detail Informasi</Card.Header>
                    <Card.Body>
                        {Object.entries(response?.detail).map(([key, value]) => {
                            if (Array.isArray(value) && value.length === 2 && Array.isArray(value[1])) {
                                return (
                                    <div key={key} className="mb-3">
                                        <strong>{value[0]}:</strong>
                                        {value[1].map((item, index) => (
                                            <>
                                                <Link key={index} to={`/detail/${item[0]}`} className="text-primary"> {item[1]}</Link>
                                                {index < value[1].length - 1 && <>, </>}
                                            </>
                                        ))}
                                    </div>
                                );
                            }
                            else if (Array.isArray(value) && value.length === 2 && value[1] != null) {
                                return (
                                    <div key={key} className="mb-3">
                                        <strong>{value[0]}:</strong> {value[1]}
                                    </div>
                                );
                            }
                            else {
                                return (
                                    <div key={key} className="mb-3">
                                        <strong>{key}:</strong> Data tidak tersedia
                                    </div>
                                );
                            }
                        })}
                    </Card.Body>
                </Card>
            ) : (
                <div>Loading details...</div>
            )}
        </Container>
    )
}

export default Detail;
