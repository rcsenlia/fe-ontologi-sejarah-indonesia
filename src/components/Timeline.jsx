import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Timeline } from '@knight-lab/timelinejs';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../tl.css'
import { useParams } from "react-router-dom";
import LandingPage from "./LandingPage";
import domain from "../domain"
const TimelineEvent = () => {
    const { searchSent, roleSent } = useParams();
    const [showTimeline, setShowTimeline] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);

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
                const response = await axios.get(domain+'/api/timeline/', { params });

                if (response.data.length !== 0 ) {
                    const timeline = roleSent === 'Event' ? mapTimelineEvents(response.data) : mapTimeline(response.data);
                    new Timeline('tl-timeline', timeline, options);
                    setShowTimeline(true);
                }
                else {
                    setIsAvailable(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsAvailable(false);
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
                        headline: `<a style="color: #282c34" href="/app/detail/${uriEncoded}">${name}</a>`,
                        text: `<div style="padding-bottom: 10px" class="timeline-button-wrapper">
                                <a href="${wikiurl}" class="btn m-1" style="background: #7D8ABC; color: #fff; ${wikiurl === '' ? 'display: none;' : ''}" role="button">Laman Wikipedia</a>
                                <a href="/app/detail/${uriEncoded}" class="btn m-1" style="background: #e3a209; color: #fff" role="button">Detail</a>
                                <a href="/app/canvas/${uriEncoded}" class="btn m-1" style="background: #1360E7; color: #fff" role="button">Canvas Graph</a>
                                <a href="/app/events/${uriEncoded}/${name}" class="btn m-1" style="background: #d1a592; color: #fff" role="button">Peristiwa Terlibat</a>
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
            events: rawData.map(({name, summary, wikiurl, firstDateDay, firstDateMonth, firstDateYear, secondDateDay, secondDateMonth, secondDateYear, thing, image}) => {
                const url = image.slice(0,4) === 'http' ? image : `https://commons.wikimedia.org/wiki/Special:FilePath/${image}`;
                const uriEncoded = thing.replace('/', '%2F')
                const checkSummary = summary.length === 0 ? 'Tidak terdapat ringkasan' : summary
                const thumbnail = image === 'No image available.svg' ? 'kosong' : url

                const baseEvent = {
                    start_date: {
                        year: firstDateYear,
                        month: firstDateMonth,
                        day: firstDateDay,
                    },
                    text: {
                        headline: `<a style="color: #282c34" href="/app/detail/${uriEncoded}">${name}</a>`,
                        text: `<div style="padding-bottom: 10px" class="timeline-button-wrapper">
                                <a href="${wikiurl}" class="btn m-1" style="background: #7D8ABC; color: #fff; ${wikiurl === '' ? 'display: none;' : ''}" role="button">Laman Wikipedia</a>
                                <a href="/app/detail/${uriEncoded}" class="btn m-1" style="background: #e3a209; color: #fff" role="button">Detail</a>
                                <a href="/app/canvas/${uriEncoded}" class="btn m-1" style="background: #1360E7; color: #fff" role="button">Canvas Graph</a>
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

                if (secondDateYear) {
                    baseEvent.end_date = {
                        year: secondDateYear,
                        month: secondDateMonth,
                        day: secondDateDay,
                    };
                }

                return baseEvent;
            })
        };
    }

    return (
        <div>
            <LandingPage></LandingPage>

            {!isAvailable &&
                <h1 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}> Data tidak tersedia </h1>}

            {isAvailable && <div id="tl-timeline" className="tl-timeline" style={{ width: '100%', height: '85vh', maxHeight: '85%;'}} ></div>}

            {isAvailable && showTimeline  && roleSent !== 'Event' && (
                <div className="tl-timenav" style={{ display: "none !important" }}>
                    <style>
                        {`
                                #tl-timeline .tl-timenav {
                                    display: none !important;
                                }
                                #tl-timeline .tl-menubar {
                                    display: none !important;
                                }
                                #tl-timeline .tl-headline-date {
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
