import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, TextField, Button } from '@mui/material';

const ViewPausedDates = () => {
    const [pausedDates, setPausedDates] = useState([]);
    const [inputDate, setInputDate] = useState('');
    const [isFetched, setIsFetched] = useState(false);

    const datelistApiUrl = `${process.env.REACT_APP_API_URL}datelist/`;

    const fetchPausedDates = async () => {
        if (inputDate) {
            try {
                const response = await axios.get(datelistApiUrl);
    
                // Filter dates where the input date falls within the pause period
                const pausedDates = response.data.filter(date => {
                    const pauseStart = new Date(date.pause_start_date);
                    const pauseEnd = new Date(date.pause_end_date);
                    const checkDate = new Date(inputDate);
    
                    // Check if the input date falls within the pause period
                    return checkDate >= pauseStart && checkDate <= pauseEnd;
                });
    
                // Fetch household details for the filtered dates
                const pausedDatesWithNames = await Promise.all(pausedDates.map(async (date) => {
                    try {
                        const householdResponse = await axios.get(`${process.env.REACT_APP_API_URL}households/${date.hh_id}/`);
                        return {
                            ...date,
                            hh_first_name: householdResponse.data.hh_first_name,
                            hh_last_name: householdResponse.data.hh_last_name,
                        };
                    } catch {
                        return { ...date, hh_first_name: 'Error', hh_last_name: 'Error' };
                    }
                }));
    
                setPausedDates(pausedDatesWithNames);
                setIsFetched(true);
            } catch {
                alert('Error fetching paused dates');
            }
        } else {
            alert('Please specify a date.');
        }
    };

    const handleReset = () => {
        setInputDate('');
        setPausedDates([]);
        setIsFetched(false);
    };

    return (
        <Box sx={{ padding: '16px' }}>
            <Typography variant="h4" gutterBottom>
                Paused Dates Report
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Enter a Date to See the Households Paused on that Date and the entire duration of their "Paused Period"
            </Typography>
            <TextField
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ marginBottom: '16px' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={fetchPausedDates}
                sx={{ marginBottom: '16px' }}
            >
                View Paused Dates
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleReset}
                sx={{ marginBottom: '16px', marginLeft: '8px' }}
            >
                Reset
            </Button>
            <List>
                {isFetched && pausedDates.length === 0 ? (
                    <Typography variant="body1">No paused households found.</Typography>
                ) : (
                    pausedDates.map((date, index) => (
                        <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {`${date.hh_first_name || 'Unknown'} ${date.hh_last_name || 'Client'}`}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {`${date.pause_start_date} to ${date.pause_end_date}`}
                            </Typography>
                        </ListItem>
                    ))
                )}
            </List>
        </Box>
    );
};

export default ViewPausedDates;