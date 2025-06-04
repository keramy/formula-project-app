import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Assignment,
  People,
  Schedule,
  Warning,
  CheckCircle,
  Star,
  DateRange
} from '@mui/icons-material';

// Color palettes for charts
const COLORS = {
  primary: '#37444B',
  secondary: '#C0B19E',
  light: '#DDD0BE',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3'
};

const pieColors = [COLORS.primary, COLORS.secondary, COLORS.light, COLORS.success];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function AdvancedDashboard({ projects, tasks, teamMembers }) {
  const [analyticsTab, setAnalyticsTab] = useState(0);

  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    overdueTasks: tasks.filter(t => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return t.status !== 'completed' && new Date(t.dueDate) < today;
    }).length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
  };

  // Project type distribution
  const projectTypeData = [
    { name: 'Construction', value: projects.filter(p => p.type === 'construction').length },
    { name: 'Millwork', value: projects.filter(p => p.type === 'millwork').length },
    { name: 'Electrical', value: projects.filter(p => p.type === 'electrical').length },
    { name: 'Mechanical', value: projects.filter(p => p.type === 'mechanical').length }
  ].filter(item => item.value > 0);

  // Team performance data
  const teamPerformanceData = teamMembers.map(member => {
    const memberTasks = tasks.filter(t => t.assignedTo === member.id);
    const completedTasks = memberTasks.filter(t => t.status === 'completed').length;
    const completionRate = memberTasks.length > 0 ? (completedTasks / memberTasks.length) * 100 : 0;
    
    return {
      name: member.fullName.split(' ')[0],
      fullName: member.fullName,
      completed: completedTasks,
      total: memberTasks.length,
      rate: Math.round(completionRate),
      role: member.role
    };
  }).filter(member => member.total > 0).sort((a, b) => b.rate - a.rate);

  // Upcoming deadlines
  const upcomingDeadlines = tasks
    .filter(task => task.status !== 'completed')
    .map(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      const project = projects.find(p => p.id === task.projectId);
      const assignee = teamMembers.find(m => m.id === task.assignedTo);
      
      return {
        ...task,
        daysLeft,
        projectName: project?.name || 'Unknown',
        assigneeName: assignee?.fullName || 'Unassigned'
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  return (
    <Box>
      {/* Main Stats Cards - Always Visible */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            title: 'Total Projects', 
            value: stats.totalProjects, 
            icon: <Assignment />, 
            color: COLORS.primary,
            subtitle: 'Active projects'
          },
          { 
            title: 'Total Tasks', 
            value: stats.totalTasks, 
            icon: <Schedule />, 
            color: COLORS.secondary,
            subtitle: 'All tasks'
          },
          { 
            title: 'Completion Rate', 
            value: `${stats.completionRate}%`, 
            icon: <CheckCircle />, 
            color: COLORS.success,
            subtitle: `${stats.completedTasks}/${stats.totalTasks} completed`
          },
          { 
            title: 'Team Members', 
            value: stats.activeMembers, 
            icon: <People />, 
            color: COLORS.info,
            subtitle: 'Active members'
          },
          { 
            title: 'Overdue Tasks', 
            value: stats.overdueTasks, 
            icon: <Warning />, 
            color: COLORS.error,
            subtitle: stats.overdueTasks > 0 ? 'Need attention' : 'All on track'
          }
        ].map((kpi, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${kpi.color}10 0%, ${kpi.color}20 100%)`,
              border: `1px solid ${kpi.color}30`,
              height: '100%'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ color: kpi.color, mb: 1 }}>
                  {React.cloneElement(kpi.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Typography variant="h5" sx={{ color: kpi.color, fontWeight: 'bold', mb: 0.5 }}>
                  {kpi.value}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {kpi.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {kpi.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={analyticsTab} 
          onChange={(e, newValue) => setAnalyticsTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="📊 Overview" />
          <Tab label="👥 Team Performance" />
          <Tab label="⏰ Deadlines" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={analyticsTab} index={0}>
        {/* Overview Tab */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 350 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment color="primary" />
                Project Types Distribution
              </Typography>
              {projectTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={projectTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280 }}>
                  <Typography color="text.secondary">No project data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 350 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="primary" />
                Project Progress Summary
              </Typography>
              <Box sx={{ py: 2 }}>
                {projects.length > 0 ? projects.map(project => {
                  const projectTasks = tasks.filter(t => t.projectId === project.id);
                  const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
                  const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
                  
                  return (
                    <Box key={project.id} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {project.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round(progress)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: progress === 100 ? COLORS.success : COLORS.primary
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {completedTasks}/{projectTasks.length} tasks completed
                      </Typography>
                    </Box>
                  );
                }) : (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No projects available
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={analyticsTab} index={1}>
        {/* Team Performance Tab */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People color="primary" />
                Team Performance Overview
              </Typography>
              {teamPerformanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {data.fullName}
                              </Typography>
                              <Typography variant="body2">
                                Completion Rate: {data.rate}%
                              </Typography>
                              <Typography variant="body2">
                                Completed: {data.completed}/{data.total} tasks
                              </Typography>
                            </Paper>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="rate" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                  <Typography color="text.secondary">No team performance data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={analyticsTab} index={2}>
        {/* Deadlines Tab */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DateRange color="primary" />
                Upcoming Deadlines
              </Typography>
              {upcomingDeadlines.length > 0 ? (
                <List>
                  {upcomingDeadlines.map((task, index) => (
                    <ListItem key={task.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: task.daysLeft < 0 ? COLORS.error : task.daysLeft <= 1 ? COLORS.warning : COLORS.primary,
                          color: 'white'
                        }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Project: {task.projectName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Assigned to: {task.assigneeName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={
                          task.daysLeft < 0 
                            ? `${Math.abs(task.daysLeft)} days overdue`
                            : task.daysLeft === 0 
                              ? 'Due today'
                              : `${task.daysLeft} days left`
                        }
                        size="small"
                        color={
                          task.daysLeft < 0 ? 'error' : 
                          task.daysLeft <= 1 ? 'warning' : 
                          'default'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No upcoming deadlines
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
}

export default AdvancedDashboard;