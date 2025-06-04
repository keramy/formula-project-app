import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import ProjectForm from './components/ProjectForm';
import TaskForm from './components/TaskForm';
import ProjectsList from './components/ProjectsList';
import TasksList from './components/TasksList';
import StatsCards from './components/StatsCards';
import GanttChart from './components/GanttChart';
import TeamMemberForm from './components/TeamMemberForm';
import TeamMembersList from './components/TeamMembersList';
import AdvancedDashboard from './components/AdvancedDashboard';
import './App.css';

// Custom Formula International Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#37444B', // Koyu lacivert - header, ana butonlar
      light: '#5a6b73',
      dark: '#1f2e35',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#C0B19E', // Orta ton - ikincil butonlar, vurgular
      light: '#d4c7b5',
      dark: '#a5967e',
      contrastText: '#37444B'
    },
    background: {
      default: '#F1EEEA', // Ana arkaplan
      paper: '#ffffff'
    },
    info: {
      main: '#DDD0BE', // Açık ton - kartlar, bilgi alanları
      light: '#e9ddd1',
      dark: '#c4b5a0'
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c'
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00'
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f'
    },
    text: {
      primary: '#37444B',
      secondary: '#5a6b73'
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#37444B'
    },
    h2: {
      fontWeight: 700,
      color: '#37444B'
    },
    h3: {
      fontWeight: 600,
      color: '#37444B'
    },
    h4: {
      fontWeight: 600,
      color: '#37444B'
    },
    h5: {
      fontWeight: 600,
      color: '#37444B'
    },
    h6: {
      fontWeight: 500,
      color: '#37444B'
    }
  },
  components: {
    // AppBar özelleştirmesi
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #37444B 0%, #5a6b73 100%)',
          boxShadow: '0 4px 20px rgba(55, 68, 75, 0.3)'
        }
      }
    },
    // Paper (kartlar) özelleştirmesi
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(55, 68, 75, 0.08)',
          border: '1px solid #DDD0BE20'
        }
      }
    },
    // Button özelleştirmesi
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(55, 68, 75, 0.15)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(55, 68, 75, 0.25)',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    // Tab özelleştirmesi
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.95rem',
          '&.Mui-selected': {
            color: '#37444B',
            fontWeight: 600
          }
        }
      }
    },
    // Chip özelleştirmesi
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500
        }
      }
    }
  }
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('formula_projects');
    const savedTasks = localStorage.getItem('formula_tasks');
    const savedTeamMembers = localStorage.getItem('formula_team_members');
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedTeamMembers) {
      setTeamMembers(JSON.parse(savedTeamMembers));
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('formula_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('formula_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('formula_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setProjects([...projects, newProject]);
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    
    // Log task assignment (for demo)
    if (task.assignedTo) {
      const assignee = teamMembers.find(m => m.id === task.assignedTo);
      const project = projects.find(p => p.id === task.projectId);
      
      if (assignee && project) {
        console.log('📧 Task assigned notification would be sent:', {
          taskName: newTask.name,
          assigneeName: assignee.fullName,
          assigneeEmail: assignee.email,
          projectName: project.name
        });
      }
    }
  };

  const updateTask = (taskId, updates) => {
    const oldTask = tasks.find(t => t.id === taskId);
    const updatedTask = { ...oldTask, ...updates };
    
    setTasks(tasks.map(task => 
      task.id === taskId ? updatedTask : task
    ));

    // Log task completion (for demo)
    if (updates.status === 'completed' && oldTask.status !== 'completed') {
      const assignee = teamMembers.find(m => m.id === updatedTask.assignedTo);
      const project = projects.find(p => p.id === updatedTask.projectId);
      
      if (assignee && project) {
        console.log('📧 Task completion notification would be sent:', {
          taskName: updatedTask.name,
          assigneeName: assignee.fullName,
          projectName: project.name,
          completedAt: new Date().toISOString()
        });
      }
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
    setTasks(tasks.filter(task => task.projectId !== projectId));
  };

  // Team Members functions
  const addTeamMember = (member) => {
    const newMember = {
      ...member,
      id: Date.now()
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const updateTeamMember = (memberId, updates) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    ));
  };

  const deleteTeamMember = (memberId) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    // Also update tasks that were assigned to this member
    setTasks(tasks.map(task => 
      task.assignedTo === memberId ? { ...task, assignedTo: null } : task
    ));
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* Header */}
        <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              📋 Formula Project Management
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl">
          {/* Statistics Cards */}
          <StatsCards projects={projects} tasks={tasks} teamMembers={teamMembers} />

          {/* Navigation Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="📊 Dashboard" />
              <Tab label="📈 Analytics" />
              <Tab label="👥 Team Management" />
              <Tab label="📋 Projects & Tasks" />
              <Tab label="🕐 Timeline" />
            </Tabs>
          </Paper>

          {/* Tab Panels */}
          <TabPanel value={currentTab} index={0}>
  {/* Dashboard */}
  <Grid container spacing={4}>
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create New Project
        </Typography>
        <ProjectForm onSubmit={addProject} />
      </Paper>
    </Grid>
    
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Task
        </Typography>
        <TaskForm 
          projects={projects} 
          teamMembers={teamMembers}
          onSubmit={addTask} 
        />
      </Paper>
    </Grid>
  </Grid>
</TabPanel>

<TabPanel value={currentTab} index={1}>
  {/* Analytics Dashboard */}
  <AdvancedDashboard 
    projects={projects}
    tasks={tasks}
    teamMembers={teamMembers}
  />
</TabPanel>

          <TabPanel value={currentTab} index={2}>
            {/* Team Management */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Add Team Member
                  </Typography>
                  <TeamMemberForm 
                    teamMembers={teamMembers}
                    onSubmit={addTeamMember} 
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Team Members ({teamMembers.length})
                  </Typography>
                  <TeamMembersList 
                    teamMembers={teamMembers}
                    tasks={tasks}
                    onUpdateMember={updateTeamMember}
                    onDeleteMember={deleteTeamMember}
                  />
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            {/* Projects & Tasks */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Active Projects ({projects.length})
                  </Typography>
                  <ProjectsList 
                    projects={projects}
                    tasks={tasks}
                    onSelectProject={setSelectedProject}
                    onDeleteProject={deleteProject}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tasks Overview ({tasks.length})
                  </Typography>
                  <TasksList 
                    tasks={tasks}
                    projects={projects}
                    teamMembers={teamMembers}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                  />
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={currentTab} index={4}>
            {/* Timeline */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Project Timeline & Gantt Chart
              </Typography>
              <GanttChart 
                tasks={tasks}
                projects={projects}
                teamMembers={teamMembers}
              />
            </Paper>
          </TabPanel>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;