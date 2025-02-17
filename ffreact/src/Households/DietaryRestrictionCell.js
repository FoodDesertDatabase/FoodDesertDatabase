import React, { Fragment } from 'react';
import { Typography } from '@mui/material';

const DietaryRestrictionsCell = ({ value }) => {
    const dietaryRestrictions = value || {};

    return (
        <Fragment>
            <table>
                <tbody>
                    {Object.entries(dietaryRestrictions).map(([type, servings], index) => (
                        <Fragment key={index}>
                            <tr>
                                <td>
                                    <Typography variant="body2">
                                        {type} - {servings} servings
                                    </Typography>
                                </td>
                            </tr>
                        </Fragment>
                    ))}
                    {Object.keys(dietaryRestrictions).length === 0 && (
                        <tr>
                            <td>
                                <Typography variant="body2">
                                    No Restrictions
                                </Typography>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Fragment>
    );
};

export default DietaryRestrictionsCell;