import {useState} from 'react'
import AllergiesList from './AllergiesList.js'
import React from 'react'
import { Button, Grid, Input, Typography } from '@mui/material'
import { InputLabel } from '@mui/material'
import { Card } from '@mui/material'
import { plPL } from '@mui/x-data-grid'
import HistoricalDataHandler from './HistoricalDataHandler.js'
// Kainoa Borges  

// Household Form component
// Takes AddHousehold callback function
// Returns a form that can be used to define a new household object in a HouseholdList
const HouseholdForm = (props) => {
  const addEntry = props.addEntry;
  const handleClose = props.handleClose;
  const clearHousehold = () => {
    return {
      hh_last_name: "",
      hh_first_name: "",
      num_adult: undefined,
      num_child_lt_6: undefined,
      num_child_gt_6: undefined,
      
      veg_flag: 0,
      allergy_flag: 0,
      gf_flag: 0,
      ls_flag: 0,
      paused_flag: 0,
      ppMealKit_flag: 0,
      childrenSnacks_flag: 0,
      foodBox_flag: 0,
      rteMeal_flag: 0,
      paying: 0,
      phone: "",
      street: "",
      city: "",
      pcode: undefined,
      state: "",
      delivery_notes: "",
      hh_allergies: [],
      hh_pauseddates: [],
      historicalTimeStamps: [],
      bags_or_crates: "",
    }
  }

  // The state of this Household Form with each attribute of Household, using the clearHousehold helper function
  const [household, setHousehold] = useState(clearHousehold());

    // Handle form submission (prevent refresh, pass household to addHousehold, and clear form state)
    // Takes submit event information (form submission)
    // Returns none
    const handleSubmit = async (event) => {
      // Prevent refresh
      event.preventDefault();

      const currentTime = new Date().toISOString();
      const subscriptionHistory = [
        { product_type: 'ppMealKit', subscribed: household.ppMealKit_flag, timestamp: currentTime },
        { product_type: 'childrenSnacks', subscribed: household.childrenSnacks_flag, timestamp: currentTime },
        { product_type: 'foodBox', subscribed: household.foodBox_flag, timestamp: currentTime },
        { product_type: 'rteMeal', subscribed: household.rteMeal_flag, timestamp: currentTime },
      ];

      // Add the household to the database
      addEntry(household);
      await new Promise(resolve => setTimeout(resolve, 500));
      const historicalDataHandler = new HistoricalDataHandler('product-subscription-history/');
       for (const history of subscriptionHistory) {
        if (history.subscribed) {
          historicalDataHandler.addEntry({
            household: household.hh_id,
            product_type: history.product_type,
            subscribed: history.subscribed,
            timestamp: history.timestamp,
          });
        }
      }
      // Clear the form state
      setHousehold(clearHousehold());
      handleClose();
    }

    const updateEditForm = (names, values) => {
      const newHousehold = {...household};
      for (let i = 0; i < names.length; i++) {
        newHousehold[names[i]] = values[i];
        // console.log('(' + names[i] + ', ' + values[i] + ')', newHousehold.aFlag);
      }
      setHousehold(newHousehold);
    }

    // Handle the data inputted to each form input and set the state with the new values
    // General solution, input verification is tricky with this implementation
    // Takes input change event information (name, type, and value)
    // Returns None
    const handleFormChange = (event) => {
      // Get the name and value of the changed field
      const fieldName = event.target.getAttribute('name');
      const fieldValue = event.target.type === 'checkbox' ? (+event.target.checked) : event.target.value;
      // Create new household object before setting state
      updateEditForm([fieldName], [fieldValue]);
      // updateEditForm('aFlag', true);
    }

    

    // HTML structure of this component
    return (
      <Card sx={{marginTop: '1em', padding: '1em'}}>
        <Typography component='h5' variant='h5'>Add a Client: </Typography>
        <Typography component='h6' variant='h6'>Required * </Typography>
        <form onSubmit={handleSubmit}>
            {/* Basic household info */}
            <Grid container spacing={4}>
              <Grid item>
                <InputLabel htmlFor="hh_last_name">Last Name*: </InputLabel>
                <Input name="hh_last_name" id="hh_last_name" type="text" inputProps={{maxLength: '30'}} required={true} value={household.hh_last_name} onChange={handleFormChange} oninput="validity.valid||(value='');"/>
                
                <InputLabel htmlFor="hh_first_name">First Name*: </InputLabel>
                <Input name="hh_first_name" id="hh_first_name" type="text" inputProps={{maxLength: '30'}} required={true} value={household.hh_first_name} onChange={handleFormChange} oninput="validity.valid||(value='');"/>

                <InputLabel htmlFor='num_adult'>Number of Adults: </InputLabel>
                <Input name='num_adult' id="num_adult" type="number" inputProps={{min: 0}} value={household.num_adult} onChange={handleFormChange} oninput="validity.valid||(value='');"/>
                
                <InputLabel htmlFor='num_child_lt_6'>Number of Children 0-6: </InputLabel>
                <Input name='num_child_lt_6' id="num_child_lt_6" type="number" inputProps={{min: 0}} value={household.num_child_lt_6} onChange={handleFormChange} oninput="validity.valid||(value='');"/>
                
                <InputLabel htmlFor='num_child_gt_6'>Number of Children 7-17: </InputLabel>
                <Input name='num_child_gt_6' id="num_child_gt_6" type="number" inputProps={{min: 0}} value={household.num_child_gt_6} onChange={handleFormChange} oninput="validity.valid||(value='');"/>
              </Grid>
              <Grid item>
                <InputLabel htmlFor='veg_flag'>Vegan/Vegetarian: </InputLabel>          
                <Input name='veg_flag' id='veg_flag' type="checkbox" checked={household.veg_flag} onChange={handleFormChange}/>

                <InputLabel htmlFor='gf_flag'>Gluten Free: </InputLabel>          
                <Input name='gf_flag' id='gf_flag' type='checkbox' checked={household.gf_flag} onChange={handleFormChange} />
                
                

                <InputLabel htmlFor='ppMealKit_flag'>Participating in Meal Kits: </InputLabel>
                <Input name='ppMealKit_flag' id='ppMealKit_flag' type='checkbox' checked={household.ppMealKit_flag} onChange={handleFormChange}/>

                <InputLabel htmlFor='childrenSnacks_flag'>Receiving Children's Snacks: </InputLabel>
                <Input name='childrenSnacks_flag' id='childrenSnacks_flag' type='checkbox' checked={household.childrenSnacks_flag} onChange={handleFormChange}/>

                <InputLabel htmlFor='foodBox_flag'>Receiving Food Box: </InputLabel>
                <Input name='foodBox_flag' id='foodBox_flag' type='checkbox' checked={household.foodBox_flag} onChange={handleFormChange}/>

                <InputLabel htmlFor='rteMeal_flag'>Receiving Ready-to-Eat Meals: </InputLabel>
                <Input name='rteMeal_flag' id='rteMeal_flag' type='checkbox' checked={household.rteMeal_flag} onChange={handleFormChange}/>
                
                <InputLabel htmlFor="paused_flag">Is Paused: </InputLabel>
                <Input name="paused_flag" id="paused_flag" type="checkbox" checked={household.paused_flag || (household.pausedDates && household.pausedDates.length > 0)} onChange={handleFormChange}/>

              
                <InputLabel htmlFor='paying'>Is Paying: </InputLabel>          
                <Input name='paying' id='paying' type='checkbox' checked={household.paying} onChange={handleFormChange}/>
              </Grid>
              <Grid item>
                <InputLabel htmlFor='phone'>Phone Number*: </InputLabel>          
                <Input name='phone' id='phone' type='tel' inputProps={{pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}', placeholder: '###-###-####', minLength: '12', maxLength: '12'}} value={household.phone} onChange={handleFormChange}>###-###-####</Input>
                
                <InputLabel htmlFor='street'>Street*: </InputLabel>          
                <Input name='street' id='street' inputProps={{maxLength: '50'}} value={household.street} onChange={handleFormChange}/>

                <InputLabel htmlFor='city'>City*: </InputLabel>
                <Input name='city' id='city' inputProps={{maxLength: '50'}} value={household.city} onChange={handleFormChange}/>

                <InputLabel htmlFor='pcode'>Postal Code*: </InputLabel>
                <Input name='pcode' id='pcode' inputProps={{minLength:'5', maxLength:'5', placeholder: '#####'}} value={household.pcode} onChange={handleFormChange}/>

                <InputLabel htmlFor='state'>State: </InputLabel>
                <Input name='state' id='state' inputProps={{minLength:'2', maxLength:'2'}} value={household.state} onChange={handleFormChange}/>

                <InputLabel htmlFor='delivery_notes'>Delivery Notes: </InputLabel>
                <Input name='delivery_notes' id='delivery_notes' inputProps={{maxLength: '255'}} value={household.delivery_notes} onChange={handleFormChange}/>

                <InputLabel htmlFor='hh_bags_or_crates'>Bags or Crates: </InputLabel>
                

<select name="hh_bags_or_crates" id="hh_bags_or_crates" value={household.hh_bags_or_crates} onChange={handleFormChange}>
  <option value="bags">Bags</option>
  <option value="crates">Crates</option>
</select>
                
              </Grid>

              <Grid item>
                <InputLabel>Allergies</InputLabel>
                <AllergiesList allergies={household.hh_allergies} isEditable={true} updateEditForm={updateEditForm}/>
              </Grid>
            </Grid>
            <Button type='Submit' color='lightBlue' variant='contained' onClick={handleClose}>Add Client</Button>
        </form>
      </Card>

    );
}

export default HouseholdForm