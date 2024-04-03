import React, { useEffect } from 'react';
import { Card } from "react-bootstrap";
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';

const ChangeMapView = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds]);

  return null;
}

const DetailCard = (prop) => {
  const { response } = prop;

  const maxBounds = [
    [-90, -180],
    [90, 180],
  ];

  return <Card className="my-3">
    <Card.Header as="h5" className='p-4' style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }} >Detail {response?.detail.name[1]}</Card.Header>
    <Card.Body className='flex gap-4 p-4'>
      <div className='w-3/5 grow'>
        {Object.entries(response?.detail).map(([key, value]) => {
          if (Array.isArray(value) && value.length === 2 && Array.isArray(value[1])) {
            return (
              <div key={key} className="mb-3">
                <strong>{value[0]}:</strong>
                {value[1].map((item, index) => {
                  if (item[0]) {
                    return <span>
                      <Link key={key + index} to={`/detail/${item[0]}`} className="text-primary"> {item[1]}</Link>
                      {index < value[1].length - 1 && <span>, </span>}
                    </span>
                  }
                  return <span> Data tidak tersedia</span>
                }
                )}
              </div>
            )
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
                <strong>{value[0]}:</strong> Data tidak tersedia
              </div>
            );
          }
        })}
      </div>
      <div className='w-2/5 grow'>
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
      </div>



    </Card.Body>
  </Card>
}

export default DetailCard;