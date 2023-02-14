import React, {Fragment, useState, useEffect, Suspense} from 'react'
import axios from 'axios'
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid'
import { Box } from '@mui/system';
import { wait } from '@testing-library/user-event/dist/utils';
import './PackagingList.css'

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
  
  const usdPrice = {
    type: 'number',
    width: 80,
    valueFormatter: ({ value }) => currencyFormatter.format(value),
    cellClassName: 'font-tabular-nums',
};

// Packaging List Component
export default function PackagingPage() {
    
    const [packaging, setPackaging] = useState([]);
    const columns = [
        { field: 'package_type', headerName: 'Packaging Type', width: 150 },
        { field: 'unit', headerName: 'Unit', width: 6 },
        { field: 'qty_holds', headerName: 'Size', width: 5 },
        { field: 'returnable', headerName: 'Returnable', width: 90, type: 'boolean' },
        { field: 'unit_cost', headerName: 'Unit Cost', width: 90, valueFormatter: ({ value }) => currencyFormatter.format(value) },
        { field: 'pref_psupplier', headerName: 'Supplier', width: 80, valueFormatter: ({ value }) => value.s_name },
        { field: 'in_date', headerName: 'Purchase Date', width: 120, type: 'date' },
        { field: 'in_qty', headerName: 'Purchased Amount', width: 140 },
        { field: 'tmp_1', headerName: 'Date Used', width: 100, type: 'date', editable: true },
        { field: 'tmp_2', headerName: 'Units Used', width: 100, type: 'number', editable: true }
    ]

    useEffect(() => {
        getDBPackaging();
    }, []);

    const getDBPackaging = () => {
        axios({
            method: "GET",
            url:"http://4.236.185.213:8000/api/packaging-inventory"
        }).then((response)=>{
        setPackaging(response.data);
        }).catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }

    const handleRowClick = (params) => {
        getDBPackaging(params.row.p_id);
        wait(300);
        console.log(packaging);
    }

    if (packaging === undefined) {
        return (
            <>loading...</>
        )
    }
    // The HTML structure of this component
    
    return(
        <div class='table-div'>
        <h3>Packaging</h3>
        <Box sx={{height: '80vh'}}>
            <DataGrid 
            onRowClick={handleRowClick} 
            rows={packaging} 
            columns={columns} 
            getRowId={(row) => row.p_id}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}>
            </DataGrid>
        </Box>
        </div>
    )
}
