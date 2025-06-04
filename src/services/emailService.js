// E-mail Service for Formula Project Management
// In production, this would connect to a backend API

class EmailService {
  constructor() {
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('formula_email_settings');
    return saved ? JSON.parse(saved) : { enabled: false };
  }

  updateSettings(newSettings) {
    this.settings = newSettings;
    localStorage.setItem('formula_email_settings', JSON.stringify(newSettings));
  }

  isEnabled() {
    return this.settings.enabled && this.settings.smtpServer && this.settings.email;
  }

  // Email Templates
  getEmailTemplate(type, data) {
    const baseStyle = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    `;
    const footerStyle = `
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This email was sent by Formula Project Management System</p>
          <p>If you no longer wish to receive these emails, please contact your administrator.</p>
        </div>
      </div>
    `;

    switch (type) {
      case 'task_assigned':
        return {
          subject: `📋 New Task Assigned: ${data.taskName}`,
          html: baseStyle + `
            <h2 style="color: #2c3e50; margin-bottom: 20px;">🎯 New Task Assigned</h2>
            <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="margin: 0; color: #3498db;">${data.taskName}</h3>
            </div>
            
            <p><strong>Project:</strong> ${data.projectName}</p>
            <p><strong>Assigned to:</strong> ${data.assigneeName}</p>
            <p><strong>Priority:</strong> <span style="color: ${data.priorityColor}; font-weight: bold;">${data.priority.toUpperCase()}</span></p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            
            ${data.description ? `<p><strong>Description:</strong></p><div style="background-color: #f8f9fa; padding: 10px; border-radius: 3px;">${data.description}</div>` : ''}
            
            <div style="margin-top: 30px; padding: 15px; background-color: #eafaf1; border-radius: 5px;">
              <p style="margin: 0; color: #27ae60;"><strong>🚀 Ready to get started?</strong></p>
              <p style="margin: 5px 0 0 0;">Log in to the Formula Project Management system to view task details and track your progress.</p>
            </div>
          ` + footerStyle
        };

      case 'deadline_reminder':
        return {
          subject: `⏰ Deadline Reminder: ${data.taskName} (Due in ${data.daysLeft} day${data.daysLeft > 1 ? 's' : ''})`,
          html: baseStyle + `
            <h2 style="color: #e67e22; margin-bottom: 20px;">⏰ Deadline Reminder</h2>
            <div style="background-color: #fef9e7; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #f39c12;">
              <h3 style="margin: 0; color: #e67e22;">${data.taskName}</h3>
              <p style="margin: 5px 0 0 0; color: #f39c12; font-weight: bold;">Due in ${data.daysLeft} day${data.daysLeft > 1 ? 's' : ''}</p>
            </div>
            
            <p><strong>Project:</strong> ${data.projectName}</p>
            <p><strong>Assigned to:</strong> ${data.assigneeName}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            <p><strong>Priority:</strong> <span style="color: ${data.priorityColor}; font-weight: bold;">${data.priority.toUpperCase()}</span></p>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #fff5f5; border-radius: 5px; border-left: 4px solid #e74c3c;">
              <p style="margin: 0; color: #e74c3c;"><strong>⚡ Action Required</strong></p>
              <p style="margin: 5px 0 0 0;">This task is due soon. Please ensure it's completed on time to keep the project on track.</p>
            </div>
          ` + footerStyle
        };

      case 'task_completed':
        return {
          subject: `✅ Task Completed: ${data.taskName}`,
          html: baseStyle + `
            <h2 style="color: #27ae60; margin-bottom: 20px;">🎉 Task Completed</h2>
            <div style="background-color: #eafaf1; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #27ae60;">
              <h3 style="margin: 0; color: #27ae60;">${data.taskName}</h3>
              <p style="margin: 5px 0 0 0; color: #27ae60; font-weight: bold;">Completed by ${data.completedBy}</p>
            </div>
            
            <p><strong>Project:</strong> ${data.projectName}</p>
            <p><strong>Completed on:</strong> ${data.completedDate}</p>
            <p><strong>Original Due Date:</strong> ${data.dueDate}</p>
            <p><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">${data.onTime ? 'ON TIME' : 'LATE'}</span></p>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #eafaf1; border-radius: 5px;">
              <p style="margin: 0; color: #27ae60;"><strong>🎯 Great Work!</strong></p>
              <p style="margin: 5px 0 0 0;">This task has been successfully completed. Keep up the excellent work!</p>
            </div>
          ` + footerStyle
        };

      case 'overdue_tasks':
        return {
          subject: `🚨 Overdue Tasks Alert - ${data.overdueCount} task${data.overdueCount > 1 ? 's' : ''} require attention`,
          html: baseStyle + `
            <h2 style="color: #e74c3c; margin-bottom: 20px;">🚨 Overdue Tasks Alert</h2>
            <div style="background-color: #fdf2f2; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #e74c3c;">
              <h3 style="margin: 0; color: #e74c3c;">${data.overdueCount} Task${data.overdueCount > 1 ? 's' : ''} Overdue</h3>
              <p style="margin: 5px 0 0 0; color: #e74c3c;">Immediate attention required</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h4 style="color: #2c3e50; margin-bottom: 15px;">Overdue Tasks:</h4>
              ${data.overdueTasks.map(task => `
                <div style="background-color: #fff5f5; padding: 10px; margin-bottom: 10px; border-radius: 3px; border-left: 3px solid #e74c3c;">
                  <strong>${task.name}</strong><br>
                  <span style="font-size: 12px; color: #666;">Project: ${task.projectName} | Due: ${task.dueDate} | Assigned: ${task.assigneeName}</span>
                </div>
              `).join('')}
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #fdf2f2; border-radius: 5px;">
              <p style="margin: 0; color: #e74c3c;"><strong>⚠️ Urgent Action Required</strong></p>
              <p style="margin: 5px 0 0 0;">Please review and update these overdue tasks to keep projects on schedule.</p>
            </div>
          ` + footerStyle
        };

      case 'project_update':
        return {
          subject: `📊 Weekly Project Update - ${data.projectName}`,
          html: baseStyle + `
            <h2 style="color: #3498db; margin-bottom: 20px;">📊 Weekly Project Update</h2>
            <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="margin: 0; color: #3498db;">${data.projectName}</h3>
              <p style="margin: 5px 0 0 0; color: #3498db;">Progress: ${data.progress}%</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h4 style="color: #2c3e50;">📈 Progress Summary</h4>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                <p><strong>Total Tasks:</strong> ${data.totalTasks}</p>
                <p><strong>Completed:</strong> <span style="color: #27ae60;">${data.completedTasks}</span></p>
                <p><strong>In Progress:</strong> <span style="color: #f39c12;">${data.pendingTasks}</span></p>
                <p><strong>Overdue:</strong> <span style="color: #e74c3c;">${data.overdueTasks}</span></p>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h4 style="color: #2c3e50;">👥 Team Performance</h4>
              ${data.teamStats.map(member => `
                <div style="background-color: #f8f9fa; padding: 10px; margin-bottom: 8px; border-radius: 3px;">
                  <strong>${member.name}</strong> - ${member.completedTasks} tasks completed
                </div>
              `).join('')}
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e8f4f8; border-radius: 5px;">
              <p style="margin: 0; color: #3498db;"><strong>📅 Next Week Focus</strong></p>
              <p style="margin: 5px 0 0 0;">Continue monitoring progress and support team members with upcoming deadlines.</p>
            </div>
          ` + footerStyle
        };

      default:
        return {
          subject: 'Notification from Formula Project Management',
          html: baseStyle + `
            <h2>Notification</h2>
            <p>You have a new notification from Formula Project Management.</p>
          ` + footerStyle
        };
    }
  }

  // Mock email sending function
  async sendEmail(to, subject, html) {
    if (!this.isEnabled()) {
      console.log('Email service not enabled');
      return false;
    }

    try {
      // In production, this would make an API call to your backend
      // Backend would then use nodemailer or similar to send actual emails
      
      console.log('📧 EMAIL SENT (Mock)', {
        from: `${this.settings.senderName} <${this.settings.email}>`,
        to: to,
        subject: subject,
        html: html,
        timestamp: new Date().toISOString()
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Log to localStorage for demo purposes
      this.logEmail(to, subject, html);

      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Log emails for demo (in production, this would be in database)
  logEmail(to, subject, html) {
    const logs = JSON.parse(localStorage.getItem('formula_email_logs') || '[]');
    logs.unshift({
      id: Date.now(),
      to,
      subject,
      html,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
    
    // Keep only last 50 emails
    if (logs.length > 50) logs.splice(50);
    
    localStorage.setItem('formula_email_logs', JSON.stringify(logs));
  }

  // Get email logs for viewing
  getEmailLogs() {
    return JSON.parse(localStorage.getItem('formula_email_logs') || '[]');
  }

  // Clear email logs
  clearEmailLogs() {
    localStorage.removeItem('formula_email_logs');
  }
}

// Notification Manager - handles when to send emails
class NotificationManager {
  constructor(emailService) {
    this.emailService = emailService;
  }

  // Send task assignment notification
  async notifyTaskAssigned(task, project, assignee) {
    if (!this.emailService.settings.notifications?.task_assigned) return;

    const priorityColors = {
      low: '#27ae60',
      medium: '#f39c12',
      high: '#e67e22',
      urgent: '#e74c3c'
    };

    const emailData = {
      taskName: task.name,
      projectName: project.name,
      assigneeName: assignee.fullName,
      priority: task.priority,
      priorityColor: priorityColors[task.priority],
      dueDate: new Date(task.dueDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      description: task.description
    };

    const template = this.emailService.getEmailTemplate('task_assigned', emailData);
    return await this.emailService.sendEmail(assignee.email, template.subject, template.html);
  }

  // Send deadline reminder
  async notifyDeadlineReminder(task, project, assignee, daysLeft) {
    if (!this.emailService.settings.notifications?.deadline_reminder) return;

    const priorityColors = {
      low: '#27ae60',
      medium: '#f39c12',
      high: '#e67e22',
      urgent: '#e74c3c'
    };

    const emailData = {
      taskName: task.name,
      projectName: project.name,
      assigneeName: assignee.fullName,
      priority: task.priority,
      priorityColor: priorityColors[task.priority],
      dueDate: new Date(task.dueDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      daysLeft
    };

    const template = this.emailService.getEmailTemplate('deadline_reminder', emailData);
    return await this.emailService.sendEmail(assignee.email, template.subject, template.html);
  }

  // Send task completion notification
  async notifyTaskCompleted(task, project, assignee, completedBy) {
    if (!this.emailService.settings.notifications?.task_completed) return;

    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const onTime = now <= dueDate;

    const emailData = {
      taskName: task.name,
      projectName: project.name,
      completedBy: completedBy.fullName,
      completedDate: now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      dueDate: dueDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      onTime
    };

    const template = this.emailService.getEmailTemplate('task_completed', emailData);
    
    // Send to project managers and team leads
    const managersAndLeads = this.getManagersAndLeads();
    for (const manager of managersAndLeads) {
      await this.emailService.sendEmail(manager.email, template.subject, template.html);
    }
  }

  // Send overdue tasks alert
  async notifyOverdueTasks(overdueTasks, projects, teamMembers) {
    if (!this.emailService.settings.notifications?.overdue_tasks) return;

    const tasksWithDetails = overdueTasks.map(task => {
      const project = projects.find(p => p.id === task.projectId);
      const assignee = teamMembers.find(m => m.id === task.assignedTo);
      
      return {
        name: task.name,
        projectName: project?.name || 'Unknown Project',
        assigneeName: assignee?.fullName || 'Unassigned',
        dueDate: new Date(task.dueDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
    });

    const emailData = {
      overdueCount: overdueTasks.length,
      overdueTasks: tasksWithDetails
    };

    const template = this.emailService.getEmailTemplate('overdue_tasks', emailData);
    
    // Send to project managers and team leads
    const managersAndLeads = this.getManagersAndLeads();
    for (const manager of managersAndLeads) {
      await this.emailService.sendEmail(manager.email, template.subject, template.html);
    }
  }

  getManagersAndLeads() {
    const teamMembers = JSON.parse(localStorage.getItem('formula_team_members') || '[]');
    return teamMembers.filter(member => 
      (member.role === 'project_manager' || member.role === 'team_lead') && 
      member.status === 'active'
    );
  }
}

// Export singleton instances
const emailService = new EmailService();
const notificationManager = new NotificationManager(emailService);

export { emailService, notificationManager };
export default emailService;