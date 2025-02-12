import React, { useState, useEffect, Fragment } from 'react';
import { Table, TableBody, TableRow, TableCell, Button, TableContainer, Paper } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid';

const DietaryRestrictionsEditCellContent = ({ id, value, field, handleSave }) => {
    const apiRef = useGridApiContext();
    const [dietaryRestrictions, setDietaryRestrictions] = useState(value || {});
    const [currRestriction, setCurrRestriction] = useState({ type: '', servings: 0 });

    useEffect(() => {
        setDietaryRestrictions(value || {});
    }, [value]);

    const handleRestrictionChange = (event) => {
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const newRestriction = { ...currRestriction, [fieldName]: fieldValue };
        setCurrRestriction(newRestriction);
    };

    const handleAddRestriction = (event) => {
        event.preventDefault();
        const newDietaryRestrictions = { ...dietaryRestrictions, [currRestriction.type]: currRestriction.servings };
        setDietaryRestrictions(newDietaryRestrictions);
        setCurrRestriction({ type: '', servings: 0 });
        updateEditForm(newDietaryRestrictions);
    };

    const handleDeleteRestriction = (type) => {
        const newDietaryRestrictions = { ...dietaryRestrictions };
        delete newDietaryRestrictions[type];
        setDietaryRestrictions(newDietaryRestrictions);
        updateEditForm(newDietaryRestrictions);
    };

    const updateEditForm = (newDietaryRestrictions) => {
        apiRef.current.setEditCellValue({ id, field, value: newDietaryRestrictions });
    };

    const saveChanges = () => {
        console.log('Saving changes:', dietaryRestrictions);
        handleSave(dietaryRestrictions);
    };

    return (
        <Fragment>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {Object.entries(dietaryRestrictions).map(([type, servings], index) => (
                            <Fragment key={index}>
                                <TableRow>
                                    <TableCell>{type}</TableCell>
                                    <TableCell>{servings} servings</TableCell>
                                    <TableCell>
                                        <Button variant='contained' size='small' onClick={() => handleDeleteRestriction(type)}>
                                            delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        ))}
                        <TableRow>
                            <TableCell>
                                <input name="type" type="text" onChange={handleRestrictionChange} value={currRestriction.type} />
                            </TableCell>
                            <TableCell>
                                <input name="servings" type="number" onChange={handleRestrictionChange} value={currRestriction.servings} />
                            </TableCell>
                            <TableCell>
                                <Button variant='contained' size='small' onClick={handleAddRestriction}>
                                    Add
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button onClick={saveChanges} color="primary">Save</Button>
        </Fragment>
    );
};

export default DietaryRestrictionsEditCellContent;