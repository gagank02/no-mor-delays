import { useEffect, useState } from 'react'
import { delay_data } from '../../dummyData'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import styles from './Search.module.css'
import FlightTable from '../../components/FlightTable/FlightTable';
import { CircularProgress, Typography } from '@mui/material';
import FlightTableRow from '../../components/FlightTableRow/FlightTableRow';
import axios from 'axios'

const Search = ({ airports }) => {
	const [originAirport, setOriginAirport] = useState(null);
	const [destAirport, setDestAirport] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [flightData, setFlightData] = useState([]);

	const handleSearch = async () => {
		try {
			setIsLoading(true);
			console.log(`Searching for flights from ${originAirport.IATACode} to ${destAirport.IATACode}`);
			const res = await axios.get("http://localhost:5001/delays", {
				params: {
					origin: originAirport.IATACode,
					dest: destAirport.IATACode
				}
			});

			if (res.data.success) {
				setFlightData(res.data.result);
			} else {
				setFlightData([])
			}

			setIsLoading(false);
		} catch (err) {
			console.error(err);
		}
	};

	const handleRowUpdate = async (updatedFlight) => {
		// updateFlights
		console.log("update")
		try {
			const res = await axios.put("http://localhost:5001/delays", updatedFlight);
			console.log(res.data.result)
			if (res.data.success) {
				handleSearch();
			} else {
				console.log("error with updating")
				
			}
		} catch (err) {
			console.error(err)
		}
	}

	const handleClear = () => {
		setOriginAirport(null);
		setDestAirport(null);
		setFlightData([]);
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
					disabled={!originAirport && !destAirport && !flightData}
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
				<FlightTable data={flightData} handleUpdate={handleRowUpdate} />
				// <FlightTableRow row={delay_data[0]} />
			)}
		</div>
	)
}

export default Search