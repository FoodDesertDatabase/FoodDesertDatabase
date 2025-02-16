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
    ToggleButtonGroup
} from '@mui/material';

const DietaryRestrictionsReport = () => {
    const [reportType, setReportType] = useState('all');
    const [households, setHouseholds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
            }
            // Weekly schedule report will be implemented here later
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
                    disabled={isLoading}
                >
                    {isLoading ? 'Running...' : 'Run Report'}
                </Button>
            </Box>
            
            <ToggleButtonGroup
                value={reportType}
                exclusive
                onChange={handleReportTypeChange}
                sx={{ mb: 3 }}
            >
                <ToggleButton value="all">
                    All Households with Restrictions
                </ToggleButton>
                <ToggleButton value="weekly" disabled>
                    Weekly Schedule (Coming Soon)
                </ToggleButton>
            </ToggleButtonGroup>

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
