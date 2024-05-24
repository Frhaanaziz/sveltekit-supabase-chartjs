import z from 'zod';
import { fileSchema } from '.';

/**
 * Represents the schema for a user object.
 */
export const userSchema = z.object({
	id: z.string().min(1, { message: 'Invalid user' }),
	name: z.string().min(1, { message: 'Name is required' }),
	email: z.string().email({ message: 'Invalid email address' }),
	org_id: z.string().min(1, { message: 'Invalid organization' }),
	role: z.enum(['super', 'admin', 'user'], { message: 'Invalid role' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

/**
 * Creates a user schema for validation.
 *
 * @param userSchema - The base user schema.
 * @returns The created user schema.
 */
export const createUserSchema = userSchema
	.omit({ id: true })
	.extend({
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

/**
 * Updates the user schema by omitting the password field.
 *
 * @param userSchema - The original user schema.
 * @returns The updated user schema without the password field.
 */
export const updateUserSchema = userSchema.omit({ password: true });

/**
 * Schema for updating user avatar.
 */
export const updateAvatarSchema = z.object({
	id: userSchema.shape.id,
	avatar: fileSchema
});
