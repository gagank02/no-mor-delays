import { useState, useEffect } from 'react';
import { VictoryChart, VictoryScatter, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import * as d3 from "d3";

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
    console.log(data)
    // setLoading(false);
  }, []);


  const dataDomain = [0, 5000];
  const delaysDomain = [0, 10000]

  // Define the range of values you want to map your data to
  const range = [0, 500];

  // Create a linear scale using d3
  const linearScale = d3.scaleLinear()
    .domain(dataDomain)
    .range(range);

  const delayScale = d3.scaleLinear()
  .domain(delaysDomain)
  .range(range);

  return (
    <div>
      {(!loading && data.length > 0)
        ? (<div style={{ width: '100vw', height: '80vh' }}>
          <VictoryChart
            width={1500}
            height={750}
            domain={{ x: [-20, 100], y: [0, 500] }}
            theme={VictoryTheme.material}
            zoom={true}
          >
            <VictoryAxis offsetX={-100} style={{ axisLabel: { fontSize: 20, padding: 35 } }} label="Average Delay (min)" />
            <VictoryAxis style={{ axisLabel: { fontSize: 20, padding: 35 } }} dependentAxis label="Number of Delays" />
            <VictoryScatter
              data={data.map(datum => ({
                ...datum,
                avgDelay: parseFloat(datum.avgDelay),
                totalDelays: delayScale(datum.totalDelays),
                numLargeDelays: linearScale(datum.numLargeDelays)
              }))}
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
              size={({ datum }) => datum.totalDelays * 0.05}
              minBubbleSize={5}
              maxBubbleSize={5}
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
              <p>Avg. Delay: {curAirportData.avgDelay}</p>
              <p>Total Delays: {curAirportData.totalDelays}</p>
              <p>Number of Delays Greater than 15 Minutes: {curAirportData.numLargeDelays}</p>
            </div>
          )}
        </div>) : <CircularProgress />}
    </div>
  );
};

export default Visualize;
