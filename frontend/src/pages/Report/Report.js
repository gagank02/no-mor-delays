import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Switch,
  FormControlLabel,
  Stack,
  Button
} from '@mui/material'
import { airports } from '../../dummyData';

const Report = () => {
  const [formData, setFormData] = useState({
    "FlightNumber": undefined,
    "ScheduledDepartureTime": "",
    "Date": "",
    "OriginAirportIATACode": "",
    "DestinationAirportIATACode": "",
    "DepartureDelay": undefined,
    "IsCanceled": false,
    "DelayCancellationReason": null,
    "AirlineIATA": ""
  });
  const [checked, setChecked] = useState(formData.IsCanceled)

  const airportIATACodes = airports.map((airport) => airport.IATACode);

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
      [name]: checked,
    }));
    // console.log(formData)
  };

  const handleTimeChange = (event) => {

  }

  const handleDateChange = (event) => {

  }

  const handleAirportChange = (airport, value) => {
    console.log(airport, value)
    setFormData((prevData) => ({
      ...prevData,
      [airport]: value,
    }));
  }

  const handleSave = async () => {
    try {
      console.log(formData);
      // save data w/ await and then close
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div >
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%'
      }}>
        <Typography variant="h4" component="h2">
          Report a Delay
        </Typography>
        <Stack direction="row" spacing={3}>
          <Stack direction="column" spacing={1}>
            <Typography variant="h6" component="h2">
              Add Flight Details
            </Typography>
            <TextField
              label="Flight Number"
              name="FlightNumber"
              value={formData.FlightNumber}
              onChange={handleChange}
              required
            />
            <TextField
              label="Departure Date"
              name="Date"
              value={formData.Date}
              onChange={handleDateChange}
              required
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Scheduled Departure Time"
              name="ScheduledDepartureTime"
              value={formData.ScheduledDepartureTime}
              onChange={handleTimeChange}
              required
              type="time"
              InputLabelProps={{ shrink: true }}
            />
            <Autocomplete
              options={airportIATACodes}
              getOptionLabel={(airport) => airport}
              onChange={(event, value) => handleAirportChange("OriginAirportIATACode", value)}
              renderInput={(params) => (
                <TextField required {...params} name="OriginAirportIATACode" label="Origin Airport" variant="outlined" />
              )}
              value={formData.OriginAirportIATACode || null}
            />
            <Autocomplete
              options={airportIATACodes}
              getOptionLabel={(airport) => airport}
              onChange={(event, value) => handleAirportChange("OriginAirportIATACode", value)}
              renderInput={(params) => (
                <TextField required {...params} name="OriginAirportIATACode" label="Origin Airport" variant="outlined" />
              )}
              value={formData.OriginAirportIATACode || null}
            />
          </Stack>
          <Stack direction="column" spacing={1}>
            <Typography variant="h6" component="h2">
              Add Delay Details
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
          </Stack>
        </Stack>
        <Button
          variant="contained"
          onClick={handleSave}
          // disabled={!formData.DepartureDelay}
        >
          Save
        </Button>
      </Box>
    </div>
  )
}

export default Report