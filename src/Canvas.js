
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
import domain from "./domain"
import LandingPage from "./components/LandingPage";
const baseURL = domain+"/api/graph/"

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
        label: dataNodes[start]['property'][property]['teks'],
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
          <Offcanvas.Title style={{ fontSize:"30px"}}>{node.label}</Offcanvas.Title>
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
                <ListGroup variant="flush" style={{ overflowY: "auto",height:"350px"}}>
                  <ListGroup.Item style={{ fontSize:"25px"}}>Daftar hubungan :</ListGroup.Item>
                    {Object.keys(dataNodes[node.id]['property'] ?? []).map((key)=><ListGroup.Item style={{ fontSize:"20px"}}  onClick={dataNodes[node.id]['property'][key]['status'] ? () => { add(node, key) } : () => { remove(node, key) }} action>{
                      dataNodes[node.id]['property'][key]['status'] ? `${dataNodes[node.id]['property'][key]['teks']} (show)` : `${dataNodes[node.id]['property'][key]['teks']} (hide)`
                    }</ListGroup.Item>)}
                  
                 
                  </ListGroup>
                </Row>
                  <Row>
                    <ButtonGroup>
                  {(dataNodes[node.id]['type']==="Event" && dataNodes[node.id]['start-year'] === "") ? <></>:<Button style={{background: "#11ba1f", color: "#fff"}} href={dataNodes[node.id]['label'].split(" ")[0]==='wikipedia'?`/app/timeline/${dataNodes[node.id]['label'].slice(10,dataNodes[node.id]['label'].length)}/Event`:`/app/timeline/${dataNodes[node.id]['label']}/${dataNodes[node.id]['type']}`} active>timeline</Button>}
                  {dataNodes[node.id]['wikiurl'] == "" ? <></>:<Button style={{background: "#7D8ABC", color: "#fff"}} href={dataNodes[node.id]['wikiurl']}active>wikipedia</Button>}
                  <Button style={{background: "#e3a209", color: "#fff"}} href={dataNodes[node.id]['label'].split(" ")[0]==='wikipedia'?`/app/detail/${node.id.slice(9,node.id.length)}#Wikipedia`:`/app/detail/${node.id}`} active>detail</Button>
                  <Button variant='danger' onClick={hapus} active>hapus node</Button>
                  </ButtonGroup>
              </Row>
              </>
            :
            <Row>
              <p style={{ fontSize:"25px"}}>Penjelasan :</p>
              <br/>
              <p style={{ fontSize:"20px"}}>{node.detail}</p>
            </Row>

              
            
          }
          
          
        </Offcanvas.Body>
      </Offcanvas>

      <Row >
        
                {load==true?<></>:<Alert key='primary' variant='primary'>
          Loading data! <Spinner size={'sm'} animation="border" role="status">
        </Spinner>
        </Alert>}
                    <LandingPage></LandingPage>
                

      </Row>
      <Row>
        <div style={{ position: "fixed", width: '100%', height: '100%' }}>

          <GraphCanvas
            ref={ref}
            // theme={darkTheme}
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
