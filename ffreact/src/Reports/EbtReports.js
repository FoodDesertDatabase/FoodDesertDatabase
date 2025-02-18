import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const EbtReports = () => {
    const [dayNumber, setDayNumber] = useState('');
    const [peopleByEbtDay, setPeopleByEbtDay] = useState([]);
    const [allHouseholds, setAllHouseholds] = useState([]);

    const fetchPeopleByEbtDay = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: process.env.REACT_APP_API_URL + 'Ebt-reports/get_people_by_ebt_day',
                params: { day_number: dayNumber }
            });
            setPeopleByEbtDay(response.data);
        } catch (error) {
            console.error('Error fetching people by EBT day:', error);
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        }
    };

    const fetchAllHouseholdsWithEbt = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: process.env.REACT_APP_API_URL + 'Ebt-reports/get_all_households_with_ebt'
            });
            const uniqueHouseholds = response.data.filter((household, index, self) =>
                index === self.findIndex((h) => h.ebt_number === household.ebt_number)
            );
            setAllHouseholds(uniqueHouseholds);
        } catch (error) {
            console.error('Error fetching all households with EBT:', error);
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        }
    };

   const renderProductCell = (params) => {
        return params.value ? 'Yes' : 'No';
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                EBT Reports
            </Typography>

            <Box sx={{ marginBottom: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Get People by EBT Day
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <input
                        type="text"
                        value={dayNumber}
                        onChange={(e) => setDayNumber(e.target.value)}
                        placeholder="Enter day number"
                        style={{ marginRight: 8, padding: 4 }}
                    />
                    <button onClick={fetchPeopleByEbtDay} style={{ padding: 4 }}>
                        Fetch
                    </button>
                </Box>
                <DataGrid
                    columns={[
                        { field: 'household_name', headerName: 'Household Name', width: 200 },
                        { field: 'ebt_number', headerName: 'EBT Number', width: 150 },
                        { field: 'refresh_day', headerName: 'Refresh Day', width: 150 },
                        { field: 'ppMealKit_flag', headerName: 'P.P. Meal Kit', width: 150, renderCell: renderProductCell },
                        { field: 'childrenSnacks_flag', headerName: 'Children Snacks', width: 150, renderCell: renderProductCell },
                        { field: 'foodBox_flag', headerName: 'Food Box', width: 150, renderCell: renderProductCell },
                        { field: 'rteMeal_flag', headerName: 'RTE Meal', width: 150, renderCell: renderProductCell },
                        { field: 'total_servings', headerName: 'Total Servings', width: 150 },
                        { field: 'children_snack_servings', headerName: 'Children Snack Servings', width: 200 },
                    ]}
                    rows={peopleByEbtDay}
                    autoHeight
                    getRowId={(row) => row.ebt_number}
                />
            </Box>

            <Box>
                <Typography variant="h6" gutterBottom>
                    Get All Households with EBT
                </Typography>
                <button onClick={fetchAllHouseholdsWithEbt} style={{ padding: 4, marginBottom: 2 }}>
                    Fetch
                </button>
                <DataGrid
                    columns={[
                        { field: 'household_name', headerName: 'Household Name', width: 200 },
                        { field: 'ebt_number', headerName: 'EBT Number', width: 150 },
                        { field: 'refresh_day', headerName: 'Refresh Day', width: 150 },
                        { field: 'ppMealKit_flag', headerName: 'P.P. Meal Kit', width: 150, renderCell: renderProductCell },
                        { field: 'childrenSnacks_flag', headerName: 'Children Snacks', width: 150, renderCell: renderProductCell },
                        { field: 'foodBox_flag', headerName: 'Food Box', width: 150, renderCell: renderProductCell },
                        { field: 'rteMeal_flag', headerName: 'RTE Meal', width: 150, renderCell: renderProductCell },
                        { field: 'total_servings', headerName: 'Total Servings', width: 150 },
                        { field: 'children_snack_servings', headerName: 'Children Snack Servings', width: 200 },
                    ]}
                    rows={allHouseholds}
                    autoHeight
                    getRowId={(row) => row.ebt_number}
                />
            </Box>
        </Box>
    );
};

export default EbtReports;