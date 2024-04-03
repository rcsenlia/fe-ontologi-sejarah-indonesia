import React, { useEffect, useState } from 'react';
import axios from 'axios';
import loadTimelineScript from '../utils/TimelineLoader';
import { Timeline } from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';

const TimelineEvent = () => {
    const [nameFilter, setNameFilter] = useState('');
    const [appliedNameFilter, setAppliedNameFilter] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const placeHolder = "Ketikkan nama peristiwa sejarah...";

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const params = {};
                params['filter[name]'] = appliedNameFilter;
                const responseEvent = await axios.get('http://127.0.0.1:8000/timeline/event/', { params });
                // const responsePerson = await axios.get('http://127.0.0.1:8000/timeline/person/', { params });

                //responsePerson.data.length !== 0
                if (responseEvent.data.length !== 0 ) {
                    await loadTimelineScript();
                    const tlEvent = mapTimelineEvent(responseEvent.data)
                    // const tlPerson = mapTimelinePerson(responsePerson.data)

                    // let tlData = {
                    //     events: [tlEvent, tlPerson].flatMap(obj => obj.events)
                    // };
                    new Timeline('timeline-embed', tlEvent)
                }
                else {
                    toast.warn(`${appliedNameFilter} tidak ditemukan`)
                }


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTimeline();
    }, [appliedNameFilter]);

    const handleFilter = () => {
        setAppliedNameFilter(nameFilter);
    };

    const handleClear = () => {
        setNameFilter('');
        setAppliedNameFilter('');
    };

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
                    // group: "Timeline Sejarah"
                };
            })
        };
    }

    // const mapTimelinePerson = (rawData) => {
    //     return {
    //         events: rawData.map(({name, summary, wikiurl, birthDate, deathDate, person, image}) => {
    //             const url = image.slice(0,4) === 'http' ? image : `https://commons.wikimedia.org/wiki/Special:FilePath/${image}`;
    //
    //             return {
    //                 start_date: {
    //                     year: birthDate.split("-")[0],
    //                     month: birthDate.split("-")[1],
    //                     day: birthDate.split("-")[2],
    //                 },
    //                 end_date: {
    //                     year: deathDate.split("-")[0],
    //                     month: deathDate.split("-")[1],
    //                     day: deathDate.split("-")[2],
    //                 },
    //                 text: {
    //                     headline: `<a style="color: #282c34" href="/detail/${person}">${name}</a>`,
    //                     text: `<div><small><a style="color: #282c34" href="${wikiurl}">laman wikipedia</a></small> - <small><a style="color: #282c34" href="/canvas/${person}">laman graph</a></small> <br> </div>`
    //                         + summary,
    //                 },
    //                 media : {
    //                     url: url,
    //                     link: url
    //                 },
    //                 group: "Tokoh Sejarah"
    //             };
    //         })
    //     };
    // }

    return (
        <div>
            <div className="mt-3 mb-3 p-4" style={{ width:'100%', maxWidth:'500px', margin:'auto auto', padding:'12px'}}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="border p-2 rounded-md" style={{ borderColor: '#000',position: 'relative', display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="25" fill="currentColor"
                             className="bi bi-search" viewBox="0 0 16 16">
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                        <span style={{ margin: '0 5px' }}></span>
                        <input
                            type="text"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            placeholder={placeHolder}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            style={{ marginLeft: '10px', padding: '7px', background: '#1360E7', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
                            onClick={handleFilter}
                        >
                            Cari
                        </button>
                        <button
                            style={{ marginLeft: '10px', padding: '7px', background: '#01CC09', color: 'white', borderRadius: '5px', cursor: 'pointer'}}
                            onClick={handleClear}
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
            <div id="timeline-embed" style={{ width: '100%', height: '70vh' }}></div>
        </div>
    );
};

export default TimelineEvent;
