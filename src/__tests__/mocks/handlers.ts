import { http, HttpResponse } from 'msw';
import {
  mockUser,
  mockSuperAdmin,
  mockUsers,
  mockMeetings,
  mockMeetingPending,
  mockJobs,
  mockJobApplication,
  mockAdminStats,
  mockContact,
} from './fixtures';

const API = 'http://localhost:5000/api';

export const handlers = [
  // ============================================================
  // AUTH
  // ============================================================

  // Login — succès
  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    if (body.email === 'admin@horecafrica.com') {
      return HttpResponse.json({ user: mockSuperAdmin });
    }
    if (body.email === 'test@hotel.sn' && body.password === 'password123') {
      return HttpResponse.json({ user: mockUser });
    }
    return HttpResponse.json(
      { error: 'Email ou mot de passe incorrect' },
      { status: 401 }
    );
  }),

  // Register
  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    if (!body.email || !body.name) {
      return HttpResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }
    const newUser = { ...mockUser, id: 100, ...body };
    return HttpResponse.json({ user: newUser }, { status: 201 });
  }),

  // Demo user
  http.get(`${API}/auth/demo/:key`, ({ params }) => {
    if (params.key === 'admin') return HttpResponse.json(mockSuperAdmin);
    if (params.key === 'buyer') return HttpResponse.json({ ...mockUser, role: 'Hosted Buyer' });
    return HttpResponse.json({ error: 'Clé démo invalide' }, { status: 404 });
  }),

  // ============================================================
  // USERS
  // ============================================================

  http.get(`${API}/users`, ({ request }) => {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const sector = url.searchParams.get('sector');
    const search = url.searchParams.get('search');

    let filtered = [...mockUsers];
    if (role) filtered = filtered.filter((u) => u.role === role);
    if (sector) filtered = filtered.filter((u) => u.sector === sector);
    if (search) {
      const kw = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(kw) ||
          u.company.toLowerCase().includes(kw)
      );
    }
    return HttpResponse.json(filtered);
  }),

  http.put(`${API}/users/:id`, async ({ params, request }) => {
    const body = await request.json() as Partial<typeof mockUser>;
    const updated = { ...mockUser, id: Number(params.id), ...body };
    return HttpResponse.json({ user: updated });
  }),

  http.delete(`${API}/users/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // ============================================================
  // MEETINGS
  // ============================================================

  http.get(`${API}/meetings/user/:userId`, ({ params }) => {
    const userId = Number(params.userId);
    const filtered = mockMeetings.filter(
      (m) => m.fromId === userId || m.toId === userId
    );
    return HttpResponse.json(filtered);
  }),

  http.post(`${API}/meetings`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    // Simulate conflict detection
    if (body.time === '09:00' && body.day === 'Jour 1 — 27 Nov' && body.fromId === 1) {
      return HttpResponse.json({ error: 'Créneau déjà occupé' }, { status: 409 });
    }
    const newMeeting = {
      ...mockMeetingPending,
      id: 99,
      fromId: body.fromId as number,
      toId: body.toId as number,
      day: body.day as string,
      time: body.time as string,
      note: body.note as string,
      status: 'PENDING' as const,
      table: 8,
    };
    return HttpResponse.json({ meeting: newMeeting }, { status: 201 });
  }),

  http.patch(`${API}/meetings/:id/status`, async ({ params, request }) => {
    const body = await request.json() as { status: string };
    const validStatuses = ['ACCEPTED', 'REFUSED', 'CANCELLED'];
    if (!validStatuses.includes(body.status)) {
      return HttpResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.put(`${API}/meetings/:id/note`, () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.get(`${API}/admin/meetings`, () => {
    return HttpResponse.json(mockMeetings);
  }),

  // ============================================================
  // JOBS
  // ============================================================

  http.get(`${API}/jobs`, ({ request }) => {
    const url = new URL(request.url);
    const sector = url.searchParams.get('sector');
    const contractType = url.searchParams.get('contractType');
    const search = url.searchParams.get('search');

    let filtered = [...mockJobs];
    if (sector) filtered = filtered.filter((j) => j.sector === sector);
    if (contractType) filtered = filtered.filter((j) => j.contractType === contractType);
    if (search) {
      const kw = search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.companyName.toLowerCase().includes(kw)
      );
    }
    return HttpResponse.json(filtered);
  }),

  http.post(`${API}/jobs`, () => {
    return HttpResponse.json({ success: true }, { status: 201 });
  }),

  http.post(`${API}/jobs/apply`, async () => {
    return HttpResponse.json({ success: true }, { status: 201 });
  }),


  http.get(`${API}/jobs/applications`, () => {
    return HttpResponse.json([mockJobApplication]);
  }),

  // ============================================================
  // ADMIN
  // ============================================================

  http.get(`${API}/admin/stats`, () => {
    return HttpResponse.json(mockAdminStats);
  }),

  http.get(`${API}/admin/contacts`, () => {
    return HttpResponse.json([mockContact]);
  }),

  // ============================================================
  // CONTACT
  // ============================================================

  http.post(`${API}/admin/contact`, () => {
    return HttpResponse.json({ success: true }, { status: 201 });
  }),


  // ============================================================
  // MESSAGES
  // ============================================================

  http.get(`${API}/messages/:user1/:user2`, () => {
    return HttpResponse.json([
      { id: 1, fromId: 1, toId: 2, content: 'Bonjour, ravi de vous rencontrer !', createdAt: '2026-11-01T10:00:00Z' },
      { id: 2, fromId: 2, toId: 1, content: 'Bonjour ! Pareil, à bientôt.', createdAt: '2026-11-01T10:01:00Z' },
    ]);
  }),

  http.post(`${API}/messages`, async ({ request }) => {
    const body = await request.json() as { fromId: number; toId: number; content: string };
    const msg = { id: 99, ...body, createdAt: new Date().toISOString() };
    return HttpResponse.json({ message: msg }, { status: 201 });
  }),

  // ============================================================
  // PAYMENT
  // ============================================================

  http.post(`${API}/payment/wave/checkout`, () => {
    return HttpResponse.json({ wave_launch_url: 'https://pay.wave.com/test-session-abc' });
  }),

  // ============================================================
  // UPLOAD
  // ============================================================

  http.post(`${API}/upload/cv`, () => {
    return HttpResponse.json({ cvUrl: 'http://localhost:5000/uploads/cv_test.pdf' });
  }),
];
