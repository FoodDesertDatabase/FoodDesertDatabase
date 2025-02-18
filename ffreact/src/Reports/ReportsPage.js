import React, { useState } from 'react'
import { Button, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Dropdown from '../components/Dropdown'

import HouseholdsReport from './HouseholdsReport.js'
import IngredientsReport from './IngredientsReport.js'
import PackagingReport from './PackagingReport.js'
import PackagingPurchaseReport from './PackagingPurchaseReport.js'
import PackagingReturns from './PackagingReturns.js'
import MealPlanReport from './MealPlanReport.js'
import MealHistory from './MealHistoryReport.js'
import CostTotals from './CostTotals.js'
import IndividualHouseholdProductReport from './IndividualHouseholdProductReport'
import ViewPausedDates from './ViewPausedDates'

const theme = createTheme({
    palette: {
        lightGreen: {
            main: '#9AB847', // light green logo color
            contrastText: '#fff'
        },
        darkGreen: {
            main: '#093B31',
            contrastText: '#fff'
        },
        lightBlue: {
            main: '#3E8477',
            contrastText: '#fff'
        },
        lightOrange: {
            main: '#A35426',
            contrastText: '#fff'
        },
        darkBlue: {
            main: '#070D3A',
            contrastText: '#fff'
        }
    }
})

const style = {
    padding: '10px',
    border: '1px solid black',
    display: 'flex-box',
    justifyContent: 'space-between',
};

const ReportsPage = (props) => {
    const [currPage, setCurrPage] = useState();
    
    const handlePageClick = (pageName) => {
        console.log(pageName)
        if (pageName === 'cost-totals') setCurrPage(<CostTotals handlePageClick={handlePageClick} />);
        if (pageName === 'households-report') setCurrPage(<HouseholdsReport handlePageClick={handlePageClick} />);
        if (pageName === 'ingredients-report') setCurrPage(<IngredientsReport handlePageClick={handlePageClick} />);
        if (pageName === 'meal-history') setCurrPage(<MealHistory handlePageClick={handlePageClick} />);
        if (pageName === 'meal-plan-report') setCurrPage(<MealPlanReport handlePageClick={handlePageClick} />);
        if (pageName === 'packaging-report') setCurrPage(<PackagingReport handlePageClick={handlePageClick} />);
        if (pageName === 'packaging-returns') setCurrPage(<PackagingReturns handlePageClick={handlePageClick} />);
        if (pageName === 'individual-household-product-report') setCurrPage(<IndividualHouseholdProductReport handlePageClick={handlePageClick} />);
        if (pageName === 'pack-purchase-report') setCurrPage(<PackagingPurchaseReport handlePageClick={handlePageClick} />);
        if (pageName === 'view-paused-dates') setCurrPage(<ViewPausedDates handlePageClick={handlePageClick}/>);
    }

    // HTML structure of this component
    return (
        <ThemeProvider theme={theme}>
        <div style={style}>
        <CssBaseline />
        <Dropdown
            trigger={<Button color='lightGreen' variant='contained'>Generate Report</Button>}
            menu={[
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                    Cost Totals</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                    Households Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('ingredients-report')}>
                    Ingredients Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                    Meal History</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                    Meal Plan Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('household-report')}>
                    Packaging Purchase Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('packaging-report')}>
                    Packaging Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                    Packaging Returns</button>,
                 <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('households-report')}>
                    PackagePurchasing Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('individual-household-product-report')}>
                    Individual Household Product Report</button>,
                <button color='lightGreen' ref={props.ref} type="button" onClick={() => handlePageClick('view-paused-dates')}>
                    View Paused Dates</button>,
                ]}/>
            {currPage}
        </div>
        </ThemeProvider>
     );
}

export default ReportsPage;