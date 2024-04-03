import React, { useState, useEffect } from 'react';
import { Container, Card } from "react-bootstrap";
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useParams, Link } from 'react-router-dom';

const Search = () => {
  const { search } = useParams();
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    let url = 'http://127.0.0.1:8000/map/search/' + search;
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => { setDatas(data) })
      .catch((error) => console.error(error))
  }, [search]);

  return (
    <Container fluid>
      <div className='my-4 w-1/2 mx-auto h-12'>
        {/* <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} suggestions={suggestions} handleChange={handleChange} handleClick={handleClick} placeHolder={placeHolder} /> */}
      </div>

      {datas.length === 0 && <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Hasil pencarian {search} tidak ditemukan </h1>}

      {datas.length > 1 && (<>

        <h1 className='mb-4' style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Hasil pencarian {search}: </h1>

        <div className='container mx-auto px-4'>

          {datas.map((data, index) => {
            return (
              <Card key={data + index} className='my-4 mx-20'>
                <Card.Body>
                  <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.name}</Card.Title>
                  <Link to={`/detail/${data.iri}`}
                    className='btn btn-info btn-sm mt-2'>
                    Lihat detail {'>>>'}
                  </Link>
                </Card.Body>
              </Card>)
          })}
        </div>
      </>
      )}
    </Container>
  )
}

export default Search;
