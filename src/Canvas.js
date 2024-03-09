import logo from './logo.svg';

import React, { Component } from 'react';
import { GraphCanvas,darkTheme } from 'reagraph';
import { useState } from "react";
import padri from './perang_padri.jpg';

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
  const dataNodes= {"Perang Padri":{"Pihak Satu":["Rajo Alam","Mayor Jenderal Conchius","Kolonel Stuers"],
                                    "Pihak Dua":['Tuanku Imam Bonjol','Tuanku Rao','Tuanku Nan Receh']
                                    },
                    "Rajo Alam":{"Pihak":"Kaum Adat"},
                    "Mayor Jenderal Conchius":{"Pihak":"Belanda"}
                  }

  const simpleNodes = [
    {
        id: 'Perang Padri',
        label: 'Perang Padri',
        icon:padri
      }
    ];
    
    const simpleEdges = [
      
    ];

    const cycle = [
      {
        id:'1',
        label:'1',
      },
      {
        id:'2',
        label:'2',
      },
      {
        id:'3',
        label:'3'
      }
    ]
    const cycleEdge = [
      {
        id:'e-1',
        source:'1',
        target:'2'
      },
      {
        id:'e-2',
        source:'2',
        target:'3'
      }
    ]

    const [nodes, setNodes] = useState(simpleNodes);
  const [edges, setEdges] = useState(simpleEdges);
  const [del,setDel] = useState(false)
  const[status,setStatus] = useState({"Perang Padri":true,
                                      "Rajo Alam":true,
                                      "Mayor Jenderal Conchius":true,
                                      "Kolonel Stuers":true,
                                      "Kaum Adat":true,
                                      "Belanda":true,
                                      "Tuanku Imam Bonjol":true,
                                      "Tuanku Rao":true,
                                      "Tuanku Nan Receh":true,
                                      "Pihak Satu":true,
                                      "Pihak Dua":true,
                                      "Pihak":true})
  // const [collapsed, setCollapsed] = useState<string[]>([]);
  console.log(Object.keys(dataNodes["Perang Padri"]).map((key)=>(<button>key</button>)))
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
                            {Object.keys(dataNodes[data.label]).map((key)=>(<button onClick = {status[key] ? () => {add(data,key)}:()=>{remove(data,key)}} key={key}>{status[key]?`${key} show`:`${key} hide`}</button>))}
                            
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
