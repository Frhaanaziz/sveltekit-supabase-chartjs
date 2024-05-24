import { z } from 'zod';

/**
 * Represents the schema for an organization.
 */
export const organizationSchema = z.object({
	id: z.string().min(1, { message: 'Invalid organization' }),
	name: z.string().min(1, { message: 'Name is required' }),
	created_by: z.string().min(1, { message: 'Invalid user' }),
	created_at: z.coerce.date()
});

/**
 * Creates a new organization schema by omitting certain properties.
 * @param {Object} organizationSchema - The original organization schema.
 * @returns {Object} - The new organization schema without the specified properties.
 */
export const createOrganizationSchema = organizationSchema.omit({
	id: true,
	created_by: true,
	created_at: true
});

/**
 * Updates the organization schema by omitting the "created_by" and "created_at" properties.
 *
 * @param {object} organizationSchema - The original organization schema.
 * @returns {object} - The updated organization schema.
 */
export const updateOrganizationSchema = organizationSchema.omit({
	created_by: true,
	created_at: true
});
