import { useEffect, useState } from 'react'
import { delay_data, flights_data, airlines, airports } from '../../dummyData'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import styles from './Search.module.css'
import FlightTable from '../../components/FlightTable/FlightTable';
import { CircularProgress } from '@mui/material';

const Search = () => {
    const [originAirport, setoriginAirport] = useState(null);
    const [destAirport, setdestAirport] = useState(null);
    const [filteredDelayData, setFilteredDelayData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        // Perform flight search using originAirport and destAirport
        setIsLoading(true);
        console.log(`Searching for flights from ${originAirport.IATACode} to ${destAirport.IATACode}`);
        const filtered = delay_data.filter(
            (item) =>
                item.OriginAirportIATACode === originAirport.IATACode &&
                item.DestinationAirportIATACode === destAirport.IATACode
        );
        setFilteredDelayData(filtered)
        setIsLoading(false);
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
                    sx={{ width: '150px' }}

                />
                <Autocomplete
                    options={airports}
                    getOptionLabel={(airport) => airport.IATACode}
                    onChange={(event, value) => setdestAirport(value)}
                    renderInput={(params) => (
                        <TextField required {...params} label="Destination" variant="outlined" />
                    )}
                    sx={{ width: '150px' }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={!originAirport || !destAirport}
                >
                    Search
                </Button>
            </div>
            {isLoading ? (
                <div
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    <CircularProgress />
                </div>
            ) : (
                <FlightTable data={filteredDelayData} />
            )}
        </div>
    )
}

export default Search