import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Timeline } from '@knight-lab/timelinejs';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../tl.css'
import { useParams } from "react-router-dom";
import LandingPage from "./LandingPage";
import { Card } from "react-bootstrap";
import domain from "../domain"
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
                const response = await axios.get(domain+'/api/timeline/events/', { params });

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
                                <a href="${wikiurl}" class="btn m-1" style="background: #11ba1f; color: #fff; ${wikiurl === '' ? 'display: none;' : ''}" role="button">Laman Wikipedia</a>
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
            <div id="tl-timeline" style={{ width: '100%', height: '90vh', maxHeight: '90%;'}} ></div>
        </div>
    );
};

export default ListEvents;
