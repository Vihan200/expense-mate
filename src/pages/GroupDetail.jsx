import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel, Stack
} from '@mui/material';
import Navbar from '../components/Navbar';
import {
  AttachMoney,
  Paid,
  Person,
  Add,
  ArrowBackIos,
  People,
  AccountBalance,
  Lock,
  PersonAdd,
  Receipt
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const User = { uid: localStorage.getItem("email"), name: localStorage.getItem("displayName") };

const mockGroup = {
  id: 'g1',
  name: 'Trip to Ella',
  admin_uid: 'abc123',
  members: [
    { uid: 'abc123', name: 'Dul', email: 'dul@example.com' },
    { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },
    { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },
    { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },
    { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },
    { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },
    { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },

  ],
  expenses: [
    {
      id: 'e1',
      description: 'Hotel Bill',
      amount: 8000,
      paidBy: 'abc123',
      splitType: 'equal',
      date: '2025-03-25',
      splitAmong: [
        { uid: 'abc123', amount: 4000 },
        { uid: 'def456', amount: 4000 },
      ],
    },
    {
      id: 'e2',
      description: 'Lunch',
      amount: 3000,
      paidBy: 'def456',
      splitType: 'custom',
      date: '2025-03-26',
      splitAmong: [
        { uid: 'abc123', amount: 1000 },
        { uid: 'def456', amount: 2000 },
      ],
    },
    {
      id: 'e2',
      description: 'Lunch',
      amount: 3000,
      paidBy: 'def456',
      splitType: 'custom',
      date: '2025-03-26',
      splitAmong: [
        { uid: 'abc123', amount: 1000 },
        { uid: 'def456', amount: 2000 },
      ],
    },
    {
      id: 'e2',
      description: 'Lunch',
      amount: 3000,
      paidBy: 'def456',
      splitType: 'custom',
      date: '2025-03-26',
      splitAmong: [
        { uid: 'abc123', amount: 1000 },
        { uid: 'def456', amount: 2000 },
      ],
    },
  ],
  isSettled: false,
};


function GroupDetail() {
  const navigate = useNavigate();
  const [group, setGroup] = useState(mockGroup);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [participants, setParticipants] = useState([]);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [openAddExpense, setOpenAddExpense] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [members, setMembers] = useState([]);
  const isAdmin = group.admin_uid === User.uid;

  const handleAddMember = () => {
    if (newMemberEmail) {
      alert(`Would send invite to: ${newMemberEmail}`);
      setNewMemberEmail('');
      setOpenAddMember(false);
    }
  };

  const handleAddExpense = () => {
    alert(`Adding expense: ${description}, Rs. ${amount}`);
    setDescription('');
    setAmount('');
    setPaidBy('');
    setParticipants([]);
    setOpenAddExpense(false);
  };

  const finalizeGroup = () => {
    alert('Group finalized! Balances are now locked.');
  };

  const getMemberName = (uid) => {
    const member = group.members.find((m) => m.uid === uid);
    return member ? member.name : 'Unknown';
  };

  const calculateUserBalance = (uid) => {
    let paid = 0;
    let share = 0;

    group.expenses.forEach((exp) => {
      if (exp.paidBy === uid) paid += exp.amount;
      exp.splitAmong.forEach((s) => {
        if (s.uid === uid) share += s.amount;
      });
    });

    return paid - share;
  };

  const currentUserBalance = calculateUserBalance(User.uid);
  const totalGroupExpenses = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const memberCount = group.members.length;

  return (
    <>
      <Navbar user={User} />
      <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
        {/* Header Section */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              <ArrowBackIos fontSize="small" />
            </IconButton>
            <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
              {group.name}
            </Typography>
          </Box>
          <Chip
            label={
              currentUserBalance > 0
                ? `You are owed Rs. ${currentUserBalance}`
                : currentUserBalance < 0
                  ? `You owe Rs. ${Math.abs(currentUserBalance)}`
                  : 'All settled'
            }
            color={currentUserBalance > 0 ? 'success' : currentUserBalance < 0 ? 'error' : 'default'}
            variant="outlined"
            sx={{ px: 2, py: 1, fontSize: '0.875rem' }}
          />
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={4} sx={{ marginBottom: '50px', paddingLeft: '300px'}}>
          {[
            {
              icon: <AttachMoney fontSize="large" color="primary" />,
              title: 'Total Spent',
              value: `Rs. ${totalGroupExpenses.toLocaleString()}`
            },
            {
              icon: <People fontSize="large" color="primary" />,
              title: 'Members',
              value: memberCount
            },
            {
              icon: <AccountBalance fontSize="large" color="primary" />,
              title: 'Your Balance',
              value: `${currentUserBalance > 0 ? '+' : ''}Rs. ${Math.abs(currentUserBalance).toLocaleString()}`,
              color: currentUserBalance > 0 ? 'success.main' : currentUserBalance < 0 ? 'error.main' : 'text.primary'
            }
          ].map((card, index) => (
            <Grid item xs={12} md={3.9} key={index} sx={{ minWidth: '300px' , height: '150px' }}>
              <Card variant="outlined" sx={{ p: 2, borderRadius: 4, boxShadow: 1, height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {card.icon}
                    <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>
                      {card.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: card.color || 'text.primary',
                      textAlign: 'right'
                    }}
                  >
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 6,
          '& .MuiButton-root': {
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: 1,
            '&:hover': { boxShadow: 2 }
          }
        }}>
          <Box display="flex" gap={3}>
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                onClick={finalizeGroup}
                startIcon={<Lock />}
              >
                Finalize Group
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenAddExpense(true)}
              startIcon={<Add />}
            >
              Add Expense
            </Button>
          </Box>
          {isAdmin && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenAddMember(true)}
              startIcon={<PersonAdd />}
              sx={{ borderWidth: 2 }}
            >
              Add Member
            </Button>
          )}
        </Box>

        {/* Main Content */}
        <Grid container spacing={6}>
          {/* Balances Table */}
          <Grid item xs={12} md={4} lg={4} sx={{ maxHeight: '500px' }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, boxShadow: 1, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                Member Balances
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'background.default' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: '1rem', width: '70%' }}>Member</TableCell>
                      {/* <TableCell sx={{ fontWeight: 700, fontSize: '1rem', width: '30%' }} align="right">Balance</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody
                    sx={{
                      maxHeight: '400px',
                      overflowY: 'auto',  // Enables vertical scrolling
                      display: 'block',    // Makes sure it behaves like a block element to allow scrolling
                      '&::-webkit-scrollbar': {
                        display: 'none'   // Hides the scrollbar in Webkit-based browsers (Chrome, Safari)
                      }
                    }}
                  >
                    {group.members.map((m) => {
                      const bal = calculateUserBalance(m.uid);
                      return (
                        <TableRow
                          key={m.uid}
                          hover
                          sx={{
                            '&:last-child td': { border: 0 },
                            display: 'table',  // Ensure each row is treated as a table-row
                            width: '100%'      // Ensure rows fill the table width
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{
                                width: 40,
                                height: 40,
                                mr: 3,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText'
                              }}>
                                {m.name[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {m.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {m.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              color: bal > 0 ? 'success.main' : 'error.main'
                            }}
                          >
                            {bal > 0 ? '+' : ''}Rs. {Math.abs(bal).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>

                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Expense List */}
          <Grid item xs={12} md={6} lg={6} sx={{ maxHeight: '600px' }}>
            <Paper variant="outlined" sx={{ borderRadius: 4, boxShadow: 1, height: '100%' }}>
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, width: '650px' }}>
                  Recent Expenses
                </Typography>
              </Box>
              <List sx={{
                      maxHeight: '450px',
                      overflowY: 'auto',  // Enables vertical scrolling
                      display: 'block',    // Makes sure it behaves like a block element to allow scrolling
                      '&::-webkit-scrollbar': {
                        display: 'none'   // Hides the scrollbar in Webkit-based browsers (Chrome, Safari)
                      }
                    }}>
                {group.expenses.map((exp) => (
                  <React.Fragment key={exp.id}>
                    <ListItem
                      sx={{
                        px: 3,
                        py: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <ListItemAvatar>
                          <Avatar sx={{
                            bgcolor: 'secondary.main',
                            width: 48,
                            height: 48,
                            mr: 2
                          }}>
                            <Receipt fontSize="medium" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight={600}>
                              {exp.description}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary" mt={1}>
                                Paid by {getMemberName(exp.paidBy)} • {new Date(exp.date).toLocaleDateString()}
                              </Typography>
                              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {exp.splitAmong.map((s) => (
                                  <Chip
                                    key={s.uid}
                                    size="medium"
                                    label={`${getMemberName(s.uid)}: Rs.${s.amount.toLocaleString()}`}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ borderRadius: 2, py: 1 }}
                                  />
                                ))}
                              </Box>
                            </>
                          }
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          minWidth: 120,
                          textAlign: 'right',
                          fontWeight: 700,
                          color: 'primary.main'
                        }}
                      >
                        Rs.{exp.amount.toLocaleString()}
                      </Typography>
                    </ListItem>
                    <Divider component="li" sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Dialogs remain the same as previous version */}
      </Container>
      <Dialog open={addMember} onClose={() => setAddMember(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add Members</DialogTitle>
          <DialogContent>
          <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
       
        
            <Stack direction="row" spacing={2}>
              <TextField
                label="Member Email"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                fullWidth
                placeholder='EX :- abc@gmail.com,123@gmail.com'
              />
        
            </Stack>

        </Paper>
      </Container>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddMember(false)}>Cancel</Button>
            {/* <Button onClick={handleAddIncome} variant="contained">Add</Button> */}
          </DialogActions>
        </Dialog>
    </>
  );
}

export default GroupDetail;