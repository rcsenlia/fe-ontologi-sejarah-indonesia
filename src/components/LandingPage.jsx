import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import SearchBar from "./SearchBar";
import '../tl.css'
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
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
        if (!isClicked) {
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
                const responseEvent = await axios.get('http://127.0.0.1:8000/map/all');
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
            setIsClicked(false)
            navigate(`/timeline/${finalSearch}/${appliedRole}`)
        }
        else if (searchTerm !== '' && appliedRole === '') {
            setIsClicked(false)
            navigate('/search/' + finalSearch)
        }
    }, [appliedSearch, appliedRole, datas])

    return (
        <div>
            <div className="p-2" style={{ maxWidth:'70vw', margin:'auto auto', padding:'12px', zIndex: 922999}}>
                <div className="flex my-3 gap-4">
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
    );

};

export default LandingPage;
