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
                // const response = await axios.get('http://127.0.0.1:8000/timeline/');
                // setTimelineData(response.data);
                await loadTimelineScript();

                const staticData = [{"name": "Negara Bagian Sumatra Selatan", "dateStart": "1948-08-30", "dateEnd": "1950-03-24", "latitude": 9.15982515, "longitude": 76.64200119535784}, {"name": "Kalimantan", "dateStart": "1950-08-14", "dateEnd": "1957-12-31", "latitude": -2.4833826, "longitude": 117.8902853}, {"name": "Republik Negara Bagian Indonesia", "dateStart": "1949-12-27", "dateEnd": "1950-08-17", "latitude": -2.4833826, "longitude": 117.8902853}, {"name": "Kalimantan", "dateStart": "1950-08-14", "dateEnd": "1957-12-31", "latitude": -2.4833826, "longitude": 117.8902853}, {"name": "Republik Negara Bagian Indonesia", "dateStart": "1949-12-27", "dateEnd": "1950-08-17", "latitude": -2.4833826, "longitude": 117.8902853}, {"name": "Negara Bagian Sumatra Timur", "dateStart": "1947-12-25", "dateEnd": "1950-08-15", "latitude": 32.06675625, "longitude": 72.70921683735315}, {"name": "Federasi Kalimantan Tenggara", "dateStart": "1947-01-08", "dateEnd": "1950-04-04", "latitude": -0.07008139999999999, "longitude": 109.34600977357367}, {"name": "Negara Jawa Timur", "dateStart": "1948-11-26", "dateEnd": "1950-03-09", "latitude": -7.6977397, "longitude": 112.4914199}, {"name": "Negara Indonesia Timur", "dateStart": "1946-12-24", "dateEnd": "1950-08-17", "latitude": -8.50998605, "longitude": 120.59815014764581}, {"name": "Negara Pasundan", "dateStart": "1948-02-26", "dateEnd": "1950-12-31", "latitude": -8.314176, "longitude": 113.6224232}, {"name": "Daerah Federal Jakarta", "dateStart": "1948-08-11", "dateEnd": "1950-03-30", "latitude": 42.8875912, "longitude": 0.3983792}, {"name": "Negara Madura", "dateStart": "1948-01-23", "dateEnd": "1950-03-09", "latitude": -7.059076299999999, "longitude": 113.28431738934134}, {"name": "Dayak Besar", "dateStart": "1946-12-07", "dateEnd": "1950-04-18", "latitude": -0.2817973, "longitude": 117.0134993}, {"name": "Negara Kalimantan Timur", "dateStart": "1947-04-12", "dateEnd": "1950-04-24", "latitude": -1.6029212, "longitude": 116.1694264}, {"name": "Daerah Banjar", "dateStart": "1948-01-14", "dateEnd": "1950-04-04", "latitude": -3.3222971, "longitude": 114.6007167828823}]
                const tlData = await mapTimeline(staticData)
                new Timeline('timeline-embed', tlData)
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
        <div id="timeline-embed" style={{ width: '100%', height: '600px' }}></div>
    );
};

export default TimelineEvent;
