import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Drafts as MarkAsReadIcon,
  Mail as MarkAsUnreadIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Message',
      message: 'You received a new message from John Doe',
      time: new Date(),
      unread: true
    },
    {
      id: 2,
      title: 'Payment Received',
      message: 'Invoice #1234 has been paid',
      time: new Date(Date.now() - 86400000), // 1 day ago
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === id ? { ...n, unread: !n.unread } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n => ({ ...n, unread: false }))
    );
  };

  const formatNotificationTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (hours < 1) return `${minutes}m ago`;
    if (days < 1) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ExpenseMate
        </Typography>

        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              width: 360,
              maxHeight: 500,
              borderRadius: 2,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.15)'
            }
          }}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
          </Box>

          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {notifications.map((notification) => (
                <MenuItem 
                  key={notification.id} 
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderLeft: notification.unread ? '3px solid' : '3px solid transparent',
                    borderLeftColor: notification.unread ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography 
                        variant="subtitle2" 
                        fontWeight={notification.unread ? 600 : 400}
                        color={notification.unread ? 'text.primary' : 'text.secondary'}
                      >
                        {notification.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                            backgroundColor: 'transparent'
                          }
                        }}
                      >
                        {notification.unread ? (
                          <MarkAsUnreadIcon fontSize="small" />
                        ) : (
                          <MarkAsReadIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 0.5,
                        color: notification.unread ? 'text.primary' : 'text.secondary'
                      }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      display="block" 
                      sx={{ 
                        mt: 1,
                        color: 'text.secondary',
                        fontSize: '0.75rem'
                      }}
                    >
                      {formatNotificationTime(notification.time)}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Box>
          )}

          {notifications.length > 0 && (
            <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
              <Button 
                size="small" 
                onClick={handleMarkAllAsRead}
                startIcon={<DoneAllIcon />}
                sx={{ color: 'text.secondary' }}
              >
                Mark all as read
              </Button>
            </Box>
          )}
        </Menu>

        <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;