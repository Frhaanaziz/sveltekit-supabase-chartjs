import z from 'zod';

export const userSchema = z.object({
	id: z.string().min(1, { message: 'Invalid user' }),
	name: z.string().min(1, { message: 'Name is required' }),
	email: z.string().email({ message: 'Invalid email address' }),
	org_id: z.string().min(1, { message: 'Invalid organization' }),
	role: z.enum(['super', 'admin', 'user'], { message: 'Invalid role' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export const createUserSchema = userSchema
	.omit({ id: true })
	.extend({
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const updateUserSchema = userSchema.omit({ password: true });
