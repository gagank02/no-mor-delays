import { useEffect, useState } from 'react'
import { delay_data, airports } from '../../dummyData'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import styles from './Search.module.css'
import FlightTable from '../../components/FlightTable/FlightTable';
import { CircularProgress, Typography } from '@mui/material';

const Search = () => {
    const [originAirport, setOriginAirport] = useState(null);
    const [destAirport, setDestAirport] = useState(null);
    const [filteredDelayData, setFilteredDelayData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [flightData, setFlightData] = useState([]);

    const handleSearch = () => {
        // Perform flight search using originAirport and destAirport
        setIsLoading(true);
        console.log(`Searching for flights from ${originAirport.IATACode} to ${destAirport.IATACode}`);
        const filtered = delay_data.filter(
            (item) =>
                item.OriginAirportIATACode === originAirport.IATACode &&
                item.DestinationAirportIATACode === destAirport.IATACode
        );
        // setFilteredDelayData(filtered);
        setFlightData(filtered);
        setIsLoading(false);
    };

    const handleRowUpdate = async (updatedFlight) => {
        // updateFlights
    }

    const handleClear = () => {
        setOriginAirport(null);
        setDestAirport(null);
        setFlightData(null);
    }

    return (
        <div className={styles.container}>
            <Typography variant="h4" component="h2">Find Flights</Typography>
            <div className={styles.row}>
                <Autocomplete
                    options={airports}
                    getOptionLabel={(airport) => airport.IATACode}
                    onChange={(event, value) => setOriginAirport(value)}
                    renderInput={(params) => (
                        <TextField required {...params} label="Origin" variant="outlined" />
                    )}
                    sx={{ width: '150px' }}
                    value={originAirport || null}
                    defaultValue={null}
                />
                <Autocomplete
                    options={airports}
                    getOptionLabel={(airport) => airport.IATACode}
                    onChange={(event, value) => setDestAirport(value)}
                    renderInput={(params) => (
                        <TextField required {...params} label="Destination" variant="outlined" />
                    )}
                    sx={{ width: '150px' }}
                    value={destAirport || null}
                    defaultValue={null}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={!originAirport || !destAirport}
                >
                    Search
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    onClick={handleClear}
                    disabled={!originAirport && !destAirport && !filteredDelayData}
                >
                    Clear
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
                <FlightTable data={flightData} handleUpdate={handleRowUpdate}/>
                // <FlightTableRow row={delay_data[0]} />
            )}
        </div>
    )
}

export default Search