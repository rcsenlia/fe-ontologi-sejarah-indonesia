import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Button } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SearchBar from "./components/SearchBar";

const Layout = () => {
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchIRI, setSearchIRI] = useState("");
  const placeHolder = "Ketikkan nama peristiwa, tokoh, atau tempat sejarah...";

  const handleClick = (val) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate("/detail/" + val.value);
  };

  const handleChange = (trigger) => {
    setSearchTerm(trigger.target.value);
    setSearchIRI("")
    setSuggestions(Object.values(datas)
      .map(data => ({ value: data.iri, label: data.name }))
      .filter(data => data.value.toLowerCase().includes(trigger.target.value.toLowerCase()))
      .sort((a, b) => a.label > b.label ? 1 : -1));
  }

  const handleSearchClick = () => {
    if (!searchIRI) {
      navigate("/search/" + searchTerm)
      setSearchIRI("")
      setSuggestions([])
      return
    }

    navigate("/detail/" + searchIRI)
    setSearchTerm("")
    setSearchIRI("")
    setSuggestions([])
  }

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      if (suggestions.length === 0 && searchIRI) {
        navigate("/detail/" + searchIRI)
      } else if (suggestions.length === 0 && !searchIRI) {
        navigate("/search/" + searchTerm)
      }
    }
  }

  useEffect(() => {
    let url = 'http://127.0.0.1:8000/map/all';
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => { setDatas(data) })
      .catch((error) => console.error(error))
  }, [])

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="/">Sejarah Indonesia</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Timeline</Nav.Link>
              <Nav.Link href="/map/">Peta</Nav.Link>
            </Nav>
            {/*<div className="flex w-1/2 gap-4">*/}
            {/*  <div className="w-9/10 grow">*/}
            {/*    <SearchBar*/}
            {/*      searchTerm={searchTerm}*/}
            {/*      setSearchTerm={setSearchTerm}*/}
            {/*      searchIRI={searchIRI}*/}
            {/*      setSearchIRI={setSearchIRI}*/}
            {/*      suggestions={suggestions}*/}
            {/*      setSuggestions={setSuggestions}*/}
            {/*      handleChange={handleChange}*/}
            {/*      handleClick={handleClick}*/}
            {/*      handleEnter={handleEnter}*/}
            {/*      placeHolder={placeHolder} />*/}
            {/*  </div>*/}
            {/*  <Button variant="outline-success" className="w-1/10" onClick={handleSearchClick}>Search</Button>*/}
            {/*</div>*/}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  )
};

export default Layout;