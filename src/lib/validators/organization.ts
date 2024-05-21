import { z } from 'zod';

export const organizationSchema = z.object({
	id: z.string().min(1, { message: 'Invalid organization' }),
	name: z.string().min(1, { message: 'Name is required' }),
	created_by: z.string().min(1, { message: 'Invalid user' }),
	created_at: z.coerce.date()
});
