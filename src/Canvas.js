import logo from './logo.svg';
import axios from "axios";
import React, { Component } from 'react';
import { GraphCanvas,darkTheme } from 'reagraph';
import { useState,useEffect } from "react";
import padri from './perang_padri.jpg';
import Daftar from './Daftar'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const baseURL = "http://localhost:8000/graph/"

function Canvas() {
  const navigate = useNavigate();
  const { nama_peristiwa } = useParams();
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

        setNodes([...nodes.filter(n=>!(dataNodes[source.label][key].includes(n.id))), ...dataNodes[source.label][key].map((val)=>(
          
          {id:val,
          label:val
          }))]);
        
          setEdges([...edges, ...dataNodes[source.label][key].map((val)=>({id:`${source.label}-${val}-${key}`,
                                                                          label:key,
                                                                          target:val,
                                                                          source:source.label}))
          ]);
        }
        else{
          setNodes([...nodes.filter(n=>!(dataNodes[source.label][key]===n.id)),{
            id:dataNodes[source.label][key],
            label:dataNodes[source.label][key]
          }])
          setEdges([...edges,{
            id:`${source.label}-${dataNodes[source.label][key]}-${key}`,
            label:key,
            target:dataNodes[source.label][key],
            source:source.label
          }])
        }
  }
  function remove(source,key){
    console.log("remove",status)
    let temp = status;
    temp[key] = true;
    setStatus(temp);
    
    console.log("Rajo Alam" in ['Rajo Alam'])
    console.log("halo",edges.filter(n=> !(n.id.split("-")[0] === source.label && n.id.split("-")[2]===key)))
    setEdges(edges.filter(n=> !(n.id.split("-")[0] === source.label && n.id.split("-")[2]===key)));
    
  }
  function hapus(node,props){
    console.log(node)
    setEdges(edges.filter(n=> !(n.target === node.id || n.source===node.id)));
    setNodes(nodes.filter(n=>n.id !== node.id))
  }
  function opsi(label){
    return dataNodes[label].keys().map((key)=>(<button>key</button>))
  }
  function getData(label){
    console.log(label)
    
        axios.get(baseURL+"uri/"+label).then((response) => 
        {
          dataNodes[label] = response.data
          Object.keys(response.data).map((key)=>{
            console.log(key)
            status[key] = true
            })
            console.log(status)
            console.log(dataNodes)
            setData(dataNodes);
            setStatus(status);
      })
      

  }
  
  function getInitialData(label){
    console.log(label)
    let temp = []
    axios.get(baseURL+"event").then((response)=>{
      setEvent(response.data)
      temp = response.data
      if (!temp.includes(label)) {
        label = "PerangPadri"
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
  useEffect(() => {
    getInitialData(nama_peristiwa)
    
  }, []);
  const handleChange = event => {
    console.log(event.target.value);
    navigate("/canvas/"+event.target.value)
    getInitialData(event.target.value)
  };
  return (
    <Container fluid>

      <Row>
        <Col>
            <Button variant="danger" onClick={() => {
                setDel(!del)  
            }} active>
                {del?"mode delete":"mode normal"}
            </Button>
        </Col>
        
        <Col>
          <Form>
          <Form.Select aria-label="Default select example"  onChange={handleChange}>
          <option value={nama_peristiwa}>{nama_peristiwa}</option>
            
            {event.map((key)=>(
              (key !== nama_peristiwa) ? <option value={key} >{key}</option> :<></>
             ))}
        </Form.Select>
          </Form>
            
        </Col>
      </Row>
      <Row>
        
      
        {/* <Col> */}
        <div  style={{ position: "fixed", width: '100%', height: '100%'}}>
        
        <GraphCanvas
                    theme={darkTheme}
                    labelType={'all'}
                    nodes={nodes}
                    edges={edges}
                    draggable={true}
                    contextMenu={({
                      data,
                      onClose
                    }) => <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={padri} />
                    
                    <Card.Body>
                      <Card.Title>{data.id}</Card.Title>
                      
                      <ListGroup variant="flush">
                      { Object.keys(dataNodes[data.label] ?? []).map((key)=>(<ListGroup.Item onClick = {status[key] ? () => {add(data,key)}:()=>{remove(data,key)}} action>{
                        status[key]?`${key} show`:`${key} hide`
                        }</ListGroup.Item>))}
                      </ListGroup>
                      <Button variant="primary" active>detail</Button>
                      <Button variant='danger' onClick={onClose} active>Close Menu</Button>
                    </Card.Body>
                  </Card>} 
                    onNodeDoubleClick={del?hapus:()=>{}}
                    />
                  
              </div>
            {/* </Col> */}
        
        </Row>
        <Row>
        </Row>
        </Container>
  );
  // const collapsed = ['1']
  // return (
      
  //          <GraphCanvas
  //                   collapsedNodeIds={collapsed}
  //                   labelType={'all'}
  //                   nodes={cycle}
  //                   edges={cycleEdge}
  //                   draggable={true}
  //                   contextMenu={({
  //                     data,
  //                     onClose
  //                   }) => <div style={{
  //                     background: 'white',
  //                     width: 150,
  //                     border: 'solid 1px blue',
  //                     borderRadius: 2,
  //                     padding: 5,
  //                     textAlign: 'center'
  //                   }}>
  //                           <h1>{data.label}</h1>
  //                           <img src={padri}></img>
  //                           {/* {Object.keys(dataNodes[data.label]).map((key)=>(<button onClick = {status[key] ? () => {add(data,key)}:()=>{remove(data,key)}} key={key}>{key}</button>))} */}
                            
  //                           <button onClick={onClose}>Close Menu</button>
  //                         </div>} 
  //                   />
  // )
}

export default Canvas;
