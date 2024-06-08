import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const [pulseRate, setPulseRate] = useState('');
  const [age, setAge] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');

  const handleSave = async () => {
    try {
      const response = await axios.post('/user/save-dashboard', {
        pulseRate,
        age,
        temperature,
        weight,
        bloodPressure,
      });
      console.log('Data saved:', response.data);
      // Optionally, show a success message to the user
    } catch (error) {
      console.error('Error saving data:', error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={2}
    >
      <Typography variant="h4" textAlign="center" fontWeight={600} mb={2}>
        Dashboard
      </Typography>
      <TextField
        label="Pulse Rate"
        value={pulseRate}
        onChange={(e) => setPulseRate(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Temperature"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Blood Pressure"
        value={bloodPressure}
        onChange={(e) => setBloodPressure(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Save
      </Button>
    </Box>
  );
};

export default Dashboard;
