
import axios from "axios";
import React, { Component } from 'react';
import { GraphCanvas, darkTheme } from 'reagraph';
import { useState, useEffect, useRef } from "react";
import padri from './perang_padri.jpg';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useParams } from "react-router-dom";
import SearchBar from './components/SearchBar';
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { ButtonGroup, FormText, CloseButton,Alert,Stack,Offcanvas,Image,Spinner } from 'react-bootstrap';

const baseURL = "http://localhost:8000/graph/"

function Canvas() {
  const navigate = useNavigate();
  const { nama_peristiwa } = useParams();
  const ref = useRef(null);
  const [dataNodes, setData] = useState({})
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [del, setDel] = useState(false)
  const [status, setStatus] = useState({})
  const [datas, setDatas] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [iri, setIri] = useState({})
  const [root,setRoot] = useState(nama_peristiwa)
  const [pending,setPending] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [load,setLoad] = useState(false)
  const placeHolder = "Ketikkan nama peristiwa, tokoh, atau tempat sejarah...";
  const [show, setShow] = useState(false);
  const [node,setNode] = useState('')

  
  
  function add(source, key) {
    console.log("add", key,nodes)
    let temp = status;
    temp[key] = false;
    setStatus(temp);
    if (typeof (dataNodes[source.label][key]) === "object") {
      dataNodes[source.label][key].forEach(element => {
        getData(element)
      });
      setNodes(prevnodes=>([...prevnodes.filter(n => !(dataNodes[source.label][key].includes(n.id))), ...dataNodes[source.label][key].map((val) => (

        {
          id: val,
          label: val
        }))]));

      setEdges(prevedges=>([...prevedges, ...dataNodes[source.label][key].map((val) => ({
        id: `${source.label}|?${val}|?${key}`,
        label: key,
        target: val,
        source: source.label
      }))
      ]));
    }
    else {
      getData(dataNodes[source.label][key])
      setNodes(prevnodes=>([...prevnodes.filter(n => !(dataNodes[source.label][key] === n.id)), {
        id: dataNodes[source.label][key],
        label: dataNodes[source.label][key]
      }]))
      setEdges(prevedges=>([...prevedges, {
        id: `${source.label}|?${dataNodes[source.label][key]}|?${key}`,
        label: key,
        target: dataNodes[source.label][key],
        source: source.label
      }]))
    }
  }
  function remove(source, key) {
    console.log("remove", status)
    console.log("node", nodes)
    console.log("edges", edges)
    let temp = status;
    temp[key] = true;
    setStatus(temp);


    setEdges(edges.filter(n => !(n.id.split("|?")[0] === source.label && n.id.split("|?")[2] === key)));

  }
  function hapus(node, props) {

    setEdges(edges.filter(n => !(n.target === node.id || n.source === node.id)));
    setNodes(nodes.filter(n => n.id !== node.id))
  }
  
  function getData(label) {
    console.log("get data",label)

    axios.post(baseURL + "uri/", { 'label': label }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      dataNodes[label] = response.data
      Object.keys(response.data).map((key) => {
        status[key] = true
      })
      console.log(response.data)
      setData(dataNodes);
      setStatus(status);
      
    }).catch(function (error) {
      console.log(error)
    })
    

  }

  function getRootData(root) {
    console.log("root data"+root)

    axios.post(baseURL + "uri/", { 'label': root }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      dataNodes[root] = response.data
      Object.keys(response.data).map((key) => {
        status[key] = true
      })
      setData(dataNodes);
      setStatus(status);
      Object.keys(dataNodes[root]).map((key)=>{
        if(key !== 'image') add({'label':root},key)
      })
    setLoad(true)
    }).catch(function (error) {
      console.log(error)
    })
    

  }
  useEffect(() => {
    
    console.log("initial data")
    let url = 'http://127.0.0.1:8000/map/all';
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => { setDatas(data) 
                        
      })
      .catch((error) => console.error(error))

    axios.get(baseURL + "event").catch((error) => {
        console.log(error)
      }).then((response) => {
        setIri(response.data[1])
      })
      
  } , [])

  useEffect(() => {
    setLoad(false)
    console.log("root",root,nodes)
    
    if(iri[root] !== undefined){
      setNodes([{
        'id':iri[root],
        'label':iri[root]
      }])
      getRootData(iri[root])
      
    }
    
    },[root,iri])
  
  const handleClick = event => {
    setSearchTerm("");
    setSuggestions([]);
    navigate("/canvas/" + event)
    setRoot(event)
  };
  const handleChange= trigger => {
    setSearchTerm(trigger.target.value);
    setSuggestions(Object.values(datas)
      .map(data => ({ value: data.iri, label: data.name }))
      .filter(data => data.value.toLowerCase().includes(trigger.target.value.toLowerCase()))
      .sort((a, b) => a.label > b.label ? 1 : -1));
  }
  const handleClose = () => setShow(false);
  const handleShow = (node, props) => {
    setShow(true);
    setNode(node)
  }
  return (
    <Container fluid={true}>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{node.id}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
          <Image  variant="top" src={typeof dataNodes[node.label] === "undefined" ? padri : dataNodes[node.label]['image']} />
          </Row>
          <Row>
          <ListGroup variant="flush" style={{ overflowY: "auto", maxHeight:"300px"}}>
              {Object.keys(dataNodes[node.label] ?? []).map((key) => (key === "image" ? <></> : <ListGroup.Item onClick={status[key] ? () => { add(node, key) } : () => { remove(node, key) }} action>{
                status[key] ? `${key} (show)` : `${key} (hide)`
              }</ListGroup.Item>))}
            <ListGroup.Item>a</ListGroup.Item>
            <ListGroup.Item>a</ListGroup.Item>
            <ListGroup.Item>a</ListGroup.Item>
            <ListGroup.Item>a</ListGroup.Item>
            <ListGroup.Item>a</ListGroup.Item>
            <ListGroup.Item>a</ListGroup.Item>
            <ListGroup.Item>a</ListGroup.Item>
            </ListGroup>
          </Row>
            <Row>
            <Button variant="primary" href={`/detail/${iri[node.id]}`} active>detail</Button>
            </Row>
        </Offcanvas.Body>
      </Offcanvas>

      <Row >
        <Stack direction="horizontal">
        {load==true?<></>:<Alert key='primary' variant='primary'>
          Loading data! <Spinner size={'sm'} animation="border" role="status">
        </Spinner>
        </Alert>}
        
        
        <div className='my-4 w-1/2 mx-auto h-12'>
          <SearchBar searchTerm={searchTerm} suggestions={suggestions} handleChange={handleChange} handleClick={handleClick} placeHolder={placeHolder} />
        </div>        
        
        
        <ButtonGroup>
            <Button variant="danger" onClick={() => {
              setDel(!del)
            }} active>
              {del ? "cancel" : "hapus"}
            </Button>

          </ButtonGroup>
          </Stack>
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
            contextMenu={({
              data,
              onClose
            }) => <Card style={{ width: '18rem' }}>


                <Card.Img style={{ width: "300px", height: "200px" }} variant="top" src={typeof dataNodes[data.label] === "undefined" ? padri : dataNodes[data.label]['image']} />

                <Card.Body >
                  <Card.Title>{data.id}</Card.Title>

                  <ListGroup variant="flush" style={{ overflowY: "auto", height: "100px" }}>
                    {Object.keys(dataNodes[data.label] ?? []).map((key) => (key === "image" ? <></> : <ListGroup.Item onClick={status[key] ? () => { add(data, key) } : () => { remove(data, key) }} action>{
                      status[key] ? `${key} (show)` : `${key} (hide)`
                    }</ListGroup.Item>))}

                  </ListGroup>
                  <Button variant="primary" href={`/detail/${iri[data.id]}`} active>detail</Button>
                  <Button variant="danger" active onClick={onClose}>Tutup</Button>
                </Card.Body>
              </Card>}
            onNodeDoubleClick={del ? hapus : () => { }}
            onNodeClick={handleShow}

          />

        </div>


      </Row>
      <Row>
      </Row>
    </Container>
  );

}

export default Canvas;
