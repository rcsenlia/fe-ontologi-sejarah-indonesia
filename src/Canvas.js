
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
import { ButtonGroup, FormText, CloseButton,Alert,Stack,Offcanvas,Image,Spinner } from 'react-bootstrap';
import { scryRenderedComponentsWithType } from "react-dom/test-utils";

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
                    {Object.keys(dataNodes[node.id]['property'] ?? []).map((key)=><ListGroup.Item onClick={dataNodes[node.id]['property'][key]['status'] ? () => { add(node, key) } : () => { remove(node, key) }} action>{
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
              {node.detail}
            </Row>

              
            
          }
          
          
        </Offcanvas.Body>
      </Offcanvas>

      <Row >
        <Stack direction="horizontal">
        {load==true?<></>:<Alert key='primary' variant='primary'>
          Loading data! <Spinner size={'sm'} animation="border" role="status">
        </Spinner>
        </Alert>}
        
        
            
        
        
        
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
