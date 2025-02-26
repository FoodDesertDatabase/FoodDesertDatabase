import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { DataGrid, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';

export default function ShowServingsReport() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [servingsData, setServingsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFromDateChange = (e) => setFromDate(e.target.value);
    const handleToDateChange = (e) => setToDate(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fromDate || !toDate) {
            setError('Please enter both dates.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}servings`, {
                params: { from: fromDate, to: toDate }
            });

            if (response.status === 200) {
                setServingsData([response.data]); // Ensure data is an array for DataGrid
            } else {
                throw new Error('Failed to fetch servings report.');
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : "Error fetching data.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFromDate('');
        setToDate('');
        setServingsData(null);
        setError(null);
    };

    const columns = [
        { field: 'num_adult', headerName: 'Total Adults', type: 'number', width: 150 },
        { field: 'num_child_0_6', headerName: 'Children (0-6)', type: 'number', width: 150 },
        { field: 'num_child_7_17', headerName: 'Children (7-17)', type: 'number', width: 150 },
        { field: 'total_children', headerName: 'Total Children', type: 'number', width: 150 },
        { field: 'total_servings', headerName: 'Total Servings', type: 'number', width: 180 }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Servings Report
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="From Date"
                    type="date"
                    fullWidth
                    value={fromDate}
                    onChange={handleFromDateChange}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                />
                <TextField
                    label="To Date"
                    type="date"
                    fullWidth
                    value={toDate}
                    onChange={handleToDateChange}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                />
                <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                    <Button onClick={handleReset} variant="contained" color="primary">
                        Reset
                    </Button>
                </Box>
            </form>

            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            {servingsData && (
                <Box sx={{ mt: 3 }}>
                    <DataGrid
                        columns={columns}
                        rows={servingsData} // DataGrid expects an array
                        getRowId={() => 1} // Assign a unique row ID
                        autoHeight
                        components={{ Toolbar: CustomToolbar }}
                    />
                </Box>
            )}
        </Box>
    );
}

// Custom Toolbar for Export
function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport
                csvOptions={{ fileName: 'Servings Report', delimiter: ';' }}
            />
        </GridToolbarContainer>
    );
}
