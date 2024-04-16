
import axios from "axios";
import React, { Component } from 'react';
import { GraphCanvas, darkTheme } from 'reagraph';
import { useState, useEffect, useRef } from "react";
import padri from './perang_padri.jpg';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import { useParams } from "react-router-dom";
import SearchBar from './components/SearchBar';
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { ButtonGroup, FormText, CloseButton,Alert,Stack,Offcanvas,Image,Spinner, ListGroupItem } from 'react-bootstrap';
import { scryRenderedComponentsWithType } from "react-dom/test-utils";
import Select from "react-select";
import { toast } from 'react-toastify';

const baseURL = "http://localhost:8000/graph/"

function Canvas() {
  
  const { nama_peristiwa } = useParams();
  const ref = useRef(null);
  const [dataNodes, setData] = useState({})
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [type,setType] = useState("")
  
  const [load,setLoad] = useState(false)
  
  const [show, setShow] = useState(false);
  const [node,setNode] = useState('')


  
  
  function add(source, key) {
    console.log("add", key, source.id)
    const start = source.id
    const property = key

    dataNodes[start]['property'][property]['value'].forEach(element => {
      getData(element.iri)
      dataNodes[start]['property'][property]['status'] = false
    })
    setNodes(prevnodes=>([...prevnodes.filter(n => !(dataNodes[start]['property'][property]['value'].map((data)=>data.iri).includes(n.id))), ...dataNodes[start]['property'][property]['value'].map((val) => (

      {
        id: val.iri,
        label: val.label
      }))]));
    setEdges(prevedges=>([...prevedges, ...dataNodes[start]['property'][property]['value'].map((val) => ({
        id: `${start}|?${val.iri}|?${key}`,
        label: property,
        target: val.iri,
        source: start,
        detail:val.detail
      }))
      ]));
    setData(dataNodes)
    
  }
  function remove(source, key) {
    console.log("remove", source,key)
    setEdges(edges.filter(n => !(n.id.split("|?")[0] === source.id && n.id.split("|?")[2] === key)));
    dataNodes[source.id]['property'][key]['value'].forEach(element => {
      dataNodes[source.id]['property'][key]['status'] = true
    })
    setData(dataNodes)
  }
  function hapus() {
    console.log(node)
    setShow(false)
    setEdges(edges.filter(n => !(n.target === node.id || n.source === node.id)));
    setNodes(nodes.filter(n => n.id !== node.id))
  }
  
  function getData(iri) {
    console.log("get data",iri)
    if(Object.keys(dataNodes).includes(iri)){
      return
    }
    axios.post(baseURL + "uri/", { 'iri': iri }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      dataNodes[iri] = response.data
      console.log(response.data)
      setData(dataNodes);
      
    }).catch(function (error) {
      console.log(error)
    })
    

  }

  useEffect(() => {
    //get edges dan target node dari nama peristiwa
    axios.post(baseURL + "uri/", { 'iri': nama_peristiwa }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      dataNodes[nama_peristiwa] = response.data
      setData(dataNodes);
      setNodes([{
        'id':nama_peristiwa,
        'label':dataNodes[nama_peristiwa]['label']
      }])
      Object.keys(dataNodes[nama_peristiwa]['property']).map((key)=>{
        add({'id':nama_peristiwa},key)
      })
    setLoad(true)
    }).catch(function (error) {
      console.log(error)
    })

  },[])
  
  const handleClose = () => setShow(false);
  const handleShow = (node, type) => {
    setShow(true);
    setNode(node);
    setType(type)
  }
//search
const [suggestions, setSuggestions] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const placeHolder = "Ketikkan nama peristiwa, tokoh, atau tempat sejarah...";
const [datas, setDatas] = useState([]);
const [roleTerm, setRoleTerm] = useState('');
const [appliedSearch, setAppliedSearch] = useState('');
const [appliedRole, setAppliedRole] = useState({});
const [searchIRI, setSearchIRI] = useState("");
const navigate = useNavigate();
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
    <Container fluid={true}>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{node.label}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {type === 'node' ?
            dataNodes[node.id] == null ?
              <Row>
                data sedang diproses
              </Row>
              :<>
              <Row>
                <Image  variant="top" src={dataNodes[node.id]['image']} />
                </Row>
                
                <Row>
                <ListGroup variant="flush" style={{ overflowY: "auto", maxHeight:"300px"}}>
                  <ListGroupItem>Nama Property :</ListGroupItem>
                    {Object.keys(dataNodes[node.id]['property'] ?? []).map((key)=><ListGroup.Item  onClick={dataNodes[node.id]['property'][key]['status'] ? () => { add(node, key) } : () => { remove(node, key) }} action>{
                      dataNodes[node.id]['property'][key]['status'] ? `${key} (show)` : `${key} (hide)`
                    }</ListGroup.Item>)}
                  </ListGroup>
                </Row>
                  <Row>
                    <ButtonGroup>
                  <Button variant="primary" href={`/detail/${node.id}`} active>detail</Button>
                  <Button variant='danger' onClick={hapus} active>hapus</Button>
                  </ButtonGroup>
              </Row>
              </>
            :
            <Row>
              Detail Property :
              <br/>
              {node.detail}
            </Row>

              
            
          }
          
          
        </Offcanvas.Body>
      </Offcanvas>

      <Row >
      
      <div>
        <div className="mt-3 mb-3 p-4" style={{ maxWidth: '70vw', margin: 'auto auto', padding: '12px', zIndex: 922999 }}>
          <div className="flex my-3 gap-4">
          {load==true?<></>:<Alert key='primary' variant='primary'>
          Loading data! <Spinner size={'sm'} animation="border" role="status">
        </Spinner>
        </Alert>}
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
      </Row>
      <Row>
        <div style={{ position: "fixed", width: '100%', height: '100%' }}>

          <GraphCanvas
            ref={ref}
            theme={darkTheme}
            labelType={'all'}
            nodes={nodes}
            edges={edges}
            draggable={true}
            onNodeClick={(node,prop)=>handleShow(node,'node')}
            onEdgeClick={(node,prop)=>handleShow(node,'edge')}
          />

        </div>


      </Row>
      <Row>
      </Row>
    </Container>
  );

}

export default Canvas;
