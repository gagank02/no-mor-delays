import { useState, useEffect } from 'react';
import { VictoryChart, VictoryScatter, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

// const data = [
// 	{ airport: 'JFK', avgDelay: 10, totalDelays: 50 },
// 	{ airport: 'LAX', avgDelay: 5, totalDelays: 80 },
// 	{ airport: 'ORD', avgDelay: 12, totalDelays: 30 },
// 	{ airport: 'DFW', avgDelay: 8, totalDelays: 45 },
// 	{ airport: 'ATL', avgDelay: 15, totalDelays: 60 },
// 	// Add more airports and data points as needed
// ];

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
		// setLoading(false);
	}, []);
	return (
		<div>
			{/* {(!loading && data) ? (<div style={{ width: '80%', height: '80%' }}>
				<VictoryChart
					width={900}
					height={750}
					domain={{ x: [-60, 60], y: [0, 100] }}
					theme={VictoryTheme.material}
				>
					<VictoryAxis offsetX={-100} style={{ axisLabel: { fontSize: 20, padding: 35 } }} label="Average Delay (min)" />
					<VictoryAxis style={{ axisLabel: { fontSize: 20, padding: 35 } }} dependentAxis label="Number of Delays" />
					<VictoryScatter
						data={data}
						x="avgDelay"
						y="numLargeDelays"
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
						size={({ airport }) => airport.totalDelays * 0.5}
						labels={({ airport, idx }) => airport.IATACode}
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
						<p>Avg. Delay: {curAirportData.avgDelay}</p>
						<p>Total Delays: {curAirportData.totalDelays}</p>
					</div>
				)}
			</div>) : <CircularProgress />} */}
		</div>
	);
};

export default Visualize;
