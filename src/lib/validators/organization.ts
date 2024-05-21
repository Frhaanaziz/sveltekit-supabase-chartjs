import { z } from 'zod';

export const organizationSchema = z.object({
	id: z.string().min(1, { message: 'Invalid organization' }),
	name: z.string().min(1, { message: 'Name is required' }),
	created_by: z.string().min(1, { message: 'Invalid user' }),
	created_at: z.coerce.date()
});

export const createOrganizationSchema = organizationSchema.omit({
	id: true,
	created_by: true,
	created_at: true
});

export const updateOrganizationSchema = organizationSchema.omit({
	created_by: true,
	created_at: true
});
