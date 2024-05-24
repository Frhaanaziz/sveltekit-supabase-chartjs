import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { AuthApiError } from '@supabase/supabase-js';
import { registerSchema } from '$lib/validators/auth';

/**
 * Loads the register page on the server.
 *
 * @param {PageServerLoadParams} params - The parameters for the page server load function.
 * @returns {Promise<PageServerLoadResult>} The result of the page server load function.
 */
export const load: PageServerLoad = async ({ request, locals: { getUser } }) => {
	const user = await getUser();
	if (user) redirect(303, '/dashboard');

	const form = await superValidate(request, zod(registerSchema));

	return { form };
};

/**
 * Handles the registration action.
 *
 * @param request - The HTTP request object.
 * @param locals - The local variables object containing the Supabase client.
 * @returns A Promise that resolves to a redirect response or an error response.
 */
export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = await superValidate(formData, zod(registerSchema));
		if (!form.valid) {
			console.error('Invalid data', form);
			return fail(400, { error: 'Invalid data', form });
		}

		const { name, email, password } = form.data;

		const { error, data } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name
				}
			}
		});

		if (error) {
			if (error instanceof AuthApiError) {
				return fail(400, {
					error: error.message,
					form
				});
			}
			return fail(500, {
				error: 'Server error. Try again later.',
				form
			});
		}

		if (data.user) {
			const user = data.user;
			await supabase.from('profiles').insert([{ id: user.id, email, name }]);
		}

		redirect(303, '/dashboard');
	}
};
