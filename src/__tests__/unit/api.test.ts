import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { apiService } from '../../services/api';
import {
  mockUser,
  mockSuperAdmin,
  mockUsers,
  mockMeetingPending,
  mockMeetings,
  mockJobs,
  mockJobApplication,
  mockAdminStats,
  mockContact,
} from '../mocks/fixtures';

const API = 'http://localhost:5000/api';

// ============================================================
// AUTH
// ============================================================
describe('apiService.login()', () => {
  it('retourne le user en cas de succès', async () => {
    const user = await apiService.login('test@hotel.sn', 'password123');
    expect(user.id).toBe(mockUser.id);
    expect(user.email).toBe(mockUser.email);
    expect(user.name).toBe(mockUser.name);
  });

  it('retourne le SuperAdmin avec les bons droits', async () => {
    const user = await apiService.login('admin@horecafrica.com', 'any');
    expect(user.isSuperAdmin).toBe(true);
  });

  it("throw une erreur si les identifiants sont incorrects", async () => {
    await expect(
      apiService.login('mauvais@email.com', 'wrongpass')
    ).rejects.toThrow('Email ou mot de passe incorrect');
  });
});

describe('apiService.register()', () => {
  it("inscrit un nouvel utilisateur avec succès", async () => {
    const user = await apiService.register({
      email: 'nouveau@hotel.sn',
      name: 'Nouveau User',
      company: 'Hotel Test',
      role: 'Professionnel',
      sector: 'Hôtellerie',
      pass: 'pass123',
    });
    expect(user).toBeDefined();
    expect(user.email).toBe('nouveau@hotel.sn');
  });

  it("throw une erreur si champs obligatoires manquants", async () => {
    server.use(
      http.post(`${API}/auth/register`, () =>
        HttpResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
      )
    );
    await expect(
      apiService.register({ pass: 'abc' } as any)
    ).rejects.toThrow('Champs obligatoires manquants');
  });
});

describe('apiService.getDemoUser()', () => {
  it('retourne un super admin avec la clé admin', async () => {
    const user = await apiService.getDemoUser('admin');
    expect(user.isSuperAdmin).toBe(true);
  });

  it("throw si la clé est invalide", async () => {
    await expect(apiService.getDemoUser('invalid-key')).rejects.toThrow();
  });
});

// ============================================================
// USERS
// ============================================================
describe('apiService.getUsers()', () => {
  it('retourne tous les utilisateurs sans filtre', async () => {
    const users = await apiService.getUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  it('filtre par rôle Professionnel', async () => {
    const users = await apiService.getUsers({ role: 'Professionnel' });
    expect(users.every((u) => u.role === 'Professionnel')).toBe(true);
  });

  it('filtre par secteur Hôtellerie', async () => {
    const users = await apiService.getUsers({ sector: 'Hôtellerie' });
    expect(users.every((u) => u.sector === 'Hôtellerie')).toBe(true);
  });

  it('filtre par mot-clé de recherche', async () => {
    const users = await apiService.getUsers({ search: 'Terrou' });
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].company).toContain('Terrou');
  });

  it('throw une erreur si le serveur échoue', async () => {
    server.use(
      http.get(`${API}/users`, () => HttpResponse.json({}, { status: 500 }))
    );
    await expect(apiService.getUsers()).rejects.toThrow();
  });
});

describe('apiService.updateProfile()', () => {
  it('met à jour le profil utilisateur', async () => {
    const updated = await apiService.updateProfile(1, { name: 'Nom Modifié' });
    expect(updated).toBeDefined();
  });
});

describe('apiService.deleteUser()', () => {
  it('supprime un utilisateur sans erreur', async () => {
    await expect(apiService.deleteUser(1)).resolves.not.toThrow();
  });
});

// ============================================================
// MEETINGS
// ============================================================
describe('apiService.getMeetings()', () => {
  it('retourne les meetings liés à un userId', async () => {
    const meetings = await apiService.getMeetings(mockUser.id);
    expect(meetings).toBeDefined();
    expect(Array.isArray(meetings)).toBe(true);
  });

  it('retourne les meetings du bon utilisateur (fromId ou toId)', async () => {
    const meetings = await apiService.getMeetings(mockUser.id);
    meetings.forEach((m) => {
      expect(m.fromId === mockUser.id || m.toId === mockUser.id).toBe(true);
    });
  });
});

describe('apiService.createMeeting()', () => {
  it('crée un meeting avec succès', async () => {
    const meeting = await apiService.createMeeting({
      fromId: mockUser.id,
      toId: mockUsers[1].id,
      day: 'Jour 2 — 28 Nov',
      time: '14:00',
      note: 'Discussion partenariat',
    });
    expect(meeting).toBeDefined();
    expect(meeting.status).toBe('PENDING');
    expect(meeting.table).toBeGreaterThan(0);
  });

  it('throw une erreur si créneau déjà occupé', async () => {
    server.use(
      http.post(`${API}/meetings`, () =>
        HttpResponse.json({ error: 'Créneau déjà occupé' }, { status: 409 })
      )
    );
    await expect(
      apiService.createMeeting({
        fromId: 1,
        toId: 2,
        day: 'Jour 1 — 27 Nov',
        time: '09:00',
      })
    ).rejects.toThrow('Créneau déjà occupé');
  });
});

describe('apiService.updateMeetingStatus()', () => {
  it.each(['ACCEPTED', 'REFUSED', 'CANCELLED'])(
    'met à jour le statut en %s sans erreur',
    async (status) => {
      await expect(
        apiService.updateMeetingStatus(mockMeetingPending.id, status)
      ).resolves.not.toThrow();
    }
  );
});

