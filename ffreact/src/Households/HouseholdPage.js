import React, { useState, useEffect } from 'react';
import { useGridApiContext, GridEditInputCell } from '@mui/x-data-grid';
import './HouseholdList.css';
import { Box, Typography, MenuItem, FormControl, Select, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import AllergiesList from './AllergiesList';
import NewModularDatagrid from '../components/NewModularDatagrid';
import CellDialog from '../components/CellDialog.js';
import HouseholdForm from './HouseholdForm.js';
import Datelist from './Datelist';

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

    const AllergyListCell = (params) => {
        return <AllergiesList allergies={params.value} isEditable={false} />;
    };

    const AllergyListEditCell = (params) => {
        const api = useGridApiContext();
        const updateCellValue = (a, b) => {
            const newAllergies = b[0];
            const { id, field } = params;
            api.current.setEditCellValue({ id, field, value: newAllergies, debounceMs: 200 });
        };
        return <AllergiesList allergies={params.value} isEditable={true} updateEditForm={updateCellValue} />;
    };

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
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 150, editable: true },
        { field: 'ppMealKit_flag', headerName: 'Part. Prep. M.K.', width: 150, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'childrenSnacks_flag', headerName: 'Children Snacks', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'foodBox_flag', headerName: 'Food Box', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'rteMeal_flag', headerName: 'RTE Meal', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'veg_flag', headerName: 'Veg', width: 70, type: 'boolean', description: 'Vegetarian', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 70, type: 'boolean', description: 'Gluten Free', editable: true, valueParser: (value) => value ? 1 : 0 },
        {
            field: 'hh_allergies', headerName: 'Allergies', width: 130, type: 'string', editable: true,
            renderCell: (params) => {
                if (params.value && params.value.length > 0) {
                    return <CellDialog buttonText={'View Allergies'} dialogTitle={'Allergies'} component={<AllergyListCell {...params} />} />
                }
                else {
                    return <Typography variant='body2'>No Allergies</Typography>
                }
            },
            renderEditCell: (params) => <CellDialog buttonText={'Edit Allergies'} dialogTitle={'Edit Allergies'} component={<AllergyListEditCell {...params} sx={{ height: 'auto', minHeight: 200, maxHeight: 1000 }} />} />
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
                />
                <Dialog
                    open={showDatelist}
                    onClose={handleCancelClick}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Edit Dates</DialogTitle>
                    <DialogContent>
                        {selectedHousehold && (
                            <Datelist
                                hh_id={selectedHousehold.hh_id}
                                handleDataUpdate={handleDataUpdate}
                                onSaveSuccess={() => setShowDatelist(false)}
                                selectedId={selectedId}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelClick} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => setShowDatelist(false)} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={showPausedDatesDialog}
                    onClose={() => setShowPausedDatesDialog(false)}
                >
                    <DialogTitle>Paused Dates</DialogTitle>
                    <DialogContent>
                        {selectedHousehold && pausedDates[selectedHousehold.hh_id] && pausedDates[selectedHousehold.hh_id].map((date, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography>
                                    {date.pause_start_date} to {date.pause_end_date}: {date.description}
                                </Typography>
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowPausedDatesDialog(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
}  