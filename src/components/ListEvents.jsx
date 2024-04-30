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
    const options = {
        initial_zoom: 2,
        scale_factor: 2
    }

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const params = {};
                params['filter[iri]'] = iriSent;
                const response = await axios.get('http://127.0.0.1:8000/timeline/events/', { params });

                if (response.data.length !== 0 ) {
                    const timeline = mapTimelineEvents(response.data);
                    new Timeline('tl-timeline', timeline, options);
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
            <div id="tl-timeline" style={{ width: '100%', height: '90vh', maxHeight: '90%;'}} ></div>
        </div>
    );
};

export default ListEvents;
