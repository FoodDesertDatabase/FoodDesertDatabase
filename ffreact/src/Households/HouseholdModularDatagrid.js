import React, { useState } from 'react'
import { useGridApiContext, gridClasses} from '@mui/x-data-grid'
import './HouseholdList.css'
import { Box } from '@mui/material'
import AllergiesList from './AllergiesList';
import NewModularDatagrid from '../components/NewModularDatagrid';
import HouseholdForm from './HouseholdForm.js'

// Packaging List Component
export default function HouseholdModularDatagrid() {

    const AllergyListCell = (params) => {
        return <AllergiesList allergies={params.value} isEditable={false}/>
    }
    const AllergyListEditCell = (params) => {
        const api = useGridApiContext();
        const updateCellValue = (a, b) => {
            const newAllergies = b[0];
            const {id, value, field} = params;
            api.current.setEditCellValue({id, field, value: newAllergies, debounceMs: 200})
        }
        return <AllergiesList allergies={params.value} isEditable={true} updateEditForm={updateCellValue}/>
    }

    const [openPopup, setOpenPopup] = useState(false);
    const [currentRestrictions, setCurrentRestrictions] = useState({});
    const [currentParams, setCurrentParams] = useState(null);

    const handleOpenPopup = (params) => {
        setCurrentRestrictions(params.value || {});
        setCurrentParams(params);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const handleSaveRestrictions = (newRestrictions) => {
        const api = useGridApiContext();
        const { id, field } = currentParams;
        api.current.setEditCellValue({ id, field, value: newRestrictions, debounceMs: 200 });
        handleClosePopup();
    };
    const DietaryRestrictionsCell = (params) => {
        return (
            <Button variant="contained" onClick={() => handleOpenPopup(params)}>
                Edit Restrictions
            </Button>
        );
    };

    const columns = [
        { field: 'hh_name', headerName: 'Name', type: 'string', width: 80, editable: true },
        { field: 'num_adult', headerName: 'Adults', type: 'number', width: 80, editable: true },
        { field: 'num_child_lt_6', headerName: '0-6', type: 'number', width: 80, editable: true },
        { field: 'num_child_gt_6', headerName: '7-17', type: 'number', width: 80, editable: true },
        { field: 'phone', headerName: 'Phone Number', width: 110, type: 'number', editable: true },
        { field: 'street', headerName: 'Street', width: 160, type: 'string', editable: true },
        { field: 'city', headerName: 'City', width: 100, type: 'string', editable: true },
        { field: 'state', headerName: 'State', width: 70, type: 'string', editable: true },
        { field: 'pcode', headerName: 'Zip Code', width: 80, type: 'string', editable: true, /*valueFormatter: (value) => {return value}*/ },
        { field: 'delivery_notes', headerName: 'Delivery Notes', width: 100, editable: true },
       
        { field: 'veg_flag', headerName: 'Veg', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'gf_flag', headerName: 'Gluten Free', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0},
        { field: 'ppMealKit_flag', headerName: 'Part. Prep. M.K.', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'childrenSnacks_flag', headerName: 'Children Snacks', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'foodBox_flag', headerName: 'Food Box', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'rteMeal_flag', headerName: 'RTE Meal', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
        { field: 'hh_allergies', headerName: 'Allergies', width: 100, type: 'string', editable: true, 
            renderCell: AllergyListCell,
            renderEditCell: (params) => <AllergyListEditCell {...params} sx={{height: 'auto', minHeight: 200, maxHeight: 1000}}/>
        },
        { field: 'EBT', headerName: 'EBT', width: 70, type: 'string', editable: true },
        { field: 'paused_flag', headerName: 'Paused', width: 70, type: 'boolean', editable: true, valueParser: (value) => value ? 1 : 0 },
    ]
    
    return(
        <div class='table-div'>
        <h3>Clients</h3>
        <Box sx={{height: '80%'}}>
            <NewModularDatagrid 
                columns={columns} 
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 300} 
                keyFieldName={'hh_name'} 
                apiEndpoint={'households'}
                AddFormComponent={HouseholdForm}>
            </NewModularDatagrid>
        </Box>
        <DietaryRestrictionsPopup
                open={openPopup}
                onClose={handleClosePopup}
                restrictions={currentRestrictions}
                onSave={handleSaveRestrictions}
            />
        </div>
    )
}
