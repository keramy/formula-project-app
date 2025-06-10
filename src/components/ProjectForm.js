import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const projectTypes = [
  { value: 'fit-out', label: 'Fit-out' },
  { value: 'millwork', label: 'Millwork' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'mep', label: 'MEP' },
  { value: 'management', label: 'Management' }
];

function ProjectForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    startDate: null,
    endDate: null,
    client: '',
    description: ''
  });
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

  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Project type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0]
      });
      
      setFormData({
        name: '',
        type: '',
        startDate: null,
        endDate: null,
        client: '',
        description: ''
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {success && (
          <Alert severity="success">
            Project created successfully!
          </Alert>
        )}
        
        <TextField
          label="Project Name"
          value={formData.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          required
        />

        <TextField
          select
          label="Project Type"
          value={formData.type}
          onChange={handleChange('type')}
          error={!!errors.type}
          helperText={errors.type}
          fullWidth
          required
        >
          {projectTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="Start Date"
          value={formData.startDate}
          onChange={handleDateChange('startDate')}
          slotProps={{
            textField: {
              error: !!errors.startDate,
              helperText: errors.startDate,
              fullWidth: true,
              required: true
            }
          }}
        />

        <DatePicker
          label="End Date"
          value={formData.endDate}
          onChange={handleDateChange('endDate')}
          slotProps={{
            textField: {
              error: !!errors.endDate,
              helperText: errors.endDate,
              fullWidth: true,
              required: true
            }
          }}
        />

        <TextField
          label="Client Name"
          value={formData.client}
          onChange={handleChange('client')}
          fullWidth
        />

        <TextField
          label="Description"
          value={formData.description}
          onChange={handleChange('description')}
          multiline
          rows={3}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          Create Project
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default ProjectForm;