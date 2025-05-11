import React, { useState, useEffect } from 'react';
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
import { useNotifications } from '../NotificationContext';

const Navbar = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const { notifications, clearNotifications, setNotifications } = useNotifications();

  // Update current time every minute to refresh notification timestamps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Sort notifications by time (newest first)
  notifications.sort((a, b) => {
    const timeA = new Date(a.timestamp || a.time || new Date()).getTime();
    const timeB = new Date(b.timestamp || b.time || new Date()).getTime();
    return timeB - timeA;
  });
  
  const unreadCount = notifications.filter(n => n.unread !== false).length;

  const formatNotificationTime = (notification, index) => {
    const timestamp = notification.timestamp || notification.time;
    if (!timestamp) return 'Some time ago';
    
    const notificationDate = new Date(timestamp);
    if (isNaN(notificationDate.getTime())) return 'Some time ago';
    
    const diffInSeconds = Math.floor((currentTime - notificationDate) / 1000);
    
    // Only the newest notification (index 0) can be "Just now"
    if (index === 0 && diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    return notificationDate.toLocaleDateString(); // For older than 7 days, show date
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === id ? { ...n, unread: false } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n => ({ ...n, unread: false }))
    );
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
              borderRadius: 2,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
              overflow: 'hidden'
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
            <Box sx={{ 
              maxHeight: 400, 
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '0.4em'
              },
              '&::-webkit-scrollbar-track': {
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.1)',
                outline: '1px solid slategrey'
              }
            }}>
              {notifications.map((notification, index) => {
                const title = notification.notification?.title || notification.title || 'Notification';
                const message = notification.notification?.body || '';
                const unread = notification.unread !== false;
                
                return (
                  <MenuItem 
                    key={notification.id || index}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderLeft: unread ? '3px solid' : '3px solid transparent',
                      borderLeftColor: unread ? 'primary.main' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={unread ? 600 : 400}
                          color={unread ? 'text.primary' : 'text.secondary'}
                        >
                          {title}
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
                          {unread ? (
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
                          color: unread ? 'text.primary' : 'text.secondary'
                        }}
                      >
                        {message}
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
                        {formatNotificationTime(notification, index)}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
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
              <Button 
                size="small" 
                onClick={clearNotifications}
                sx={{ color: 'text.secondary', ml: 1 }}
              >
                Clear all
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