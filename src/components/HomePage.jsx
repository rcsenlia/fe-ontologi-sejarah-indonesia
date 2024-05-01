import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import LandingPage from "./LandingPage";
import { Card, Container } from "react-bootstrap";
import L, { divIcon } from 'leaflet';
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';
import { Link } from "react-router-dom";

const ChangeMapView = ({ bounds }) => {
    const map = useMap();
    useEffect(() => {
      if (bounds) {
        map.fitBounds(bounds);
      }
    }, [bounds]);
  
    return;
  }

const HomePage = () => {
    const [dataEvents, setDataEvents] = useState([]);
    const [dataActors, setDataActors] = useState([]);
    const [dataPlaces, setDataPlaces] = useState([]);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const activeThickDotDivIcon = divIcon({
        className: 'active-thick-dot-icon',
        iconSize: [20, 20]
      })

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const responseEvents = await axios.get('/api/timeline/homepage/event/');
                const responseActors = await axios.get('/api/timeline/homepage/actor/');
                const responsePlaces = await axios.get('/api/timeline/homepage/place/');

                if (responseEvents.data.length !== 0 || responseActors.data.length !== 0 || responsePlaces.data.length !== 0) {
                    setDataEvents(responseEvents.data)
                    setDataActors(responseActors.data)
                    setDataPlaces(responsePlaces.data)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTimeline();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768);
        };

        handleResize(); // Call it once to set the initial state

        window.addEventListener('resize', handleResize); // Listen for resize events

        // Cleanup function to remove the event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (isSmallScreen) {
        return (
            <div>
                <LandingPage></LandingPage>
                <Container fluid>
                    <div className='container mx-auto px-4'>
                        <Card className="mb-4">
                            <Card.Header>Peristiwa Sejarah</Card.Header>
                            <Card.Body>
                                {dataEvents.map((data, index) => {
                                    return (
                                        <div key={data + index} className='my-2 mx-25'>
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.name}</Card.Title>
                                                    <Card.Text>
                                                    </Card.Text>
                                                    <Link to={`/timeline/${data.name}/${data.typeLabel}`} className='btn mt-2' style={{background: "#11ba1f", color: "#fff"}}>
                                                        Lihat Timeline {'>>>'}
                                                    </Link>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    )
                                })}
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
                <Container fluid>
                    <div className='container mx-auto px-4'>
                        <Card className="mb-4">
                            <Card.Header>Tokoh Sejarah</Card.Header>
                            <Card.Body>
                                {dataActors.map((data, index) => {
                                    return (
                                        <div key={data + index} className='my-2 mx-25'>
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.name}</Card.Title>
                                                    <Card.Text>
                                                    </Card.Text>
                                                    <Link to={`/timeline/${data.name}/${data.typeLabel}`} className='btn mt-2' style={{background: "#11ba1f", color: "#fff"}}>
                                                        Lihat Timeline {'>>>'}
                                                    </Link>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    )
                                })}
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
                <Container fluid>
                    <div className='container mx-auto px-4'>
                        <Card className="mb-4">
                            <Card.Header>Tempat</Card.Header>
                            <Card.Body>
                                {dataPlaces.map((data, index) => {
                                    return (
                                        <div key={data + index} className='my-2 mx-25'>
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.name}</Card.Title>
                                                    <Card.Text>
                                                    </Card.Text>
                                                    <Link to={`/timeline/${data.name}/${data.typeLabel}`} className='btn mt-2' style={{background: "#11ba1f", color: "#fff"}}>
                                                        Lihat Timeline {'>>>'}
                                                    </Link>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    )
                                })}
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>
        );
    } else {
        return (
            <div>
                <LandingPage></LandingPage>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' }}>
                    <Container fluid>
                        <div className='container mx-auto px-4' style={{ height: '100%' }}>
                            <Card style={{ height: '100%', marginBottom: '1px' }}>
                                <Card.Header>Peristiwa Sejarah</Card.Header>
                                <Card.Body style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    {dataEvents.map((data, index) => (
                                        <div key={data + index} className='my-4 mx-25' style={{ flex: 1 }}>
                                            <Card style={{ height: '100%' }}>
                                                <Card.Body>
                                                    <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.name}</Card.Title>
                                                    <Card.Text style={{ textAlign: "justify" }}>
                                                        {data.summary}
                                                    </Card.Text>
                                                    <Link to={`/timeline/${data.name}/${data.typeLabel}`} className='btn mt-2' style={{background: "#11ba1f", color: "#fff"}}>
                                                        Lihat Timeline {'>>>'}
                                                    </Link>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </div>
                    </Container>
                    <Container fluid>
                        <div className='container mx-auto px-4' style={{ height: '100%' }}>
                            <Card style={{ height: '100%', marginBottom: '16px' }}>
                                <Card.Header>Tokoh Sejarah</Card.Header>
                                <Card.Body style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    {dataActors.map((data, index) => (
                                        <div key={data + index} className='my-4 mx-25' style={{ flex: 1 }}>
                                            <Card style={{ height: '100%' }}>
                                                <Card.Body>
                                                    <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.name}</Card.Title>
                                                    <Card.Text style={{ textAlign: "justify" }}>
                                                        {data.summary}
                                                    </Card.Text>
                                                    <Link to={`/timeline/${data.name}/${data.typeLabel}`} className='btn mt-2' style={{background: "#11ba1f", color: "#fff"}}>
                                                        Lihat Timeline {'>>>'}
                                                    </Link>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </div>
                    </Container>
                    <Container fluid>
                        <div className='container mx-auto px-4' style={{ height: '100%' }}>
                            <Card style={{ height: '100%', marginBottom: '16px' }}>
                                <Card.Header>Tempat</Card.Header>
                                <Card.Body style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    {dataPlaces.map((data, index) => (
                                        <div key={data + index} className='my-4 mx-25' style={{ flex: 1 }}>
                                            <Card style={{ height: '100%' }}>
                                                <Card.Body>
                                                    <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.name}</Card.Title>
                                                    <Card.Text style={{ textAlign: "justify" }}>
                                                        <div>
                                                            {data.summary}
                                                            {/* {console.log(data)} */}
                                                        </div>
                                                        <MapContainer
                                                            style={{ height: "40vh" }}
                                                            minZoom={3}
                                                            className='rounded my-3'
                                                        >
                                                            <TileLayer
                                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                            />
                                                            <GeoJSON
                                                                data={data.location}
                                                                pointToLayer={(feature, latlng) => {
                                                                    return L.marker(latlng, {
                                                                        icon: activeThickDotDivIcon
                                                                    })
                                                                }}
                                                            />
                                                            <ChangeMapView bounds={data.bounds} />
                                                        </MapContainer>
                                                    </Card.Text>
                                                    <Link to={`/timeline/${data.name}/${data.typeLabel}`} className='btn mt-2' style={{background: "#11ba1f", color: "#fff"}}>
                                                        Lihat Timeline {'>>>'}
                                                    </Link>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
};

export default HomePage;
