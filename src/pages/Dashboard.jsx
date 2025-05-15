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
  Divider,
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
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true); 

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    setTotalExpenses(mockExpenses[month]); 
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${process.env.api_url}/api/groups`);
        setGroups(response.data);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching groups:', error);
        setLoading(false);
      }
    };

    fetchGroups(); 
  }, []); 

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
     <Grid container spacing={3} mt={3} justifyContent="center">
  <Grid item xs={12} md={10} lg={8}>
    <Card
      onClick={() => navigate('/my-budget')}
      sx={{
        cursor: 'pointer',
        '&:hover': { boxShadow: 8 },
        p: 2,
        borderRadius: 4,
        transition: '0.3s ease-in-out',
        backgroundColor: 'background.paper',
        boxShadow: 3
      }}
    >
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Personal Budget Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Click to view detailed analysis and history
            </Typography>
          </Box>

          {/* Month Selector */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
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

        <Divider sx={{ my: 3 }} />

        {/* Total Expenses */}
        <Box textAlign="right">
          <Typography variant="subtitle2" color="text.secondary">
            Total Expenses in {selectedMonth}
          </Typography>
          <Typography variant="h4" fontWeight={700} color="error.main">
            Rs. {totalExpenses.toLocaleString()}
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
          <Grid container spacing={6} mt={1}>
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
