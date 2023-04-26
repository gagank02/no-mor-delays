import { useState } from 'react'
import { Slider, Box, Typography } from '@mui/material';
import { blueGrey, orange, yellow, green } from '@mui/material/colors';

const grades = ['Least Reliable', 'Relatively Reliable', 'Reliable', 'Most Reliable'];
const grade_abbr = ['LR', 'RR', 'R', 'MR']
const colors = ["#bf3737", "#bf8237", '#376cbf', '#308531'];

const ReliabilityBar = ({ reliability }) => {
	const gradeIdx = grades.indexOf(reliability);

	return (
		<Box sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column',
			gap: '15px',
			paddingTop: '15px'
		}}>
			<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
				{colors.map((color, index) => (
					<Box
						key={index}
						sx={{
							width: '70px',
							flexGrow: 1,
							height: 20,
							backgroundColor: color,
							border: `3px solid ${index === gradeIdx ? 'black' : 'transparent'}`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative',
						}}
					>
						<Box sx={{ color: 'white', fontWeight: index === gradeIdx ? '600' : '400' }}>
							{grade_abbr[index]}
						</Box>
					</Box>
				))}

			</Box>
			<Typography style={{ textAlign: 'center', color: `${colors[gradeIdx]}`, fontWeight: '600' }}>
				{reliability}
			</Typography>
		</Box>
	);
}

export default ReliabilityBar