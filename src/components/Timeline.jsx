import React, {useEffect, useState} from 'react';
import axios from 'axios';
import loadTimelineScript from '../utils/TimelineLoader';
import {Timeline} from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';


const TimelineEvent = () => {
    const [timelineData, setTimelineData] = useState(null);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/timeline/');
                setTimelineData(response.data);
                await loadTimelineScript();
                const tlData = await mapTimeline(response.data)
                window.timeline = new Timeline('timeline-embed', tlData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTimeline();
    }, []);

    const mapTimeline = async (rawData) => {
        return {
            events: rawData.map(({name, dateStart, dateEnd, latitude, longitude}) => ({
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
            })),
            title: {
                text: {
                    headline: 'Your Timeline Title',
                    text: 'Your Timeline Description',
                },
            },
        }
    }

    return (
        <div id="timeline-embed" style={{ width: '100%', height: '600px' }}>
        </div>
    );
};

export default TimelineEvent;
