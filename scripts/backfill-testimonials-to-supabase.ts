import { getFirestore } from '../server/src/infrastructure/firebase/firestore.ts';
import { supabaseAdminRestRequest } from '../server/src/infrastructure/database/supabase/supabase-admin-rest.ts';

type FirestoreTestimonial = {
  company?: string;
  createdAt?: string;
  isApproved?: boolean;
  isNew?: boolean;
  name?: string;
  source?: string;
  status?: string;
  testimonial?: string;
  updatedAt?: string;
  deletedAt?: string;
  deletedBy?: string;
};

const normalizeString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const normalizeBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;

const normalizeStatus = (value: unknown, isApproved: boolean): string => {
  if (value === 'pending_review' || value === 'published' || value === 'archived' || value === 'deleted') {
    return value;
  }

  return isApproved ? 'published' : 'pending_review';
};

const db = getFirestore();
if (!db) {
  console.error('FIRESTORE_UNAVAILABLE');
  process.exit(1);
}

const snapshot = await db.collection('testimonials').get();
const nowIso = new Date().toISOString();
const rows: Record<string, unknown>[] = [];
const skipped: string[] = [];

for (const doc of snapshot.docs) {
  const testimonial = doc.data() as FirestoreTestimonial;
  const name = normalizeString(testimonial.name);
  const message = normalizeString(testimonial.testimonial);

  if (!name || !message) {
    skipped.push(doc.id);
    continue;
  }

  const isApproved = normalizeBoolean(testimonial.isApproved, false);

  rows.push({
    legacy_firestore_id: doc.id,
    name,
    company: normalizeString(testimonial.company) ?? 'Cliente',
    testimonial: message,
    status: normalizeStatus(testimonial.status, isApproved),
    is_new: normalizeBoolean(testimonial.isNew, false),
    is_approved: isApproved,
    source: normalizeString(testimonial.source) ?? 'website',
    created_at: normalizeString(testimonial.createdAt) ?? nowIso,
    updated_at: normalizeString(testimonial.updatedAt) ?? normalizeString(testimonial.createdAt) ?? nowIso,
    deleted_at: normalizeString(testimonial.deletedAt),
    deleted_by: normalizeString(testimonial.deletedBy),
  });
}

if (rows.length > 0) {
  await supabaseAdminRestRequest('/testimonials?on_conflict=legacy_firestore_id', {
    method: 'POST',
    body: JSON.stringify(rows),
  });
}

console.log(
  JSON.stringify({
    firestoreTestimonials: snapshot.size,
    migratedTestimonials: rows.length,
    skipped,
  }),
);
