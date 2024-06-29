import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Card, Nav } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import DetailCard from './DetailCard';
import LandingPage from "./LandingPage";
import domain from "../domain"

const Detail = () => {
  const { iri } = useParams();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    let url = domain + '/api/map/detail/' + iri;
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data)
        setResponse(data)
      })
      .catch((error) => setResponse(null))
  }, [iri]);

  return (
    <div className='container mx-auto px-4'>
      <div>
        <LandingPage></LandingPage>
      </div>

      {!response?.detail &&
        <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Loading detail... </h1>}

      {response?.detail && response?.authorities?.length === 0 && !response?.detail?.name &&
        <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Data {iri} tidak tersedia </h1>}

      {(response?.detail?.name || response?.authorities) && (
        <Card className="my-3" >

          {response?.detail?.name && !response?.authorities && (
            <>
              <Card.Header as="h5" className='p-4' style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }} >Detail {response?.detail?.name[1]}</Card.Header>
              <DetailCard iri={iri} response={response} />
            </>
          )}

          {response?.authorities && (
            <>
              <Card.Header as="h5" className='p-4' style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }} >Detail {response[response.authorities[0]].detail.name[1]}</Card.Header>
              <Nav variant="tabs" defaultActiveKey={`#${response.authorities[0]}`}>
                {response.authorities.map((authority, index) => (
                  <Nav.Item key={index}>
                    <Nav.Link href={`#${authority}`}>Menurut {authority}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
              <DetailCard iri={iri} response={response[response.authorities[0]]} />
            </>
          )}

        </Card>
      )}
    </div>
  )
}

export default Detail;
