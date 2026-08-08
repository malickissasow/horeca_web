import { User, Meeting, JobOffer, JobApplication, AdminStats, ContactSubmission } from '../../types';

// ============================================================
// FIXTURES UTILISATEURS
// ============================================================

export const mockUser: User = {
  id: 1,
  email: 'test@hotel.sn',
  name: 'Mamadou Ba',
  company: 'Hôtel Terrou-Bi',
  role: 'Professionnel',
  sector: 'Hôtellerie',
  phone: '+221 77 000 00 01',
  isSuperAdmin: false,
  looking: ['Équipementiers', 'Tech'],
  blockedSlots: [],
};

export const mockExposant: User = {
  id: 2,
  email: 'exposant@salon.sn',
  name: 'Fatou Diop',
  company: 'Tech Hôtelier SARL',
  role: 'Exposant',
  sector: 'Équipementiers',
  phone: '+221 77 000 00 02',
  isSuperAdmin: false,
};

export const mockStudent: User = {
  id: 3,
  email: 'etudiant@ecole.sn',
  name: 'Ibrahima Sow',
  company: 'École Hôtelière de Dakar',
  role: 'Étudiant',
  sector: 'Hôtellerie',
  phone: '+221 77 000 00 03',
  isSuperAdmin: false,
  studentJob: 'Chef de rang',
  cvAttached: true,
  cvUrl: 'http://localhost:5000/uploads/cv_3.pdf',
};

export const mockSuperAdmin: User = {
  id: 99,
  email: 'admin@horecafrica.com',
  name: 'Admin HORECA',
  company: 'HORECA Africa',
  role: 'SuperAdmin',
  sector: 'Autre',
  isSuperAdmin: true,
};

export const mockSponsor: User = {
  id: 4,
  email: 'sponsor@banque.sn',
  name: 'Awa Touré',
  company: 'CBAO Groupe Attijariwafa',
  role: 'Sponsor',
  sector: 'Banques',
};

export const mockHostedBuyer: User = {
  id: 5,
  email: 'buyer@dmc.com',
  name: 'Carlos Rivera',
  company: 'Africa DMC Group',
  role: 'Hosted Buyer',
  sector: 'DMC',
};

export const mockUsers: User[] = [
  mockUser,
  mockExposant,
  mockStudent,
  mockSponsor,
  mockHostedBuyer,
];

// ============================================================
// FIXTURES MEETINGS
// ============================================================

export const mockMeetingPending: Meeting = {
  id: 1,
  fromId: mockExposant.id,
  toId: mockUser.id,
  fromName: mockExposant.name,
  fromCompany: mockExposant.company,
  fromRole: 'Exposant',
  toName: mockUser.name,
  toCompany: mockUser.company,
  toRole: 'Professionnel',
  day: 'Jour 1 — 27 Nov',
  time: '09:00',
  status: 'PENDING',
  table: 5,
  note: 'Discussion sur nos équipements de cuisine',
  createdAt: '2026-11-01T10:00:00Z',
};

export const mockMeetingAccepted: Meeting = {
  id: 2,
  fromId: mockUser.id,
  toId: mockSponsor.id,
  fromName: mockUser.name,
  fromCompany: mockUser.company,
  fromRole: 'Professionnel',
  toName: mockSponsor.name,
  toCompany: mockSponsor.company,
  toRole: 'Sponsor',
  day: 'Jour 1 — 27 Nov',
  time: '10:30',
  status: 'ACCEPTED',
  table: 3,
  createdAt: '2026-11-01T11:00:00Z',
};

export const mockMeetings: Meeting[] = [mockMeetingPending, mockMeetingAccepted];

// ============================================================
// FIXTURES JOBS
// ============================================================

export const mockJob: JobOffer = {
  id: 1,
  companyId: mockExposant.id,
  companyName: mockExposant.company,
  companyEmail: mockExposant.email,
  companyPhone: mockExposant.phone,
  title: 'Chef de rang expérimenté',
  contractType: 'CDI',
  location: 'Dakar, Sénégal',
  sector: 'Restauration',
  description: 'Recherche chef de rang avec 3 ans d\'expérience minimum.',
  requirements: 'Maîtrise du français et de l\'anglais.',
  createdAt: '2026-11-01T08:00:00Z',
};

export const mockJobStage: JobOffer = {
  id: 2,
  companyId: mockExposant.id,
  companyName: mockExposant.company,
  companyEmail: mockExposant.email,
  title: 'Stage en réception hôtelière',
  contractType: 'Stage',
  location: 'Dakar, Sénégal',
  sector: 'Hôtellerie',
  description: 'Stage de 3 mois dans notre réception.',
  createdAt: '2026-11-01T09:00:00Z',
};

export const mockJobs: JobOffer[] = [mockJob, mockJobStage];

export const mockJobApplication: JobApplication = {
  id: 1,
  jobId: mockJob.id,
  jobTitle: mockJob.title,
  contractType: mockJob.contractType,
  applicantId: mockStudent.id,
  applicantName: mockStudent.name,
  applicantEmail: mockStudent.email,
  studentJob: mockStudent.studentJob,
  message: 'Je suis très motivé pour ce poste.',
  status: 'PENDING',
  createdAt: '2026-11-02T10:00:00Z',
};

// ============================================================
// FIXTURES ADMIN STATS
// ============================================================

export const mockAdminStats: AdminStats = {
  totalUsers: 48,
  totalStudents: 12,
  confirmedMeetings: 35,
  totalMeetings: 52,
};

// ============================================================
// FIXTURES CONTACT
// ============================================================

export const mockContact: ContactSubmission = {
  id: 1,
  firstName: 'Moussa',
  lastName: 'Diallo',
  email: 'moussa@hotel.sn',
  phone: '+221 77 111 22 33',
  company: 'Hôtel des Arts',
  message: 'Je souhaite réserver un stand pour le salon.',
  createdAt: '2026-10-15T14:00:00Z',
};

// ============================================================
// HELPERS
// ============================================================

export const makeUser = (overrides: Partial<User> = {}): User => ({
  ...mockUser,
  ...overrides,
});