describe('apiService.savePrivateNote()', () => {
  it('sauvegarde une note privée et un rating', async () => {
    await expect(
      apiService.savePrivateNote(1, 'Contact très prometteur !', 5)
    ).resolves.not.toThrow();
  });
});

// ============================================================
// JOBS
// ============================================================
describe('apiService.getJobs()', () => {
  it('retourne toutes les offres sans filtre', async () => {
    const jobs = await apiService.getJobs();
    expect(jobs.length).toBeGreaterThan(0);
  });

  it('filtre par type de contrat Stage', async () => {
    const jobs = await apiService.getJobs({ contractType: 'Stage' });
    expect(jobs.every((j) => j.contractType === 'Stage')).toBe(true);
  });

  it('filtre par secteur', async () => {
    const jobs = await apiService.getJobs({ sector: 'Restauration' });
    expect(jobs.every((j) => j.sector === 'Restauration')).toBe(true);
  });

  it('filtre par mot-clé de recherche', async () => {
    const jobs = await apiService.getJobs({ search: 'Chef' });
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs[0].title.toLowerCase()).toContain('chef');
  });
});

describe('apiService.applyToJob()', () => {
  it('envoie une candidature avec succès', async () => {
    await expect(
      apiService.applyToJob(mockJobs[0].id, mockUsers[2].id, 'Je suis motivé')
    ).resolves.not.toThrow();
  });

  it('throw une erreur si candidature dupliquée', async () => {
    server.use(
      http.post(`${API}/jobs/apply`, () =>
        HttpResponse.json({ error: 'Candidature déjà envoyée' }, { status: 409 })
      )
    );
    await expect(
      apiService.applyToJob(1, 3, 'Doublon')
    ).rejects.toThrow('Candidature déjà envoyée');
  });
});

describe('apiService.createJob()', () => {
  it("crée une offre d'emploi sans erreur", async () => {
    await expect(
      apiService.createJob({
        companyId: mockUsers[1].id,
        companyName: mockUsers[1].company,
        companyEmail: mockUsers[1].email,
        title: 'Réceptionniste',
        contractType: 'CDD',
        location: 'Dakar',
        sector: 'Hôtellerie',
        description: 'Poste de réception',
      })
    ).resolves.not.toThrow();
  });
});

describe('apiService.getJobApplications()', () => {
  it('retourne les candidatures', async () => {
    const apps = await apiService.getJobApplications({ applicantId: mockUsers[2].id });
    expect(Array.isArray(apps)).toBe(true);
  });
});

// ============================================================
// ADMIN
// ============================================================
describe('apiService.getAdminStats()', () => {
  it('retourne les statistiques admin', async () => {
    const stats = await apiService.getAdminStats();
    expect(stats.totalUsers).toBe(mockAdminStats.totalUsers);
    expect(stats.confirmedMeetings).toBe(mockAdminStats.confirmedMeetings);
    expect(stats.totalStudents).toBe(mockAdminStats.totalStudents);
  });
});

describe('apiService.getMasterMeetings()', () => {
  it('retourne la liste master des meetings', async () => {
    const meetings = await apiService.getMasterMeetings();
    expect(Array.isArray(meetings)).toBe(true);
  });
});

describe('apiService.getContacts()', () => {
  it('retourne les messages de contact', async () => {
    const contacts = await apiService.getContacts();
    expect(Array.isArray(contacts)).toBe(true);
    expect(contacts[0].email).toBe(mockContact.email);
  });
});

// ============================================================
// CONTACT
// ============================================================
describe('apiService.submitContact()', () => {
  it('envoie un formulaire de contact avec succès', async () => {
    await expect(
      apiService.submitContact({
        firstName: 'Moussa',
        email: 'moussa@test.sn',
        message: 'Je souhaite exposer au salon.',
      })
    ).resolves.not.toThrow();
  });

  it('throw une erreur si le serveur échoue', async () => {
    server.use(
      http.post(`${API}/admin/contact`, () =>
        HttpResponse.json({}, { status: 500 })
      )
    );
    await expect(
      apiService.submitContact({ firstName: 'X', email: 'x@x.com', message: 'test' })
    ).rejects.toThrow();
  });
});

// ============================================================
// PAIEMENT
// ============================================================
describe('apiService.createWaveCheckout()', () => {
  it('retourne une URL Wave de paiement', async () => {
    const result = await apiService.createWaveCheckout(250000, 'Pack Exposant Pro');
    expect(result.wave_launch_url).toContain('wave.com');
  });

  it('throw une erreur si le serveur Wave échoue', async () => {
    server.use(
      http.post(`${API}/payment/wave/checkout`, () =>
        HttpResponse.json({ error: 'Wave indisponible' }, { status: 503 })
      )
    );
    await expect(
      apiService.createWaveCheckout(250000, 'Pack')
    ).rejects.toThrow();
  });
});

// ============================================================
// MESSAGES
// ============================================================
describe('apiService.getMessages()', () => {
  it('retourne les messages entre deux utilisateurs', async () => {
    const messages = await apiService.getMessages(1, 2);
    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThan(0);
  });
});

describe('apiService.sendMessage()', () => {
  it('envoie un message avec succès', async () => {
    const msg = await apiService.sendMessage(1, 2, 'Bonjour !');
    expect(msg.content).toBe('Bonjour !');
    expect(msg.fromId).toBe(1);
    expect(msg.toId).toBe(2);
  });
});

// ============================================================
// UPLOAD CV
// ============================================================
describe('apiService.uploadCv()', () => {
  it("retourne l'URL du CV uploadé", async () => {
    const file = new File(['contenu cv'], 'cv.pdf', { type: 'application/pdf' });
    const result = await apiService.uploadCv(mockUsers[2].id, file);
    expect(result.cvUrl).toContain('cv');
  });
});
