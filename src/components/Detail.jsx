import React, { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import { MapContainer, GeoJSON, TileLayer, useMap} from 'react-leaflet';
import { useParams } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';

function ChangeMapView({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            console.log(bounds);
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
        console.log(url)
        fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => setResponse(data))
        .catch((error) => console.error(error))
    }, []);

    const maxBounds = [
        [-90, -180],
        [90, 180],
    ];

    return (
        <Container fluid>
            {response?.geojson != null && 
            <MapContainer
                style={{ height: "40vh"}} 
                maxBounds={maxBounds}
                className='rounded'
            >
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJSON
                    data={response?.geojson}
                />
                <ChangeMapView bounds={response?.bounds} />
            </MapContainer>}

            <div className='p-5 text-center'>
                <h1 className="my-3" style={{ textAlign: "center" }}>Detail {response?.name}</h1>
            </div>

            {response?.detail != null &&
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Properties</th>
                        <th>Pihak 1</th>
                        <th>Pihak 2</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(response?.detail).map(([key, value], index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{key}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            }
            </Container>
    )
}

export default Detail;
