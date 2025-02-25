import React, { useState, useEffect } from 'react';
import { useGridApiContext, GridEditInputCell } from '@mui/x-data-grid';
import './HouseholdList.css';
import { Box, Typography, MenuItem, FormControl, Select, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, Paper, ListItem, ListItemText} from '@mui/material';
import axios from 'axios';
import NewModularDatagrid from '../components/NewModularDatagrid';
import CellDialog from '../components/CellDialog.js';
import HouseholdForm from './HouseholdForm.js';
import Datelist from './Datelist';
import DietaryRestrictionsEditCellContent from './DietaryRestrictionsEditCell.js';
import DietaryRestrictionsList from './DietaryRestrictionsList.js';

export default function HouseholdPage(props) {
    const loginState = props.loginState.isAuthenticated ? props.loginState : { isAuthenticated: false };
    const [households, setHouseholds] = useState([]);
    const [pausedDates, setPausedDates] = useState({});
    const [selectedHousehold, setSelectedHousehold] = useState(null);
    const [showDatelist, setShowDatelist] = useState(false);
    const [showPausedDatesDialog, setShowPausedDatesDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const apiUrl = `${process.env.REACT_APP_API_URL}households/`;
    const datelistApiUrl = `${process.env.REACT_APP_API_URL}datelist/`;

// Households/Clients List Component
const fetchDietaryRestrictions = async (householdId) => {
    try {
        const response = await axios({
            method: "GET",
            url: process.env.REACT_APP_API_URL + "dietary-restrictions/",
            params: { household: householdId }
        });
        console.log('Fetched restrictions for household', householdId, ':', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching dietary restrictions:', error);
        return [];
    }
};

const updateDietaryRestrictions = async (householdId, dietaryRestrictions) => {
    try {
        // First, get existing restrictions
        const existingRestrictions = await fetchDietaryRestrictions(householdId);
        
        // Create sets of IDs to track what needs to be deleted, updated, or created
        const existingIds = new Set(existingRestrictions.map(r => r.id));
        const keepIds = new Set(dietaryRestrictions.filter(r => r.id).map(r => r.id));
        
        // Delete restrictions that are no longer needed
        const deletePromises = existingRestrictions
            .filter(r => !keepIds.has(r.id))
            .map(r => axios({
                method: "DELETE",
                url: process.env.REACT_APP_API_URL + `dietary-restrictions/${r.id}/`,
            }));
        
        await Promise.all(deletePromises);
        
        // Process each new/updated restriction
        const updatePromises = dietaryRestrictions.map(restriction => {
            const data = {
                household: householdId,
                restriction_type: restriction.restriction_type,
                servings: restriction.servings
            };
            
            // If restriction has an ID, update it, otherwise create new
            if (restriction.id && existingIds.has(restriction.id)) {
                return axios({
                    method: "PUT",
                    url: process.env.REACT_APP_API_URL + `dietary-restrictions/${restriction.id}/`,
                    data: data
                });
            } else {
                return axios({
                    method: "POST",
                    url: process.env.REACT_APP_API_URL + 'dietary-restrictions/',
                    data: data
                });
            }
        });

        await Promise.all(updatePromises);
        return await fetchDietaryRestrictions(householdId);
    } catch (error) {
        console.error('Error updating dietary restrictions:', error);
        return [];
    }
};

const getRowId = (row) => row.hh_id;

    useEffect(() => {
        // Fetch households
        const fetchHouseholds = async () => {
            try {
                const response = await axios.get(apiUrl);
                setHouseholds(response.data);
            } catch (error) {
                alert('Error fetching households');
            }
        };

        // Fetch paused dates for all households
        const fetchPausedDates = async () => {
            try {
                const response = await axios.get(datelistApiUrl);
                const pausedDatesMap = response.data.reduce((acc, date) => {
                    if (!acc[date.hh_id]) {
                        acc[date.hh_id] = [];
                    }
                    acc[date.hh_id].push(date);
                    return acc;
                }, {});
                setPausedDates(pausedDatesMap);
            } catch (error) {
                alert('Error fetching paused dates');
            }
        };

        fetchHouseholds();
        fetchPausedDates();
    }, [apiUrl, datelistApiUrl]);

    const Datelistcell = (params) => {
        return <Datelist dates={params.value} isEditable={false} />;
    };

    const DatelistCellEdit = (params) => {
        const api = useGridApiContext();
        const updateCellValue = (newDates) => {
            const { id, field } = params;
            api.current.setEditCellValue({
                id,
                field,
                value: newDates,
                debounceMs: 200,
            });
        };
        return <Datelist dates={params.value} isEditable={true} updateEditForm={updateCellValue} />;
    };

    const renderPausedCell = (params) => {
        const hhPausedDates = pausedDates[params.row.hh_id] || [];
        const isPaused = hhPausedDates.length > 0;
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    color={isPaused ? 'error' : 'success'}
                    size="small"
                    onClick={() => handlePausedDatesClick(params.row.hh_id)}
                    style={{ marginRight: '8px' }}
                >
                    {isPaused ? 'Paused' : 'Active'}
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleEditPausedDatesClick(params.row.hh_id)}
                >
                    Edit
                </Button>
            </div>
        );
    };

    const handlePausedDatesClick = (hh_id) => {
        setSelectedHousehold(households.find(household => household.hh_id === hh_id));
        setShowPausedDatesDialog(true);
    };

    const handleEditPausedDatesClick = (hh_id) => {
        setSelectedHousehold(households.find(household => household.hh_id === hh_id));
        setShowDatelist(true);
    };

    const handleEditClick = (household, dateId = null) => {
        setSelectedHousehold(household);
        setShowDatelist(true);
        setSelectedId(dateId);
    };

    const handleCancelClick = () => {
        setShowDatelist(false);
        setSelectedHousehold(null);
    };

    const handleDataUpdate = (updatedData) => {
        setPausedDates((prev) => ({
            ...prev,
            [updatedData.hh_id]: [...(prev[updatedData.hh_id] || []), updatedData],
        }));
        setShowDatelist(false);
    };

    const handleDeleteAllDates = async (hh_id) => {
        if (window.confirm('Are you sure you want to delete all paused dates for this household?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}household/${hh_id}/delete_all_dates/`);
                setPausedDates((prev) => ({
                    ...prev,
                    [hh_id]: [],
                }));
                setShowPausedDatesDialog(false);
            } catch (error) {
                alert('Error deleting all dates');
            }
        }
    };

    const DietaryRestrictionsEditCell = (params) => {
        const [open, setOpen] = React.useState(false);
        const handleClickOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };

        const handleSave = async (dietaryRestrictions) => {
            try {
                console.log('handleSave called with:', dietaryRestrictions);
                const updatedRestrictions = await updateDietaryRestrictions(params.row.hh_id, dietaryRestrictions);
                
                // Create a new row object that includes all existing data plus the updated restrictions
                const updatedRow = {
                    ...params.row,
                    hh_id: params.row.hh_id,  // Ensure the ID is included
                    dietary_restrictions: updatedRestrictions
                };

                // Update the grid with the complete row data
                params.api.updateRow(updatedRow);
                handleClose();
            } catch (error) {
                console.error('Error updating dietary restrictions:', error);
            }
        };

        return (
            <>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Edit Dietary Restrictions
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Edit Dietary Restrictions</DialogTitle>
                    <DialogContent>
                        <DietaryRestrictionsEditCellContent {...params} handleClose={handleClose} handleSave={handleSave} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };

    // Fix the naming conflict - rename the component to avoid naming collision
    const DietaryRestrictionsDisplay = (params) => {
        const [loadedRestrictions, setLoadedRestrictions] = React.useState([]);

        React.useEffect(() => {
            const loadRestrictions = async () => {
                try {
                    const restrictions = await fetchDietaryRestrictions(params.row.hh_id);
                    setLoadedRestrictions(restrictions);
                } catch (error) {
                    console.error('Error loading restrictions:', error);
                }
            };
            loadRestrictions();
        }, [params.row.hh_id]);

        return <DietaryRestrictionsList restrictions={loadedRestrictions} isEditable={false}/>;
    }

    const DietaryRestrictionsListEditCell = (params) => {
        const api = useGridApiContext();
        const [currentRestrictions, setCurrentRestrictions] = React.useState([]);

        React.useEffect(() => {
            const loadExistingRestrictions = async () => {
                try {
                    const restrictions = await fetchDietaryRestrictions(params.row.hh_id);
                    setCurrentRestrictions(restrictions);
                } catch (error) {
                    console.error('Error loading restrictions:', error);
                }
            };
            loadExistingRestrictions();
        }, [params.row.hh_id]);

        const updateCellValue = async (names, values) => {
            try {
                const newRestrictions = values[0];
                const updatedRestrictions = await updateDietaryRestrictions(params.row.hh_id, newRestrictions);
                
                // Update the grid data
                const updatedRow = {
                    ...params.row,
                    dietary_restrictions: updatedRestrictions
                };
                params.api.updateRow(updatedRow);
                
                // Update local state
                setCurrentRestrictions(updatedRestrictions);
            } catch (error) {
                console.error('Error updating restrictions:', error);
            }
        };

        return <DietaryRestrictionsList 
            restrictions={currentRestrictions} 
            isEditable={true} 
            updateEditForm={updateCellValue}
            householdId={params.row.hh_id}
        />;
    }

    // Add a new component to handle async loading
    const DietaryRestrictionsCell = (params) => {
        const [restrictions, setRestrictions] = React.useState([]);
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
            const loadRestrictions = async () => {
                try {
                    const data = await fetchDietaryRestrictions(params.row.hh_id);
                    setRestrictions(data);
                } catch (error) {
                    console.error('Error loading restrictions:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            loadRestrictions();
        }, [params.row.hh_id]);

        if (isLoading) {
            return <Typography>Loading...</Typography>;
        }

        if (restrictions && restrictions.length > 0) {
            return (
                <CellDialog 
                    buttonText={'View Restrictions'} 
                    dialogTitle={'Dietary Restrictions'} 
                    component={<DietaryRestrictionsList 
                        restrictions={restrictions} 
                        isEditable={false}
                    />}
                />
            );
        }
        return <Typography variant='p'>No Restrictions</Typography>;
    };

    const columns = [
        { field: 'hh_last_name', headerName: 'Last Name', defaultValue: "Last Name", type: 'string', width: 120, editable: true },
        { field: 'hh_first_name', headerName: 'First Name', defaultValue: 'First Name', type: 'string', width: 120, editable: true },
        { field: 'num_adult', headerName: 'Adults', type: 'number', renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0, }} />), width: 70, editable: true },
        { field: 'num_child_gt_6', headerName: '7-17', type: 'number', renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0, }} />), description: 'Number of children from age 7 to 17', width: 70, editable: true },
        { field: 'num_child_lt_6', headerName: '0-6', type: 'number', renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0, }} />), description: 'Number of children from age 0 to 6', width: 70, editable: true },
        { field: 'phone', headerName: 'Phone', defaultValue: 'xxx-xxx-xxxx', width: 130, type: 'phone', editable: true },
        { field: 'street', headerName: 'Street', width: 160, type: 'string', editable: true },
        { field: 'city', headerName: 'City', width: 100, type: 'string', editable: true },
        { field: 'state', headerName: 'State', width: 50, type: 'string', editable: true },
        { field: 'pcode', headerName: 'Zip Code', width: 80, type: 'string', editable: true },
        { field: 'pcode', headerName: 'Zip Code', width: 80, type: 'string', editable: true, /*valueFormatter: (value) => {return value}*/ },
        { field: 'ebt', headerName: 'EBT', width: 120, type: 'string', editable: true },
        { field: 'ebt_refill_date', headerName: 'EBT Refill Date', width: 150, type: 'day', editable: true },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 150, editable: true },
        { field: 'ppMealKit_flag', headerName: 'Part. Prep. M.K.', width: 150, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'childrenSnacks_flag', headerName: 'Children Snacks', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'foodBox_flag', headerName: 'Food Box', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'rteMeal_flag', headerName: 'RTE Meal', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        
        { 
            field: 'dietary_restrictions', 
            headerName: 'Dietary Restrictions', 
            width: 200, 
            editable: true,
            // Replace the async renderCell with our new component
            renderCell: (params) => <DietaryRestrictionsCell {...params} />,
            renderEditCell: (params) => {
                return <CellDialog 
                    buttonText={'Edit Restrictions'} 
                    dialogTitle={'Edit Restrictions'} 
                    component={<DietaryRestrictionsListEditCell {...params}/>}
                />;
            }
        },
        
        {
            field: 'paused_flag', headerName: 'Paused', width: 200, type: 'string', editable: false,
            renderCell: renderPausedCell
        },
        { field: 'paying', headerName: 'Paying', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'hh_bags_or_crates', headerName: 'Bags or Crates', defaultValue: "bags", width: 120, editable: true,
            renderEditCell: (params) => {
                let api = useGridApiContext();
                return (
                    <FormControl fullWidth>
                        <Select
                            value={params.value}
                            onChange={(event) => {
                                const newValue = event.target.value;
                                const handleChange = async (event) => {
                                    await api.current.setEditCellValue({ id: params.id, field: 'hh_bags_or_crates', value: newValue });
                                }
                                handleChange(newValue, params.id);
                            }}
                        >
                            <MenuItem value="bags">Bags</MenuItem>
                            <MenuItem value="crates">Crates</MenuItem>
                        </Select>
                    </FormControl>
                )
            }
        }
    ];

    const columnGroupingModel = [
        { field: 'hh_first_name' }, { field: 'hh_last_name' },
        {
            groupId: 'ages',
            headerName: 'Member Ages',
            description: 'Number of members per household in each age range',
            children: [{ field: 'num_adult' }, { field: 'num_child_gt_6' }, { field: 'num_child_lt_6' }],
        },
        {
            groupId: 'contact_details',
            headerName: 'Contact Details',
            children: [{ field: 'phone' }, { field: 'sms_flag' }]
        },
        {
            groupId: 'contact',
            headerName: 'Address',
            children: [{ field: 'street' }, { field: 'city' }, { field: 'state' }, { field: 'pcode' }],
        },
        { field: 'delivery_notes' },
        {
            groupId: 'diet',
            headerName: 'Dietary Requirements',
            children: [{ field: 'veg_flag' }, { field: 'gf_flag' }, { field: 'hh_allergies' }]
        },
        {
            groupId: 'services',
            headerName: 'Services',
            children: [{ field: 'ppMealKit_flag' }, { field: 'childrenSnacks_flag' }, { field: 'foodBox_flag' }, { field: 'rteMeal_flag' }]
        },
        { field: 'paused_flag' }, { field: 'paying' }
    ];

    return (
        <div className='table-div'>
            <Typography id='page-header' variant='h5'>Clients</Typography>
            <Box sx={{ height: '70vh' }}>
                <NewModularDatagrid
                    loginState={loginState}
                    columns={columns}
                    columnGroupingModel={columnGroupingModel}
                    getRowHeight={() => 'auto'}
                    getEstimatedRowHeight={() => 300}
                    keyFieldName={'hh_id'}
                    apiEndpoint={'households'}
                    entryName={'Client'}
                    searchField={'hh_last_name'}
                    searchLabel={'Client Names'}
                    AddFormComponent={HouseholdForm}
                    experimentalFeatures={{ columnGrouping: true }}
                    getRowId={getRowId}
                />
                
                <Dialog
                open={showDatelist}
                onClose={handleCancelClick}
                maxWidth="md"
                fullWidth>
                <DialogTitle>Edit Dates</DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                {selectedHousehold && (
                     <Datelist hh_id={selectedHousehold.hh_id} handleDataUpdate={handleDataUpdate} onSaveSuccess={() => setShowDatelist(false)} selectedId={selectedId} handleCancelClick={handleCancelClick}/>
                )}
                </DialogContent>
                </Dialog>

                <Dialog
                open={showPausedDatesDialog}
                onClose={() => setShowPausedDatesDialog(false)}
                maxWidth="sm"
                fullWidth
                >
                <DialogTitle>Paused Duration</DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {selectedHousehold && pausedDates[selectedHousehold.hh_id] ? (
                        <List>
                            {pausedDates[selectedHousehold.hh_id].map((date, index) => (
                                <Paper key={index} sx={{ p: 2, mb: 1, borderRadius: 2 }}>
                                    <ListItem sx={{ display: 'flex', justifyContent: 'unset' }}>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" >
                                                  Duration: {date.pause_start_date} --- {date.pause_end_date}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                </Paper>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No paused dates available.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{p: 2 }}>
                    <Button onClick={() => setShowPausedDatesDialog(false)} variant="contained" color="secondary">
                        Close
                    </Button>
                    <Button onClick={() => handleDeleteAllDates(selectedHousehold.hh_id)} variant="contained" color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            </Box>
        </div>
    );
}