import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/** https://mui.com/material-ui/react-table/ */

const FlightTableRow = (props) => {
	const { row } = props;
	const [open, setOpen] = useState(false);

	return (
		<>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.FlightNumber}
				</TableCell>
				<TableCell align="right">{row.OriginAirportIATACode}</TableCell>
				<TableCell align="right">{row.DestinationAirportIATACode}</TableCell>
				<TableCell align="right">{row.AirlineIATA}</TableCell>
				<TableCell align="right">{row.Date}</TableCell>
				<TableCell align="right">{row.ScheduledDepartureTime}</TableCell>
				<TableCell align="right">
					{
						(() => {
							if (row.DepartureDelay < 0) {
								return "Early";
							} else if (row.DepartureDelay > 0) {
								return "Delayed";
							} else {
								return "On Time";
							}
						})()
					}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant="h6" gutterBottom component="div">
								Delay Details
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Departure Delay</TableCell>
										<TableCell>Is Canceled</TableCell>
										<TableCell>Delay Cancellation Reason</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow key={row.FlightNumber}>
										<TableCell component="th" scope="row">
											{row.DepartureDelay}
										</TableCell>
										<TableCell>{row.IsCanceled}</TableCell>
										<TableCell>
											{row.DelayCancellationReason ? row.DelayCancellationReason : "N/A"}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

FlightTableRow.propTypes = {
  row: PropTypes.shape({
    FlightNumber: PropTypes.number.isRequired,
    ScheduledDepartureTime: PropTypes.string.isRequired,
    Date: PropTypes.string.isRequired,
    OriginAirportIATACode: PropTypes.string.isRequired,
    DestinationAirportIATACode: PropTypes.string.isRequired,
    DepartureDelay: PropTypes.number.isRequired,
    IsCanceled: PropTypes.bool.isRequired,
    DelayCancellationReason: PropTypes.string,
    AirlineIATA: PropTypes.string.isRequired,
  }).isRequired,
};

// "FlightNumber": 1415,
// "ScheduledDepartureTime": "1149",
// "Date": "2015-01-01",
// "OriginAirportIATACode": "IAH",
// "DestinationAirportIATACode": "PHX",
// "DepartureDelay": 0.0,
// "IsCanceled": false,
// "DelayCancellationReason": null,
// "AirlineIATA": "UA"

export default FlightTableRow;