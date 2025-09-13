export const categories = [
  "Road Maintenance",
  "Street Lighting", 
  "Vandalism",
  "Trash Collection",
  "Water Issues",
  "Parks and Recreation",
  "Noise Complaints",
  "Traffic Signals",
  "Sidewalk Repair",
  "Other"
];

export const departments = [
  "Public Works",
  "Electrical Services", 
  "Parks and Recreation",
  "Water Department",
  "Code Enforcement",
  "Traffic Management"
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'status-submitted';
    case 'acknowledged':
    case 'in-progress':
      return 'status-progress';
    case 'resolved':
      return 'status-resolved';
    default:
      return 'muted';
  }
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'secondary';
    case 'acknowledged':
    case 'in-progress':
      return 'default';
    case 'resolved':
      return 'default';
    default:
      return 'outline';
  }
};