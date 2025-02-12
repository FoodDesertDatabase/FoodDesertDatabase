import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';

const Datelist = ({ hh_id, handleDataUpdate, onSaveSuccess, selectedId }) => {
    const [pauseStartDate, setPauseStartDate] = useState('');
    const [pauseEndDate, setPauseEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [pausedDates, setPausedDates] = useState([]);
    const [currentSelectedId, setCurrentSelectedId] = useState(selectedId);

    const apiUrl = `${process.env.REACT_APP_API_URL}datelist/`;

    const fetchPausedDates = async () => {
        try {
            const response = await axios.get(`${apiUrl}?hh_id=${hh_id}`);
            setPausedDates(response.data);
        } catch (error) {
            console.error('Error fetching paused dates:', error);
            alert('Error fetching paused dates');
        }
    };

    useEffect(() => {
        if (hh_id) {
            fetchPausedDates();
        }
    }, [hh_id]);

    useEffect(() => {
        if (currentSelectedId && hh_id) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${apiUrl}${currentSelectedId}/`);
                    const data = response.data;

                    if (data.hh_id === hh_id) {
                        setPauseStartDate(data.pause_start_date);
                        setPauseEndDate(data.pause_end_date);
                    } else {
                        console.warn('The selected date does not belong to this household.');   
                        alert('The selected date does not belong to this household.');
                    }
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.error('Selected date not found:', error);
                        alert('Selected date not found');
                    } else {
                        console.error('Error fetching selected date data:', error);
                        alert('Error fetching data');
                    }
                }
            };
            fetchData();
        }
    }, [currentSelectedId, hh_id]);

    const handleSave = async () => {
        if (!pauseStartDate || !pauseEndDate) {
            alert('Both pause start and end dates are required');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                hh_id,
                pause_start_date: pauseStartDate,
                pause_end_date: pauseEndDate,
            };
            const response = currentSelectedId
                ? await axios.put(`${apiUrl}${currentSelectedId}/`, payload)
                : await axios.post(apiUrl, payload);

            const updatedData = response.data;
            handleDataUpdate(updatedData);

            if (onSaveSuccess) {
                onSaveSuccess(updatedData);
            }

            alert('Date range saved successfully');
            resetForm();
            fetchPausedDates();
        } catch (error) {
            console.error('Failed to save date range:', error);
            alert('Failed to save date range');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!hh_id) {
            alert('Invalid household ID');
            return;
        }

        if (window.confirm('Are you sure you want to delete all paused dates for this household?')) {
            setLoading(true);
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}household/${hh_id}/delete_all_dates/`);
                alert('All paused dates for this household deleted successfully');
                fetchPausedDates();
                resetForm();
            } catch (error) {
                console.error('Failed to delete paused dates:', error);
                alert('Failed to delete paused dates');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setPauseStartDate('');
        setPauseEndDate('');
        setCurrentSelectedId(null);
    };

    const handleEdit = (date) => {
        setPauseStartDate(date.pause_start_date);
        setPauseEndDate(date.pause_end_date);
        setCurrentSelectedId(date.id);
    };

    return (
        <div>
            <TextField
                label="Pause Start Date"
                type="date"
                value={pauseStartDate}
                onChange={(e) => setPauseStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Pause End Date"
                type="date"
                value={pauseEndDate}
                onChange={(e) => setPauseEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
            />
            <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete All'}
            </Button>
            <div>
                {pausedDates.map((date) => (
                    <div key={date.id}>
                        <Typography>
                            {date.pause_start_date} to {date.pause_end_date}
                        </Typography>
                        <Button onClick={() => handleEdit(date)}>Edit</Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Datelist;
