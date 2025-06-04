// Güncellenmiş Departman ve Proje Türleri Konfigürasyonu

// Yeni Departmanlar
export const departments = [
  { value: 'fit-out', label: 'Fit-out', color: '#e67e22', icon: 'Build' },
  { value: 'millwork', label: 'Millwork', color: '#8e44ad', icon: 'Carpenter' },
  { value: 'electrical', label: 'Electrical', color: '#f1c40f', icon: 'ElectricalServices' },
  { value: 'mep', label: 'MEP', color: '#1abc9c', icon: 'Engineering' },
  { value: 'management', label: 'Management', color: '#37444B', icon: 'Business' }
];

// Yeni Proje Türleri
export const projectTypes = [
  { value: 'fit-out', label: 'Fit-out', color: '#e67e22' },
  { value: 'millwork', label: 'Millwork', color: '#8e44ad' },
  { value: 'electrical', label: 'Electrical', color: '#f1c40f' },
  { value: 'mep', label: 'MEP', color: '#1abc9c' }
];

// Formula International Çalışanları
export const formulaEmployees = [
  {
    id: 1001,
    firstName: "Kubilay",
    lastName: "Ilgın",
    fullName: "Kubilay Ilgın",
    initials: "KI",
    email: "kubilay.ilgin@formulaint.com",
    username: "kubilay.ilgin",
    password: "Formula2025!",
    position: "Managing Partner",
    systemRole: "super_admin",
    level: 10,
    department: "Management",
    reportsTo: null,
    status: "active",
    permissions: ["all"],
    roleColor: "#8e44ad"
  },
  {
    id: 1002,
    firstName: "Ömer",
    lastName: "Onan",
    fullName: "Ömer Onan",
    initials: "ÖO",
    email: "omer.onan@formulaint.com",
    username: "omer.onan",
    password: "Formula2025!",
    position: "Managing Partner",
    systemRole: "super_admin",
    level: 10,
    department: "Management",
    reportsTo: null,
    status: "active",
    permissions: ["all"],
    roleColor: "#8e44ad"
  },
  {
    id: 1003,
    firstName: "Taylan",
    lastName: "Kaygusuz",
    fullName: "Taylan Kaygusuz",
    initials: "TK",
    email: "taylan.kaygusuz@formulaint.com",
    username: "taylan.kaygusuz",
    password: "Formula2025!",
    position: "General Manager",
    systemRole: "admin",
    level: 9,
    department: "Management",
    reportsTo: "Ömer-Kubilay",
    status: "active",
    permissions: ["manage_projects", "manage_teams", "view_all", "manage_users"],
    roleColor: "#e74c3c"
  },
  {
    id: 1004,
    firstName: "Cevahir",
    lastName: "Sevimli",
    fullName: "Cevahir Sevimli",
    initials: "CS",
    email: "cevahir.sevimli@formulaint.com",
    username: "cevahir.sevimli",
    password: "Formula2025!",
    position: "Deputy General Manager",
    systemRole: "project_manager",
    level: 8,
    department: "Management",
    reportsTo: "Ömer-Kubilay-Taylan",
    status: "active",
    permissions: ["manage_projects", "assign_tasks", "view_reports"],
    roleColor: "#e67e22"
  },
  {
    id: 1005,
    firstName: "Yusuf",
    lastName: "Sağlam",
    fullName: "Yusuf Sağlam",
    initials: "YS",
    email: "yusuf.saglam@formulaint.com",
    username: "yusuf.saglam",
    password: "Formula2025!",
    position: "Deputy General Manager",
    systemRole: "project_manager",
    level: 8,
    department: "Management",
    reportsTo: "Ömer-Kubilay-Taylan",
    status: "active",
    permissions: ["manage_projects", "assign_tasks", "view_reports"],
    roleColor: "#e67e22"
  },
  {
    id: 1006,
    firstName: "İpek",
    lastName: "Gönenç",
    fullName: "İpek Gönenç",
    initials: "İG",
    email: "ipek.gonenc@formulaint.com",
    username: "ipek.gonenc",
    password: "Formula2025!",
    position: "Project Director",
    systemRole: "project_manager",
    level: 7,
    department: "Fit-out",
    reportsTo: "Ömer-Kubilay-Taylan-Cevahir",
    status: "active",
    permissions: ["manage_projects", "assign_tasks", "view_reports"],
    roleColor: "#e67e22"
  },
  {
    id: 1007,
    firstName: "Berk",
    lastName: "Ulukan",
    fullName: "Berk Ulukan",
    initials: "BU",
    email: "berk.ulukan@formulaint.com",
    username: "berk.ulukan",
    password: "Formula2025!",
    position: "Director of Technical Office",
    systemRole: "team_lead",
    level: 7,
    department: "MEP",
    reportsTo: "Ömer-Kubilay-Taylan-Cevahir",
    status: "active",
    permissions: ["manage_team_tasks", "view_team_reports"],
    roleColor: "#f39c12"
  },
  {
    id: 1008,
    firstName: "Kerem Salih",
    lastName: "Colak",
    fullName: "Kerem Salih Colak",
    initials: "KC",
    email: "kerem.colak@formulaint.com",
    username: "kerem.colak",
    password: "Formula2025!",
    position: "Project Manager",
    systemRole: "project_manager",
    level: 6,
    department: "Fit-out",
    reportsTo: "Ömer-Kubilay-Taylan-Cevahir",
    status: "active",
    permissions: ["manage_projects", "assign_tasks", "view_reports"],
    roleColor: "#e67e22",
    isCurrentUser: true // Bu özel işaret
  },
  {
    id: 1009,
    firstName: "Hakan",
    lastName: "Ayseli",
    fullName: "Hakan Ayseli",
    initials: "HA",
    email: "hakan.ayseli@formulaint.com",
    username: "hakan.ayseli",
    password: "Formula2025!",
    position: "Project Manager/Site Manager",
    systemRole: "project_manager",
    level: 6,
    department: "Fit-out",
    reportsTo: "Ömer-Kubilay-Taylan-Cevahir",
    status: "active",
    permissions: ["manage_projects", "assign_tasks", "view_reports"],
    roleColor: "#e67e22"
  },
  {
    id: 1010,
    firstName: "Hande Selen",
    lastName: "Karaman",
    fullName: "Hande Selen Karaman",
    initials: "HK",
    email: "handeselen.karaman@formulaint.com",
    username: "handeselen.karaman",
    password: "Formula2025!",
    position: "Project Manager",
    systemRole: "project_manager",
    level: 6,
    department: "Fit-out",
    reportsTo: "Ömer-Kubilay-Taylan-Cevahir",
    status: "active",
    permissions: ["manage_projects", "assign_tasks", "view_reports"],
    roleColor: "#e67e22"
  },
  {
    id: 1011,
    firstName: "Murat",
    lastName: "Gökdemir",
    fullName: "Murat Gökdemir",
    initials: "MG",
    email: "murat.gokdemir@formulaint.com",
    username: "murat.gokdemir",
    password: "Formula2025!",
    position: "Technical Manager",
    systemRole: "team_lead",
    level: 5,
    department: "MEP",
    reportsTo: "Ömer-Kubilay-Taylan-Cevahir-Berk",
    status: "active",
    permissions: ["manage_team_tasks", "view_team_reports"],
    roleColor: "#f39c12"
  },
  {
    id: 1012,
    firstName: "Serra",
    lastName: "Uluveren",
    fullName: "Serra Uluveren",
    initials: "SU",
    email: "serra.uluveren@formulaint.com",
    username: "serra.uluveren",
    password: "Formula2025!",
    position: "Project Specialist",
    systemRole: "senior",
    level: 4,
    department: "Fit-out",
    reportsTo: "Ömer-Kubilay-Taylan-Cevahir",
    status: "active",
    permissions: ["create_tasks", "view_own_tasks"],
    roleColor: "#27ae60"
  },
  {
    id: 1013,
    firstName: "Ebru",
    lastName: "Alkın",
    fullName: "Ebru Alkın",
    initials: "EA",
    email: "ebru.alkin@formulaint.com",
    username: "ebru.alkin",
    password: "Formula2025!",
    position: "Site Chief",
    systemRole: "senior",
    level: 4,
    department: "Fit-out",
    reportsTo: "Ömer-Kubilay-Taylan-Cevahir",
    status: "active",
    permissions: ["create_tasks", "view_own_tasks"],
    roleColor: "#27ae60"
  },
  {
    id: 1014,
    firstName: "Uğur",
    lastName: "Karabayır",
    fullName: "Uğur Karabayır",
    initials: "UK",
    email: "ugur.karabayir@formulaint.com",
    username: "ugur.karabayir",
    password: "Formula2025!",
    position: "Technical Office Engineer",
    systemRole: "junior",
    level: 3,
    department: "MEP",
    reportsTo: "Ömer-Kubilay-Taylan-Cevahir-Berk",
    status: "active",
    permissions: ["view_own_tasks"],
    roleColor: "#3498db"
  }
];

// Yetki kontrol fonksiyonları
export const checkPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes('all') || user.permissions.includes(permission);
};

export const getUserRole = (user) => {
  if (!user) return 'guest';
  return user.systemRole;
};

export const canManageUsers = (user) => {
  return checkPermission(user, 'manage_users') || checkPermission(user, 'all');
};

export const canManageProjects = (user) => {
  return checkPermission(user, 'manage_projects') || checkPermission(user, 'all');
};

export const canAssignTasks = (user) => {
  return checkPermission(user, 'assign_tasks') || checkPermission(user, 'manage_projects') || checkPermission(user, 'all');
};