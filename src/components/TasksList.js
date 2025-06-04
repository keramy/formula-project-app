import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Grid,
  Avatar
} from '@mui/material';
import {
  CheckCircle,
  Delete,
  Person,
  CalendarToday,
  Assignment,
  Warning,
  Undo
} from '@mui/icons-material';

const priorityConfig = {
  low: {
    label: 'Low',
    color: '#27ae60',
    bgColor: '#eafaf1'
  },
  medium: {
    label: 'Medium',
    color: '#f39c12',
    bgColor: '#fef9e7'
  },
  high: {
    label: 'High',
    color: '#e67e22',
    bgColor: '#fef5e7'
  },
  urgent: {
    label: 'Urgent',
    color: '#e74c3c',
    bgColor: '#fdf2f2'
  }
};

function TasksList({ tasks, projects, teamMembers = [], onUpdateTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          No tasks added yet. Create a project and add your first task!
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCompleteTask = (taskId) => {
    onUpdateTask(taskId, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const handleUndoTask = (taskId) => {
    onUpdateTask(taskId, { 
      status: 'pending',
      completedAt: null
    });
  };

  const handleDeleteTask = (taskId, taskName) => {
    if (window.confirm(`Are you sure you want to delete "${taskName}"?`)) {
      onDeleteTask(taskId);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (b.status === 'completed' && a.status !== 'completed') return -1;
    
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <Grid container spacing={2}>
      {sortedTasks.map((task) => {
        const project = projects.find(p => p.id === task.projectId);
        const priority = priorityConfig[task.priority];
        const overdue = isOverdue(task.dueDate, task.status);
        const daysUntilDue = getDaysUntilDue(task.dueDate);
        
        return (
          <Grid item xs={12} key={task.id}>
            <Card
              className={`task-card priority-${task.priority} ${task.status === 'completed' ? 'status-completed' : ''} ${overdue ? 'status-overdue' : ''}`}
              sx={{
                borderLeft: `4px solid ${overdue ? '#e74c3c' : priority.color}`,
                backgroundColor: task.status === 'completed' ? '#f8f9fa' : 
                               overdue ? '#fff5f5' : 'white',
                opacity: task.status === 'completed' ? 0.7 : 1,
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: 2
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        component="h3"
                        sx={{ 
                          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          flex: 1
                        }}
                      >
                        {task.name}
                        {overdue && (
                          <Warning sx={{ ml: 1, color: '#e74c3c', fontSize: 20 }} />
                        )}
                      </Typography>
                      
                      <Chip
                        label={priority.label}
                        size="small"
                        sx={{
                          backgroundColor: priority.bgColor,
                          color: priority.color,
                          fontWeight: 'bold'
                        }}
                      />
                      
                      {task.status === 'completed' && (
                        <Chip
                          label="Completed"
                          size="small"
                          color="success"
                          icon={<CheckCircle />}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Assignment fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Project:</strong> {project ? project.name : 'Unknown Project'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar sx={{ width: 20, height: 20, fontSize: 12, bgcolor: (() => {
                        const assignedMember = teamMembers.find(member => member.id === task.assignedTo);
                        return assignedMember ? assignedMember.roleColor : '#gray';
                      })() }}>
                        {(() => {
                          const assignedMember = teamMembers.find(member => member.id === task.assignedTo);
                          return assignedMember ? assignedMember.initials : '?';
                        })()}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Assigned to:</strong> {(() => {
                          const assignedMember = teamMembers.find(member => member.id === task.assignedTo);
                          return assignedMember ? assignedMember.fullName : 'Unassigned';
                        })()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography 
                        variant="body2" 
                        color={overdue ? 'error' : 'text.secondary'}
                        sx={{ fontWeight: overdue ? 'bold' : 'normal' }}
                      >
                        <strong>Due:</strong> {formatDate(task.dueDate)}
                        {task.status !== 'completed' && (
                          <span style={{ marginLeft: 8 }}>
                            {overdue ? (
                              <span style={{ color: '#e74c3c' }}>
                                (Overdue by {Math.abs(daysUntilDue)} days)
                              </span>
                            ) : daysUntilDue === 0 ? (
                              <span style={{ color: '#f39c12' }}>(Due today)</span>
                            ) : daysUntilDue === 1 ? (
                              <span style={{ color: '#e67e22' }}>(Due tomorrow)</span>
                            ) : (
                              <span>({daysUntilDue} days left)</span>
                            )}
                          </span>
                        )}
                      </Typography>
                    </Box>

                    {task.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <strong>Description:</strong> {task.description}
                      </Typography>
                    )}

                    {/* Files */}
                    {task.files && task.files.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                          📎 Attached Files:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {task.files.map((file, index) => (
                            <Chip
                              key={index}
                              label={file.name}
                              size="small"
                              onClick={() => {
                                window.open(file.url, '_blank');
                              }}
                              sx={{ 
                                backgroundColor: '#F1EEEA',
                                '&:hover': { backgroundColor: '#DDD0BE' }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Show completion date if completed */}
                    {task.status === 'completed' && task.completedAt && (
                      <Typography variant="body2" sx={{ color: '#27ae60', mb: 2 }}>
                        <strong>Completed on:</strong> {formatDate(task.completedAt)}
                      </Typography>
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                    {task.status === 'completed' ? (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        startIcon={<Undo />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUndoTask(task.id);
                        }}
                      >
                        Undo
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteTask(task.id);
                        }}
                      >
                        Complete
                      </Button>
                    )}
                    
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id, task.name);
                      }}
                      sx={{ alignSelf: 'center' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default TasksList;