import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  Avatar,
  Typography,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Work,
  Star
} from '@mui/icons-material';

const roles = [
  { value: 'project_manager', label: 'Project Manager', color: '#e74c3c', level: 5 },
  { value: 'team_lead', label: 'Team Lead', color: '#e67e22', level: 4 },
  { value: 'senior', label: 'Senior', color: '#f39c12', level: 3 },
  { value: 'junior', label: 'Junior', color: '#27ae60', level: 2 },
  { value: 'client', label: 'Client', color: '#3498db', level: 1 }
];

const departments = [
  { value: 'fit-out', label: 'Fit-out' },
  { value: 'millwork', label: 'Millwork' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'mep', label: 'MEP' },
  { value: 'management', label: 'Management' }
];

function TeamMemberForm({ onSubmit, teamMembers = [] }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    reportsTo: '',
    hourlyRate: '',
    notes: ''
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // Check if email already exists
    if (teamMembers.some(member => member.email === formData.email.trim())) {
      newErrors.email = 'Email already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      const selectedRole = roles.find(r => r.value === formData.role);
      
      onSubmit({
        ...formData,
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        initials: `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase(),
        roleLevel: selectedRole.level,
        roleColor: selectedRole.color,
        status: 'active',
        joinedAt: new Date().toISOString()
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        reportsTo: '',
        hourlyRate: '',
        notes: ''
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  // Get potential managers (higher level roles)
  const currentRoleLevel = formData.role ? roles.find(r => r.value === formData.role)?.level : 0;
  const potentialManagers = teamMembers.filter(member => 
    member.roleLevel > currentRoleLevel && member.status === 'active'
  );

  const generateInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    }
    return '?';
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {success && (
        <Alert severity="success">
          Team member added successfully!
        </Alert>
      )}

      {/* Preview Card */}
      <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          Preview
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: formData.role ? roles.find(r => r.value === formData.role)?.color : '#gray' }}>
            {generateInitials()}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {formData.firstName || formData.lastName ? 
                `${formData.firstName} ${formData.lastName}` : 
                'Team Member Name'
              }
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {formData.role && (
                <Chip 
                  label={roles.find(r => r.value === formData.role)?.label} 
                  size="small"
                  sx={{ 
                    backgroundColor: roles.find(r => r.value === formData.role)?.color + '20',
                    color: roles.find(r => r.value === formData.role)?.color 
                  }}
                />
              )}
              {formData.department && (
                <Typography variant="body2" color="text.secondary">
                  {departments.find(d => d.value === formData.department)?.label}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={handleChange('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
            required
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
            required
          />
        </Grid>
      </Grid>

      <TextField
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        required
        InputProps={{
          startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />

      <TextField
        label="Phone Number"
        value={formData.phone}
        onChange={handleChange('phone')}
        fullWidth
        InputProps={{
          startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Role"
            value={formData.role}
            onChange={handleChange('role')}
            error={!!errors.role}
            helperText={errors.role}
            fullWidth
            required
            InputProps={{
              startAdornment: <Star sx={{ mr: 1, color: 'action.active' }} />,
            }}
          >
            {roles.map((role) => (
              <MenuItem 
                key={role.value} 
                value={role.value}
                sx={{ 
                  borderLeft: `4px solid ${role.color}`,
                  marginBottom: 0.5
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{role.label}</span>
                  <Chip 
                    label={`Level ${role.level}`} 
                    size="small" 
                    sx={{ backgroundColor: role.color + '20', color: role.color }}
                  />
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Department"
            value={formData.department}
            onChange={handleChange('department')}
            error={!!errors.department}
            helperText={errors.department}
            fullWidth
            required
            InputProps={{
              startAdornment: <Work sx={{ mr: 1, color: 'action.active' }} />,
            }}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.value} value={dept.value}>
                {dept.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {potentialManagers.length > 0 && (
        <TextField
          select
          label="Reports To"
          value={formData.reportsTo}
          onChange={handleChange('reportsTo')}
          fullWidth
          helperText="Select a manager (optional)"
        >
          {potentialManagers.map((manager) => (
            <MenuItem key={manager.id} value={manager.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: manager.roleColor }}>
                  {manager.initials}
                </Avatar>
                {manager.fullName} - {roles.find(r => r.value === manager.role)?.label}
              </Box>
            </MenuItem>
          ))}
        </TextField>
      )}

      <TextField
        label="Hourly Rate ($)"
        type="number"
        value={formData.hourlyRate}
        onChange={handleChange('hourlyRate')}
        fullWidth
        helperText="Optional - for time tracking and billing"
      />

      <TextField
        label="Notes"
        value={formData.notes}
        onChange={handleChange('notes')}
        multiline
        rows={3}
        fullWidth
        placeholder="Additional notes about this team member..."
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        sx={{ mt: 2 }}
      >
        Add Team Member
      </Button>
    </Box>
  );
}

export default TeamMemberForm;