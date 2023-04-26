import { useState, useEffect, useContext } from 'react'
import { UserAuth } from '../../components/UserAuth/UserAuth';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';



const Account = () => {
	const { user, login, logout } = useContext(UserAuth);
	const [itineraries, setItineraries] = useState([
		{
			UserID: 1,
			FlightNum: 1,
			Date: "2023-04-25",
			ScheduledDepartureTime: "00:09:09",
			OriginAirportIATACode: "ORD",
			DestinationAirportIATACode: "LAX"
		}
	]);

	const navigate = useNavigate();

	useEffect(() => {
			if (!user) {
				navigate('/login')
			}
	    // Fetch the user's itineraries from your API or database
	    // and set them in the "itineraries" state
	    // const fetchItineraries = async () => {
	    //     const response = await fetch(`/api/itineraries?user=${user.id}`);
	    //     const data = await response.json();
	    //     setItineraries(data);
	    // };
	    // fetchItineraries();
	}, [user, navigate]);

	return (
		<div>
			{user && (
				<Box sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					width: '100%',
					gap: "25px",
				}}>
					<Typography variant="h4" component="h2">
					Welcome {user.username}!
					</Typography>
					<h2>Your Itineraries</h2>
					{itineraries.length > 0 ? (
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Flight Number</TableCell>
										<TableCell>Date</TableCell>
										<TableCell>Departure Time</TableCell>
										<TableCell>Origin Airport</TableCell>
										<TableCell>Destination Airport</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{itineraries.map((itinerary, idx) => (
										<TableRow key={idx}>
											<TableCell>{itinerary.FlightNum}</TableCell>
											<TableCell>{itinerary.Date}</TableCell>
											<TableCell>{itinerary.ScheduledDepartureTime}</TableCell>
											<TableCell>{itinerary.OriginAirportIATACode}</TableCell>
											<TableCell>{itinerary.DestinationAirportIATACode}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					) : (
						<p>You have no itineraries yet.</p>
					)}
				</Box>
			)}
		</div>
	)
}

export default Account