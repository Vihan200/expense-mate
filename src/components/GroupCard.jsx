import React, { useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

function GroupCard({ group, currentUser }) {
  const navigate = useNavigate();
  const isAdmin = group.admin_uid === currentUser.uid;
  const fileInputRef = useRef();

  const handleClick = () => {
    navigate(`/group/${group.id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click(); // Trigger hidden file input
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'expense_mate'); // replace with your Cloudinary preset

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dqnt23doa/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        console.log("Uploaded image URL:", data.secure_url);
        // You can now save this URL to your DB via an API call
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <Card
      sx={{ borderRadius: 2, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
      
    >
      <div style={{ position: 'relative' }}>
        <img
          src="https://www.stokedtotravel.com/wp-content/uploads/2019/06/IMG_6352-800x662.jpg"
          alt="Group"
          style={{ width: "250px", height: "260px", objectFit: "cover" }}
        />
        {isAdmin && (
          <>
            <IconButton
              size="small"
              onClick={handleEditClick}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'white',
                '&:hover': { backgroundColor: '#f0f0f0' }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>

      <CardContent onClick={handleClick}>
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
