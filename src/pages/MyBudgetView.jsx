import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { ArrowBackIos } from '@mui/icons-material'; 
import Navbar from '../components/Navbar';

function MyBudgetView() {
  const [incomeDialog, setIncomeDialog] = useState(false);
  const [expenseDialog, setExpenseDialog] = useState(false);
  const navigate = useNavigate();

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [incomeForm, setIncomeForm] = useState({ amount: '', category: '', description: '', date: '' });
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: '', description: '', date: '' });

  const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  const handleAddIncome = () => {
    setIncomes([...incomes, incomeForm]);
    setIncomeForm({ amount: '', category: '', description: '', date: '' });
    setIncomeDialog(false);
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, expenseForm]);
    setExpenseForm({ amount: '', category: '', description: '', date: '' });
    setExpenseDialog(false);
  };

  return (
    <>
      <Navbar user={{ name: 'Dul' }} />
      <Container sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Button
            variant="text"
            onClick={() => navigate("/dashboard")}
            sx={{
              minWidth: 'auto',
              padding: 0,
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <ArrowBackIos />
          </Button>
          <Typography variant="h5" gutterBottom>My Budget</Typography>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Total Income</Typography>
                <Typography variant="h6" color="green">Rs. {totalIncome}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Total Expenses</Typography>
                <Typography variant="h6" color="red">Rs. {totalExpense}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Balance</Typography>
                <Typography variant="h6" color={balance >= 0 ? 'green' : 'red'}>Rs. {balance}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="outlined" onClick={() => setIncomeDialog(true)}>Add Income</Button>
          <Button variant="outlined" onClick={() => setExpenseDialog(true)}>Add Expense</Button>
        </Stack>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Incomes</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incomes.map((inc, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{inc.amount}</TableCell>
                    <TableCell>{inc.category}</TableCell>
                    <TableCell>{inc.description}</TableCell>
                    <TableCell>{inc.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6">Expenses</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((exp, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{exp.amount}</TableCell>
                    <TableCell>{exp.category}</TableCell>
                    <TableCell>{exp.description}</TableCell>
                    <TableCell>{exp.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>

        {/* Income Dialog */}
        <Dialog open={incomeDialog} onClose={() => setIncomeDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add Income</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Amount"
                type="number"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={incomeForm.category}
                  onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="Salary">Salary</MenuItem>
                  <MenuItem value="Freelance">Freelance</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Description"
                value={incomeForm.description}
                onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                value={incomeForm.date}
                onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIncomeDialog(false)}>Cancel</Button>
            <Button onClick={handleAddIncome} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>

        {/* Expense Dialog */}
        <Dialog open={expenseDialog} onClose={() => setExpenseDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add Expense</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Amount"
                type="number"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Transport">Transport</MenuItem>
                  <MenuItem value="Rent">Rent</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExpenseDialog(false)}>Cancel</Button>
            <Button onClick={handleAddExpense} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
       
      </Container>
    </>
  );
}

export default MyBudgetView;