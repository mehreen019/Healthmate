import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { IoIosLogIn } from 'react-icons/io';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CustomizedInput from '../components/shared/CustomizedInput';

const Dashboard = () => {
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pulseRate = formData.get("pulseRate") as string;
    const temperature = formData.get("temperature") as string;
    const bloodPressure = formData.get("bloodPressure") as string;
    const weight = formData.get("weight") as string;
    const age = formData.get("age") as string;

    try {
      toast.loading('Saving Data', { id: 'dashboard' });
      const response = await axios.post('/user/save-dashboard',{ pulseRate, temperature, bloodPressure, weight, age});
      toast.success('Data Saved Successfully', { id: 'dashboard' });
      console.log('Data saved:', response.data);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to Save Data', { id: 'dashboard' });
    }
  };

  return (
    <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
      <form onSubmit={handleSubmit}>
        <Box
          width="400px"
          padding="30px"
          boxShadow="10px 10px 20px #000"
          borderRadius="10px"
          border="none"
        >
          <Typography variant="h4" textAlign="center" fontWeight={600} mb={2}>
            Dashboard
          </Typography>
          <CustomizedInput
            type="text"
            name="pulseRate"
            label="Pulse Rate"
           // value={formData.pulseRate}
            //onChange={(e) => handleChange('pulseRate', e.target.value)}
          />
          <CustomizedInput
            type="text"
            name="age"
            label="Age"
           // value={formData.age}
            //onChange={(e) => handleChange('age', e.target.value)}
          />
          <CustomizedInput
            type="text"
            name="temperature"
            label="Temperature"
            //value={formData.temperature}
            //onChange={(e) => handleChange('temperature', e.target.value)}
          />
          <CustomizedInput
            type="text"
            name="weight"
            label="Weight"
           // value={formData.weight}
            //onChange={(e) => handleChange('weight', e.target.value)}
          />
          <CustomizedInput
            type="text"
            name="bloodPressure"
            label="Blood Pressure"
           // value={formData.bloodPressure}
            //onChange={(e) => handleChange('bloodPressure', e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            endIcon={<IoIosLogIn />}
          >
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Dashboard;
