import { useState, useContext } from 'react'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Button, ButtonBase } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DelayDetails from '../DelayDetails/DelayDetails';
import DeleteDialog from '../DeleteDialog/DeleteDialog';
import { UserAuth } from "../../components/UserAuth/UserAuth";
import axios from 'axios';

/** https://mui.com/material-ui/react-table/ */

function formatDate(dateStr) {
	const options = {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	};
	const date = new Date(dateStr);
	return date.toLocaleString('en-US', options);
}

function formatTime(time) {
	const [days, hours, minutes] = time.split(':');
	// let hour = time.substr(3, 5);
	// let minute = time.substr(5, 2);

	return hours + ':' + minutes;
}

function calculateAdjustedTime(timeStr, departureDelay) {
	const time = formatTime(timeStr);
	const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10));
	const totalMinutes = hours * 60 + minutes + departureDelay;
	const adjustedHours = Math.floor(totalMinutes / 60);
	const adjustedMinutes = totalMinutes % 60;
	const adjustedtime =
		`${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
	return adjustedtime;
}

const FlightTableRow = ({ row, handleUpdate, deleteRow }) => {
	const { user, login, logout } = useContext(UserAuth);
	const [open, setOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const handleEdit = () => {
		console.log(row)
		setIsEditing(true);
	}

	const handleDelete = async () => {
		// delete delay through api
		await deleteRow(row);
		console.log("post-delete");
		setOpenDeleteDialog(false);
	}

	const handleCloseDelete = () => {
		setOpenDeleteDialog(false);
	}

	const addFlight = async () => {
		console.log(row);
		let formData = {
			"userid": user.UserId,
			"flightnum": row.FlightNum,
			"date": row.Date,
			"depttime": row.ScheduledDepartureTime,
			"origin": row.OriginAirportIATACode,
			"dest": row.DestinationAirportIATACode
		}
		const res = await axios.post("http://localhost:5001/itinerary", formData);
		if (res.data.success) {
			console.log("itineary added");
		} else {
			console.log("itineary not added");
		}
	}

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
					{row.FlightNum}
				</TableCell>
				<TableCell>{row.OriginAirportIATACode}</TableCell>
				<TableCell>{row.DestinationAirportIATACode}</TableCell>
				<TableCell>{row.AirlineIATA}</TableCell>
				<TableCell>{formatDate(row.Date)}</TableCell>
				<TableCell>{formatTime(row.ScheduledDepartureTime)}</TableCell>
				<TableCell>
					{
						(() => {
							if (row.DepartureDelay < 0) {
								return <p style={{ color: "#39FF14" }}>Early</p>;
							} else if (row.DepartureDelay > 0) {
								return <p style={{ color: "red" }}>Delayed</p>;
							} else {
								return "On Time";
							}
						})()
					}
				</TableCell>
				{user && (
					<TableCell>
						<Button onClick={addFlight}>
							Add Flight
						</Button>
					</TableCell>
				)}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Box display="flex" flexDirection="row" gap="20px">
								<Typography variant="h6" gutterBottom component="div">
									Delay Details
								</Typography>
								<Button onClick={handleEdit}>
									Edit
								</Button>
								<Button color="warning" onClick={() => setOpenDeleteDialog(true)}>
									Delete
								</Button>
							</Box>
							<Table size="small" aria-label="delay-details">
								<TableHead>
									<TableRow>
										<TableCell>Departure Delay</TableCell>
										<TableCell>Adjusted Time</TableCell>
										<TableCell>Is Canceled</TableCell>
										<TableCell>Delay Cancellation Reason</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow key={row.FlightNum}>
										<TableCell component="th" scope="row">
											{row.DepartureDelay} min
										</TableCell>
										<TableCell>{calculateAdjustedTime(row.ScheduledDepartureTime, row.DepartureDelay)}</TableCell>
										<TableCell>{row.IsCanceled ? "Yes" : "No"}</TableCell>
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
			{isEditing && (
				<DelayDetails data={row} handleClose={() => setIsEditing(false)} handleUpdate={handleUpdate} />
			)}
			{openDeleteDialog && (
				<DeleteDialog open={openDeleteDialog} handleClose={handleCloseDelete} handleDelete={handleDelete} />
			)}
		</>
	);
}

FlightTableRow.propTypes = {
	row: PropTypes.shape({
		FlightNum: PropTypes.number.isRequired,
		ScheduledDepartureTime: PropTypes.string.isRequired,
		Date: PropTypes.string.isRequired,
		OriginAirportIATACode: PropTypes.string.isRequired,
		DestinationAirportIATACode: PropTypes.string.isRequired,
		DepartureDelay: PropTypes.number.isRequired,
		IsCanceled: PropTypes.number.isRequired,
		DelayCancellationReason: PropTypes.string,
		AirlineIATA: PropTypes.string.isRequired,
	}).isRequired,
};

export default FlightTableRow;