// src/pages/CreateGroup.jsx
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  Box,
  Stack,
  Chip,
} from '@mui/material';
import Navbar from '../components/Navbar';

const mockUser = { uid: 'abc123', name: 'Dul' };

function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState([]);

  const handleAddMember = () => {
    if (memberEmail && !members.includes(memberEmail)) {
      setMembers([...members, memberEmail]);
      setMemberEmail('');
    }
  };

  const handleSubmit = () => {
    if (!groupName || members.length === 0) {
      alert('Please enter group name and add at least one member.');
      return;
    }

    // TODO: Send to backend later
    console.log('Creating Group:', {
      groupName,
      members,
      createdBy: mockUser.uid,
    });

    alert('Group created successfully!');
    // You can navigate to dashboard here
  };

  return (
    <>
      <Navbar user={mockUser} />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Create New Group
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Member Email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleAddMember}>
                Add
              </Button>
            </Stack>

            <Box>
              {members.map((email, index) => (
                <Chip
                  key={index}
                  label={email}
                  sx={{ mr: 1, mb: 1 }}
                  onDelete={() =>
                    setMembers(members.filter((m) => m !== email))
                  }
                />
              ))}
            </Box>

            <Button variant="contained" onClick={handleSubmit}>
              Create Group
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default CreateGroup;
