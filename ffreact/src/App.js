import CostTotals from './Reports/CostTotals.js'
import EntryPage from './components/EntryPage.js'
import LoginPage from './components/LoginPage.js'
import LandingPage from './components/LandingPage.js'
import MealsPage from './Meals/MealsPage.js'
import InventoryPage from './InventoryPage.js'
import HouseholdForm from './Households/HouseholdForm.js'
import HouseholdPage from './Households/HouseholdPage.js'
import HouseholdsReport from './Reports/HouseholdsReport.js'
import Ingredients from './Ingredients/IngredientList.js'
import IngredientPage from './Ingredients/IngredientPage.js'
import IngredientManagementReport from './Reports/IngredientManagementReport.js'
import IngredientsReport from './Reports/IngredientsReport.js'
import IngPurchaseReport from './Reports/IngPurchaseReport.js'
import StationList from './Stations/StationList.js'
import ReportsPage from "./Reports/ReportsPage.js"
import UserPage from "./User/UserPage.js"
import UserList from "./User/UserList.js"
import NewUserPage from "./User/NewUserPage.js"
import MealPlan from './Meals/MealList.js'
import MealPlanReport from './Reports/MealPlanReport.js'
import MealHistoryReport from './Reports/MealHistoryReport.js'
import Packaging from './Packaging/PackagingList.js'
import PackagingPage from './Packaging/PackagingPage.js'
import PackagingReport from './Reports/PackagingReport.js'
import PackagingReturns from './Reports/PackagingReturns.js'
import PackagingPurchaseReport from './Reports/PackagingPurchaseReport.js'
import RecipeIngredientReport from './Reports/RecipeIngredientReport.js'
import PwResetPage from './components/PwResetPage.js'
import Recipe from './Recipe/RecipeList.js'
import RecipePage from './Recipe/RecipePage.js'
import UnderConstruction from './components/UnderConstruction.js'
import Navbar from './components/Navbar.js'
import React, { useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate, createSearchParams, HashRouter } from 'react-router-dom'
import { useState } from 'react'
import { Box } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
// import { useOutsideClick} from './components/Dropdown'
import './App.css';
import IngredientDefinitionPage from './Ingredients/IngredientDefinitionPage.js'
import PackagingDefinitionPage from './Packaging/PackagingDefinitions.js'
import IngredientDefReport from './Reports/IngredientDefReport.js'
import RecipePackagingReport from './Reports/RecipePackagingReport.js'
import IndividualHouseholdProductReport from './Reports/IndividualHouseholdProductReport.js'
import ViewPausedDates from './Reports/ViewPausedDates.js'
import ShowServingsReport from './Reports/ShowServingsReport.js'

// require("dotenv").config({path: `.env.${process.env.NODE_ENV}`})

console.log('NODE_ENV: ' + process.env.NODE_ENV);
console.log('API URL: ' + process.env.REACT_APP_API_URL);

// SERVER IP 4.236.185.213

const pageContainerStyle = {
    padding: '10px',
    // border: '1px solid black',
    display: 'flex',
    justifyContent: 'space-between',
};

const App = () => {
    return (
        <HashRouter>
            <AppComponent/>
        </HashRouter>
    )
}

