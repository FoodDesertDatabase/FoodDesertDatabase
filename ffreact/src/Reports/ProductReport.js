import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const ProductReport = () => {
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    const fetchReport = async (product) => {
        try {
            axios({
                method: "GET",
                url: process.env.REACT_APP_API_URL + `product-report/`,
                params: { product }
            }).then((response) => {
                setReport(response.data);
                setError(null);
            }).catch((error) => {
                setError(error.response ? error.response.data.error : 'Error fetching report');
                setReport(null);
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
        } catch (err) {
            setError('Error fetching report. Please try again.');
            setReport(null);
        }
    };

   const columns = [
        { field: 'first_name', headerName: 'First Name', width: 150 },
        { field: 'last_name', headerName: 'Last Name', width: 150 },
        { field: 'adult_servings', headerName: 'Adult Servings', width: 150, hide: report && report.product === 'childrenSnacks' },
        { field: 'child_servings', headerName: 'Child Servings', width: 150 },
        { field: 'total_servings', headerName: 'Total Servings', width: 150 },
    ];

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Product Report
            </Typography>
            <Box sx={{ marginBottom: 4 }}>
                <Button variant="contained" color="primary" onClick={() => fetchReport('ppMealKit')} sx={{ marginRight: 2 }}>
                    PP Meal Kit
                </Button>
                <Button variant="contained" color="primary" onClick={() => fetchReport('childrenSnacks')} sx={{ marginRight: 2 }}>
                    Children Snacks
                </Button>
                <Button variant="contained" color="primary" onClick={() => fetchReport('foodBox')} sx={{ marginRight: 2 }}>
                    Food Box
                </Button>
                <Button variant="contained" color="primary" onClick={() => fetchReport('rteMeal')}>
                    RTE Meal
                </Button>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
            {report && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Report for {report.product}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Total Servings: {report.total_servings}
                    </Typography>
                    <DataGrid
                        columns={columns}
                        rows={report.households}
                        autoHeight
                        getRowId={(row) => row.household_id}
                    />
                </Box>
            )}
        </Box>
    );
};

export default ProductReport;