import React from 'react';
import { Card } from "react-bootstrap";
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';

const DetailCard = (prop) => {
  const { response } = prop;

  return <Card className="my-3">
    <Card.Header as="h5" style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }} >Detail {response?.detail.name[1]}</Card.Header>
    <Card.Body>
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
    </Card.Body>
  </Card>
}

export default DetailCard;