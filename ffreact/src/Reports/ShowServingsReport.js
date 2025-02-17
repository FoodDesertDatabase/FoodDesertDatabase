import React, { useState } from 'react';

const ShowServingsReport = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [totalServings, setTotalServings] = useState(null);

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
    };

    const handleToDateChange = (e) => {
        setToDate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/servings?from=${fromDate}&to=${toDate}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTotalServings(data.totalServings);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <div>
            <h1>Show Servings Report</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fromDate">From:</label>
                    <input
                        type="date"
                        id="fromDate"
                        value={fromDate}
                        onChange={handleFromDateChange}
                    />
                </div>
                <div>
                    <label htmlFor="toDate">To:</label>
                    <input
                        type="date"
                        id="toDate"
                        value={toDate}
                        onChange={handleToDateChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {totalServings !== null && (
                <div>
                    <h2>Total Servings: {totalServings}</h2>
                </div>
            )}
        </div>
    );
};

export default ShowServingsReport;