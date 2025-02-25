import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, 
    Typography, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    TextField
} from '@mui/material';

const DietaryRestrictionsReport = () => {
    const [reportType, setReportType] = useState('all');
    const [households, setHouseholds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

    const runReport = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (reportType === 'all') {
                const householdsResponse = await axios.get(process.env.REACT_APP_API_URL + 'households/');
                let householdsWithRestrictions = [];
                
                // For each household, fetch their restrictions
                for (const household of householdsResponse.data) {
                    const restrictionsResponse = await axios.get(
                        process.env.REACT_APP_API_URL + 'dietary-restrictions/',
                        { params: { household: household.hh_id } }
                    );
                    if (restrictionsResponse.data.length > 0) {
                        householdsWithRestrictions.push({
                            ...household,
                            dietary_restrictions: restrictionsResponse.data
                        });
                    }
                }
                
                setHouseholds(householdsWithRestrictions);
            } else if (reportType === 'weekly' && selectedDate) {
                const checkDate = new Date(selectedDate);
                const weekEnd = new Date(selectedDate);
                weekEnd.setDate(weekEnd.getDate() + 6);

                const householdsResponse = await axios.get(process.env.REACT_APP_API_URL + 'households/');
                let householdsWithRestrictions = [];

                // Get all paused dates first
                const allPausedDatesResponse = await axios.get(process.env.REACT_APP_API_URL + 'datelist/');
                const pausedDatesMap = allPausedDatesResponse.data.reduce((acc, date) => {
                    if (!acc[date.hh_id]) {
                        acc[date.hh_id] = [];
                    }
                    acc[date.hh_id].push(date);
                    return acc;
                }, {});

                // Process each household
                for (const household of householdsResponse.data) {
                    const isSubscribed = household.ppMealKit_flag || 
                                       household.childrenSnacks_flag || 
                                       household.foodBox_flag || 
                                       household.rteMeal_flag;

                    if (!isSubscribed) continue;

                    // Check if household has any paused dates
                    const householdPausedDates = pausedDatesMap[household.hh_id] || [];
                    const isPaused = householdPausedDates.some(date => {
                        const pauseStart = new Date(date.pause_start_date);
                        const pauseEnd = new Date(date.pause_end_date);
                        return (pauseStart <= weekEnd && pauseEnd >= checkDate);
                    });

                    if (isPaused) continue;

                    // Get dietary restrictions for active subscribed households
                    const restrictionsResponse = await axios.get(
                        process.env.REACT_APP_API_URL + 'dietary-restrictions/',
                        { params: { household: household.hh_id } }
                    );

                    if (restrictionsResponse.data.length > 0) {
                        householdsWithRestrictions.push({
                            ...household,
                            dietary_restrictions: restrictionsResponse.data
                        });
                    }
                }
                setHouseholds(householdsWithRestrictions);
            }
        } catch (err) {
            setError('Failed to fetch report data');
            console.error(err);
        }
        setIsLoading(false);
    };

    const handleReportTypeChange = (event, newType) => {
        if (newType !== null) {
            setReportType(newType);
        }
    };

    const renderReportContent = () => {
        if (isLoading) return <Typography>Loading...</Typography>;
        if (error) return <Typography color="error">{error}</Typography>;

        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Household Name</TableCell>
                            <TableCell>Restriction Type</TableCell>
                            <TableCell>Servings</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {households.map((household) => (
                            household.dietary_restrictions.map((restriction, index) => (
                                <TableRow key={`${household.hh_id}-${index}`}>
                                    <TableCell>
                                        {`${household.hh_first_name} ${household.hh_last_name}`}
                                    </TableCell>
                                    <TableCell>{restriction.restriction_type}</TableCell>
                                    <TableCell>{restriction.servings}</TableCell>
                                </TableRow>
                            ))
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Dietary Restrictions Report
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={runReport}
                    disabled={isLoading || (reportType === 'weekly' && !selectedDate)}
                >
                    {isLoading ? 'Running...' : 'Run Report'}
                </Button>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <ToggleButtonGroup
                    value={reportType}
                    exclusive
                    onChange={handleReportTypeChange}
                >
                    <ToggleButton value="all">
                        All Households with Restrictions
                    </ToggleButton>
                    <ToggleButton value="weekly">
                        Weekly Schedule
                    </ToggleButton>
                </ToggleButtonGroup>

                {reportType === 'weekly' && (
                    <TextField
                        type="date"
                        label="Select Week Start Date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                )}
            </Box>

            {households.length > 0 ? (
                renderReportContent()
            ) : (
                <Typography variant="body1" color="textSecondary">
                    {isLoading ? 'Loading...' : 'Click "Run Report" to generate the report'}
                </Typography>
            )}
        </Box>
    );
};

export default DietaryRestrictionsReport;
