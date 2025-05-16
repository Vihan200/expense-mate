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
  Divider, LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GroupCard from '../components/GroupCard';
import BudgetWidget from '../components/BudgetWidget';
import { AttachMoney, TrendingDown, TrendingUp, AccountBalanceWallet } from '@mui/icons-material';

// Mock data for expenses (or you can replace with real API call if needed)


const currentMonth = new Date().toLocaleString('default', { month: 'long' });

const User = { uid: localStorage.getItem("email"), name: localStorage.getItem("displayName") };



function Dashboard() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [expenseRatio, setExpenseRatio] = useState(0);


  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups?uid=${User.uid}`);
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/budget/user/${User.uid}`);
        const allBudgets = response.data;

        const incomeTotal = allBudgets
          .filter(entry => entry.type === '+')
          .reduce((sum, curr) => sum + parseFloat(curr.amount), 0);

        const expenseTotal = allBudgets
          .filter(entry => entry.type === '-')
          .reduce((sum, curr) => sum + parseFloat(curr.amount), 0);

        setIncomes(incomeTotal);
        setExpenses(expenseTotal);
        setRemaining(incomeTotal - expenseTotal);
        setExpenseRatio(incomeTotal > 0 ? (expenseTotal / incomeTotal) * 100 : 0);
      } catch (error) {
        console.error('Error fetching budget entries:', error);
      }
    };
    fetchBudgets();
  }, [User.uid]);

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
          <Grid item xs={12} md={12} lg={10} sx={{ minWidth: '800px', height: '300px' }}>
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
                      Summary for {currentMonth}
                    </Typography>
                  </Box>
                  <AccountBalanceWallet fontSize="large" color="primary" />
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Budget Summary */}
                <Stack direction="row" spacing={4} justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Income
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TrendingUp color="success" />
                      <Typography variant="h6" fontWeight={600} color="success.main">
                        Rs. {incomes.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Expenses
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TrendingDown color="error" />
                      <Typography variant="h6" fontWeight={600} color="error.main">
                        Rs. {expenses.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Remaining
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      Rs. {remaining.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>

                {/* Budget Usage Bar */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Budget Usage: {expenseRatio.toFixed(1)}%
                  </Typography>
                  <LinearProgress variant="determinate" value={expenseRatio} sx={{ height: 10, borderRadius: 5 }} />
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
