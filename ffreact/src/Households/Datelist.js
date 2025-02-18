import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import { DialogContent } from '@mui/material';

const Datelist = ({ hh_id, handleDataUpdate, onSaveSuccess, selectedId, handleCancelClick }) => {
    const [pauseStartDate, setPauseStartDate] = useState('');
    const [pauseEndDate, setPauseEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentSelectedId, setCurrentSelectedId] = useState(selectedId);

    const apiUrl = `${process.env.REACT_APP_API_URL}datelist/`;

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
        } catch (error) {
            console.error('Failed to save date range:', error);
            alert('Failed to save date range');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setPauseStartDate('');
        setPauseEndDate('');
        setCurrentSelectedId(null);
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
            <DialogContent justifycontext = 'space-between' sx={{ p: 2 }}>
            <Button onClick={handleSave}  variant="outlined" color="primary">
                Save
            </Button>
            <Button onClick={handleCancelClick} variant="outlined" color="primary">
                Cancel
            </Button>
            </DialogContent>
        </div>
    );
};

export default Datelist;
