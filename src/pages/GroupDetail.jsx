import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { useParams } from 'react-router-dom';

const User = { uid: localStorage.getItem("email"), name: localStorage.getItem("displayName") };

// const mockGroup = {
//   _id: 'g1',
//   name: 'Trip to Ella',
//   admin_uid: 'abc123',
//   members: [
//     { uid: 'abc123', name: 'Dul', email: 'dul@example.com' },
//     { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },
//     { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },
//     { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },
//     { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },
//     { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },
//     { uid: 'def456', name: 'Vihan', email: 'vihan@example.com' },

//   ],
//   expenses: [
//     {
//       id: 'e1',
//       description: 'Hotel Bill',
//       amount: 8000,
//       paidBy: 'abc123',
//       splitType: 'equal',
//       date: '2025-03-25',
//       splitAmong: [
//         { uid: 'abc123', amount: 4000 },
//         { uid: 'def456', amount: 4000 },
//       ],
//     },
//     {
//       id: 'e2',
//       description: 'Lunch',
//       amount: 3000,
//       paidBy: 'def456',
//       splitType: 'custom',
//       date: '2025-03-26',
//       splitAmong: [
//         { uid: 'abc123', amount: 1000 },
//         { uid: 'def456', amount: 2000 },
//       ],
//     },
//     {
//       id: 'e2',
//       description: 'Lunch',
//       amount: 3000,
//       paidBy: 'def456',
//       splitType: 'custom',
//       date: '2025-03-26',
//       splitAmong: [
//         { uid: 'abc123', amount: 1000 },
//         { uid: 'def456', amount: 2000 },
//       ],
//     },
//     {
//       id: 'e2',
//       description: 'Lunch',
//       amount: 3000,
//       paidBy: 'def456',
//       splitType: 'custom',
//       date: '2025-03-26',
//       splitAmong: [
//         { uid: 'abc123', amount: 1000 },
//         { uid: 'def456', amount: 2000 },
//       ],
//     },
//   ],
//   isSettled: false,
// };


function GroupDetail() {
  const navigate = useNavigate();
  const [group, setGroup] = useState();
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
  // const isAdmin = group.admin_uid === User.uid;

  const handleAddMember = () => {
    if (newMemberEmail) {
      alert(`Would send invite to: ${newMemberEmail}`);
      setNewMemberEmail('');
      setOpenAddMember(false);
    }
  };
  const { id } = useParams();
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/groups/${id}`);

        // Normalize members into objects with uid, name, email
        const normalizedMembers = response.data.members.map((email) => ({
          uid: email,
          name: email.split('@')[0], // Example: "vihanganirmitha200"
          email: email
        }));

        // Keep the expenses as they are, or overwrite if needed
        setGroup({
          ...response.data,
          members: normalizedMembers,
          expenses: response.data.expenses || [] // Ensure expenses is an array
        });

      } catch (error) {
        console.error('Error fetching group:', error);
      }
    };

    fetchGroupDetails();
  }, [id]);

  if (!group) return <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>Loading group details...</Typography>;

  const isAdmin = group.admin_uid === User.uid;

  const handleAddExpense = async () => {
    let splitAmong = [];

    if (splitType === "equal") {
      const eachShare = parseFloat(amount) / group.members.length;
      splitAmong = group.members.map((member) => ({
        uid: member.uid,
        amount: parseFloat(eachShare.toFixed(2))
      }));
    } else if (splitType === "exact") {
      splitAmong = participants;
    }

    // ✅ Validate total split equals main amount
    const totalSplit = splitAmong.reduce((sum, entry) => sum + entry.amount, 0);
    const expectedAmount = parseFloat(amount);

    // Allow a small rounding tolerance for equal splits
    if (Math.abs(totalSplit - expectedAmount) > 0.01) {
      alert(`Split total (Rs. ${totalSplit.toFixed(2)}) does not match the total amount (Rs. ${expectedAmount.toFixed(2)}). Please correct the values.`);
      return;
    }

    const expense = {
      id: `exp-${Date.now()}`, // or let backend generate ID
      description,
      amount: parseFloat(amount),
      paidBy,
      date: new Date().toISOString(), // or use a selected date if you add it
      splitAmong
    };

    console.log('Posting expense object:', expense);

    try {
      await axios.post(`http://localhost:5000/api/groups/${id}/expenses`, expense);
      alert('Expense added successfully!');
      // Optional: Refresh group data
    } catch (error) {
      console.error('Error posting expense:', error);
      alert('Failed to add expense.');
    }

    // Cleanup
    setDescription('');
    setAmount('');
    setPaidBy('');
    setParticipants([]);
    setOpenAddExpense(false);
    navigate(0);
  };


  const finalizeGroup = () => {
    alert('Group finalized! Balances are now locked.');
  };

  const getMemberName = (uid) => {
    const member = group.members.find((m) => m.uid === uid);
    return member ? member.name : 'Unknown';
  };

  const calculateUserBalance = (uid) => {
    if (!group.expenses) return 0;

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
        <Grid container spacing={4} sx={{ marginBottom: '50px', paddingLeft: '300px' }}>
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
            <Grid item xs={12} md={3.9} key={index} sx={{ minWidth: '300px', height: '150px' }}>
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
                      const bal = group.expenses?.length ? calculateUserBalance(m.uid) : 0;
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
                {group.expenses.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary">
                      No expenses recorded yet.
                    </Typography>
                  </Box>
                ) : (
                  group.expenses.map((exp) => (
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
                  ))
                )}


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
      <Dialog open={openAddExpense} onClose={() => setOpenAddExpense(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', pb: 0 }}>
          Add New Expense
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <Stack spacing={3} mt={1}>
            <TextField
              label="Expense Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />

            <TextField
              label="Total Amount (Rs.)"
              type="number"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Paid By</InputLabel>
              <Select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                label="Paid By"
              >
                {group.members.map((member) => (
                  <MenuItem key={member.uid} value={member.uid}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Date of Expense"
              type="date"
              fullWidth
              value={group.date || new Date().toISOString().split("T")[0]}
              onChange={(e) => setGroup((prev) => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Split Type</InputLabel>
              <Select
                value={splitType}
                onChange={(e) => setSplitType(e.target.value)}
                label="Split Type"
              >
                <MenuItem value="equal">Equally</MenuItem>
                <MenuItem value="exact">Exact Amount</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Split Among
              </Typography>
              <Stack spacing={1}>
                {group.members.map((member) => (
                  <Box
                    key={member.uid}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={2}
                    py={1}
                    sx={{ borderRadius: 2, bgcolor: 'grey.100' }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>{member.name}</Typography>
                    {splitType === 'equal' ? (
                      <Typography color="primary" fontWeight={600}>
                        Rs. {(amount && !isNaN(amount)) ? (parseFloat(amount) / group.members.length).toFixed(2) : '0.00'}
                      </Typography>
                    ) : (
                      <TextField
                        size="small"
                        type="number"
                        label="Amount"
                        sx={{ width: 120 }}
                        onChange={(e) => {
                          const updated = participants.filter(p => p.uid !== member.uid);
                          updated.push({
                            uid: member.uid,
                            amount: parseFloat(e.target.value) || 0,
                          });
                          setParticipants(updated);
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ mt: 2, px: 3, pb: 2 }}>
          <Button onClick={() => setOpenAddExpense(false)} color="inherit" variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleAddExpense} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
            Add Expense
          </Button>
        </DialogActions>

      </Dialog>


    </>
  );
}

export default GroupDetail;