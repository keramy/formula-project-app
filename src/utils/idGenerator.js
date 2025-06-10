// Utility for generating unique IDs to prevent collisions

let counter = 0;

export const generateUniqueId = (prefix = '') => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  counter = (counter + 1) % 1000;
  
  return `${prefix}${timestamp}_${randomNum}_${counter}`;
};

export const generateProjectId = () => generateUniqueId('proj_');
export const generateTaskId = () => generateUniqueId('task_');
export const generateMemberId = () => generateUniqueId('member_');
export const generateNotificationId = () => generateUniqueId('notif_');