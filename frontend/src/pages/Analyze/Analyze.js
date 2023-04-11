import { useState } from 'react'
import { Button, List, ListItem, ListItemText, Autocomplete, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';

import styles from './Analyze.module.css'

const ORD = {
  "IATACode": 'ORD',
  "AirportName": "Chicago O'Hare International Airport",
  "City": 'Chicago',
  "State": 'IL',
  "Latitude": 41.9796,
  "Longitude": -87.90446
}

const Analyze = ({ airports }) => {
  const [AQ1Data, setAQ1Data] = useState([]);
  const [AQ2Data, setAQ2Data] = useState([]);
  const [curAirport, setCurAirport] = useState("ORD");
  const [isLoadingAQ1, setIsLoadingAQ1] = useState(false);
  const [isLoadingAQ2, setIsLoadingAQ2] = useState(false);

  const aiportsIATA = airports.map((airport) => airport.IATACode);

  const handleAQ1 = async () => {
    try {
      setIsLoadingAQ1(true);
      const res = await axios.get("http://localhost:5001/adv1");
      if (res.data.success) {
        setAQ1Data(res.data.result);
        console.log(res.data.result);
        setIsLoadingAQ1(false);
      } else {
        console.log("failed aq1")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAQ2 = async () => {
    try {
      console.log(curAirport)
      setIsLoadingAQ2(true);
      const res = await axios.get("http://localhost:5001/adv2", { params: { airport: curAirport } });
      if (res.data.success) {
        setAQ2Data(res.data.result);
        console.log(res.data.result);
        setIsLoadingAQ2(false);
      } else {
        console.log("failed aq2")
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <h3>View the most reliable Airlines, in terms of average delay of non-cancelled Flights</h3>
        <Button onClick={handleAQ1} variant='contained'>View</Button>
        <div>
          {!isLoadingAQ1 ? (<List component='ol'>
            {AQ1Data.map((airline, index) => (
              <ListItemText primary={`${index + 1}. ${airline.Airline}`} secondary={`${airline.AirlineIATA}, ${airline.avgDepartureDelay} minutes`} />
            ))}
          </List>) : <CircularProgress />}
        </div>
      </div>

      <div className={styles.column}>
        <h3>Find the most popular airline from an aiport</h3>
        <div className={styles.row}>
          <Autocomplete
            options={aiportsIATA}
            getOptionLabel={(airport) => airport}
            onChange={(event, value) => setCurAirport(value)}
            renderInput={(params) => (
              <TextField required {...params} label="Origin" variant="outlined" />
            )}
            sx={{ width: '150px' }}
            value={curAirport || null}
          />
          <Button onClick={handleAQ2} variant='contained'>Find</Button>
        </div>
        <div>
          {!isLoadingAQ2 ? (<List component='ol'>
            {AQ2Data.map((airline, index) => (
              <ListItemText primary={`${index + 1}. ${airline.Airline}`} secondary={`${airline.AirlineIATA}, ${airline.FlightCount.toLocaleString()} flights`} />
            ))}
          </List>) : <CircularProgress />}
        </div>
      </div>
    </div>
  )
}

export default Analyze