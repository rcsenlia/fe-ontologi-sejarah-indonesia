import React, {useEffect} from 'react';
import axios from 'axios';
import loadTimelineScript from '../utils/TimelineLoader';
import {Timeline} from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';

const TimelineEvent = () => {

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/timeline/');
                await loadTimelineScript();
                const tlData = await mapTimeline(response.data)
                new Timeline('timeline-embed', tlData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTimeline();
    }, []);

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
        <div id="timeline-embed" style={{ width: '100%', height: '600px' }}></div>
    );
};

export default TimelineEvent;
