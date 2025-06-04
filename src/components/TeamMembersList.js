import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider,
  Badge
} from '@mui/material';
import {
  Edit,
  Delete,
  Email,
  Phone,
  Work,
  Person,
  Star,
  AccountTree,
  AccessTime,
  Visibility
} from '@mui/icons-material';

const roles = [
  { value: 'project_manager', label: 'Project Manager', color: '#e74c3c', level: 5 },
  { value: 'team_lead', label: 'Team Lead', color: '#e67e22', level: 4 },
  { value: 'senior', label: 'Senior', color: '#f39c12', level: 3 },
  { value: 'junior', label: 'Junior', color: '#27ae60', level: 2 },
  { value: 'client', label: 'Client', color: '#3498db', level: 1 }
];

const departments = [
  { value: 'construction', label: 'Construction' },
  { value: 'millwork', label: 'Millwork' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'mechanical', label: 'Mechanical' },
  { value: 'management', label: 'Management' },
  { value: 'client', label: 'Client' }
];

function TeamMembersList({ teamMembers, tasks, onUpdateMember, onDeleteMember }) {
  const [editDialog, setEditDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  if (teamMembers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          No team members added yet. Add your first team member to get started!
        </Typography>
      </Box>
    );
  }

  const getMemberStats = (memberId) => {
    const memberTasks = tasks.filter(task => task.assignedTo === memberId);
    const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
    const overdueTasks = memberTasks.filter(task => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return task.status !== 'completed' && new Date(task.dueDate) < today;
    }).length;

    return {
      total: memberTasks.length,
      completed: completedTasks,
      pending: memberTasks.length - completedTasks,
      overdue: overdueTasks,
      completionRate: memberTasks.length > 0 ? Math.round((completedTasks / memberTasks.length) * 100) : 0
    };
  };

  const getReportsCount = (managerId) => {
    return teamMembers.filter(member => member.reportsTo === managerId).length;
  };

  const getManagerName = (managerId) => {
    const manager = teamMembers.find(member => member.id === managerId);
    return manager ? manager.fullName : 'No Manager';
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setEditFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone || '',
      role: member.role,
      department: member.department,
      reportsTo: member.reportsTo || '',
      hourlyRate: member.hourlyRate || '',
      notes: member.notes || '',
      status: member.status
    });
    setEditDialog(true);
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setViewDialog(true);
  };

  const handleSaveEdit = () => {
    const selectedRole = roles.find(r => r.value === editFormData.role);
    
    onUpdateMember(selectedMember.id, {
      ...editFormData,
      fullName: `${editFormData.firstName.trim()} ${editFormData.lastName.trim()}`,
      initials: `${editFormData.firstName.charAt(0)}${editFormData.lastName.charAt(0)}`.toUpperCase(),
      roleLevel: selectedRole.level,
      roleColor: selectedRole.color
    });
    
    setEditDialog(false);
    setSelectedMember(null);
  };

  const handleDelete = (member) => {
    if (window.confirm(`Are you sure you want to delete ${member.fullName}? This action cannot be undone.`)) {
      onDeleteMember(member.id);
    }
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Sort members by role level (highest first) then by name
  const sortedMembers = [...teamMembers].sort((a, b) => {
    if (a.roleLevel !== b.roleLevel) {
      return b.roleLevel - a.roleLevel;
    }
    return a.fullName.localeCompare(b.fullName);
  });

  return (
    <Box>
      <Grid container spacing={3}>
        {sortedMembers.map((member) => {
          const stats = getMemberStats(member.id);
          const reportsCount = getReportsCount(member.id);
          const roleInfo = roles.find(r => r.value === member.role);
          const deptInfo = departments.find(d => d.value === member.department);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={member.id}>
              <Card
                sx={{
                  position: 'relative',
                  borderTop: `4px solid ${member.roleColor}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <CardContent>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: member.status === 'active' ? '#27ae60' : '#95a5a6',
                            border: '2px solid white'
                          }}
                        />
                      }
                    >
                      <Avatar
                        sx={{
                          bgcolor: member.roleColor,
                          width: 56,
                          height: 56,
                          fontSize: 20,
                          fontWeight: 'bold'
                        }}
                      >
                        {member.initials}
                      </Avatar>
                    </Badge>
                    
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="h6" component="h3">
                        {member.fullName}
                      </Typography>
                      <Chip
                        label={roleInfo?.label}
                        size="small"
                        sx={{
                          backgroundColor: member.roleColor + '20',
                          color: member.roleColor,
                          fontWeight: 'bold',
                          mb: 1
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {deptInfo?.label}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleView(member)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(member)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(member)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Contact Info */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {member.email}
                      </Typography>
                    </Box>
                    {member.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {member.phone}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Stats */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Task Performance
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`${stats.total} total`} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`${stats.completed} done`} 
                        size="small" 
                        sx={{ backgroundColor: '#eafaf1', color: '#27ae60' }}
                      />
                      {stats.overdue > 0 && (
                        <Chip 
                          label={`${stats.overdue} overdue`} 
                          size="small" 
                          sx={{ backgroundColor: '#fdf2f2', color: '#e74c3c' }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Completion Rate: {stats.completionRate}%
                    </Typography>
                  </Box>

                  {/* Hierarchy Info */}
                  <Box sx={{ mb: 2 }}>
                    {member.reportsTo && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <AccountTree fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Reports to: {getManagerName(member.reportsTo)}
                        </Typography>
                      </Box>
                    )}
                    {reportsCount > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Manages: {reportsCount} team member{reportsCount > 1 ? 's' : ''}
                      </Typography>
                    )}
                  </Box>

                  {/* Join Date */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Joined: {formatJoinDate(member.joinedAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Team Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  value={editFormData.firstName || ''}
                  onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  value={editFormData.lastName || ''}
                  onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                  fullWidth
                />
              </Grid>
            </Grid>
            
            <TextField
              label="Email"
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              fullWidth
            />
            
            <TextField
              label="Phone"
              value={editFormData.phone || ''}
              onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
              fullWidth
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Role"
                  value={editFormData.role || ''}
                  onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                  fullWidth
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Department"
                  value={editFormData.department || ''}
                  onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                  fullWidth
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            
            <TextField
              select
              label="Status"
              value={editFormData.status || 'active'}
              onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Team Member Details</DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Box sx={{ pt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: selectedMember.roleColor,
                    width: 64,
                    height: 64,
                    fontSize: 24
                  }}
                >
                  {selectedMember.initials}
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedMember.fullName}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {roles.find(r => r.value === selectedMember.role)?.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {departments.find(d => d.value === selectedMember.department)?.label}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
                  <Typography variant="body2">Email: {selectedMember.email}</Typography>
                  {selectedMember.phone && (
                    <Typography variant="body2">Phone: {selectedMember.phone}</Typography>
                  )}
                </Grid>
                
                {selectedMember.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                    <Typography variant="body2">{selectedMember.notes}</Typography>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Statistics</Typography>
                  {(() => {
                    const stats = getMemberStats(selectedMember.id);
                    return (
                      <Box>
                        <Typography variant="body2">Total Tasks: {stats.total}</Typography>
                        <Typography variant="body2">Completed: {stats.completed}</Typography>
                        <Typography variant="body2">Pending: {stats.pending}</Typography>
                        <Typography variant="body2">Overdue: {stats.overdue}</Typography>
                        <Typography variant="body2">Completion Rate: {stats.completionRate}%</Typography>
                      </Box>
                    );
                  })()}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamMembersList;