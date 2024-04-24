import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Timeline } from '@knight-lab/timelinejs';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../tl.css'
import { useParams } from "react-router-dom";
import LandingPage from "./LandingPage";
import { Card } from "react-bootstrap";

const ListEvents = () => {
    const { iriSent, iriLabel } = useParams();
    const [ isEventsAvailable, setIsEventsAvailable] = useState(false)
    const [showTimeline, setShowTimeline] = useState(false);
    const options = {
        initial_zoom: 2,
        scale_factor: 2
    }

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const params = {};
                params['filter[iri]'] = iriSent;
                setShowTimeline(false)
                const response = await axios.get('http://127.0.0.1:8000/timeline/events/', { params });

                if (response.data.length !== 0 ) {
                    const timeline = mapTimelineEvents(response.data);
                    setIsEventsAvailable(timeline.length !== 0);
                    new Timeline('tl-timeline', timeline, options);
                    setShowTimeline(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTimeline();
    }, [iriSent]);

    const mapTimelineEvents = (rawData) => {
        return {
            events: rawData.map(({name, summary, wikiurl, firstDate, secondDate, event, image}) => {
                const url = image.slice(0,4) === 'http' ? image : `https://commons.wikimedia.org/wiki/Special:FilePath/${image}`;
                const uriEncoded = event.replace('/', '%2F');
                const checkSummary = summary.length === 0 ? 'Tidak terdapat ringkasan' : summary;

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
                                <a href="${wikiurl}" class="timeline-button" style="background: #0b9955; color: #f0f0f0 ; ${wikiurl === '' ? 'display: none;' : ''}" class="btn mr-2" style="color: #f0f0f0" role="button">Laman Wikipedia</a>
                                <a href="/detail/${uriEncoded}" class="timeline-button" style="background: #9810ad; color: #f0f0f0" class="btn mr-2" style="color: #f0f0f0" role="button">Detail</a>
                                <a href="/canvas/${uriEncoded}"  class="timeline-button" style="background: #1360E7; color: #f0f0f0" class="btn mr-2" style="color: #f0f0f0" role="button">Canvas Graph</a>
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

    useEffect(() => {
        const addHeadingToContainers = () => {
            const slideContentContainers = document.querySelectorAll('.tl-slide-scrollable-container');
            slideContentContainers.forEach(container => {
                const heading = document.createElement('div');
                heading.textContent = `Peristiwa yang berkaitan dengan '${iriLabel}'`;
                heading.className = 'timeline-title'

                container.parentNode.insertBefore(heading, container);
            });
        };

        if (showTimeline){
            addHeadingToContainers();
        }

        return () => {};
    }, [showTimeline]);

    return (
        <div>
            <LandingPage></LandingPage>
            <div id="tl-timeline" style={{ width: '100%', height: '70vh'}} ></div>
        </div>
    );
};

export default ListEvents;
