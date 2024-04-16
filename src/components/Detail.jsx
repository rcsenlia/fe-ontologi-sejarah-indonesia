import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate, useParams } from 'react-router-dom';
import DetailCard from './DetailCard';
import { toast } from 'react-toastify';
import SearchBar from "./SearchBar";
import Select from "react-select";
import axios from 'axios';

const Detail = () => {
  const navigate = useNavigate();
  const { iri_peristiwa } = useParams();
  const [datas, setDatas] = useState([]);
  const [response, setResponse] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const placeHolder = "Ketikkan nama peristiwa, tokoh, atau tempat sejarah...";

  const [roleTerm, setRoleTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedRole, setAppliedRole] = useState({});
  const [searchIRI, setSearchIRI] = useState("");

  const role = [
    { value: 'Event', label: 'Peristiwa' },
    { value: 'Actor', label: 'Tokoh' },
    { value: 'Place', label: 'Tempat' }
  ];

  const handleClick = (val) => {
    setSearchTerm(val.label)
    setSuggestions([])
  };

  const handleChange = (trigger) => {
    setSearchTerm(trigger.target.value)
    setSearchIRI("")
    setSuggestions(Object.values(datas)
      .map(data => ({ value: data.iri, label: data.name, type: data.type }))
      .filter(data => data.label.toLowerCase().includes(trigger.target.value.toLowerCase()))
      .sort((a, b) => a.label > b.label ? 1 : -1));
  }

  const handleFilter = () => {
    if (searchTerm === '' || roleTerm === '') {
      toast.error(`Masukkan nama dan tipe pencarian terlebih dahulu`, {
        autoClose: 2000
      })
    }
    else {
      setAppliedSearch(searchTerm);
      setAppliedRole(roleTerm);
    }
  };

  useEffect(() => {
    let url = 'http://127.0.0.1:8000/map/detail/' + iri_peristiwa;
    // console.log(url)
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => { setResponse(data) })
      .catch((error) => console.error(error))
  }, [iri_peristiwa]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseEvent = await axios.get('http://127.0.0.1:8000/map/all');
        if (responseEvent.data.length !== 0) {
          setDatas(responseEvent.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterData = (dt) => {
      const isDataWithTypeAvailable = dt.type.slice(-5) === appliedRole.value;
      const doesNameContainSearch = dt.name.toLowerCase().includes(appliedSearch.toLowerCase());
      return isDataWithTypeAvailable && doesNameContainSearch
    }

    const filteredDatas = [];
    for (const data of datas) {
      if (filterData(data)) {
        filteredDatas.push(data);
        break;
      }
    }
    if (filteredDatas.length !== 0) {
      setSuggestions([])
      navigate(`/timeline/${appliedSearch}/${appliedRole.value}`)
    }
    else if (searchTerm !== '') {
      toast.warn(`${appliedSearch} dengan tipe ${appliedRole.label} tidak ditemukan`, {
        autoClose: 2000
      })
    }
  }, [appliedSearch, appliedRole, datas])

  return (
    <div className='container mx-auto px-4'>
      <div>
        <div className="mt-3 mb-3 p-4" style={{ maxWidth: '70vw', margin: 'auto auto', padding: '12px', zIndex: 922999 }}>
          <div className="flex my-3 gap-4">
            <div className='w-3/4 grow'>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchIRI={searchIRI}
                setSearchIRI={setSearchIRI}
                suggestions={suggestions}
                setSuggestions={setSuggestions}
                handleChange={handleChange}
                handleClick={handleClick}
                handleEnter={() => { }}
                placeHolder={placeHolder} />
            </div>
            <div className='w-1/4 grow'>
              <div style={{ display: 'flex', justifyContent: 'left' }}>
                <Select
                  placeholder="Pilih Tipe..."
                  className="basic-single"
                  classNamePrefix="select"
                  name="role"
                  options={role}
                  onChange={setRoleTerm}
                  styles={{ menuPortal: zzz => ({ ...zzz, position: "relative", zIndex: 9999 }) }}
                />

                <button
                  style={{ marginLeft: '10px', padding: '7px', background: '#1360E7', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
                  onClick={handleFilter}
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!response?.detail &&
        <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Loading detail... </h1>}

      {response?.detail && !response?.detail?.name &&
        <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Data {iri_peristiwa} tidak tersedia </h1>}

      {response?.detail?.name && (<DetailCard response={response} />)}
    </div>
  )
}

export default Detail;
