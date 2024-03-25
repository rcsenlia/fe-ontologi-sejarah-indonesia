import React, { useEffect, useState } from 'react';
import axios from 'axios';
import loadTimelineScript from '../utils/TimelineLoader';
import { Timeline } from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TimelineEvent = () => {
    const [nameFilter, setNameFilter] = useState('');
    const [appliedNameFilter, setAppliedNameFilter] = useState('');

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const params = {};
                params['filter[name]'] = appliedNameFilter;
                const response = await axios.get('http://127.0.0.1:8000/timeline/', { params });

                if (response.data.length !== 0) {
                    await loadTimelineScript();
                    const tlData = await mapTimeline(response.data)
                    new Timeline('timeline-embed', tlData)
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

    const mapTimeline = async (rawData) => {
        return {
            events: rawData.map(({name, dateStart, dateEnd, latitude, longitude, actor}) => ({
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
                    headline: name,
                    text: `Description for ${name}`,
                },
                media : {
                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/640px-Google_2015_logo.svg.png',
                    caption: 'Klik untuk lihat Lokasi',
                    link: `/map/${actor}`
                }
            })),
            title: {
                text: {
                    headline: 'Your Timeline Title',
                    text: 'Timeline Description',
                },
            },
        }
    }

    return (
        <div>
            <div className="mt-3 border p-4 rounded-md" style={{ width:'100%', maxWidth:'500px', margin:'0 auto', padding:'15px', boxSizing:'border-box', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
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
                            placeholder="Cari Peristiwa atau Aktor"
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
            <div id="timeline-embed" style={{ width: '100%', height: '600px' }}></div>
        </div>
    );
};

export default TimelineEvent;
