import React, { useEffect, useState } from 'react';
import axios from 'axios';
import loadTimelineScript from '../utils/TimelineLoader';
import { Timeline } from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import SearchBar from "./SearchBar";
import MultiRangeSlider from "multi-range-slider-react";

const TimelineEvent = () => {
    const [minYear, setMinYear] = useState(1200);
    const [maxYear, setMaxYear] = useState(2024);
    const [datas, setDatas] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchIRI, setSearchIRI] = useState("");
    const placeHolder = "Ketikkan nama peristiwa sejarah...";

    const options = {
        initial_zoom: 2,
    }

    const handleClick = (val) => {
        setSearchTerm(val.label)
        setSuggestions([])
    };

    const handleChange = (trigger) => {
        setSearchTerm(trigger.target.value)
        setSearchIRI("")
        setSuggestions(Object.values(datas)
            .map(data => ({ value: data.event, label: data.name }))
            .filter(data => data.value.toLowerCase().includes(trigger.target.value.toLowerCase()))
            .sort((a, b) => a.label > b.label ? 1 : -1));
    }

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const responseEvent = await axios.get('http://127.0.0.1:8000/timeline/event/');
                if (responseEvent.data.length !== 0 ) {
                    setDatas(responseEvent.data)
                    const tlEvent = mapTimelineEvent(responseEvent.data);
                    new Timeline('timeline-embed', tlEvent, options)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTimeline();
    }, []);

    useEffect(() => {
        const filteredDatas = datas.filter(filterData);

        if (filteredDatas.length !== 0) {
            const tlEvent = mapTimelineEvent(filteredDatas);
            new Timeline('timeline-embed', tlEvent, options)
        }
        else if (searchTerm !== '') {
            toast.warn(`${searchTerm} tidak ditemukan`, {
                autoClose: 2000
            })
        }

    }, [minYear, maxYear, searchTerm, datas])

    const filterData = (dt) => {
        const isYearInRange = (dt.dateStart.split("-")[0] >= minYear && dt.dateStart.split("-")[0] <= maxYear) ||
            (dt.dateEnd.split("-")[0] >= minYear && dt.dateEnd.split("-")[0] <= maxYear)

        if (searchTerm) {
            const doesNameContainSearch = dt.name.toLowerCase().includes(searchTerm.toLowerCase());
            return isYearInRange && doesNameContainSearch
        }

        return isYearInRange
    }

    const mapTimelineEvent = (rawData) => {
        return {
            events: rawData.map(({name, summary, wikiurl, dateStart, dateEnd, event, image}) => {
                // handles if the image are retrieved from wikipedia or outside wikipedia
                const url = image.slice(0,4) === 'http' ? image : `https://commons.wikimedia.org/wiki/Special:FilePath/${image}`;
                const eventEncoded = event.replace('/', '%2F')

                return {
                    start_date: {
                        year: dateStart.split("-")[0],
                        month: dateStart.split("-")[1],
                        day: dateStart.split("-")[2],
                    },
                    end_date: {
                        year: dateEnd.split("-")[0],
                        month: dateEnd.split("-")[1],
                        day: dateEnd.split("-")[2],
                    },
                    text: {
                        headline: `<a style="color: #282c34" href="/detail/${eventEncoded}">${name}</a>`,
                        text: `<div style="padding-bottom: 10px"> 
                                <a href="${wikiurl}" style="background: #0aa85d; color: #f0f0f0" class="btn mr-2" style="color: #f0f0f0" role="button">Laman Wikipedia</a> 
                                <a href="/detail/${eventEncoded}" style="background: #07a393; color: #f0f0f0" class="btn mr-2" style="color: #f0f0f0" role="button">Detail Peristiwa</a>
                                <a href="/canvas/${eventEncoded}" style="background: #1360E7; color: #f0f0f0" class="btn" style="color: #f0f0f0" role="button">Canvas Graph Peristiwa</a> 
                                </div>` + summary
                    },
                    media : {
                        url: url,
                        link: url
                    },
                };
            })
        };
    }

    return (
        <div>
            <div className="mt-3 mb-3 p-4" style={{ width:'100%', maxWidth:'80vw', margin:'auto auto', padding:'12px'}}>
                <div className="flex my-3 gap-4">
                    <div className='w-1/2 grow'>
                        <SearchBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            searchIRI={searchIRI}
                            setSearchIRI={setSearchIRI}
                            suggestions={suggestions}
                            setSuggestions={setSuggestions}
                            handleChange={handleChange}
                            handleClick={handleClick}
                            handleEnter={() => { }}
                            placeHolder={placeHolder} />
                    </div>
                    <div className='w-1/2 grow'>
                        <MultiRangeSlider
                            min={1200}
                            max={2024}
                            step={1}
                            minValue={minYear}
                            maxValue={maxYear}
                            onInput={(e) => {
                                setMinYear(e.minValue);
                                setMaxYear(e.maxValue);
                            }}
                            barInnerColor='blue'
                            ruler={false}
                        />
                    </div>
                </div>
            </div>
            <div id="timeline-embed" style={{ width: '100%', height: '70vh' }}></div>
        </div>
    );
};

export default TimelineEvent;
