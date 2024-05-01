import React from 'react';
import { Outlet } from "react-router-dom";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Layout = () => {
  return (
    <>
      <Navbar expand="lg" className="text-xl bg-gray-600">
        <Container fluid>
          <Navbar.Brand href="/app" className='text-3xl font-bold text-white'>Sejarah Indonesia</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto ">
              <Nav.Link href="/app" className='text-white hover:bg-gray-700 rounded-lg'>Timeline</Nav.Link>
              <Nav.Link href="/app/map/" className='text-white hover:bg-gray-700 rounded-lg'>Peta</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  )
};

export default Layout;