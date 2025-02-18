import React, { useState } from 'react';
import { AppBar, Button, Typography, Toolbar, Tabs, Grid} from "@mui/material"
import Dropdown from './Dropdown'

const styles = {
  hideOnPrint: {
  '@media print': {
    display: 'none'
  }
} 
}

// const PAGES = ["Landing Page", "Clients", "Households", "Inventory", "Meals", "Reports", "Administration"]
// console.log(PAGES)
  const Navbar = (props) => {
  const [value, setValue] = useState();
  // const theme = useTheme();
  // console.log(theme);
  // const isMatch = useMediaQuery(theme.breakpoints.down(""))
  // console.log(isMatch)
  const loginState = props.loginState;
  const handleLogout = props.handleLogout;

  const displayLoginSignup = () => {
    if (loginState.isAuthenticated) {
      return (
        <Grid item>
          <Button color='lightGreen' sx={{boxShadow: '0'}} variant='contained' onClick={() => handlePageClick('userPage')}>My Account</Button>
          <Button color='lightGreen' sx={{boxShadow: '0'}} variant='contained' onClick={handleLogout}>Sign Out</Button>
        </Grid>
      )
    }
    else {
      return (
        <Grid item>
            <Button color='lightGreen' sx={{boxShadow:'0'}} variant="contained" onClick={() => handlePageClick('loginPage')
            }>Login{""}</Button>
            <Button color='lightGreen' sx={{boxShadow:'0'}} variant="contained" onClick={() => handlePageClick('newUserPage')}>Sign Up{""}</Button>
        </Grid>
      )
    }
  }

  const handlePageClick = props.handlePageClick;
  return (
    <React.Fragment>
      {/* #9AB847 */}
      <AppBar sx={{...styles.hideOnPrint, background: '#9AB847'}}>
        <Toolbar>
        <Tabs
          value={value}
          onChange={(e, value) => setValue(value)}
        >
        </Tabs>
      
        <Grid container justifyContent='space-between' alignItems='center' direction='row'>
          <Grid item sx={{width: '70%'}} container alignItems='center' direction='row'>
            <Typography component='img' sx={{width: '7%'}} src={process.env.REACT_APP_SITE_IMAGE_URL + "ff_logo.jpg"} onClick = {() => handlePageClick('landingPage')}/>
            <Button color='lightGreen' sx={{boxShadow:'0'}} variant='contained' onClick={() => handlePageClick('households')}>
                Clients
            </Button>
            <Dropdown
            trigger={<Button color='lightGreen' sx={{boxShadow:'0'}} variant='contained'> Inventory </Button>}
            menu={[
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ingredientPage')}>
                    Ingredients</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ingredientDefPage')}>
                    Ingredient Definitions</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('packagingPage')}>
                    Packaging</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('packagingDefPage')}>
                    Packaging Definitions</Button>
                ]}/>
            <Dropdown
            trigger={<Button color='lightGreen' sx ={{boxShadow: '0'}} variant='contained'> Meals </Button>}
            menu={[
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('meals')}>
                    Meal Plans</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('recipePage')}>
                    Recipes</Button>
                ]}/>
            <Dropdown
            sx={{ alignItems: 'left' }}
            trigger={<Button color='lightGreen' sx={{boxShadow: '0'}} variant='contained'> Reports </Button>}
            menu={[
              <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('cost-totals')}>
                    Cost Totals</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('households-report')}>
                    Clients Report</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ingredients-report')}>
                    Ingredients Report</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ing-purchase-report')}>
                    Ingredient Purchasing</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ing-def-report')}>
                    Ingredient Definitions</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ingredient-management-report')}>
                    Ingredient Management</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('meal-history-report')}>
                    Meal History</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('meal-plan-report')}>
                    Meal Plan Report</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('packaging-report')}>
                    Packaging Report</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('pack-purchase-report')}>
                    Package Purchasing</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('packaging-return-report')}>
                    Packaging Returns</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('recipe-ing-report')}>
                    Recipe Ingredients</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('recipe-packaging-report')}>
                    Recipe Packaging</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('individual-household-product-report')}>
                    Individual Household Product</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('view-paused-dates')}>
                    Paused Dates Report</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('show-servings-report')}>
                    Total Servings Rport</Button>    
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('ebt-reports')}>
                    EBT Reports</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('product-report')}>
                    Product Report</Button>,
                <Button ref={props.ref} type="button" sx={{justifyContent: 'left', "&.MuiButton-text": { color:'black'}}} onClick={() => handlePageClick('dietary-restrictions-report')}>
                    Dietary Restrictions Report</Button>
                ]}/>
            <Button color='lightGreen' sx={{boxShadow:'0'}} variant="contained" onClick={() => handlePageClick('userList')}>
                Administration
            </Button>
          </Grid>
          {displayLoginSignup()}
        </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}


export default Navbar;
