import { User, Meeting, AdminStats, JobOffer, JobApplication, ContactSubmission, ChatMessage } from '../types';

const env = (import.meta as any).env || {};
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const API_BASE_URL = (env.VITE_API_URL as string) || (isLocal || env.DEV || env.MODE === 'test' ? 'http://localhost:5000/api' : 'https://api.horecafrica.org/api');

export const apiService = {
  async login(email: string, pass: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
    return data.user;
  },

  async register(userData: Partial<User> & { pass: string }): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de l’inscription');
    return data.user;
  },

  async updateProfile(userId: number, data: Partial<User> & { pass?: string }): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Erreur mise à jour profil');
    return resData.user;
  },

  async deleteUser(userId: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erreur suppression utilisateur');
  },

  async toggleUserActive(userId: number): Promise<{ success: boolean; isActive: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/toggle-active`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur modification statut utilisateur');
    return data;
  },

  async getDemoUser(key: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/demo/${key}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur démo user');
    return data;
  },

  async getUsers(filters?: { role?: string; sector?: string; search?: string }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.sector) params.append('sector', filters.sector);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE_URL}/users?${params.toString()}`);
    if (!res.ok) throw new Error('Erreur chargement des utilisateurs');
    return res.json();
  },

  async getMeetings(userId: number): Promise<Meeting[]> {
    const res = await fetch(`${API_BASE_URL}/meetings/user/${userId}`);
    if (!res.ok) throw new Error('Erreur chargement des rendez-vous');
    return res.json();
  },

  async createMeeting(meeting: { fromId: number; toId: number; day: string; time: string; note?: string }): Promise<Meeting> {
    const res = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meeting)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur création du rendez-vous');
    return data.meeting;
  },

  async updateMeetingStatus(id: number, status: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/meetings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Erreur mise à jour rendez-vous');
  },

  async getJobs(filters?: { sector?: string; contractType?: string; search?: string }): Promise<JobOffer[]> {
    const params = new URLSearchParams();
    if (filters?.sector) params.append('sector', filters.sector);
    if (filters?.contractType) params.append('contractType', filters.contractType);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`);
    if (!res.ok) throw new Error('Erreur chargement des offres');
    return res.json();
  },

  async createJob(jobData: Partial<JobOffer>): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur création de l’offre');
  },

  async applyToJob(jobId: number, applicantId: number, message?: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/jobs/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, applicantId, message })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur envoi de la candidature');
  },

  async getJobApplications(filters?: { applicantId?: number; companyId?: number }): Promise<JobApplication[]> {
    const params = new URLSearchParams();
    if (filters?.applicantId) params.append('applicantId', filters.applicantId.toString());
    if (filters?.companyId) params.append('companyId', filters.companyId.toString());

    const res = await fetch(`${API_BASE_URL}/jobs/applications?${params.toString()}`);
    if (!res.ok) throw new Error('Erreur chargement candidatures');
    return res.json();
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!res.ok) throw new Error('Erreur chargement statistiques');
    return res.json();
  },

  async getMasterMeetings(): Promise<Meeting[]> {
    const res = await fetch(`${API_BASE_URL}/admin/meetings`);
    if (!res.ok) throw new Error('Erreur chargement master rendez-vous');
    return res.json();
  },

  async getContacts(): Promise<ContactSubmission[]> {
    const res = await fetch(`${API_BASE_URL}/admin/contacts`);
    if (!res.ok) throw new Error('Erreur chargement messages de contact');
    return res.json();
  },

  async uploadCv(userId: number, file: File): Promise<{ cvUrl: string }> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('cvFile', file);

    const res = await fetch(`${API_BASE_URL}/upload/cv`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors du téléversement du CV');
    return data;
  },

  async getMessages(user1: number, user2: number): Promise<ChatMessage[]> {
    const res = await fetch(`${API_BASE_URL}/messages/${user1}/${user2}`);
    if (!res.ok) throw new Error('Erreur chargement de la discussion');
    return res.json();
  },

  async sendMessage(fromId: number, toId: number, content: string): Promise<ChatMessage> {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromId, toId, content })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur envoi message');
    return data.message;
  },

  async savePrivateNote(meetingId: number, privateNote: string, rating: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}/note`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ privateNote, rating })
    });
    if (!res.ok) throw new Error('Erreur sauvegarde note privée');
  },

  async createWaveCheckout(amount: number, packName: string, userEmail?: string, userId?: number, userName?: string, userPhone?: string, companyName?: string): Promise<{ success: boolean; reference: string; wave_session_id: string; wave_launch_url?: string; qr_uri?: string; uri?: string }> {
    const res = await fetch(`${API_BASE_URL}/payment/wave/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, packName, userEmail, userId, userName, userPhone, companyName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur d’initialisation du paiement Wave');
    return data;
  },

  async verifyWaveSession(reference: string): Promise<{ success: boolean; isPaid: boolean; statut: string }> {
    const res = await fetch(`${API_BASE_URL}/payment/wave/verify/${reference}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur vérification du paiement Wave');
    return data;
  },

  async submitManualPayment(payload: { customerName: string; customerEmail: string; customerPhone?: string; companyName?: string; packName: string; amount: number; paymentMethod: 'MANUAL_WAVE' | 'MANUAL_OM'; transactionRef: string; password?: string }): Promise<{ message: string; reference: string }> {
    const res = await fetch(`${API_BASE_URL}/payment/manual/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur enregistrement paiement manuel');
    return data;
  },

  async getOrders(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/payment/orders`);
    if (!res.ok) throw new Error('Erreur chargement des commandes');
    return res.json();
  },

  async verifyManualPayment(orderId: number, action: 'APPROVE' | 'REJECT', adminNotes?: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/payment/manual/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, action, adminNotes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur validation paiement');
    return data;
  },

  async submitContact(data: { firstName: string; lastName?: string; email: string; phone?: string; company?: string; message: string }): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erreur envoi du message');
  }
};
