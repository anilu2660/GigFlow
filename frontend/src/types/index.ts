export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: 'website' | 'instagram' | 'referral';
  assignedTo?: { _id: string; name: string; email: string };
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}
