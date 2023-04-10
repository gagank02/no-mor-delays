import { useState, useEffect } from 'react'
import {
	Modal,
	Fade,
	Box,
	Typography,
	Backdrop,
	TextField,
	Switch,
	FormControlLabel,
	Stack,
	Button
} from '@mui/material'

const DelayDetails = ({ data, handleClose, handleUpdate }) => {
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 300,
		bgcolor: 'background.paper',
		// border: '2px solid #000',
		boxShadow: 24,
		p: 4,
		gap: "20px",
		display: "flex",
		flexDirection: "column"
	};

	const [formData, setFormData] = useState(data);
	const [checked, setChecked] = useState(formData.IsCanceled)

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSwitchChange = (event) => {
		const { name } = event.target;
		// console.log(event.target.checked)
		setChecked(event.target.checked);
		setFormData((prevData) => ({
			...prevData,
			[name]: event.target.checked,
		}));
		// console.log(formData)
	};

	const handleSave = async () => {
		try {
			console.log(formData);
			// update data w/ await and then close
			await handleUpdate(formData);
			handleClose();
		} catch (err) {
			console.error(err)
		}

	}

	return (
		<div >
			<Modal
				open
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in>
					<Box sx={style}>
						<Typography variant="h6" component="h2">
							Edit Delay Details
						</Typography>
						<TextField
							label="Departure Delay (in minutes)"
							name="DepartureDelay"
							value={formData.DepartureDelay}
							onChange={handleChange}
							type="number"
							InputProps={{
								inputProps: {
									min: -180,
									max: 180,
									step: 1
								}
							}}
							shrink={"true"}
							required
						/>
						<Box>
							<Typography sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "12px" }}>Is Canceled *</Typography>
							<Box
								sx={{
									border: "1px #BDBDBD solid",
									padding: "10px",
									borderRadius: "5px"
								}}
							>
								<Stack direction="row" spacing={1} alignItems="center">
									<Typography sx={{ color: `${!checked ? 'black' : 'rgba(0, 0, 0, 0.54)'}` }}>No</Typography>
									<FormControlLabel
										control={
											<Switch
												checked={checked}
												onChange={handleSwitchChange}
												name="IsCanceled"
												color="primary"
												value={checked}
											/>
										}
									/>
									<Typography sx={{ color: `${checked ? 'black' : 'rgba(0, 0, 0, 0.54)'}` }}>Yes</Typography>
								</Stack>
							</Box>
						</Box>
						<TextField
							label="Delay Cancellation Reason"
							name="DelayCancellationReason"
							value={formData.DelayCancellationReason ? formData.DelayCancellationReason : "N/A"}
							onChange={handleChange}
							shrink={"true"}
						/>
						<Button
							variant="contained"
							onClick={handleSave}
							disabled={!formData.DepartureDelay}
						>
							Save
						</Button>
					</Box>
				</Fade>
			</Modal>
		</div>
	)
}

export default DelayDetails