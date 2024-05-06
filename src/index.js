import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Canvas from './Canvas';
import Layout from './Layout';
import Detail from './components/Detail';
import Map from './components/Map'
import reportWebVitals from './reportWebVitals';
import './style.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TimelineEvent from "./components/Timeline";
import Search from './components/Search';
import { ToastContainer } from "react-toastify";
import ListEvents from "./components/ListEvents";
import HomePage from "./components/HomePage";
import NavbarTimeline from "./components/NavbarTimeline";
export default function App() {
  return (
    <BrowserRouter basename="/app">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path='canvas/' element={<Canvas />} />
          <Route path='canvas/:nama_peristiwa' element={<Canvas />} />
          <Route path="detail/:iri" element={<Detail />} />
          <Route path="map" element={<Map />} />
          <Route path="events" element={<NavbarTimeline />} />
          <Route path="" element={<HomePage />} />
          <Route path='search/:search' element={<Search />} />
           <Route path="events/:iriSent/:iriLabel" element={<ListEvents />} />
          <Route path="timeline/:searchSent/:roleSent" element={<TimelineEvent />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
