import React from 'react'
import FlightTableRow from '../FlightTableRow/FlightTableRow'

const FlightTable = (props) => {
    const { data } = props;
    console.log(data)
    return (
        <div>
            FlightTable
            {data.map((row) => (
                <FlightTableRow 
                    key={`${row.FlightNumber} - ${row.AirlineIATA}`} 
                    row={row}
                />
            ))}
        </div>
    )
}

export default FlightTable