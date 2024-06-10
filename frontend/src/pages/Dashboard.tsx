import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { IoIosLogIn } from 'react-icons/io';
import { FaHeartbeat, FaThermometerHalf, FaTint, FaWeight, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CustomizedInput from '../components/shared/CustomizedInput';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

interface DashboardData {
  pulseRate: string;
  temperature: string;
  bloodPressure: string;
  weight: string;
  age: string;
}

const healthAdviceQuotes = [
  "Drink plenty of water.",
  "Eat a balanced diet.",
  "Exercise regularly.",
  "Get enough sleep.",
  "Practice mindfulness.",
  "Stay positive.",
  "Take breaks and relax.",
  "Maintain a healthy weight.",
  "Avoid smoking.",
  "Limit alcohol consumption.",
  "Stay connected with loved ones.",
  "Manage stress effectively.",
  "Keep learning new things.",
  "Practice good hygiene.",
  "Stay active throughout the day.",
  "Eat more fruits and vegetables.",
  "Protect your skin from the sun.",
  "Stay hydrated.",
  "Practice gratitude.",
  "Avoid processed foods.",
  "Get regular check-ups.",
  "Take care of your mental health.",
  "Stay informed about health issues.",
  "Wear a seatbelt.",
  "Stay socially active.",
  "Get regular exercise.",
  "Eat whole grains.",
  "Avoid sugary drinks.",
  "Practice safe sex.",
  "Get vaccinated.",
  "Limit screen time.",
  "Take care of your teeth.",
  "Wash your hands regularly.",
  "Avoid unnecessary stress.",
  "Stay curious.",
  "Spend time in nature.",
  "Keep a positive attitude.",
  "Practice deep breathing.",
  "Get enough vitamin D.",
  "Eat healthy fats.",
  "Maintain a consistent sleep schedule.",
  "Avoid trans fats.",
  "Get regular physical activity.",
  "Stay organized.",
  "Avoid too much caffeine.",
  "Practice self-care.",
  "Stay hopeful.",
  "Keep a healthy work-life balance.",
  "Laugh often."
];

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [storedData, setStoredData] = useState<DashboardData | null>(null);
  const [quote, setQuote] = useState<string>('');

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

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    } else {
      const randomIndex = Math.floor(Math.random() * healthAdviceQuotes.length);
      setQuote(healthAdviceQuotes[randomIndex]);
    }
  }, [auth, navigate]);

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
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to Save Data', { id: 'dashboard' });
    }
  };

  return (
    <Box width="85%" height="100vh" display="flex" justifyContent="space-between" alignItems="center" p={3} flexDirection={{ xs: 'column', md: 'row' }}>
      <Box flex={1} mt={{ xs: '20px', md: '-270px' }} ml={{ xs: '0', md: '20px' }}>
        {storedData && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3" sx={{
                padding: "30px",
                marginTop:"300px",
                fontSize: { xs: "30px", md: "50px" },
                fontWeight: "500",
                textAlign: { xs: 'center', md: 'left' }
              }}>Today's Personal Health Dashboard</Typography>
            </Grid>
            {[
              { label: "Pulse Rate", value: storedData.pulseRate, icon: <FaHeartbeat style={{ color: "#ff0000" }} />, bgcolor: "#ffcccb" },
              { label: "Temperature", value: storedData.temperature, icon: <FaThermometerHalf style={{ color: "#0000ff" }} />, bgcolor: "#add8e6" },
              { label: "Blood Pressure", value: storedData.bloodPressure, icon: <FaTint style={{ color: "#008000" }} />, bgcolor: "#90ee90" },
              { label: "Weight", value: storedData.weight, icon: <FaWeight style={{ color: "#a18a38" }} />, bgcolor: "#f5f5dc" },
              { label: "Age", value: storedData.age, icon: <FaUser style={{ color: "#802476" }} />, bgcolor: "#ffe4e1" }
            ].map((item, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%" height="200px" bgcolor={item.bgcolor} borderRadius="15px" boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)" textAlign="center">
                  <Box display="flex" justifyContent="center" alignItems="center" bgcolor="#ffffff" width="50px" height="50px" borderRadius="50%" marginBottom="10px">
                    {item.icon}
                  </Box>
                  <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>{item.label}</Typography>
                  <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>{item.value}</Typography>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ padding: "30px", mt: "20px", textAlign: 'center' }}>
                Today's Health Tip
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100px" bgcolor="#e0f7fa" borderRadius="10px" border="1px solid #00bcd4">
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>
                  {quote}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      <Box width={{ xs: '100%', md: '280px' }} marginLeft="40px" marginRight="20px" padding="20px" boxShadow="10px 10px 20px #000" borderRadius="10px" border="none" mt={{ xs: '20px', md: '-50px' }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" alignItems="center" textAlign="center" fontWeight={300} mb={2}>
            Input Vitals
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
