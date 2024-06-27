import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Timeline } from '@knight-lab/timelinejs';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../tl.css'
import LandingPage from "./LandingPage";
import domain from "../domain"

const ListActors = () => {
    const [showTimeline, setShowTimeline] = useState(false);


    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const options = {
                    initial_zoom: 5,
                    scale_factor: 5
                }
                setShowTimeline(false)
                const response = await axios.get(domain+'/api/timeline/actors/');

                if (response.data.length !== 0 ) {
                    const timeline = mapTimeline(response.data)
                    new Timeline('tl-timeline', timeline, options);
                    setShowTimeline(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTimeline();
    }, []);

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
                                <a href="${wikiurl}" class="btn m-1" style="background: #11ba1f; color: #fff; ${wikiurl === '' ? 'display: none;' : ''}" role="button">Laman Wikipedia</a>
                                <a href="/app/detail/${uriEncoded}" class="btn m-1" style="background: #e3a209; color: #fff" role="button">Detail</a>
                                <a href="/app/canvas/${uriEncoded}" class="btn m-1" style="background: #1360E7; color: #fff" role="button">Canvas Graph</a>
                                <a href="/app/events/${uriEncoded}/${name}" class="btn m-1" style="background: #cc0a3b; color: #fff" role="button">Peristiwa Terlibat</a>
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

    return (
        <div>
            <LandingPage></LandingPage>
            <div id="tl-timeline" className="tl-timeline" style={{ width: '100%', height: '85vh', maxHeight: '85%;'}} ></div>
            {showTimeline && (
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

export default ListActors;
