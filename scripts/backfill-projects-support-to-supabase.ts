import { createHash } from 'node:crypto';

import { getFirestore } from '../server/src/infrastructure/firebase/firestore.ts';
import { supabaseAdminRestRequest } from '../server/src/infrastructure/database/supabase/supabase-admin-rest.ts';

type FirestoreProject = {
  adjuntos?: unknown[];
  createdAt?: unknown;
  description?: string;
  fases?: unknown[];
  fechaFinEstimada?: string;
  fechaInicio?: string;
  funcionalidades?: unknown[];
  name?: string;
  ownerEmail?: string;
  prioridad?: string;
  status?: string;
  type?: string;
  updatedAt?: unknown;
};

type FirestoreSupportTicket = {
  createdAt?: unknown;
  message?: string;
  priority?: 'low' | 'medium' | 'high';
  responses?: unknown[];
  status?: 'open' | 'in-progress' | 'resolved';
  subject?: string;
  updatedAt?: unknown;
  userId?: string;
};

type UserRow = {
  email: string;
  firebase_uid: string;
};

const createDeterministicUuid = (input: string): string => {
  const hash = createHash('sha256').update(input).digest('hex');
  const hex = hash.slice(0, 32).split('');
  hex[12] = '5';
  hex[16] = ['8', '9', 'a', 'b'][parseInt(hex[16], 16) % 4];
  return `${hex.slice(0, 8).join('')}-${hex.slice(8, 12).join('')}-${hex.slice(12, 16).join('')}-${hex.slice(16, 20).join('')}-${hex.slice(20, 32).join('')}`;
};

const normalizeString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const normalizeTimestamp = (value: unknown, fallback: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    '_seconds' in value &&
    typeof (value as { _seconds?: unknown })._seconds === 'number'
  ) {
    return new Date(((value as { _seconds: number })._seconds) * 1000).toISOString();
  }

  return fallback;
};

const normalizeProjectStatus = (value: unknown): 'active' | 'completed' | 'on-hold' => {
  if (value === 'completed' || value === 'on-hold' || value === 'active') {
    return value;
  }

  return 'active';
};

const normalizeTicketStatus = (value: unknown): 'open' | 'in-progress' | 'resolved' => {
  if (value === 'open' || value === 'in-progress' || value === 'resolved') {
    return value;
  }

  return 'open';
};

const normalizeTicketPriority = (value: unknown): 'low' | 'medium' | 'high' => {
  if (value === 'low' || value === 'medium' || value === 'high') {
    return value;
  }

  return 'medium';
};

const db = getFirestore();
if (!db) {
  console.error('FIRESTORE_UNAVAILABLE');
  process.exit(1);
}

const nowIso = new Date().toISOString();
const users = await supabaseAdminRestRequest<UserRow[]>('/users?select=email,firebase_uid');
const userIdByEmail = new Map(
  users
    .filter((user) => typeof user.email === 'string' && typeof user.firebase_uid === 'string')
    .map((user) => [user.email.trim().toLowerCase(), user.firebase_uid]),
);

const projectsSnapshot = await db.collection('projects').get();
const supportSnapshot = await db.collection('support_tickets').get();

const projectRows: Record<string, unknown>[] = [];
const userProjectUpdates = new Map<string, string>();
const skippedProjects: string[] = [];

for (const doc of projectsSnapshot.docs) {
  const project = doc.data() as FirestoreProject;
  const name = normalizeString(project.name);
  const type = normalizeString(project.type);
  if (!name || !type) {
    skippedProjects.push(doc.id);
    continue;
  }

  const ownerEmail = normalizeString(project.ownerEmail)?.toLowerCase() ?? null;
  const userId = ownerEmail ? userIdByEmail.get(ownerEmail) ?? null : null;
  const projectId = createDeterministicUuid(`project:${doc.id}`);

  projectRows.push({
    id: projectId,
    legacy_firestore_id: doc.id,
    user_id: userId,
    owner_email: ownerEmail,
    name,
    type,
    description: normalizeString(project.description),
    priority: normalizeString(project.prioridad),
    start_date: normalizeString(project.fechaInicio),
    estimated_end_date: normalizeString(project.fechaFinEstimada),
    overall_progress: 0,
    status: normalizeProjectStatus(project.status),
    phases: Array.isArray(project.fases) ? project.fases : [],
    attachments: Array.isArray(project.adjuntos) ? project.adjuntos : [],
    raw_data: project,
    created_at: normalizeTimestamp(project.createdAt, nowIso),
    updated_at: normalizeTimestamp(project.updatedAt, nowIso),
  });

  if (userId) {
    userProjectUpdates.set(userId, projectId);
  }
}

const supportRows: Record<string, unknown>[] = [];
for (const doc of supportSnapshot.docs) {
  const ticket = doc.data() as FirestoreSupportTicket;
  const userId = normalizeString(ticket.userId);
  const subject = normalizeString(ticket.subject);
  const message = normalizeString(ticket.message);

  if (!userId || !subject || !message) {
    continue;
  }

  supportRows.push({
    id: createDeterministicUuid(`support:${doc.id}`),
    legacy_firestore_id: doc.id,
    user_id: userId,
    subject,
    message,
    status: normalizeTicketStatus(ticket.status),
    priority: normalizeTicketPriority(ticket.priority),
    responses: Array.isArray(ticket.responses) ? ticket.responses : [],
    raw_data: ticket,
    created_at: normalizeTimestamp(ticket.createdAt, nowIso),
    updated_at: normalizeTimestamp(ticket.updatedAt, nowIso),
  });
}

if (projectRows.length > 0) {
  await supabaseAdminRestRequest('/projects?on_conflict=legacy_firestore_id', {
    method: 'POST',
    body: JSON.stringify(projectRows),
  });
}

if (supportRows.length > 0) {
  await supabaseAdminRestRequest('/support_tickets?on_conflict=legacy_firestore_id', {
    method: 'POST',
    body: JSON.stringify(supportRows),
  });
}

for (const [userId, projectId] of userProjectUpdates.entries()) {
  await supabaseAdminRestRequest(`/users?firebase_uid=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      legacy_project_id: projectId,
      updated_at: nowIso,
    }),
  });
}

console.log(
  JSON.stringify({
    firestoreProjects: projectsSnapshot.size,
    migratedProjects: projectRows.length,
    skippedProjects,
    firestoreSupportTickets: supportSnapshot.size,
    migratedSupportTickets: supportRows.length,
    linkedUsers: userProjectUpdates.size,
  }),
);
