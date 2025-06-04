import React from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  Warning
} from '@mui/icons-material';

function StatsCards({ projects, tasks }) {
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  
  // Calculate overdue tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = tasks.filter(task => 
    task.status !== 'completed' && new Date(task.dueDate) < today
  ).length;

  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const statCards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#3498db',
      bgColor: '#e8f4f8'
    },
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#9b59b6',
      bgColor: '#f4ecf7'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#27ae60',
      bgColor: '#eafaf1'
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: '#f39c12',
      bgColor: '#fef9e7'
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: <Warning sx={{ fontSize: 40 }} />,
      color: '#e74c3c',
      bgColor: '#fdf2f2'
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: card.bgColor,
                border: `2px solid ${card.color}20`,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${card.color}30`
                }
              }}
            >
              <Box sx={{ color: card.color, mb: 1 }}>
                {card.icon}
              </Box>
              <Typography variant="h4" component="div" sx={{ 
                fontWeight: 'bold', 
                color: card.color,
                mb: 1 
              }}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Progress Overview */}
      {totalTasks > 0 && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Overall Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: completionPercentage === 100 ? '#27ae60' : '#3498db'
                  }
                }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {Math.round(completionPercentage)}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {completedTasks} of {totalTasks} tasks completed
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default StatsCards;