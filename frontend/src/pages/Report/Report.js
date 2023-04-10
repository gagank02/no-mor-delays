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
import { airports, airlines } from '../../dummyData';

const defaultFormData = {
  "FlightNumber": '',
  "ScheduledDepartureTime": "",
  "Date": "",
  "OriginAirportIATACode": "",
  "DestinationAirportIATACode": "",
  "DepartureDelay": '',
  "IsCanceled": false,
  "DelayCancellationReason": '',
  "AirlineIATA": ""
}

const Report = () => {
  const [formData, setFormData] = useState(defaultFormData);
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
    setChecked(event.target.checked);
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleTimeChange = (event) => {
    const time = event.target.value;
    const revertedTime = time.slice(0, 2) + time.slice(3);
    setFormData({ ...formData, ScheduledDepartureTime: revertedTime });
  }

  function formatTime(timeString) {
    let formattedTime = timeString.slice(0, 2) + ":" + timeString.slice(2);
    return formattedTime;
  }

  const handleAirportChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }

  const handleAirlineChange = (event, value) => {
    if (value) {
      setFormData({
        ...formData,
        AirlineIATA: value.IATACode,
      });
    } else {
      setFormData({
        ...formData,
        AirlineIATA: "",
      });
    }
  }

  const isFormValid =
    formData.FlightNumber &&
    formData.Date &&
    formData.ScheduledDepartureTime &&
    formData.OriginAirportIATACode &&
    formData.DestinationAirportIATACode &&
    formData.AirlineIATA &&
    formData.DepartureDelay;

  const handleSave = async () => {
    try {
      console.log(formData);
      // save data w/ await and then close
    } catch (err) {
      console.error(err)
    }
  }

  const handleClear = () => {
    setFormData(defaultFormData);
  }

  return (
    <div >
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        gap: "50px",
      }}>
        <Typography variant="h4" component="h2">Report a Delay</Typography>
        <Stack direction="row" spacing={3}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center" }}>
              Add Flight Details
            </Typography>
            <TextField
              label="Flight Number"
              name="FlightNumber"
              type="number"
              value={formData.FlightNumber}
              onChange={handleChange}
              InputProps={{
                inputProps: {
                  min: 0
                }
              }}
              required
            />
            <TextField
              label="Departure Date"
              name="Date"
              value={formData.Date}
              onChange={handleChange}
              required
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Scheduled Departure Time"
              name="ScheduledDepartureTime"
              value={formData.ScheduledDepartureTime ? formatTime(formData.ScheduledDepartureTime) : ''}
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
              onChange={(event, value) => handleAirportChange("DestinationAirportIATACode", value)}
              renderInput={(params) => (
                <TextField required {...params} name="DestinationAirportIATACode" label="Destination Airport" variant="outlined" />
              )}
              value={formData.DestinationAirportIATACode || null}
            />
            <Autocomplete
              options={airlines}
              getOptionLabel={(airline) => airline.AirlineName}
              onChange={handleAirlineChange}
              renderInput={(params) => (
                <TextField required {...params} name="AirlineIATA" label="Airline" variant="outlined" />
              )}
              value={
                formData.AirlineIATA
                  ? airlines.find((airline) => airline.IATACode === formData.AirlineIATA)
                  : null
              }
            />
          </Stack>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center" }}>
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
        <Stack direction="row" spacing={5}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={handleClear}
            color="warning"
          >
            Clear
          </Button>
        </Stack>
      </Box>
    </div>
  )
}

export default Report