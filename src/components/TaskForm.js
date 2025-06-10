import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FileUpload from './FileUpload';

const priorityLevels = [
  { value: 'low', label: 'Low', color: '#27ae60' },
  { value: 'medium', label: 'Medium', color: '#f39c12' },
  { value: 'high', label: 'High', color: '#e67e22' },
  { value: 'urgent', label: 'Urgent', color: '#e74c3c' }
];

function TaskForm({ projects, teamMembers = [], onSubmit }) {
  const [formData, setFormData] = useState({
    projectId: '',
    name: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: null,
    description: ''
  });
  const [taskFiles, setTaskFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dueDate: date
    });
    if (errors.dueDate) {
      setErrors({
        ...errors,
        dueDate: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project';
    }

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please select a team member';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        projectId: parseInt(formData.projectId),
        assignedTo: parseInt(formData.assignedTo),
        dueDate: formData.dueDate.toISOString().split('T')[0],
        files: taskFiles
      });
      
      setFormData({
        projectId: '',
        name: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: null,
        description: ''
      });
      setTaskFiles([]);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {success && (
          <Alert severity="success">
            Task added successfully!
          </Alert>
        )}
        
        <TextField
          select
          label="Select Project"
          value={formData.projectId}
          onChange={handleChange('projectId')}
          error={!!errors.projectId}
          helperText={errors.projectId || (projects.length === 0 ? 'Create a project first' : '')}
          fullWidth
          required
          disabled={projects.length === 0}
        >
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name} ({project.type})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Task Name"
          value={formData.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          required
        />

        <TextField
          select
          label="Assigned To"
          value={formData.assignedTo || ''}
          onChange={handleChange('assignedTo')}
          error={!!errors.assignedTo}
          helperText={errors.assignedTo || (teamMembers.length === 0 ? 'Add team members first' : '')}
          fullWidth
          required
          disabled={teamMembers.length === 0}
        >
          {teamMembers.filter(member => member.status === 'active').map((member) => (
            <MenuItem key={member.id} value={member.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: member.roleColor }}>
                  {member.initials}
                </Avatar>
                {member.fullName} - {member.role}
              </Box>
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Priority"
          value={formData.priority}
          onChange={handleChange('priority')}
          fullWidth
          required
        >
          {priorityLevels.map((priority) => (
            <MenuItem 
              key={priority.value} 
              value={priority.value}
              sx={{ 
                borderLeft: `4px solid ${priority.color}`,
                marginBottom: 0.5
              }}
            >
              {priority.label}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="Due Date"
          value={formData.dueDate}
          onChange={handleDateChange}
          minDate={new Date()}
          slotProps={{
            textField: {
              error: !!errors.dueDate,
              helperText: errors.dueDate,
              fullWidth: true,
              required: true
            }
          }}
        />

        <TextField
          label="Task Description"
          value={formData.description}
          onChange={handleChange('description')}
          multiline
          rows={2}
          fullWidth
          placeholder="Optional task details..."
        />

        <FileUpload
          taskId={Date.now()}
          projectId={formData.projectId}
          files={taskFiles}
          onFilesChange={setTaskFiles}
          maxFiles={5}
          maxSize={10}
        />

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
          disabled={projects.length === 0}
        >
          Add Task
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default TaskForm;