import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Drafts as MarkAsReadIcon,
  Mail as MarkAsUnreadIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../NotificationContext";
import Tooltip from "@mui/material/Tooltip";

const Navbar = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const { notifications, clearNotifications, setNotifications } =
    useNotifications();

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

  const unreadCount = notifications.filter((n) => n.unread !== false).length;

  const formatNotificationTime = (notification, index) => {
    const timestamp = notification.timestamp || notification.time;
    if (!timestamp) return "Some time ago";

    const notificationDate = new Date(timestamp);
    if (isNaN(notificationDate.getTime())) return "Some time ago";

    const diffInSeconds = Math.floor((currentTime - notificationDate) / 1000);

    // Only the newest notification (index 0) can be "Just now"
    if (index === 0 && diffInSeconds < 60) return "Just now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    return notificationDate.toLocaleDateString(); // For older than 7 days, show date
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => ({ ...n, unread: false }))
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
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
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
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              width: 380,
              borderRadius: "12px",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
              overflow: "hidden",
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 3,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "grey.100",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
            <Box>
              <Tooltip title="Mark all as read">
                <IconButton
                  size="small"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <MarkAsReadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear all notifications">
                <IconButton
                  size="small"
                  onClick={clearNotifications}
                  disabled={notifications.length === 0}
                  sx={{
                    color: "text.secondary",
                    ml: 1,
                    "&:hover": { color: "error.main" },
                  }}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Notification List */}
          {notifications.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <NotificationsIcon
                sx={{
                  fontSize: 48,
                  color: "text.disabled",
                  mb: 2,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ mt: 1 }}
              >
                We'll notify you when something arrives
              </Typography>
            </Box>
          ) : (
            <Box sx={{ py: 1 }}>
              {notifications.map((notification, index) => {
                const title =
                  notification.notification?.title ||
                  notification.title ||
                  "Notification";
                const message =
                  notification.notification?.message ||
                  notification.message ||
                  "";
                const unread = notification.unread !== false;

                return (
                  <MenuItem
                    key={notification.id || index}
                    sx={{
                      py: 1.5,
                      px: 3,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      transition: "background-color 0.2s ease",
                      display: "flex",
                      alignItems: "flex-start",
                      whiteSpace: "normal",
                    }}
                    onClick={() => handleMarkAsRead(notification.id)} // Mark as read when clicked
                  >
                    {/* Notification icon - now swapped colors */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: unread ? "primary.light" : "grey.200", // Swapped colors
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      {unread ? (
                        <MarkAsUnreadIcon
                          fontSize="small"
                          sx={{ color: "primary.main" }}
                        />
                      ) : (
                        <MarkAsReadIcon
                          fontSize="small"
                          sx={{ color: "text.disabled" }}
                        />
                      )}
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={unread ? 500 : 600} // Swapped weights
                        color={unread ? "primary.main" : "text.disabled"} // Swapped colors
                        sx={{ lineHeight: 1.3 }}
                      >
                        {title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: unread ? "primary.main" : "text.disabled", // Swapped colors
                          lineHeight: 1.4,
                          whiteSpace: "normal",
                        }}
                      >
                        {message}
                      </Typography>

                      <Typography
                        variant="caption"
                        display="block"
                        sx={{
                          mt: 1,
                          color: "text.disabled",
                          fontSize: "0.7rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            bgcolor: "text.disabled",
                            mr: 1,
                            flexShrink: 0,
                          }}
                        />
                        {formatNotificationTime(notification, index)}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
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
