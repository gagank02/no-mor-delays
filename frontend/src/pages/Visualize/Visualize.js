import { useState, useEffect } from 'react';
import { VictoryChart, VictoryScatter, VictoryZoomContainer, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory';
import axios from 'axios';
import { CircularProgress, Typography, Box } from '@mui/material';
import * as d3 from "d3";

const Visualize = () => {
	const [curAirportData, setCurAirportData] = useState(null);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const res = await axios.get(`http://localhost:5001/visualize`);
				setData(res.data.result);
				console.log(res.data)

				if (res.data.success) {
					setData(res.data.result);
				} else {
					setData([])
				}

				setLoading(false);
			} catch (err) {
				console.error(err);
			}

		};

		fetchData();
	}, []);


	const dataDomain = [0, 5000];
	const delaysDomain = [0, 10000]
	const range = [0, 400];

	const linearScale = d3.scaleLinear()
		.domain(dataDomain)
		.range(range);

	const delayScale = d3.scaleLinear()
		.domain(delaysDomain)
		.range(range);

	return (
		<div>
			<Box sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				width: '100%',
				gap: "50px",
				textAlign: 'center'
			}}>
				<Typography variant="h4" component="h2">
					Average Delay vs Number of Delays greater than 15 minutes (by Airport)
				</Typography>
				{(!loading && data.length > 0)
					? (
						<div>
							<VictoryChart
								width={1500}
								height={750}
								domain={{ x: [-20, 100], y: [0, 500] }}
								theme={VictoryTheme.material}
								containerComponent={<VictoryZoomContainer zoomDomain={{ x: [-20, 100], y: [0, 500] }} />}
							>
								<VictoryAxis offsetX={-100} style={{ axisLabel: { fontSize: 20, padding: 35 } }} label="Average Delay (min)" />
								<VictoryAxis style={{ axisLabel: { fontSize: 20, padding: 35 } }} dependentAxis label="Number of Delays Greater than 15 Minutes" />
								<VictoryScatter
									data={data.map(datum => ({
										...datum,
										avgDelay: parseFloat(datum.avgDelay),
										totalDelays: delayScale(datum.totalDelays),
										numLargeDelays: linearScale(datum.numLargeDelays)
									}))}
									x="avgDelay"
									y="numLargeDelays"
									padding={{ top: 2, bottom: 2 }}
									style={{
										labels: {
											fill: "black",
											fontSize: 12
										},
										data: {
											fill: "#e38e39",
											stroke: "#e38e39",
											fillOpacity: 0.7,
											strokeWidth: 3
										}
									}}
									size={({ datum }) => Math.max(datum.totalDelays * 0.05, 5)}
									labels={({ datum, idx }) => datum.IATACode}
									labelComponent={<VictoryLabel dy={4} />}
									events={[
										{
											target: 'labels',
											eventHandlers: {
												onMouseOver: (_, { index }) => {
													setCurAirportData(data[index]);
													return { active: true };
												},
												onMouseLeave: () => {
													setCurAirportData(null);
													return { active: false };
												},
											},
										},
										{
											target: 'data',
											eventHandlers: {
												onMouseOver: (_, { index }) => {
													setCurAirportData(data[index]);
													return { active: true };
												},
												onMouseLeave: () => {
													setCurAirportData(null);
													return { active: false };
												},
											},
										},
									]}
								/>
							</VictoryChart>
							{curAirportData && (
								<div>
									<p>Airport: {curAirportData.IATACode}</p>
									<p>Name: {curAirportData.AirportName}</p>
									<p>Avg. Delay: {curAirportData.avgDelay} min</p>
									<p>Total Delays: {curAirportData.totalDelays}</p>
									<p>Number of Delays Greater than 15 Minutes: {curAirportData.numLargeDelays}</p>
								</div>
							)}
						</div>
					) : <CircularProgress />}
			</Box>
		</div>
	);
};

export default Visualize;
