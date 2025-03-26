
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
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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
  CardContent
} from '@mui/material';
import Navbar from '../components/Navbar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaidIcon from '@mui/icons-material/Paid';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { ArrowBackIos } from '@mui/icons-material'; 
import { useNavigate } from 'react-router-dom'; 


const mockUser = { uid: 'abc123', name: 'Dul' };

const mockGroup = {
  id: 'g1',
  name: 'Trip to Ella',
  admin_uid: 'abc123',
  members: [
    { uid: 'abc123', name: 'Dul', email: 'dul@example.com' },
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

  const isAdmin = group.admin_uid === mockUser.uid;

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

  const currentUserBalance = calculateUserBalance(mockUser.uid);
  const totalGroupExpenses = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const memberCount = group.members.length;

  return (
    <>
      <Navbar user={mockUser} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Header Section */}
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
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              <Typography variant="h5">Group: {group.name}</Typography>
              <Chip
                label={
                  currentUserBalance > 0
                    ? `You are owed Rs. ${currentUserBalance}`
                    : currentUserBalance < 0
                    ? `You owe Rs. ${Math.abs(currentUserBalance)}`
                    : 'All settled'
                }
                color={
                  currentUserBalance > 0 ? 'success' : currentUserBalance < 0 ? 'error' : 'default'
                }
                sx={{ maxWidth: '250px' }}
              />
            </Box>
          </Stack>

          <Typography variant="subtitle1" color="text.secondary" mt={1}>
            Total Spent: Rs. {totalGroupExpenses} • Members: {memberCount}
          </Typography>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} mt={2}>
            {isAdmin && (
              <Button variant="contained" color="success" onClick={finalizeGroup} sx={{ minWidth: 150 }}>
                Finalize Group
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddMember(true)}
                sx={{ minWidth: 150 }}
              >
                Add Member
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddExpense(true)}
              sx={{ minWidth: 150 }}
            >
              Add Expense
            </Button>
          </Stack>

          {/* Members List */}
          <Typography variant="h6" mt={4}>Members</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
            {group.members.map((member) => (
              <Chip
                key={member.uid}
                icon={<PersonIcon />}
                label={`${member.name} (${member.email})`}
                sx={{ maxWidth: '300px' }}
              />
            ))}
          </Stack>

          {/* Grid Layout for Balances and Expenses */}
          <Grid container spacing={3} mt={4}>
            {/* Member Balances Card */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={2}>Member Balances</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Member</TableCell>
                          <TableCell align="right">Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.members.map((m) => {
                          const bal = calculateUserBalance(m.uid);
                          return (
                            <TableRow key={m.uid}>
                              <TableCell>{m.name}</TableCell>
                              <TableCell align="right" style={{ color: bal > 0 ? 'green' : bal < 0 ? 'red' : 'gray' }}>
                                {bal > 0 ? `+Rs. ${bal}` : bal < 0 ? `-Rs. ${Math.abs(bal)}` : 'Rs. 0'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Expense History Card */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={2}>Expense History</Typography>
                  <List>
                    {group.expenses.map((exp) => (
                      <ListItem key={exp.id} sx={{ mb: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar>
                            <AttachMoneyIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1">
                              {exp.description} - Rs. {exp.amount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Paid by {getMemberName(exp.paidBy)} • {exp.splitType} split • {exp.date}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                          {exp.splitAmong.map((s) => (
                            <Chip
                              key={s.uid}
                              icon={<PaidIcon fontSize="small" />}
                              label={`${getMemberName(s.uid)}: Rs. ${s.amount}`}
                              variant="outlined"
                              size="small"
                            />
                          ))}
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export default GroupDetail;