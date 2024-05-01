import React, { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css'
import './styles.css';
import {Link, useParams} from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import domain from "../domain"
const MapTimelineClick = () => {
    const {name} = useParams();
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimelineLocation = async () => {
            try {
                const response = await axios.get(domain+`/api/timeline/location/${name}/`);
                setDatas(response.data)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTimelineLocation();
    }, [name]);

    const thickDotDivIcon = divIcon({
        className: 'thick-dot-icon'
    })

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid>
            {datas.length !== 0 ? (
                <h1 className='mt-3' style={{ textAlign: "center" }}> {datas[0].label} </h1>
            ) : (
                <h1 className='mt-3' style={{ textAlign: "center" }}> {name} tidak ditemukan pada peta </h1>
            )}

            <MapContainer
                style={{ height: "80vh"}}
                zoom={5}
                center={[-2.548926, 118.0148634]}
                minZoom={3}
                className='rounded'
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {datas.length !==0 ? (
                    datas.map((data) => (
                            <Marker
                                position={[data.latitude, data.longitude]}
                                icon={thickDotDivIcon}
                            >
                                <Popup>
                                    <h3>{data.label}</h3>
                                    <Link to={`/detail/${data.name}`}
                                          className='btn btn-info'>
                                        Lihat detail
                                    </Link>
                                </Popup>
                            </Marker>
                        ))
                ) : (
                    toast.error(`${name} tidak ditemukan pada peta!`)
                )}
            </MapContainer>
        </Container>
    )
}

export default MapTimelineClick;


