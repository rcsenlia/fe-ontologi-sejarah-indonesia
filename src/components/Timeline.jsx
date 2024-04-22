import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Timeline } from '@knight-lab/timelinejs';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../tl.css'
import { useParams } from "react-router-dom";
import LandingPage from "./LandingPage";
import { Card } from "react-bootstrap";

const TimelineEvent = () => {
    const { searchSent, roleSent } = useParams();
    const [ roleLabel, setRoleLabel] = useState("");
    const [showTimeline, setShowTimeline] = useState(false);

    const options = {
        initial_zoom: 2,
        scale_factor: 2
    }

    const role = [
        { value: 'Event', label: 'Peristiwa' },
        { value: 'Actor', label: 'Tokoh' },
        { value: 'Feature', label: 'Tempat' }
    ];

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const params = {};
                params['filter[search]'] = searchSent;
                params['filter[role]'] = roleSent;
                const response = await axios.get('http://127.0.0.1:8000/timeline/', { params });

                if (response.data.length !== 0 ) {
                    const timeline = roleSent === 'Event' ? mapTimelineEvents(response.data) : mapTimeline(response.data);
                    new Timeline('tl-timeline', timeline, options);
                    setShowTimeline(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTimeline();
    }, [searchSent, roleSent]);

    useEffect(() => {
        for (const idx in role) {
            if (roleSent === role[idx].value) {
                setRoleLabel(role[idx].label)
                break
            }
        }
    }, [roleSent])


    const mapTimeline = (rawData) => {
        return {
            events: rawData.map(({name, summary, wikiurl, dummyDate, thing, image}) => {
                // handles if the image are retrieved from wikipedia or outside wikipedia
                const url = image.slice(0,4) === 'http' ? image : `https://commons.wikimedia.org/wiki/Special:FilePath/${image}`;
                const uriEncoded = thing.replace('/', '%2F')
                const checkSummary = summary.length === 0 ? 'Tidak terdapat ringkasan' : summary

                return {
                    start_date: {
                        year: dummyDate.split("-")[0],
                        month: dummyDate.split("-")[1],
                        day: dummyDate.split("-")[2],
                    },
                    text: {
                        headline: `<a style="color: #282c34" href="/detail/${uriEncoded}">${name}</a>`,
                        text: `<div style="padding-bottom: 10px">
                                <a href="${wikiurl}" style="background: #0b9955; color: #f0f0f0 ; ${wikiurl === '' ? 'display: none;' : ''}" class="btn mr-2" style="color: #f0f0f0" role="button">Laman Wikipedia</a>
                                <a href="/detail/${uriEncoded}" style="background: #9810ad; color: #f0f0f0" class="btn mr-2" style="color: #f0f0f0" role="button">Detail</a>
                                <a href="/canvas/${uriEncoded}" style="background: #1360E7; color: #f0f0f0" class="btn mr-2" style="color: #f0f0f0" role="button">Canvas Graph</a>
                                <a href="/events/${uriEncoded}/${name}" style="background: #99630b; color: #f0f0f0" class="btn" style="color: #f0f0f0" role="button">Peristiwa yang Terlibat</a>
                                </div>` + checkSummary
                    },
                    media : {
                        url: url,
                        link: url
                    },
                };
            })
        };
    }

    const mapTimelineEvents = (rawData) => {
        return {
            events: rawData.map(({name, summary, wikiurl, firstDate, secondDate, thing, image}) => {
                const url = image.slice(0,4) === 'http' ? image : `https://commons.wikimedia.org/wiki/Special:FilePath/${image}`;
                const uriEncoded = thing.replace('/', '%2F')
                const checkSummary = summary.length === 0 ? 'Tidak terdapat ringkasan' : summary

                return {
                    start_date: {
                        year: firstDate.split("-")[0],
                        month: firstDate.split("-")[1],
                        day: firstDate.split("-")[2],
                    },
                    end_date: {
                        year: secondDate.split("-")[0],
                        month: secondDate.split("-")[1],
                        day: secondDate.split("-")[2],
                    },
                    text: {
                        headline: `<a style="color: #282c34" href="/detail/${uriEncoded}">${name}</a>`,
                        text: `<div style="padding-bottom: 10px">
                                <a href="${wikiurl}" style="background: #0b9955; color: #f0f0f0 ; ${wikiurl === '' ? 'display: none;' : ''}" class="btn mr-2" style="color: #f0f0f0" role="button">Laman Wikipedia</a>
                                <a href="/detail/${uriEncoded}" style="background: #9810ad; color: #f0f0f0" class="btn mr-2" style="color: #f0f0f0" role="button">Detail</a>
                                <a href="/canvas/${uriEncoded}" style="background: #1360E7; color: #f0f0f0" class="btn mr-2" style="color: #f0f0f0" role="button">Canvas Graph</a>
                                </div>` + checkSummary
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
            <LandingPage></LandingPage>
            <Card.Header as="h5" className='p-5' style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold"}} >Hasil pencarian '{searchSent}' dengan tipe {roleLabel}</Card.Header>
            <div id="tl-timeline" className="tl-timeline" style={{ width: '100%', height: '65vh'}}></div>
            {showTimeline  && roleSent !== 'Event' && (
                <div className="tl-timenav" style={{ display: "none !important" }}>
                    <style>
                        {`
                                #tl-timeline .tl-timenav {
                                    display: none !important;
                                }
                                #tl-timeline .tl-menubar {
                                    display: none !important;
                                }
                        `}
                    </style>
                </div>
            )}
        </div>
    );
};

export default TimelineEvent;
