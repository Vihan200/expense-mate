import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GroupCard from '../components/GroupCard';
import BudgetWidget from '../components/BudgetWidget';

// Mock data for expenses (or you can replace with real API call if needed)
const mockExpenses = {
  'January': 5000,
  'February': 4000,
  'March': 6000,
  'April': 7000,
  'May': 3000,
};

const User = { uid: localStorage.getItem("email"), name: localStorage.getItem("displayName") };

function Dashboard() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [totalExpenses, setTotalExpenses] = useState(mockExpenses[selectedMonth]);
  const [groups, setGroups] = useState([]); // State to hold fetched groups
  const [loading, setLoading] = useState(true); // Loading state

  // Handle Month Change
  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    setTotalExpenses(mockExpenses[month]); // Set total expenses based on selected month
  };

  // Fetch groups from the backend when the page is initialized
  useEffect(() => {
    const fetchGroups = async () => {
      console.log("feeee")
      try {
        const response = await axios.get('http://localhost:5000/api/groups');
        setGroups(response.data); // Set the fetched groups
        setLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching groups:', error);
        setLoading(false);
      }
    };

    fetchGroups(); // This fetches groups as soon as the component is mounted
  }, []); // Empty dependency array ensures this runs only once on initialization

  return (
    <>
      {/* 🔹 Top Navigation Bar */}
      <Navbar user={User} />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* 🔹 Welcome & Create Group */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Welcome, {User.name}</Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-group')}
          >
            Create Group
          </Button>
        </Stack>

        {/* 🔹 Personal Budget Widget (Card Style) */}
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Card sx={{ borderRadius: '10px', boxShadow: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Typography variant="h5">Personal Budget</Typography>

                  {/* Month Selector */}
                  <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Month</InputLabel>
                    <Select
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      label="Month"
                    >
                      {Object.keys(mockExpenses).map((month) => (
                        <MenuItem key={month} value={month}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                {/* Total Expenses for Selected Month */}
                <Box mt={2}>
                  <Typography variant="h6">
                    Total Expenses for {selectedMonth}: Rs. {totalExpenses}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 🔹 Group Cards */}
        <Typography variant="h5" mt={5}>
          My Groups
        </Typography>

        {loading ? (
          <Typography variant="h6" mt={3}>
            Loading groups...
          </Typography>
        ) : (
          <Grid container spacing={3} mt={1}>
            {groups.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group._id}>
                <GroupCard group={group} currentUser={User} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default Dashboard;