const AppComponent = () => {
    // Navigate using the useNavigate hook
    const navigate = useNavigate();
    // loginState of this user to be passed to different pages
    const [loginState, setLoginState] = useState({
        username: "",
        isAuthenticated: false,
        isAdmin: false
    })

    // Let this element handle what happens when app background is clicked
    const handleBackgroundClick = (event) => {
        event.stopPropagation();
    };

    // Parse login cookie text into account data map
    const readLoginCookie = () => {
        let accountData = {};
        // If there is an existing login cookie
        if (document.cookie) {
            // For this login cookie...
            let cookieValues = document.cookie
            .split(';') // Split by terminating character ';'
            .map(v => v.split('=')) // Key/value is separated by '='
            .reduce((accountData, v) => {
                // Create map of account data as key/value pairs
                if (v.length > 1)
                accountData[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                // console.log(decodeURIComponent(v[0].trim()), decodeURIComponent(v[1].trim()))
                return accountData;
            })
            return {...cookieValues}
        }
        else {
            return undefined;
        }
    }

    // Get existing login cookie when first entering site
    useEffect(() => {
        // Get account data from cookie
        let cookieData = readLoginCookie();
        // If we got account data from cookie
        if (cookieData !== undefined) {
            // Set this user's login state (they are already logged in)
            setLoginState({
                username: cookieData.username,
                isAuthenticated: cookieData.isAuthenticated === 'true' ? true : false,
                isAdmin: cookieData.isAdmin === 'true' ? true : false            
            });
        }
    }, [])

    // Clear login cookie when logging out
    const handleLogout = () => {
        document.cookie = 'username=;'
        document.cookie = 'isAuthenticated=false;'
        document.cookie = 'isAdmin=false;'
        setLoginState({
            username: '',
            isAuthenticated: false,
            isAdmin: false
        })
    }

    // Replace with link, don't use this callback anymore, overcomplicated
    const handlePageClick = (pageName) => {
        // console.log(pageName)
        switch(pageName) {
            case 'cost-totals': navigate('/cost-totals-report'); break;
            case 'loginPage': navigate('/login'); break;
            case 'newUserPage': navigate('/sign-up'); break;
            case 'pwResetPage': navigate('/reset-password'); break;
            case 'landingPage': navigate('/home'); break;
            case 'households': navigate('/clients'); break;
            case 'households-report': navigate('clients-report'); break;
            case 'ingredientPage': navigate('/ingredients'); break;
            case 'ingredientDefPage': navigate('/ingredient-defs'); break;
            case 'ingredient-management-report': navigate('ingredient-management-report'); break;
            case 'ingredients-report': navigate('ingredients-report'); break;
            case 'ing-purchase-report': navigate('ingredient-purchasing-report'); break;
            case 'ing-def-report': navigate('/ing-def-report'); break;
            case 'packagingPage': navigate('/packaging'); break;
            case 'packagingDefPage': navigate('/packaging-defs'); break;
            case 'packaging-report': navigate('/packaging-report'); break;
            case 'packaging-return-report': navigate('package-return-report'); break;
            case 'pack-purchase-report': navigate('package-purchasing-report'); break;
            case 'recipe-ing-report': navigate('recipe-ing-report'); break;
            case 'recipe-packaging-report': navigate('recipe-packaging-report'); break;
            case 'meals': navigate('/mealplans'); break;
            case 'meal-plan-report': navigate('/meal-plan-report'); break;
            case 'meal-history-report': navigate('/meal-history-report'); break;
            case 'individual-household-product-report': navigate('/individual-household-product-report'); break;
            case 'view-paused-dates': navigate('/view-paused-dates'); break;
            case 'show-servings-report': navigate('/show-servings-report'); break;
            case 'recipePage': navigate('/recipes'); break;
            case 'userList': navigate('/admin'); break;
            case 'entryPage': navigate('/'); break;
            default: navigate('/home');
        }
    }

    const theme = createTheme({
        palette: {
            lightGreen: {
                main: '#9AB847', // light green logo color
                contrastText: '#fff'
            },
            darkGreen: {
                main: '#636182',
                contrastText: '#fff'
            },
            lightBlue: {
                main: '#636182',
                contrastText: '#fff'
            },
            lightOrange: {
                main: '#636182',
                contrastText: '#fff'
            },
            darkBlue: {
                // main: '#404851',
                main: '#636182',
                contrastText: '#fff'
            },
        }
    })

    // Protected Route component that navigates back to landing page when not admin
    const AdminRoute = ({ isAdmin, children }) => {
        const params = {isAdmin: isAdmin};
        if (!isAdmin) {
          return navigate({pathname: "/home", search: `?${createSearchParams(params)}`});
        }
      
        return children;
    };

    // User Route component navigates to login unless user is authenticated
    const UserRoute = ({children}) => {
        if (!loginState.isAuthenticated) {
            const params = {isAuthenticated: false};
            return navigate({pathname: "/login", search: `?${createSearchParams(params)}`});
        }
        return <Outlet/>;
    }

    // JSX HTML Structure
    return (
        <ThemeProvider theme={theme}>
        <div className="App" style={pageContainerStyle} onClick={handleBackgroundClick}>
            <Navbar handlePageClick={handlePageClick} handleLogout={handleLogout} loginState={loginState} />
            <Box sx={{
                bgcolor: (theme) => theme.palette.background.default,
                minHeight: "100%",
                width: '90%',
                margin: 'auto',
                marginTop: {lg: '5%', md: '6%', sm: '10%', xs: '12%'},
            }}>
                <Routes>
                    <Route exact path='/' element={<EntryPage setLoginState={setLoginState} handlePageClick={handlePageClick}/>}/>
                    <Route path='/home' element={<LandingPage handlePageClick={handlePageClick} />}/>
                    <Route path='/login' element={<LoginPage loginState={loginState} setLoginState={setLoginState} handlePageClick={handlePageClick} />}/>
                    <Route path='/sign-up' element={<NewUserPage handlePageClick={handlePageClick} navigate={navigate} />}/>
                    <Route path='/reset-password' element={<PwResetPage handlePageClick={handlePageClick} />}/>
                    <Route element={<UserRoute/>}>
                        <Route path='/clients' element={<HouseholdPage loginState={loginState} handlePageClick={handlePageClick} />}/>
                        <Route path='/ingredients' element={<IngredientPage loginState={loginState} handlePageClick={handlePageClick} />}/>
                        <Route path='/ingredient-defs' element={<IngredientDefinitionPage loginState={loginState} handlePageClick={handlePageClick} />}/>
                        <Route path='/packaging' element={<PackagingPage loginState={loginState} handlePageClick={handlePageClick} />}/>
                        <Route path='/packaging-defs' element={<PackagingDefinitionPage loginState={loginState} handlePageClick={handlePageClick}/>}/>
                        <Route path='/mealplans' element={<MealPlan loginState={loginState} handlePageClick={handlePageClick} />}/>
                        <Route path='/recipes/*' element={<RecipePage loginState={loginState} handlePageClick={handlePageClick}/>}/>
                        <Route path='/cost-totals-report' element={<CostTotals handlePageClick={handlePageClick} />}/>
                        <Route path='/clients-report' element={<HouseholdsReport handlePageClick={handlePageClick} />}/>
                        <Route path='/ingredient-management-report' element={<IngredientManagementReport handlePageClick={handlePageClick}/>}/>
                        <Route path='/ingredients-report' element={<IngredientsReport handlePageClick={handlePageClick} />}/>
                        <Route path='/ingredient-purchasing-report' element={<IngPurchaseReport handlePageClick={handlePageClick} />}/>
                        <Route path='/ing-def-report' element={<IngredientDefReport/>}/>
                        <Route path='/meal-plan-report' element={<MealPlanReport handlePageClick={handlePageClick} />}/>
                        <Route path='/meal-history-report' element={<MealHistoryReport handlePageClick={handlePageClick} />}/>
                        <Route path='/packaging-report' element={<PackagingReport handlePageClick={handlePageClick} />}/>
                        <Route path='/package-purchasing-report' element={<PackagingPurchaseReport handlePageClick={handlePageClick} />}/>
                        <Route path='/package-return-report' element={<PackagingReturns handlePageClick={handlePageClick} />}/>
                        <Route path="/recipe-ing-report" element={<RecipeIngredientReport/>}/>
                        <Route path="/recipe-packaging-report" element={<RecipePackagingReport/>}/>
                        <Route path='/individual-household-product-report' element={<IndividualHouseholdProductReport handlePageClick={handlePageClick} />}/>
                        <Route path='/view-paused-dates' element={<ViewPausedDates handlePageClick={handlePageClick} />}/>
                        <Route path='/show-servings-report' element={<ShowServingsReport handlePageClick={handlePageClick} />}/>
                        <Route path='/under-construction' element={<UnderConstruction handlePageClick={handlePageClick}/>}/>
                        <Route path='/admin' element={
                            <AdminRoute isAdmin={loginState && loginState.isAdmin}>
                                <UserList loginState={loginState} handlePageClick={handlePageClick}/>
                            </AdminRoute>}>
                        </Route>
                    </Route>
                    <Route path='/user-page' element={<UserPage handlePageClick={handlePageClick} />}/>
                </Routes>
            </Box>
        </div>
        </ThemeProvider>
    );
};

export default App;
