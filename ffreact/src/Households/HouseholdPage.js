import React from 'react'
import { useGridApiContext, GridEditInputCell } from '@mui/x-data-grid'
import './HouseholdList.css'
import { Box, Typography } from '@mui/material'
import AllergiesList from './AllergiesList';
import NewModularDatagrid from '../components/NewModularDatagrid';
import CellDialog from '../components/CellDialog.js';
import HouseholdForm from './HouseholdForm.js';
import DietaryRestrictionsCell from './DietaryRestrictionCell.js';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MenuItem, FormControl, Select, Button } from '@mui/material';
import DietaryRestrictionsEditCellContent from './DietaryRestrictionsEditCell.js';
import axios from 'axios';
import { type } from '@testing-library/user-event/dist/type';
import DietaryRestrictionsList from './DietaryRestrictionsList.js';

// Households/Clients List Component
const fetchDietaryRestrictions = async (householdId) => {
    try {
        const response = await axios({
            method: "GET",
            url: process.env.REACT_APP_API_URL + "dietary-restrictions/",
            params: { household: householdId }
        });
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

export default function HouseholdPage(props) {

    const loginState = props.loginState.isAuthenticated ? props.loginState : {isAuthenticated: false};
    
    const AllergyListCell = (params) => {
        return <AllergiesList allergies={params.value} isEditable={false}/>
    }
    const AllergyListEditCell = (params) => {
        const api = useGridApiContext();
        const updateCellValue = async (a, b) => {
            const newAllergies = b[0];
            const {id, field} = params;
            await api.current.setEditCellValue({id, field, value: newAllergies, debounceMs: 200})
        }
        return <AllergiesList allergies={params.value} isEditable={true} updateEditForm={updateCellValue}/>
    }

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

        // Load existing restrictions when component mounts
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
                
                // Save to dietary restrictions endpoint
                const updatedRestrictions = await updateDietaryRestrictions(params.row.hh_id, newRestrictions);
                
                // Update grid with new data
                params.api.updateRow({
                    ...params.row,
                    restriction_flag: updatedRestrictions.length > 0 ? 1 : 0,
                    dietary_restrictions: updatedRestrictions
                });
                
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

    const columns = [
        { field: 'hh_last_name', headerName: 'Last Name', defaultValue:"Last Name", type: 'string', width: 120, editable: true},
        { field: 'hh_first_name', headerName: 'First Name', defaultValue: 'First Name', type: 'string', width: 120, editable: true},
        { field: 'num_adult', headerName: 'Adults', type: 'number', 
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0,}}/>),
            width: 70, editable: true },
        { field: 'num_child_gt_6', headerName: '7-17',  type: 'number', 
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0,}}/>),
            description: 'Number of children from age 7 to 17', width: 70, editable: true },
        { field: 'num_child_lt_6', headerName: '0-6', type: 'number', 
            renderEditCell: (params) => (<GridEditInputCell {...params} inputProps={{ max: 25, min: 0,}}/>),
            description: 'Number of children from age 0 to 6', width: 70, editable: true },
        { field: 'phone', headerName: 'Phone', defaultValue:'xxx-xxx-xxxx', width: 130, type: 'phone', editable: true },
       
        { field: 'street', headerName: 'Street', width: 160, type: 'string', editable: true },
        { field: 'city', headerName: 'City', width: 100, type: 'string', editable: true },
        { field: 'state', headerName: 'State', width: 50, type: 'string', editable: true },
        { field: 'pcode', headerName: 'Zip Code', width: 80, type: 'string', editable: true, /*valueFormatter: (value) => {return value}*/ },
        { field: 'ebt', headerName: 'EBT', width: 120, type: 'string', editable: true },
        { field: 'ebt_refill_date', headerName: 'EBT Refill Date', width: 150, type: 'day', editable: true },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 150, editable: true },
        { field: 'ppMealKit_flag', headerName: 'Part. Prep. M.K.', width: 150, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'childrenSnacks_flag', headerName: 'Children Snacks', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'foodBox_flag', headerName: 'Food Box', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'rteMeal_flag', headerName: 'RTE Meal', width: 100, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'veg_flag', headerName: 'Veg', width: 70, type: 'boolean', description: 'Vegetarian', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 70, type: 'boolean', description: 'Gluten Free', editable: true, valueParser: (value) => value ? 1 : 0},
        { 
            field: 'dietary_restrictions', 
            headerName: 'Dietary Restrictions', 
            width: 200, 
            editable: true,
            renderCell: (params) => {
                if (params.row.restriction_flag === 1) {
                    return <CellDialog 
                        buttonText={'View Restrictions'} 
                        dialogTitle={'Dietary Restrictions'} 
                        component={<DietaryRestrictionsList restrictions={params.value} isEditable={false}/>}
                    />;
                } else {
                    return <Typography variant='p'>No Restrictions</Typography>;
                }
            },
            renderEditCell: (params) => 
                <CellDialog 
                    buttonText={'Edit Restrictions'} 
                    dialogTitle={'Edit Restrictions'} 
                    component={<DietaryRestrictionsListEditCell {...params}/>}
                />
        },
        { field: 'hh_allergies', headerName: 'Allergies', width: 130, type: 'string', editable: true, 
            renderCell: (params) => {
                if (params.value && params.value.length > 0) {
                    return <CellDialog buttonText={'View Allergies'} dialogTitle={'Allergies'} component={<AllergyListCell {...params}/>}/>
                }
                else {
                    return <Typography variant='p'>No Allergies</Typography>
                }
            },
            renderEditCell: (params) => <CellDialog buttonText={'Edit Allergies'} dialogTitle={'Edit Allergies'} component={<AllergyListEditCell {...params} sx={{height: 'auto', minHeight: 200, maxHeight: 1000}}/>}/>
        },
        { field: 'paused_flag', headerName: 'Paused', width: 70, type: 'boolean', editable: true, valueParser: (value) => {return value ? 1 : 0} },
        { field: 'paying', headerName: 'Paying', width: 70, type: 'boolean', editable: true, valueParser: (value) => {return value ? 1 : 0} },
        { field: 'hh_bags_or_crates', headerName: 'Bags or Crates', defaultValue:"bags", width: 120, editable: true, 
        renderEditCell: (params) => 
            {    let api = useGridApiContext();
                return (
            
            <FormControl fullWidth>
              <Select
                value={params.value}

                onChange={(event) => {
                  const newValue = event.target.value;
                  // Implement your logic to update the data here, e.g., via an API call
                  // Example:
                  // updateData(params.id, params.field, newValue);

                  //console.log(event, newValue, params)
                  console.log(newValue);

                  const handleChange = async (event) => {
                    await api.current.setEditCellValue({id: params.id, field: 'hh_bags_or_crates', value: newValue});
                    
                    //await api.current.commitRowChange(params.id);
                    console.log(newValue);
                }
                handleChange(newValue, params.id);
                
            }}
              >
                <MenuItem value="bags">Bags</MenuItem>
                <MenuItem value="crates">Crates</MenuItem>
              </Select>
            </FormControl>)
          }}
    ]
    
    const columnGroupingModel = [
        { field: 'hh_first_name' }, { field: 'hh_last_name'},
        {
            groupId: 'ages',
            headerName: 'Member Ages',
            description: 'Number of members per household in each age range',
            children: [{ field: 'num_adult' }, { field: 'num_child_gt_6' }, { field: 'num_child_lt_6' }],
        },
        {
            groupId: 'contact_details',
            headerName: 'Contact Details',
            children: [{field: 'phone' }, { field: 'sms_flag'}]
        },
        {
            groupId: 'contact',
            headerName: 'Address',
            children: [{ field: 'street' }, { field: 'city' }, { field: 'state' }, { field: 'pcode' }],
        },
        { field: 'delivery_notes'},
        {
            groupId: 'diet',
            headerName: 'Dietary Requirements',
            children:[{ field: 'veg_flag' }, { field: 'gf_flag'}, { field: 'hh_allergies'}]
        },
        {
            groupId: 'services',
            headerName: 'Services',
            children: [{ field: 'ppMealKit_flag' }, { field: 'childrenSnacks_flag'}, { field: 'foodBox_flag'}, { field: 'rteMeal_flag'}]
        },
        { field: 'paused_flag' }, { field: 'paying'}
    ];

    return(
        <div class='table-div'>
        <Typography id='page-header' variant='h5'>Clients</Typography>
        <Box sx={{height: '70vh'}}>
            
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
            >
               
                  
            </NewModularDatagrid>
        </Box>
        </div>
    )
}