import { useState, useEffect } from 'react'
import FlightTableRow from '../FlightTableRow/FlightTableRow'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Pagination } from '@mui/material';

const FlightTable = ({ data, handleUpdate, deleteRow }) => {
	const [page, setPage] = useState(1);
	const rowsPerPage = 5;
	const totalRows = data.length;
	const totalPages = Math.ceil(totalRows / rowsPerPage);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const startIndex = (page - 1) * rowsPerPage;
	const endIndex = startIndex + rowsPerPage;
	const currentData = data.slice(startIndex, endIndex);

	return (
		<>
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
						{currentData && currentData.length > 0 ? (
							currentData.map((row) => (
								<FlightTableRow
									key={`${row.FlightNum}-${row.Date}-${row.ScheduledDepartureTime}-${row.OriginAirportIATACode}-${row.DestinationAirportIATACode}`}
									row={row}
									handleUpdate={handleUpdate}
									deleteRow={deleteRow}
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
			<Pagination
				sx={{ marginTop: 1, display: 'flex', justifyContent: 'center' }}
				count={totalPages}
				page={page}
				onChange={handleChangePage}
				shape="rounded"
				showFirstButton 
				showLastButton
			/>
		</>
	)
}

export default FlightTable;