import { Fragment } from "react";
import { useState, useEffect } from 'react';
import React from 'react';
import { Table, TableBody, TableRow, TableCell, Button, TableContainer, Paper } from "@mui/material";

const DietaryRestrictionsList = (props) => {
    const [restrictions, setRestrictions] = useState(props.restrictions || []);
    const [currRestriction, setCurrRestriction] = useState({ restriction_type: '', servings: '' });
    const [isEditable] = useState(props.isEditable);

    useEffect(() => {
        setRestrictions(props.restrictions || []);
    }, [props.restrictions]);

    const setRestrictionFlag = (restrictionList) => {
        return ['restriction_flag', restrictionList && restrictionList.length > 0 ? 1 : 0];
    };

    const handleRestrictionChange = (event) => {
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;
        setCurrRestriction(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };

    const handleAddRestriction = (event) => {
        event.preventDefault();
        if (!currRestriction.restriction_type || !currRestriction.servings) return;

        const newRestrictions = [...restrictions, currRestriction];
        setRestrictions(newRestrictions);
        setCurrRestriction({ restriction_type: '', servings: '' });

        const ret = setRestrictionFlag(newRestrictions);
        if (props.updateEditForm) {
            props.updateEditForm(['dietary_restrictions', ret[0]], [newRestrictions, ret[1]]);
        }
    };

    const handleDeleteRestriction = (index) => {
        const newRestrictions = restrictions.filter((_, i) => i !== index);
        setRestrictions(newRestrictions);
        
        const ret = setRestrictionFlag(newRestrictions);
        if (props.updateEditForm) {
            props.updateEditForm(['dietary_restrictions', ret[0]], [newRestrictions, ret[1]]);
        }
    };

    if (isEditable) {
        return (
            <Fragment>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            {restrictions.map((restriction, index) => (
                                <TableRow key={index}>
                                    <TableCell>{restriction.restriction_type}</TableCell>
                                    <TableCell>{restriction.servings} servings</TableCell>
                                    <TableCell>
                                        <Button color='error' variant='contained' size='small' 
                                                onClick={() => handleDeleteRestriction(index)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>
                                    <input
                                        name="restriction_type"
                                        type="text"
                                        placeholder="Type"
                                        value={currRestriction.restriction_type}
                                        onChange={handleRestrictionChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <input
                                        name="servings"
                                        type="number"
                                        placeholder="Servings"
                                        value={currRestriction.servings}
                                        onChange={handleRestrictionChange}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button color='primary' variant='contained' size='small' 
                                            onClick={handleAddRestriction}>
                                        Add
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            {restrictions.map((restriction, index) => (
                                <TableRow key={index}>
                                    <TableCell>{restriction.restriction_type}</TableCell>
                                    <TableCell>{restriction.servings} servings</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Fragment>
        );
    }
};

export default DietaryRestrictionsList;
