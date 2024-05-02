import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useParams } from 'react-router-dom';
import DetailCard from './DetailCard';
import LandingPage from "./LandingPage";
import domain from "../domain"

const Detail = () => {
  const { iri } = useParams();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    let url = domain+'/api/map/detail/' + iri;
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => { setResponse(data) })
      .catch((error) => console.error(error))
  }, [iri]);

  return (
    <div className='container mx-auto px-4'>
      <div>
        <LandingPage></LandingPage>
      </div>

      {!response?.detail &&
        <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Loading detail... </h1>}

      {response?.detail && !response?.detail?.name &&
        <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Data {iri} tidak tersedia </h1>}

      {response?.detail?.name && (<DetailCard iri={iri} response={response} />)}
    </div>
  )
}

export default Detail;
