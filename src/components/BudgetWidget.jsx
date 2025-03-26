// src/components/BudgetWidget.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BudgetWidget = ({ totalIncome, totalExpense }) => {
  const navigate = useNavigate();
  const balance = totalIncome - totalExpense;

  return (
    <Card
      onClick={() => navigate('/my-budget')}
      sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 }, p: 1 }}
    >
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          My Budget Summary
        </Typography>
        <Box mt={1}>
          <Typography variant="body2">Income: Rs. {totalIncome}</Typography>
          <Typography variant="body2">Expenses: Rs. {totalExpense}</Typography>
          <Typography variant="body2" color={balance >= 0 ? 'green' : 'red'}>
            Balance: Rs. {balance}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BudgetWidget;