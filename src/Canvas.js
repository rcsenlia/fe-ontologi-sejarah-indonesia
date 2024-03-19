import logo from './logo.svg';
import axios from "axios";
import React, { Component } from 'react';
import { GraphCanvas,darkTheme } from 'reagraph';
import { useState,useEffect } from "react";
import padri from './perang_padri.jpg';
import Daftar from './Daftar'
const baseURL = "http://localhost:8000/graph/uri/"

function Canvas() {
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
    
        axios.get(baseURL+label).then((response) => 
        {
          dataNodes[label] = response.data
          Object.keys(response.data).map((key)=>{
            console.log(key)
            status[key] = true
            })
            console.log(status)
            console.log(dataNodes)
      })
      setData(dataNodes);
      setStatus(status);

  }
  
  
  const simpleNodes = [
    {
        id: 'PerangPadri',
        label: 'PerangPadri',
        icon:padri
      }
    ];
    
    const simpleEdges = [
      
    ];
    
    const [dataNodes,setData] = useState({})
    const [nodes, setNodes] = useState(simpleNodes);
  const [edges, setEdges] = useState(simpleEdges);
  const [del,setDel] = useState(false)
  const[status,setStatus] = useState({})
  // getData("PerangPadri")
  return (
    <>
      
      <div class="flex flex-row bg-black">
            <button class="bg-cyan-300 flex" onClick={() => {
                setDel(!del)  
            }}>
                {del?"mode delete":"mode normal"}
            </button>
      </div>
      <div class='flex flex-col bg-red-300 max-w-16'>
        <p>tes</p>
      <div  style={{ position: "fixed", width: '100%', height: '75%'}}>
        <GraphCanvas
                    // theme={darkTheme}
                    labelType={'all'}
                    nodes={nodes}
                    edges={edges}
                    draggable={true}
                    onNodeContextMenu={(data,props)=>{
                      getData(data.id)
                      
                    }}
                    contextMenu={({
                      data,
                      onClose
                    }) => <div style={{
                      background: 'white',
                      width: 150,
                      border: 'solid 1px blue',
                      borderRadius: 2,
                      padding: 5,
                      textAlign: 'center'
                    }}>
                            <h1>{data.label}</h1>
                            <img src={padri}></img>
                            { Object.keys(dataNodes[data.label] ?? []).map((key)=>(<button onClick = {status[key] ? () => {add(data,key)}:()=>{remove(data,key)}} key={key}>{status[key]?`${key} show`:`${key} hide`}</button>))}
                            {/* <Daftar label={data.label}
                                    add={add}
                                    remove={remove}
                                    status={status}
                                    data={data}/>                            */}
                            <button onClick={onClose}>Close Menu</button>
                          </div>} 
                    onNodeDoubleClick={del?hapus:()=>{}}
                    />
        </div>
        </div>
        <div class ="flex bg-cyan-300">
          <p>halo</p>
        </div>
    </>
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
