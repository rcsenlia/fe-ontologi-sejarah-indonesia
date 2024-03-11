import React from "react";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";

function Detail() {
  const { nama_peristiwa } = useParams();

  return (
    <Container fluid>
      <h1 className="py-3">Detail {nama_peristiwa}</h1>
    </Container>
  )
}

export default Detail;
