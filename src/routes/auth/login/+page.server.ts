import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { AuthApiError } from '@supabase/supabase-js';
import { loginSchema } from '$lib/validators/auth';

/**
 * Loads the login page on the server-side.
 *
 * @param {PageServerLoadParams} params - The parameters for loading the page.
 * @returns {Promise<PageServerLoadResult>} The result of loading the page.
 */
export const load: PageServerLoad = async ({ request, locals: { getUser } }) => {
	const user = await getUser();
	if (user) redirect(303, '/dashboard');

	const form = await superValidate(request, zod(loginSchema));

	return { form };
};

/**
 * Handles the default action for the login page.
 * @param request - The incoming request object.
 * @param locals - The local variables object, which includes the Supabase instance.
 * @returns A Promise that resolves to a redirect response or an error response.
 */
export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = await superValidate(formData, zod(loginSchema));
		if (!form.valid) {
			console.error('Invalid data', form);
			return fail(400, { error: 'Invalid data', form });
		}

		const { error } = await supabase.auth.signInWithPassword(form.data);

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, { error: error.message, form });
			}
			return fail(500, { error: 'Server error. Try again later.', form });
		}

		redirect(303, '/dashboard');
	}
};
