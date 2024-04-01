
import axios from "axios";
import React, { Component } from 'react';
import { GraphCanvas,darkTheme } from 'reagraph';
import { useState,useEffect,useRef } from "react";
import padri from './perang_padri.jpg';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { ButtonGroup, FormText,CloseButton } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
const baseURL = "http://localhost:8000/graph/"

const popover =(suggestion,handleChange)=> (
  <Popover id="popover-basic">
    
    <Popover.Body>
    <ListGroup style={{overflowY:"auto",maxHeight:"150px"}}>
      
      {suggestion.map((key)=>(
               <ListGroup.Item action value={key} onClick={handleChange} >{key}</ListGroup.Item> 
             ))}
    </ListGroup>
    </Popover.Body>
  </Popover>
);

function Canvas() {
  const navigate = useNavigate();
  const { nama_peristiwa } = useParams();
  const ref = useRef(null);
  function random(min, max) {
    // 👇️ get number between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function add(source,key){
    console.log("add",status)
    let temp = status;
    temp[key] = false;
    setStatus(temp);
    console.log(typeof(dataNodes[source.label][key]))
    if (typeof(dataNodes[source.label][key]) === "object"){
        dataNodes[source.label][key].forEach(element => {
          getData(element)
        });
        setNodes([...nodes.filter(n=>!(dataNodes[source.label][key].includes(n.id))), ...dataNodes[source.label][key].map((val)=>(
          
          {id:val,
          label:val
          }))]);
        
          setEdges([...edges, ...dataNodes[source.label][key].map((val)=>({id:`${source.label}|?${val}|?${key}`,
                                                                          label:key,
                                                                          target:val,
                                                                          source:source.label}))
          ]);
        }
        else{
          getData(dataNodes[source.label][key])
          setNodes([...nodes.filter(n=>!(dataNodes[source.label][key]===n.id)),{
            id:dataNodes[source.label][key],
            label:dataNodes[source.label][key]
          }])
          setEdges([...edges,{
            id:`${source.label}|?${dataNodes[source.label][key]}|?${key}`,
            label:key,
            target:dataNodes[source.label][key],
            source:source.label
          }])
        }
  }
  function remove(source,key){
    console.log("remove",status)
    console.log("node",nodes)
    console.log("edges",edges)
    let temp = status;
    temp[key] = true;
    setStatus(temp);
    
    
    setEdges(edges.filter(n=> !(n.id.split("|?")[0] === source.label && n.id.split("|?")[2]===key)));
    
  }
  function hapus(node,props){
    
    setEdges(edges.filter(n=> !(n.target === node.id || n.source===node.id)));
    setNodes(nodes.filter(n=>n.id !== node.id))
  }
  function opsi(label){
    return dataNodes[label].keys().map((key)=>(<button>key</button>))
  }
  function getData(label){
    console.log(label)
    
        axios.post(baseURL+"uri/",{'label':label},{
          headers: {
            'Content-Type': 'application/json'
          }}).then((response) => 
        {
          dataNodes[label] = response.data
          Object.keys(response.data).map((key)=>{
            console.log(key,dataNodes[label][key])
            status[key] = true
            })
            console.log(status)
            console.log(dataNodes)
            setData(dataNodes);
            setStatus(status);
      }).catch(function (error){
        console.log(error)
      })
      

  }
  
  function getInitialData(label){
    console.log(label)
    let temp = []
    let temp2 = {}
    axios.get(baseURL+"event").catch(function (error){
      console.log(error)
    }).then((response)=>{
      setEvent(response.data[0])
      setIri(response.data[1])
      temp = response.data[0]
      temp2 = response.data[1]
      label = temp2[label]
      if (!temp.includes(label)) {
        label = temp2[temp[0]]
        navigate("/canvas/"+label)
      }
      getData(label)
      setNodes( [
        {
          id: label,
          label: label
        }
      ])
    
    
  })
      
    }
  
  function tes(){
    console.log("tes")
  }
  
    
    const [dataNodes,setData] = useState({})
    const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [del,setDel] = useState(false)
  const[status,setStatus] = useState({})
  const[event,setEvent] = useState([])
  const [suggestion,setSuggestion] = useState([])
  const[iri,setIri] = useState({})
  const[label,setLabel] = useState({})
  useEffect(() => {
    getInitialData(nama_peristiwa)
    
  }, []);
  const handleChange = event => {
    console.log(iri[event.target.value]);
    navigate("/canvas/"+iri[event.target.value])
    getInitialData(iri[event.target.value])
  };
  const handleSearch = trigger => {
    console.log(trigger.target.value)
    console.log(event.filter((element)=>element.toLowerCase().startsWith(trigger.target.value)))
    setSuggestion(event.filter((element)=>element.toLowerCase().startsWith(trigger.target.value)).sort())
  }
  const getImage = label => {
    if(typeof dataNodes.label === "undefined" )
      return "default.png"
    return dataNodes[label]['image']
  }
  return (
    <Container fluid>

      <Row>
        <Col>
        <ButtonGroup>
        <Button variant="danger" onClick={() => {
                setDel(!del)  
            }} active>
                {del?"cancel":"hapus"}
            </Button>
        {/* <Button active variant="dark"onClick={() => ref.current?.panDown()}>Pan Down</Button>
        <Button active variant="dark"onClick={() => ref.current?.panUp()}>Pan Up</Button>
        <Button active variant="dark"onClick={() => ref.current?.panLeft()}>Pan Left</Button>
        <Button active variant="dark"onClick={() => ref.current?.panRight()}>Pan Right</Button> */}
        
        </ButtonGroup>
        
        </Col>
        
        <Col>
        <Form fluid="true">
          
        <OverlayTrigger trigger="focus" delay="500" placement="bottom-start" overlay={popover(suggestion,handleChange)}>
          <Form.Control type="text" placeholder="cari nama" onChange={handleSearch} />
        </OverlayTrigger>
          </Form>  
        </Col>
      </Row>
      <Row>
        
      
        
        <div  style={{ position: "fixed", width: '100%', height: '100%'}}>
        
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
                      
                      
                    <Card.Img style={{width :"300px",height:"200px"}} variant="top" src={typeof dataNodes[data.label] ==="undefined" ? padri:dataNodes[data.label]['image']} />
                    
                    <Card.Body >
                      <Card.Title>{data.id}</Card.Title>
                      
                      <ListGroup variant="flush" style={{overflowY:"auto",height:"100px"}}>
                      { Object.keys(dataNodes[data.label] ?? []).map((key)=>(key === "image"?<></>:<ListGroup.Item onClick = {status[key] ? () => {add(data,key)}:()=>{remove(data,key)}} action>{
                        status[key]?`${key} (show)`:`${key} (hide)`
                        }</ListGroup.Item>))}
                        
                      </ListGroup>
                      <Button variant="primary" href={`/detail/${iri[data.id]}`} active>detail</Button>
                      <Button variant="danger" active onClick={onClose}>Tutup</Button>
                    </Card.Body>
                  </Card>} 
                    onNodeDoubleClick={del?hapus:()=>{}}
                    
                    />
                  
              </div>
            
        
        </Row>
        <Row>
        </Row>
        </Container>
  );
  
}

export default Canvas;
