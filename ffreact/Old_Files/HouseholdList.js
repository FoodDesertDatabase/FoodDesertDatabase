import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HouseholdModularDatagrid from '../src/Households/HouseholdModularDatagrid.js'


// Household List Component
export default function HouseholdList() {
    const [households, setHouseholds] = useState(undefined);
    const [errorComponent, setErrorComponent] = useState(null);

    useEffect(() => {
        getDBHouseholds();
    }, []);
    const getDBHouseholds = () => {
        console.log("MAKING REQUEST TO DJANGO")
        axios({
            method: "GET",
            url:process.env.REACT_APP_API_URL + "households"
          }).then((response)=>{
            console.log(response.data[0])
            const hhData = response.data
            setHouseholds(hhData);
          }).catch((error) => {
            if (error.response) {
              setErrorComponent(error.response);
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              }
          });
    }

    if (households === undefined) {
        return (<>loading</>);
    }
    // The HTML structure of this component

    return (
      <div>
      <HouseholdModularDatagrid/>
        {/* <h3>Add Client</h3> */}
        {/* <HouseholdForm addHousehold={addHousehold} allergies={households.hh_allergies}></HouseholdForm> */}
        {errorComponent}
      </div>
    )
  }
