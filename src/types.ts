export type UserRole = 
  | 'SuperAdmin'
  | 'Professionnel'
  | 'Exposant'
  | 'Sponsor'
  | 'Hosted Buyer'
  | 'Étudiant'
  | 'Autre';

export type UserSector = 
  | 'Hôtellerie'
  | 'Restauration'
  | 'Institutions'
  | 'DMC'
  | 'Agences de voyages'
  | 'Équipementiers'
  | 'Banques'
  | 'Autre';

export interface User {
  id: number;
  email: string;
  name: string;
  company: string;
  role: UserRole;
  sector: UserSector;
  phone?: string;
  studentJob?: string;
  cvAttached?: boolean;
  cvUrl?: string;
  isSuperAdmin?: boolean;
  isActive?: boolean;
  looking?: string[];
  blockedSlots?: string[];
}

export type MeetingStatus = 'PENDING' | 'ACCEPTED' | 'REFUSED' | 'CANCELLED';

export interface Meeting {
  id: number;
  fromId: number;
  toId: number;
  fromName?: string;
  fromCompany?: string;
  fromRole?: UserRole;
  toName?: string;
  toCompany?: string;
  toRole?: UserRole;
  day: string;
  time: string;
  status: MeetingStatus;
  table: number;
  note?: string;
  privateNote?: string;
  rating?: number;
  createdAt?: string;
}

export interface ChatMessage {
  id?: number;
  fromId: number;
  toId: number;
  content: string;
  createdAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  confirmedMeetings: number;
  totalMeetings: number;
}

export interface JobOffer {
  id: number;
  companyId: number;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  title: string;
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Alternance' | 'Autre';
  location: string;
  sector: UserSector;
  description: string;
  requirements?: string;
  createdAt?: string;
}

export interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  contractType: string;
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  studentJob?: string;
  message?: string;
  status: 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  createdAt?: string;
}

export interface ContactSubmission {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  createdAt?: string;
}

export interface Order {
  id: number;
  reference: string;
  userId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  packName: string;
  amount: number;
  paymentMethod: 'WAVE_API' | 'MANUAL_WAVE' | 'MANUAL_OM';
  transactionRef?: string;
  status: 'PENDING_PAYMENT' | 'PENDING_MANUAL_VERIFICATION' | 'COMPLETED' | 'REJECTED';
  invoiceNumber?: string;
  invoiceSent?: boolean;
  adminNotes?: string;
  createdAt?: string;
}

