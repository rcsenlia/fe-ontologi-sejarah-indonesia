import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Timeline } from '@knight-lab/timelinejs';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../tl.css'
import { useParams } from "react-router-dom";
import LandingPage from "./LandingPage";

const TimelineEvent = () => {
    const { searchSent, roleSent } = useParams();
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
                setShowTimeline(false)
                const response = await axios.get('/api/timeline/', { params });

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
                        text: `<div style="padding-bottom: 10px" class="timeline-button-wrapper">
                                <a href="${wikiurl}" class="btn m-1" style="background: #11ba1f; color: #fff; ${wikiurl === '' ? 'display: none;' : ''}" role="button">Laman Wikipedia</a>
                                <a href="/detail/${uriEncoded}" class="btn m-1" style="background: #e3a209; color: #fff" role="button">Detail</a>
                                <a href="/canvas/${uriEncoded}" class="btn m-1" style="background: #1360E7; color: #fff" role="button">Canvas Graph</a>
                                <a href="/events/${uriEncoded}/${name}" class="btn m-1" style="background: #cc0a3b; color: #fff" role="button">Peristiwa Terlibat</a>
                                </div> 
                                <div class="timeline-text"> 
                                ${checkSummary} 
                                </div>`
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
                const thumbnail = image === 'No image available.svg' ? 'kosong' : url

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
                        text: `<div style="padding-bottom: 10px" class="timeline-button-wrapper">
                                <a href="${wikiurl}" class="btn m-1" style="background: #11ba1f; color: #fff; ${wikiurl === '' ? 'display: none;' : ''}" role="button">Laman Wikipedia</a>
                                <a href="/detail/${uriEncoded}" class="btn m-1" style="background: #e3a209; color: #fff" role="button">Detail</a>
                                <a href="/canvas/${uriEncoded}" class="btn m-1" style="background: #1360E7; color: #fff" role="button">Canvas Graph</a>
                                </div> 
                                <div class="timeline-text"> 
                                ${checkSummary} 
                                </div>`
                    },
                    media : {
                        url: url,
                        link: url,
                        thumbnail: thumbnail
                    },
                };
            })
        };
    }

    return (
        <div>
            <LandingPage></LandingPage>
            <div id="tl-timeline" className="tl-timeline" style={{ width: '100%', height: '85vh', maxHeight: '85%;'}} ></div>
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
