// src/pages/Dashboard.jsx
import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
//   Box,
//   IconButton,
  Stack,
} from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GroupCard from '../components/GroupCard';
import BudgetWidget from '../components/BudgetWidget';


const mockUser = { uid: 'abc123', name: 'Dul' };

const mockGroups = [
  {
    id: 'g1',
    name: 'Trip to Ella',
    admin_uid: 'abc123',
    members: ['abc123', 'def456'],
    balance: -3000,
    isSettled: false,
  },
  {
    id: 'g2',
    name: 'Dinner Plan',
    admin_uid: 'xyz789',
    members: ['abc123', 'xyz789'],
    balance: 1500,
    isSettled: true,
  },
];

function Dashboard() {
    const navigate = useNavigate();

    return (
        <>
          {/* 🔹 Top Navigation Bar */}
          <Navbar user={mockUser} />
    
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* 🔹 Welcome & Create Group */}
            
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">Welcome, {mockUser.name}</Typography>

    
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-group')}
              >
                Create Group
              </Button>
            </Stack>
    
            {/* 🔹 Personal Budget Widget */}
            <Grid container spacing={3} mt={3}>
              <Grid item xs={12} md={6} lg={4}>
                <BudgetWidget />
              </Grid>
            </Grid>
    
            {/* 🔹 Group Cards */}
            <Typography variant="h5" mt={5}>
              My Groups
            </Typography>
    
            <Grid container spacing={3} mt={1}>
              {mockGroups.map((group) => (
                <Grid item xs={12} sm={6} md={4} key={group.id}>
                  <GroupCard group={group} currentUser={mockUser} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      );
}

export default Dashboard;
