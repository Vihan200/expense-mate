import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
  IconButton
} from '@mui/material'; import { useNavigate } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';

function GroupCard({ group, currentUser }) {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(''); // State to hold the uploaded image URL
  const isAdmin = group.admin_uid === currentUser.uid;

  const handleClick = () => {
    navigate(`/group/${group._id}`);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'expense_mate'); // Replace with your Cloudinary preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dqnt23doa/image/upload`,
        formData
      );
      const uploadedImageUrl = response.data.secure_url;
      setImageUrl(uploadedImageUrl);
      updateImg(uploadedImageUrl);  // Pass image URL to updateImg
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed. Please try again.');
    }
  };

  const updateImg = async (uploadedImageUrl) => {
    if (!uploadedImageUrl) {
      alert('No image URL available');
      return;
    }

    try {
      // Prepare the data to send
      const groupData = {
        img: uploadedImageUrl, // Use the uploaded image URL
      };

      const response = await axios.put(
        `${process.env.api_url}/api/groups/image/${group._id}`,
        groupData // Send the image URL in the body
      );

      if (response.status === 200) {
        alert('Image edited successfully!');
        window.location.reload();
      } else {
        alert('Failed to edit image. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <Card sx={{
      borderRadius: 2,
      cursor: 'pointer',
      position: 'relative',
      width: 250,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        boxShadow: 6,
        transform: 'translateY(-4px)',
        '& .upload-overlay': {
          opacity: 1
        }
      }
    }}>
      {/* Image with overlay upload button */}
      <Box sx={{ position: 'relative' }}>
        <img
          src={group.img || "https://www.stokedtotravel.com/wp-content/uploads/2019/06/IMG_6352-800x662.jpg"}
          alt="Group"
          style={{
            width: "100%",
            height: "160px",
            objectFit: 'cover',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}
        />

        {isAdmin ? (
          <Box className="upload-overlay" sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}>
            <input
              accept="image/*"
              id={`group-image-upload-${group._id}`}
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <label htmlFor={`group-image-upload-${group._id}`}>
              <IconButton
                color="primary"
                sx={{
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'background.paper'
                  }
                }}
                component="span"
              >
                <AddPhotoAlternateIcon />
              </IconButton>
            </label>
          </Box>
        ) : (
          <div></div>
        )}

      </Box>

      <CardContent onClick={handleClick} sx={{ pt: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" noWrap>{group.name}</Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={isAdmin ? 'Admin' : 'Member'}
              color={isAdmin ? 'primary' : 'default'}
              size="small"
              variant="outlined"
            />
            <Chip
              label={group.isSettled ? 'Settled' : 'Active'}
              color={group.isSettled ? 'success' : 'warning'}
              size="small"
              variant="outlined"
            />
          </Box>

          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: group.balance > 0 ? 'success.main' : 'error.main'
            }}
          >
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
