import { supabaseAdminRestRequest } from '../../infrastructure/database/supabase/supabase-admin-rest';

export interface TestimonialRecord {
  id: string;
  company: string;
  createdAt: string;
  isApproved: boolean;
  isNew: boolean;
  name: string;
  source: string;
  status: string;
  testimonial: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

interface TestimonialRow {
  id: string;
  company: string;
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  is_approved: boolean;
  is_new: boolean;
  name: string;
  source: string;
  status: string;
  testimonial: string;
  updated_at: string;
}

const TESTIMONIALS_SELECT =
  'id,name,company,testimonial,status,is_new,is_approved,source,created_at,updated_at,deleted_at,deleted_by';

const normalizeString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const mapRow = (row: TestimonialRow): TestimonialRecord => ({
  id: row.id,
  name: row.name,
  company: row.company,
  testimonial: row.testimonial,
  status: row.status,
  isNew: row.is_new,
  isApproved: row.is_approved,
  source: row.source,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  deletedAt: row.deleted_at ?? undefined,
  deletedBy: row.deleted_by ?? undefined,
});

export const createTestimonialRecord = async (
  payload: Pick<TestimonialRecord, 'name' | 'company' | 'testimonial'> & Partial<TestimonialRecord>,
): Promise<TestimonialRecord> => {
  const rows = await supabaseAdminRestRequest<TestimonialRow[]>('/testimonials', {
    method: 'POST',
    body: JSON.stringify([
      {
        name: payload.name.trim(),
        company: normalizeString(payload.company) ?? 'Cliente',
        testimonial: payload.testimonial.trim(),
        status: payload.status ?? 'pending_review',
        is_new: payload.isNew ?? true,
        is_approved: payload.isApproved ?? false,
        source: normalizeString(payload.source) ?? 'website',
      },
    ]),
  });

  return mapRow(rows[0]);
};

export const getTestimonials = async (limit?: number): Promise<TestimonialRecord[]> => {
  const path =
    `/testimonials?select=${TESTIMONIALS_SELECT}` +
    '&deleted_at=is.null' +
    '&status=neq.deleted' +
    '&order=created_at.desc' +
    (typeof limit === 'number' ? `&limit=${Math.max(1, Math.floor(limit))}` : '');

  const rows = await supabaseAdminRestRequest<TestimonialRow[]>(path);
  return rows.map(mapRow);
};

export const getTestimonialById = async (testimonialId: string): Promise<TestimonialRecord | null> => {
  const rows = await supabaseAdminRestRequest<TestimonialRow[]>(
    `/testimonials?select=${TESTIMONIALS_SELECT}&id=eq.${encodeURIComponent(testimonialId)}&limit=1`,
  );

  if (!rows[0] || rows[0].deleted_at || rows[0].status === 'deleted') {
    return null;
  }

  return mapRow(rows[0]);
};

export const updateTestimonial = async (
  testimonialId: string,
  payload: Partial<TestimonialRecord>,
): Promise<void> => {
  const status =
    normalizeString(payload.status) ??
    (payload.isApproved === true ? 'published' : payload.isApproved === false ? 'pending_review' : null);

  await supabaseAdminRestRequest(`/testimonials?id=eq.${encodeURIComponent(testimonialId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...(normalizeString(payload.name) ? { name: payload.name?.trim() } : {}),
      ...(normalizeString(payload.company) ? { company: payload.company?.trim() } : {}),
      ...(normalizeString(payload.testimonial) ? { testimonial: payload.testimonial?.trim() } : {}),
      ...(typeof payload.isNew === 'boolean' ? { is_new: payload.isNew } : {}),
      ...(typeof payload.isApproved === 'boolean' ? { is_approved: payload.isApproved } : {}),
      ...(status ? { status } : {}),
      updated_at: payload.updatedAt ?? new Date().toISOString(),
    }),
  });
};

export const softDeleteTestimonial = async (testimonialId: string): Promise<boolean> => {
  const testimonial = await getTestimonialById(testimonialId);
  if (!testimonial) {
    return false;
  }

  await supabaseAdminRestRequest(`/testimonials?id=eq.${encodeURIComponent(testimonialId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      deleted_at: new Date().toISOString(),
      deleted_by: 'internal_api',
      status: 'deleted',
      updated_at: new Date().toISOString(),
    }),
  });

  return true;
};
