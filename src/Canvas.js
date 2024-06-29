
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
const [datas, setDatas] = useState([]);
const [suggestions, setSuggestions] = useState([]);

const [searchTerm, setSearchTerm] = useState("");
const [searchIRI, setSearchIRI] = useState("");
const placeHolder = "Ketikkan nama peristiwa sejarah, tokoh, atau tempat...";
const [roleTerm, setRoleTerm] = useState('');

const [appliedSearch, setAppliedSearch] = useState('');
const [appliedRole, setAppliedRole] = useState({});
const [isClicked, setIsClicked] = useState(false);
const [isEntered, setIsEntered] = useState(false);

const navigate = useNavigate();

const mapType = (tp) => {
    if (tp.slice(-5) === 'Actor') {
        return 'Actor'
    }
    else if (tp.slice(-5) === 'Event' ) {
        return 'Event'
    }
    else if (tp.slice(-7) === 'Feature' ){
        return 'Feature'
    }
}

const handleAddLabel = (listData) => {
    for (const i in listData) {
        if (listData[i].type.slice(-5) === 'Event') {
            listData[i].label += ' (Peristiwa)'
        }
        else if (listData[i].type.slice(-5) === 'Actor') {
            listData[i].label += ' (Tokoh)'
        }
        else if (listData[i].type.slice(-7) === 'Feature') {
            listData[i].label += ' (Tempat)'
        }
    }

    return listData
}

const handleRemoveLabel = (data, role) => {
    let suffix;
    if (role === 'Event') {
        suffix = ' (Peristiwa)'
    }
    else if (role === 'Actor') {
        suffix = ' (Tokoh)'
    }
    else if (role === 'Feature') {
        suffix = ' (Tempat)'
    }
    return data.replace(suffix, '');
}

const getTypeBySuffix = (data) => {
    const splittedData = data.split("(")
    const suffix = splittedData[splittedData.length - 1]
    if (suffix.includes('Peristiwa')) {
        return 'Event'
    }
    else if (suffix.includes('Tokoh')) {
        return 'Actor'
    }
    else if (suffix.includes('Tempat')) {
        return 'Feature'
    }
    return 'a'
}

const handleChange = (trigger) => {
    setSearchTerm(trigger.target.value)
    setSearchIRI("")
    let suggestions = Object.values(datas)
        .map(data => ({ value: data.iri, label: data.name, type: data.type }))
        .filter(data => data.label.toLowerCase().includes(trigger.target.value.toLowerCase()))
        .sort((a, b) => a.label > b.label ? 1 : -1)

    if (suggestions.length > 4) {
        suggestions = suggestions.slice(0, 4)
        suggestions.push({ value: '', label: 'Search more...', type: 'a' })
    }

    suggestions = handleAddLabel(suggestions)
    setSuggestions(suggestions);
}

const handleClick = (val) => {
    if (val.label === 'Search more...') {
        setIsClicked(false)
        navigate('/search/' + searchTerm)
    }

    setIsClicked(true)
    setSearchTerm(val.label)
    setRoleTerm(mapType(val.type))

    // Handling click then automatically redirect to timeline
    setAppliedSearch(val.label)
    setAppliedRole(mapType(val.type))

    setSearchIRI(val.value)
    setSuggestions([])
};

const handleEnter = (val) => {
    const keyEvents = val.nativeEvent
    if (keyEvents.keyCode === 13) {
        setIsEntered(true)
    }
}

const handleFilter = () => {
    if (!isClicked && searchTerm !== '') {
        navigate('/search/' + searchTerm)
        setIsClicked(false)
    }
    if (searchTerm === '') {
        toast.error(`Masukkan kata kunci pencarian terlebih dahulu`, {
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
            const responseEvent = await axios.get(domain+'/api/map/all');
            if (responseEvent.data.length !== 0 ) {
                setDatas(responseEvent.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);

useEffect(() => {
    if (isEntered && suggestions.length === 0) {
        if (searchIRI === '') {
            navigate('/search/' + searchTerm);
        }
        else {
            setRoleTerm(getTypeBySuffix(searchTerm));
            setAppliedRole(getTypeBySuffix(searchTerm));
            setAppliedSearch(searchTerm);
        }
        setIsEntered(false)
    }
}, [isEntered])

useEffect(() => {
    const finalSearch = handleRemoveLabel(appliedSearch, appliedRole)

    const filterData = (dt) => {
        if (appliedSearch !== ''){
            return dt.name.toLowerCase().includes(finalSearch.toLowerCase());
        }
    }

    const filteredDatas = [];
    for (const data of datas) {
        if (filterData(data)) {
            filteredDatas.push(data);
            break;
        }
    }
    if (filteredDatas.length !== 0  && appliedRole !== '') {
        setSuggestions([])
        setSearchTerm('')
        setIsClicked(false)
        navigate(`/timeline/${finalSearch}/${appliedRole}`)
    }
    else if (searchTerm !== '' && appliedRole === '') {
        setIsClicked(false)
        setSearchTerm('')
        navigate('/search/' + finalSearch)
    }
}, [appliedSearch, appliedRole, datas])



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
                      dataNodes[node.id]['property'][key]['status'] ? `${key} (show)` : `${key} (hide)`
                    }</ListGroup.Item>)}
                  
                 
                  </ListGroup>
                </Row>
                  <Row>
                    <ButtonGroup>
                  {dataNodes[node.id]['type']=='Event'? (dataNodes[node.id]['year'] == "" ? <></>:<Button variant="primary" href={`/app/timeline/${dataNodes[node.id]['label']}/${dataNodes[node.id]['type']}`} active>timeline</Button>):<Button variant="primary" href={`/app/timeline/${dataNodes[node.id]['label']}/${dataNodes[node.id]['type']}`} active>timeline</Button>}
                  {dataNodes[node.id]['wikiurl'] == "" ? <></>:<Button variant="primary" href={dataNodes['wikiurl']}active>wikipedia</Button>}
                  <Button variant="primary" href={`/app/detail/${node.id}`} active>detail</Button>
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
        <div>
        <div className="p-2" style={{ maxWidth:'70vw', margin:'auto auto', padding:'12px', zIndex: 922999}}>
                <div className="flex my-3 gap-4">
                {load==true?<></>:<Alert key='primary' variant='primary'>
          Loading data! <Spinner size={'sm'} animation="border" role="status">
        </Spinner>
        </Alert>}
                    <div className='w-3/4 grow' style={{ flex: '1', paddingRight: '10px' }}>
                        <SearchBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            searchIRI={searchIRI}
                            setSearchIRI={setSearchIRI}
                            suggestions={suggestions}
                            setSuggestions={setSuggestions}
                            handleChange={handleChange}
                            handleClick={handleClick}
                            handleEnter={handleEnter}
                            placeHolder={placeHolder}/>
                    </div>
                    <div className='w-1/4 grow' style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                            className="timeline-button"
                            style={{ padding: '7px', background: '#1360E7', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
                            onClick={handleFilter}
                        >
                            Cari
                        </button>
                    </div>
                </div>
            </div>
</div>

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
