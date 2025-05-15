
import React, { useState } from 'react';
import axios from 'axios';

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
import { ArrowBackIos } from '@mui/icons-material'; 
import { useNavigate } from 'react-router-dom'; 
import { source } from '@cloudinary/url-gen/actions/overlay';
const User = { uid: localStorage.getItem("email"), name: localStorage.getItem("displayName") };

function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  // const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState('');
  const navigate = useNavigate();

  // const handleAddMember = () => {
  //   if (memberEmail && !members.includes(memberEmail)) {
  //     setMembers([...members, memberEmail]);
  //     setMemberEmail('');
  //   }
  // };

  const handleSubmit = async () => {
    if (!groupName || members.length === 0) {
      alert('Please enter group name and add at least one member.');
      return;
    }
    try {
      // Prepare the data to send
      const groupData = {
        name: groupName,
        member: members,
        admin_uid: User.uid,
      };
      const response = await axios.post(`${process.env.api_url}/api/groups`, groupData);
  
      if (response.status === 200) {
        alert('Group created successfully!');
        navigate('/dashboard'); 
      } else {
        alert('Failed to create group. Please try again.');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <Navbar user={User} />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
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
          <Typography variant="h5" gutterBottom>
            Create New Group
          </Typography>
        </Stack>
          

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
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                fullWidth
                placeholder='EX :- abc@gmail.com,123@gmail.com'
              />
        
            </Stack>

            {/* <Box>
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
            </Box> */}

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