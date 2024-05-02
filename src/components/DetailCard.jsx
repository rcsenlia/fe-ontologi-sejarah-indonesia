import React, { useEffect } from 'react';
import { Card } from "react-bootstrap";
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';
import L, { divIcon } from 'leaflet';
import './styles.css';

const ChangeMapView = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds]);

  return;
}

const DetailCard = (prop) => {
  const { iri, response } = prop;

  let imageUrl;
  if (response.image) {
    console.log(response)
    imageUrl = response.image.slice(0, 4) === 'http'
      ? response.image
      : `https://commons.wikimedia.org/wiki/Special:FilePath/${response.image}`;
  }

  const activeThickDotDivIcon = divIcon({
    className: 'active-thick-dot-icon',
    iconSize: [20, 20]
  })

  return <Card className="my-3" >
    <Card.Header as="h5" className='p-4' style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }} >Detail {response?.detail.name[1]}</Card.Header>
    <Card.Body className='detail-card-body flex flex-wrap sm:flex-nowrap sm:gap-4 sm:mp-4'>

      <div className='w-full sm:hidden py-4'>
        {imageUrl != null &&
          <img className='h-96 rounded mx-auto' src={imageUrl} alt={`Foto ${response?.detail.name}`} />
        }
        {response?.location != null &&
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
              data={response?.location}
              pointToLayer={(feature, latlng) => {
                return L.marker(latlng, {
                  icon: activeThickDotDivIcon
                })
              }}
            />
            <ChangeMapView bounds={response?.bounds} />
          </MapContainer>
        }
      </div>

      <div className='w-full sm:w-3/5 sm:grow'>
        {Object.entries(response?.detail).map(([key, value]) => (
          <div key={key} className='mb-3'>
            {Array.isArray(value) && value.length === 2 && Array.isArray(value[1]) ? (
              value[1].length > 1 ? (
                <div>
                  <strong>{value[0]}: </strong>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 list-disc list-inside">
                    {value[1].map((item, index) => (
                      <li key={`${key}-${index}`} className="text-primary">
                        <a href={`/app/detail/${item[0]}`}>{item[1]}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <strong>{value[0]}: </strong> <a className='text-primary' href={`/app/detail/${value[1][0][0]}`}>{value[1][0][1]}</a>
                </div>
              )
            ) : (
              Array.isArray(value) && value.length === 2 && value[1] != null ? (
                <div>
                  <strong>{value[0]}:</strong> {value[1]}
                </div>
              ) : (
                <div>
                  <strong>{value[0]}:</strong> Data tidak tersedia
                </div>
              )
            )}
          </div>
        ))}

        <Link to={`/canvas/${iri}`}
          className='btn mt-2 ml-2' style={{ background: "#1360E7", color: "#fff" }}>
          Lihat Canvas Graph {'>>>'}
        </Link>

      </div>
      <div className='hidden sm:w-2/5 sm:grow sm:block'>
        {imageUrl != null &&
          <img className='h-96 rounded mx-auto' src={imageUrl} alt={`Foto ${response?.detail.name}`} />
        }
        {response?.location != null &&
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
              data={response?.location}
              pointToLayer={(feature, latlng) => {
                return L.marker(latlng, {
                  icon: activeThickDotDivIcon
                })
              }}
            />

            <ChangeMapView bounds={response?.bounds} />
          </MapContainer>
        }
      </div>



    </Card.Body>
  </Card>
}

export default DetailCard;