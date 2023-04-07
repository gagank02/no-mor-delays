import { useEffect, useState } from 'react'
import { delay_data, flights_data, airlines, airports } from '../../dummyData'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import styles from './Search.module.css'
import FlightTable from '../../components/FlightTable/FlightTable';

const Search = () => {
    const [originAirport, setoriginAirport] = useState(null);
    const [destAirport, setdestAirport] = useState(null);

    const handleSearch = () => {
        // Perform flight search using originAirport and destAirport
        console.log(`Searching for flights from ${originAirport.IATACode} to ${destAirport.IATACode}`);
    };

    return (
        <div className={styles.container}>
            <h1>Find Flights</h1>
            <div className={styles.row}>
                <Autocomplete
                    options={airports}
                    getOptionLabel={(airport) => airport.IATACode}
                    onChange={(event, value) => setoriginAirport(value)}
                    renderInput={(params) => (
                        <TextField required {...params} label="Origin" variant="outlined" />
                    )}
                    sx={{width: '150px'}}
                    
                />
                <Autocomplete
                    options={airports}
                    getOptionLabel={(airport) => airport.IATACode}
                    onChange={(event, value) => setdestAirport(value)}
                    renderInput={(params) => (
                        <TextField required {...params} label="Destination" variant="outlined" />
                    )}
                    sx={{width: '150px'}}
                />
                <Button 
                    variant="contained" 
                    onClick={handleSearch}
                    disabled={!originAirport || !destAirport}
                >
                    Search
                </Button>
            </div>
            <FlightTable data={delay_data} />
        </div>
    )
}

export default Search