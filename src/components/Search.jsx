import React, { useState, useEffect } from 'react';
import { Container, Card, Pagination } from "react-bootstrap";
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useParams, Link } from 'react-router-dom';

const Search = () => {
  const { search } = useParams();
  const [page, setPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [datas, setDatas] = useState([]);
  const [paginations, setPaginations] = useState([]);
  const maxDataPerPage = 10;

  useEffect(() => {
    let url = 'http://127.0.0.1:8000/map/search/' + search + '/' + (page * maxDataPerPage);
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => { setDatas(handleRole(data)) })
      .catch((error) => console.error(error))
  }, [search, page]);

  useEffect(() => {
    let url = 'http://127.0.0.1:8000/map/search/' + search + '/total';
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => { setTotalData(data['total']) })
      .catch((error) => console.error(error))
  }, [search]);

  useEffect(() => {
    let items = []
    let minPage = 1;
    let maxPage = Math.ceil(totalData / maxDataPerPage);

    const changePage = (number) => {
      setPage(number - 1);
    }

    if (maxPage <= 7) {
      for (let number = 1; number <= maxPage; number++) {
        items.push(
          <Pagination.Item key={number} active={number === page + 1} onClick={() => changePage(number)}>
            {number}
          </Pagination.Item>,
        );
      }
      setPaginations(items);
      return;
    }


    items.push(<Pagination.Item key={minPage} active={minPage === page + 1} onClick={() => changePage(minPage)}>{minPage}</Pagination.Item>)

    if ((minPage <= page + 1) && (page + 1 <= minPage + 3)) {
      for (let number = 2; number <= 5; number++) {
        items.push(
          <Pagination.Item key={number} active={number === page + 1} onClick={() => changePage(number)}>
            {number}
          </Pagination.Item>,
        );
      }

      items.push(<Pagination.Ellipsis key={'ellipsis'} />)
    }

    else if ((maxPage - 3 <= page + 1) && (page + 1 <= maxPage)) {
      items.push(<Pagination.Ellipsis key={'ellipsis'} />)

      for (let number = maxPage - 4; number <= maxPage - 1; number++) {
        items.push(
          <Pagination.Item key={number} active={number === page + 1} onClick={() => changePage(number)}>
            {number}
          </Pagination.Item>,
        );
      }
    }

    else if ((page + 1 > minPage + 1) || (page + 1 < maxPage - 1)) {
      items.push(<Pagination.Ellipsis key={'ellipsis1'} />)
      items.push(<Pagination.Item key={page} onClick={() => changePage(page)}>{page}</Pagination.Item>)
      items.push(<Pagination.Item key={page + 1} active>{page + 1}</Pagination.Item>)
      items.push(<Pagination.Item key={page + 2} onClick={() => changePage(page + 2)}>{page + 2}</Pagination.Item>)
      items.push(<Pagination.Ellipsis key={'ellipsis2'} />)
    }

    items.push(<Pagination.Item key={maxPage} active={maxPage === page + 1} onClick={() => changePage(maxPage)}>{maxPage}</Pagination.Item>)

    setPaginations(items);
  }, [totalData, page])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const handleRole = (listData) => {
    for (const i in listData) {
      if (listData[i].type.slice(-5) === 'Event') {
        listData[i].typeLabel = 'Event'
      }
      else if (listData[i].type.slice(-5) === 'Actor') {
        listData[i].typeLabel = 'Actor'
      }
      else if (listData[i].type.slice(-7) === 'Feature') {
        listData[i].typeLabel = 'Place'
      }
    }

    return listData
  }

  return (
    <Container fluid>
      <div className='my-4 w-1/2 mx-auto h-12'>
        {/* <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} suggestions={suggestions} handleChange={handleChange} handleClick={handleClick} placeHolder={placeHolder} /> */}
      </div>

      {datas.length === 0 && <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Hasil pencarian {search} tidak ditemukan </h1>}

      {datas.length > 0 && (<>

        <h1 className='mb-4' style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Hasil pencarian {search} </h1>

        <div className='container mx-auto px-4'>

          {datas.map((data, index) => {
            return (
              <Card key={data + index} className='my-4 mx-20'>
                <Card.Body>
                  <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.name}</Card.Title>
                  <Card.Text>
                    {data.summary}
                  </Card.Text>
                  <Link to={`/timeline/${data.name}/${data.typeLabel}`}
                    className='btn btn-info btn-sm mt-2'>
                    Lihat Timeline {'>>>'}
                  </Link>
                </Card.Body>
              </Card>)
          })}
        </div>
      </>
      )}

      {paginations && paginations.length > 0 && (
        <Pagination className='my-4 flex justify-center font-bold text-xl'>
          {paginations}
        </Pagination>
      )}
    </Container>
  )
}

export default Search;
