import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Email,
  NotificationsActive,
  Schedule,
  Task,
  CheckCircle,
  Warning,
  Settings,
  Send
} from '@mui/icons-material';

const notificationTypes = [
  {
    id: 'task_assigned',
    label: 'Task Assignment',
    description: 'When a new task is assigned to a team member',
    icon: <Task />,
    defaultEnabled: true
  },
  {
    id: 'deadline_reminder',
    label: 'Deadline Reminders',
    description: 'Reminders before task deadlines',
    icon: <Schedule />,
    defaultEnabled: true
  },
  {
    id: 'task_completed',
    label: 'Task Completion',
    description: 'When tasks are marked as completed',
    icon: <CheckCircle />,
    defaultEnabled: false
  },
  {
    id: 'overdue_tasks',
    label: 'Overdue Tasks',
    description: 'Daily alerts for overdue tasks',
    icon: <Warning />,
    defaultEnabled: true
  },
  {
    id: 'project_updates',
    label: 'Project Updates',
    description: 'Weekly project progress reports',
    icon: <NotificationsActive />,
    defaultEnabled: false
  }
];

function EmailSettings({ teamMembers, onSaveSettings }) {
  const [emailSettings, setEmailSettings] = useState({
    enabled: false,
    smtpServer: '',
    smtpPort: '587',
    email: '',
    password: '',
    senderName: 'Formula Project Management',
    notifications: {},
    reminderDays: 2
  });
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('formula_email_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setEmailSettings({
        ...emailSettings,
        ...parsed,
        notifications: {
          ...notificationTypes.reduce((acc, type) => ({
            ...acc,
            [type.id]: type.defaultEnabled
          }), {}),
          ...parsed.notifications
        }
      });
    } else {
      // Set default notification settings
      setEmailSettings(prev => ({
        ...prev,
        notifications: notificationTypes.reduce((acc, type) => ({
          ...acc,
          [type.id]: type.defaultEnabled
        }), {})
      }));
    }
  }, []);

  const handleSettingChange = (field, value) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationToggle = (notificationId) => {
    setEmailSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [notificationId]: !prev.notifications[notificationId]
      }
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('formula_email_settings', JSON.stringify(emailSettings));
    onSaveSettings && onSaveSettings(emailSettings);
    setSuccess('Email settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      setError('Please enter a test email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate email sending (in real app, this would call backend API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock email content
      const emailContent = {
        to: testEmail,
        subject: 'Test Email from Formula Project Management',
        body: `
          <h2>🎉 Email Configuration Test</h2>
          <p>Congratulations! Your email settings are working correctly.</p>
          <p><strong>Sender:</strong> ${emailSettings.senderName}</p>
          <p><strong>SMTP Server:</strong> ${emailSettings.smtpServer}:${emailSettings.smtpPort}</p>
          <p><strong>Test sent at:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is a test email from Formula Project Management system.
          </p>
        `
      };

      console.log('Test email would be sent:', emailContent);
      setSuccess(`Test email sent successfully to ${testEmail}!`);
      
    } catch (err) {
      setError('Failed to send test email. Please check your settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Main Email Settings */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Email color="primary" />
          <Typography variant="h6">Email Configuration</Typography>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={emailSettings.enabled}
              onChange={(e) => handleSettingChange('enabled', e.target.checked)}
            />
          }
          label="Enable Email Notifications"
          sx={{ mb: 3 }}
        />

        {emailSettings.enabled && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="SMTP Server"
                value={emailSettings.smtpServer}
                onChange={(e) => handleSettingChange('smtpServer', e.target.value)}
                fullWidth
                placeholder="smtp.gmail.com"
                helperText="Gmail: smtp.gmail.com, Outlook: smtp-mail.outlook.com"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="SMTP Port"
                value={emailSettings.smtpPort}
                onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                fullWidth
                placeholder="587"
                helperText="Usually 587 for TLS or 465 for SSL"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email Address"
                type="email"
                value={emailSettings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
                fullWidth
                placeholder="notifications@yourcompany.com"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email Password / App Password"
                type="password"
                value={emailSettings.password}
                onChange={(e) => handleSettingChange('password', e.target.value)}
                fullWidth
                helperText="Use App Password for Gmail"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Sender Name"
                value={emailSettings.senderName}
                onChange={(e) => handleSettingChange('senderName', e.target.value)}
                fullWidth
                placeholder="Formula Project Management"
              />
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Notification Settings */}
      {emailSettings.enabled && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Settings color="primary" />
            <Typography variant="h6">Notification Settings</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Deadline Reminder Days</InputLabel>
                <Select
                  value={emailSettings.reminderDays}
                  onChange={(e) => handleSettingChange('reminderDays', e.target.value)}
                >
                  <MenuItem value={1}>1 day before</MenuItem>
                  <MenuItem value={2}>2 days before</MenuItem>
                  <MenuItem value={3}>3 days before</MenuItem>
                  <MenuItem value={7}>1 week before</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>
            Notification Types
          </Typography>

          <List>
            {notificationTypes.map((type) => (
              <ListItem key={type.id} sx={{ px: 0 }}>
                <ListItemIcon>
                  {type.icon}
                </ListItemIcon>
                <ListItemText
                  primary={type.label}
                  secondary={type.description}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailSettings.notifications[type.id] || false}
                      onChange={() => handleNotificationToggle(type.id)}
                    />
                  }
                  label=""
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Test Email Section */}
      {emailSettings.enabled && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Send color="primary" />
            <Typography variant="h6">Test Email Configuration</Typography>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                label="Test Email Address"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                fullWidth
                placeholder="test@example.com"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                onClick={sendTestEmail}
                disabled={loading || !emailSettings.smtpServer || !emailSettings.email}
                fullWidth
                startIcon={<Send />}
              >
                {loading ? 'Sending...' : 'Send Test Email'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          onClick={saveSettings}
          startIcon={<Settings />}
        >
          Save Email Settings
        </Button>
      </Box>
    </Box>
  );
}

export default EmailSettings;