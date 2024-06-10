import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { IoIosLogIn } from 'react-icons/io';
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

  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }

    // Simulate fetching data
    const simulatedData: DashboardData = {
      pulseRate: "72 bpm",
      temperature: "98.6 °F",
      bloodPressure: "120/80 mmHg",
      weight: "150 lbs",
      age: "25"
    };
    setStoredData(simulatedData);

    // Fetch a random quote from the static array
    const randomIndex = Math.floor(Math.random() * healthAdviceQuotes.length);
    setQuote(healthAdviceQuotes[randomIndex]);
  }, [auth, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pulseRate = formData.get("pulseRate") as string;
    const temperature = formData.get("temperature") as string;
    const bloodPressure = formData.get("bloodPressure") as string;
    const weight = formData.get("weight") as string;
    const age = formData.get("age") as string;

    // Simulate saving data
    const updatedData: DashboardData = { pulseRate, temperature, bloodPressure, weight, age };
    setStoredData(updatedData);
  };

  return (
    <Box width="90%" height="100vh" display="flex" justifyContent="space-between" alignItems="center" p={3}>
      <Box flex={1} marginTop="-270px" marginLeft="20px">
        {storedData && (
          <Grid container spacing={2} sx={{ marginLeft: "10px" }}>
            <Grid item xs={12}>
              <Typography variant="h3" sx={{
                padding: "30px",
                marginTop: "-10px",
                marginBottom: "50px",
                marginLeft: "0px",
                fontSize: "50px",
                fontWeight: "500",
              }}>Today's Personal Health Dashboard</Typography>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={100} bgcolor="#ffcccb" borderRadius="10px" border="1px solid #ff0000">
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>Pulse Rate</Typography>
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>{storedData.pulseRate}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={100} bgcolor="#add8e6" borderRadius="10px" border="1px solid #0000ff">
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>Temperature</Typography>
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>{storedData.temperature}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={100} bgcolor="#90ee90" borderRadius="10px" border="1px solid #008000">
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>Blood Pressure</Typography>
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>{storedData.bloodPressure}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={100} bgcolor="#f5f5dc" borderRadius="10px" border="1px solid #d2b48c">
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>Weight</Typography>
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>{storedData.weight}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width={200} height={100} bgcolor="#ffe4e1" borderRadius="10px" border="1px solid #ff69b4">
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>Age</Typography>
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>{storedData.age}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ padding: "30px", marginTop: "20px" }}>
                Today's Health Tip
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" width="90%" height="100px" bgcolor="#e0f7fa" borderRadius="10px" border="1px solid #00bcd4">
                <Typography sx={{ color: "black", fontWeight: "600", fontSize: "20px" }}>
                  {quote}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      <Box justifyContent="flex-end" alignItems="flex-end" width="300px" padding="30px" boxShadow="10px 10px 20px #000" borderRadius="10px" border="none" marginTop="-50px">
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
