// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Button, TextField } from '@mui/material';
// import { IoIosLogIn } from 'react-icons/io';
// import { toast } from 'react-hot-toast';
// import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';


// const Appointment = () => {
//   const navigate = useNavigate();
//   const auth = useAuth();
//   const [appointmentData, setAppointmentData] = useState({
//     title: '',
//     date: new Date(),
//     time: new Date(),
//   });

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setAppointmentData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleDateChange = (date: Date | null) => {
//     if (date) {
//       setAppointmentData((prevData) => ({
//         ...prevData,
//         date,
//       }));
//     }
//   };

//   const handleTimeChange = (time: Date | null) => {
//     if (time) {
//       setAppointmentData((prevData) => ({
//         ...prevData,
//         time,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       toast.loading('Setting up appointment', { id: 'appointment' });
//       await axios.post('/user/set-appointment', appointmentData);
//       toast.success('Appointment Set Successfully', { id: 'appointment' });
//     } catch (error) {
//       console.error('Error setting up appointment:', error);
//       toast.error('Failed to Set Appointment', { id: 'appointment' });
//     }
//   };

//   useEffect(() => {
//     if (!auth?.user) {
//       navigate('/login');
//     }
//   }, [auth, navigate]);

//   return (
//     <Box width="90%" height="100vh" display="flex" justifyContent="center" alignItems="center" p={3}>
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         width="400px"
//         padding="30px"
//         boxShadow="10px 10px 20px #000"
//         borderRadius="10px"
//         bgcolor="white"
//       >
//         <Typography variant="h4" textAlign="center" fontWeight={300} mb={2}>
//           Set Up Appointment
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Appointment Title"
//             name="title"
//             value={appointmentData.title}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Date"
//               value={appointmentData.date}
//               onChange={handleDateChange}
//               renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
//             />
//             <TimePicker
//               label="Time"
//               value={appointmentData.time}
//               onChange={handleTimeChange}
//               renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
//             />
//           </LocalizationProvider>
//           <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} endIcon={<IoIosLogIn />}>
//             Set Appointment
//           </Button>
//         </form>
//       </Box>
//     </Box>
//   );
// };

// export default Appointment;


import React from 'react'

const NotFound = () => {
  return (
    <div>
      NOT FOUND
    </div>
  )
}

export default NotFound;