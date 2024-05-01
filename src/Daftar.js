import { Component } from "react";
import { useEffect,useState } from 'react';
import axios from "axios";
import domain from "./domain"
const baseURL = domain+"/api/graph/uri/"

function Daftar({label,add,remove,status,data}){
    const [list,setList] = useState([])
    useEffect(()=>{
        console.log("halo",label)
        axios.get(baseURL+label).then((response) => 
        {
          
          Object.keys(response.data).map((key)=>{
            console.log(key)
            list.push(key)
            })
            setList(list)
            console.log("halo",list)
      })
    },)
    return list.map((key)=>
    (<button onClick = {status[key] ? () => {
        add(data,key)}:()=>{
            remove(data,key)}
        } key={key}>{status[key]?`${key} show`:`${key} hide`}</button>))
 }
export default Daftar;