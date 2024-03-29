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
import MapTimelineClick from "./components/MapTimelineClick";
import {ToastContainer} from "react-toastify";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path='canvas/' element={<Canvas />} />
          <Route path='canvas/:nama_peristiwa' element={<Canvas />} />
          <Route path="detail/:iri_peristiwa" element={<Detail />} />
          <Route path="map" element={<Map />} />
          <Route path="map/:name" element={<MapTimelineClick />} />
          <Route path="timeline" element={<TimelineEvent />} />
          {/* <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
