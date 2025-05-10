// File: MyBudgetView.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Stack, Table,
  TableHead, TableRow, TableCell, TableBody, MenuItem, Select,
  InputLabel, FormControl, Paper, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIos } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function MyBudgetView() {
  const [incomeDialog, setIncomeDialog] = useState(false);
  const [expenseDialog, setExpenseDialog] = useState(false);
  const navigate = useNavigate();

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [incomeForm, setIncomeForm] = useState({ amount: '', category: '', description: '', date: '' });
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: '', description: '', date: '' });
  const User = { uid: localStorage.getItem("email"), name: localStorage.getItem("displayName") };

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/budget/user/${User.uid}`);
        const allBudgets = response.data;

        const incomeEntries = allBudgets.filter(entry => entry.type === '+');
        const expenseEntries = allBudgets.filter(entry => entry.type === '-');

        setIncomes(incomeEntries);
        setExpenses(expenseEntries);
      } catch (error) {
        console.error('Error fetching budget entries:', error);
      }
    };

    fetchBudgets();
  }, [User.uid]);

  const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  const groupByCategory = (entries) => {
    const grouped = {};
    entries.forEach(entry => {
      if (!grouped[entry.category]) grouped[entry.category] = 0;
      grouped[entry.category] += parseFloat(entry.amount);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  const incomeData = groupByCategory(incomes);
  const expenseData = groupByCategory(expenses);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF1', '#E86A92'];

  const renderPieChart = (data, title) => (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );

  const handleAddIncome = async () => {
    try {
      const BudgetData = {
        amount: incomeForm.amount,
        category: incomeForm.category,
        user: User.uid,
        description: incomeForm.description,
        date: incomeForm.date,
        type: '+'
      };
      const response = await axios.post('http://localhost:5000/api/budget', BudgetData);
      if (response.status === 200) {
        alert('Income Added successfully!');
        navigate(0);
      }
    } catch (error) {
      console.error('Error creating income:', error);
    }
    setIncomeForm({ amount: '', category: '', description: '', date: '' });
    setIncomeDialog(false);
  };

  const handleAddExpense = async () => {
    try {
      const BudgetData = {
        amount: expenseForm.amount,
        category: expenseForm.category,
        user: User.uid,
        description: expenseForm.description,
        date: expenseForm.date,
        type: '-'
      };
      const response = await axios.post('http://localhost:5000/api/budget', BudgetData);
      if (response.status === 200) {
        alert('Expense Added successfully!');
        navigate(0);
      }
    } catch (error) {
      console.error('Error creating expense:', error);
    }
    setExpenseForm({ amount: '', category: '', description: '', date: '' });
    setExpenseDialog(false);
  };

  return (
    <>
      <Navbar user={{ name: 'Dul' }} />
      <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={5}>
          <Button variant="text" onClick={() => navigate("/dashboard")} sx={{ color: 'primary.main', minWidth: 0 }}>
            <ArrowBackIos fontSize="small" />
          </Button>
          <Typography variant="h3" fontWeight={700}>My Budget</Typography>
        </Stack>

        <Grid container spacing={4} mb={5}>
          {[{
            title: 'Total Income', value: totalIncome, color: 'success.main'
          }, {
            title: 'Total Expenses', value: totalExpense, color: 'error.main'
          }, {
            title: 'Balance', value: balance, color: balance >= 0 ? 'success.main' : 'error.main'
          }].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: 3 }}>
                <CardContent sx={{ textAlign: 'left' }}>
                  <Typography color="text.secondary" fontWeight={600} variant="h6">{item.title}</Typography>
                  <Typography variant="h4" fontWeight={700} color={item.color}>
                    Rs. {item.value.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
              {renderPieChart(incomeData, 'Income by Category')}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
              {renderPieChart(expenseData, 'Expense by Category')}
            </Paper>
          </Grid>
        </Grid>
        </Grid>
       
        

        <Box display="flex" gap={3} mb={6}>
          <Button variant="contained" color="primary" size="large" onClick={() => setIncomeDialog(true)}>
            Add Income
          </Button>
          <Button variant="contained" color="secondary" size="large" onClick={() => setExpenseDialog(true)}>
            Add Expense
          </Button>
        </Box>

        <Grid container spacing={6}>
          {[{ title: 'Incomes', rows: incomes }, { title: 'Expenses', rows: expenses }].map((section, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Paper variant="outlined" sx={{ borderRadius: 4, boxShadow: 2 }}>
                <Box p={4}>
                  <Typography variant="h5" fontWeight={700} mb={3}>{section.title}</Typography>
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Amount</strong></TableCell>
                        <TableCell><strong>Category</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.rows.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>Rs. {parseFloat(row.amount).toLocaleString()}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{row.date}</TableCell>
                        </TableRow>
                      ))}
                      {section.rows.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                            No {section.title.toLowerCase()} added.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {[{
          title: 'Add Income', state: incomeDialog, setter: setIncomeDialog, form: incomeForm, setForm: setIncomeForm,
          fields: ['Salary', 'Freelance', 'Profit', 'Other'], onSubmit: handleAddIncome
        }, {
          title: 'Add Expense', state: expenseDialog, setter: setExpenseDialog, form: expenseForm, setForm: setExpenseForm,
          fields: ['Food', 'Transport', 'Rent', 'Vehicle', 'Entertainment', 'Other'], onSubmit: handleAddExpense
        }].map((dialog, idx) => (
          <Dialog open={dialog.state} onClose={() => dialog.setter(false)} fullWidth maxWidth="sm" key={idx}>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogContent>
              <Stack spacing={3} mt={1}>
                <TextField
                  label="Amount"
                  type="number"
                  value={dialog.form.amount}
                  onChange={(e) => dialog.setForm({ ...dialog.form, amount: e.target.value })}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={dialog.form.category}
                    onChange={(e) => dialog.setForm({ ...dialog.form, category: e.target.value })}
                    label="Category"
                  >
                    {dialog.fields.map((option, i) => (
                      <MenuItem key={i} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Description"
                  value={dialog.form.description}
                  onChange={(e) => dialog.setForm({ ...dialog.form, description: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Date"
                  type="date"
                  value={dialog.form.date}
                  onChange={(e) => dialog.setForm({ ...dialog.form, date: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dialog.setter(false)}>Cancel</Button>
              <Button onClick={dialog.onSubmit} variant="contained">Add</Button>
            </DialogActions>
          </Dialog>
        ))}
      </Container>
    </>
  );
}

export default MyBudgetView;
