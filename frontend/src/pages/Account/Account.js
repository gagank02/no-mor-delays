import { useState, useEffect, useContext } from 'react'
import { UserAuth } from '../../components/UserAuth/UserAuth';
import { CircularProgress, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const Account = () => {
	const { user, login, logout } = useContext(UserAuth);
	const [itineraries, setItineraries] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate('/login')
		} else {
			const fetchItineraries = async () => {
				try {
					const response = await axios.get(
						`http://localhost:5001/itinerary?user_id=${user.UserID}`
					);
					const data = response.data.result;
					// console.log(data);
					setItineraries(data);
				} catch (error) {
					console.error(error);
				}
			};

			fetchItineraries();
		}
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
						Welcome {user.FirstName} {user.LastName}!
					</Typography>
					<h2>Your Itineraries</h2>
					{!isLoading ? (
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
									{itineraries && itineraries.length > 0
										? (
											itineraries.map((itinerary, idx) => (
												<TableRow key={idx}>
													<TableCell>{itinerary.FlightNum}</TableCell>
													<TableCell>{itinerary.RelevantDate}</TableCell>
													<TableCell>{itinerary.ScheduledDepartureTime}</TableCell>
													<TableCell>{itinerary.OriginAirportIATACode}</TableCell>
													<TableCell>{itinerary.DestinationAirportIATACode}</TableCell>
												</TableRow>
											)))
										: (
											<TableRow>
												<TableCell align="center" colSpan={7}>
													No Results
												</TableCell>
											</TableRow>
										)
									}
								</TableBody>
							</Table>
						</TableContainer>
					) : (
						<CircularProgress />
					)}
				</Box>
			)}
		</div>
	)
}

export default Account