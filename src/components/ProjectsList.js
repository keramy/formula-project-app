import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Grid,
  IconButton
} from '@mui/material';
import {
  Build,
  Carpenter,
  ElectricalServices,
  Engineering,
  Person,
  CalendarToday,
  Delete,
  Business
} from '@mui/icons-material';

const projectTypeConfig = {
  'fit-out': {
    label: 'Fit-out',
    icon: <Build />,
    color: '#e67e22',
    bgColor: '#fef5e7'
  },
  millwork: {
    label: 'Millwork',
    icon: <Carpenter />,
    color: '#8e44ad',
    bgColor: '#f4ecf7'
  },
  electrical: {
    label: 'Electrical',
    icon: <ElectricalServices />,
    color: '#f1c40f',
    bgColor: '#fffbf0'
  },
  mep: {
    label: 'MEP',
    icon: <Engineering />,
    color: '#1abc9c',
    bgColor: '#e8f8f5'
  },
  management: {
    label: 'Management',
    icon: <Business />,
    color: '#37444B',
    bgColor: '#f5f5f5'
  }
};

function ProjectsList({ projects, tasks, onSelectProject, onDeleteProject }) {
  if (projects.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No projects created yet. Create your first project to get started!
        </Typography>
      </Box>
    );
  }

  const calculateProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    const overdueTasks = projectTasks.filter(task => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return task.status !== 'completed' && new Date(task.dueDate) < today;
    }).length;

    return {
      total: projectTasks.length,
      completed: completedTasks,
      pending: projectTasks.length - completedTasks,
      overdue: overdueTasks
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDeleteProject = (projectId, projectName) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"? This will also delete all associated tasks.`)) {
      onDeleteProject(projectId);
    }
  };

  return (
    <Grid container spacing={3}>
      {projects.map((project) => {
        const typeConfig = projectTypeConfig[project.type] || projectTypeConfig.construction;
        const progress = calculateProjectProgress(project.id);
        const stats = getProjectStats(project.id);
        
        return (
          <Grid item xs={12} md={6} key={project.id}>
            <Card
              className={`project-card type-${project.type}`}
              sx={{
                cursor: 'pointer',
                borderTop: `4px solid ${typeConfig.color}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => onSelectProject && onSelectProject(project.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: typeConfig.color }}>
                      {typeConfig.icon}
                    </Box>
                    <Chip
                      label={typeConfig.label}
                      size="small"
                      sx={{
                        backgroundColor: typeConfig.bgColor,
                        color: typeConfig.color,
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id, project.name);
                    }}
                    sx={{ color: '#e74c3c' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>

                <Typography variant="h6" component="h3" gutterBottom>
                  {project.name}
                </Typography>

                {project.client && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Client: {project.client}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </Typography>
                </Box>

                {project.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                )}

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: progress === 100 ? '#27ae60' : typeConfig.color
                      }
                    }}
                  />
                </Box>

                {/* Task Statistics */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>{stats.total}</strong> tasks
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#27ae60' }}>
                      <strong>{stats.completed}</strong> done
                    </Typography>
                    {stats.overdue > 0 && (
                      <Typography variant="body2" sx={{ color: '#e74c3c' }}>
                        <strong>{stats.overdue}</strong> overdue
                      </Typography>
                    )}
                  </Box>
                  
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject && onSelectProject(project.id);
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default ProjectsList;