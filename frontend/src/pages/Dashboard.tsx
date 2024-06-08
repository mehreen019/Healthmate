import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { IoIosLogIn } from 'react-icons/io';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CustomizedInput from '../components/shared/CustomizedInput';

interface DashboardData {
  pulseRate: string;
  temperature: string;
  bloodPressure: string;
  weight: string;
  age: string;
}

const Dashboard = () => {
  const [storedData, setStoredData] = useState<DashboardData | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get<DashboardData>('/user/dashboard-data');
      setStoredData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      await axios.post('/user/save-dashboard', { pulseRate, temperature, bloodPressure, weight, age });
      toast.success('Data Saved Successfully', { id: 'dashboard' });
      fetchData();  // Fetch updated data after save
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to Save Data', { id: 'dashboard' });
    }
  };

  return (
    <Box width="100%" height="100vh" display="flex" justifyContent="space-between" alignItems="center" p={3}>
      <Box flex={1}>
        {storedData && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2" sx={{
                padding :"60px", my : "auto", mx:"auto",
              }}>Today's Personal Health Dashboard</Typography>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={100} bgcolor="#ffcccb" borderRadius="10px" border="1px solid #ff0000">
                <Typography  sx={{color:"black"}}>Pulse Rate</Typography>
                <Typography sx={{color:"black"}}>{storedData.pulseRate}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={100} bgcolor="#add8e6" borderRadius="10px" border="1px solid #0000ff">
                <Typography sx={{color:"black"}}>Temperature</Typography>
                <Typography sx={{color:"black"}}>{storedData.temperature}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={100} bgcolor="#90ee90" borderRadius="10px" border="1px solid #008000">
                <Typography sx={{color:"black"}}>Blood Pressure</Typography>
                <Typography sx={{color:"black"}}>{storedData.bloodPressure}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={100} bgcolor="#f5f5dc" borderRadius="10px" border="1px solid #d2b48c">
                <Typography sx={{color:"black"}}>Weight</Typography>
                <Typography sx={{color:"black"}}>{storedData.weight}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={100} bgcolor="#ffe4e1" borderRadius="10px" border="1px solid #ff69b4">
                <Typography sx={{color:"black"}}>Age</Typography>
                <Typography sx={{color:"black"}}>{storedData.age}</Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      <Box width="400px" padding="30px" boxShadow="10px 10px 20px #000" borderRadius="10px" border="none">
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" textAlign="center" fontWeight={600} mb={2}>
            Dashboard
          </Typography>
          <CustomizedInput type="text" name="pulseRate" label="Pulse Rate" />
          <CustomizedInput type="text" name="age" label="Age" />
          <CustomizedInput type="text" name="temperature" label="Temperature" />
          <CustomizedInput type="text" name="weight" label="Weight" />
          <CustomizedInput type="text" name="bloodPressure" label="Blood Pressure" />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} endIcon={<IoIosLogIn />}>
            Save
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Dashboard;