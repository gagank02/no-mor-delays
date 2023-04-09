import { useState, useEffect } from 'react'
import FlightTableRow from '../FlightTableRow/FlightTableRow'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';

const FlightTable = ({ data }) => {
	return (
		<TableContainer component={Paper}>
			<Table aria-label="flight-table">
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>Flight Number</TableCell>
						<TableCell>Origin Airport</TableCell>
						<TableCell>Destination Airport</TableCell>
						<TableCell>Airline</TableCell>
						<TableCell>Date</TableCell>
						<TableCell>Scheduled Departure Time</TableCell>
						<TableCell>Delay Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data && data.length > 0 ? (
						data.map((row) => (
							<FlightTableRow
								key={`${row.FlightNumber} - ${row.AirlineIATA}`}
								row={row}
							/>
						))
					) : (
						<TableRow>
							<TableCell align="center" colSpan={7}>
								No Results
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default FlightTable