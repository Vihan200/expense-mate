// src/components/GroupCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function GroupCard({ group, currentUser }) {
    const navigate = useNavigate();
  const isAdmin = group.admin_uid === currentUser.uid;
  const handleClick = () => {
    navigate(`/group/${group.id}`);
};
return (
    <Card
      sx={{ borderRadius: 2, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
      onClick={handleClick}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">{group.name}</Typography>

          <Chip
            label={isAdmin ? 'Admin' : 'Member'}
            color={isAdmin ? 'primary' : 'default'}
            size="small"
          />

          <Typography variant="body2">
            Status: {group.isSettled ? 'Settled' : 'Active'}
          </Typography>

          <Typography variant="body1">
            {group.balance > 0
              ? `You are owed Rs. ${group.balance}`
              : `You owe Rs. ${Math.abs(group.balance)}`}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default GroupCard;
