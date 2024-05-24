import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AuthApiError } from '@supabase/supabase-js';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { forgotPasswordSchema } from '$lib/validators/auth';

/**
 * Loads the server-side data for the forgot password page.
 * @param {PageServerLoadParams} params - The parameters for the page server load function.
 * @returns {Promise<PageServerLoadResult>} The server-side data for the forgot password page.
 */
export const load: PageServerLoad = async ({ request, locals: { getUser } }) => {
	const user = await getUser();
	if (user) redirect(303, '/dashboard');

	const form = await superValidate(request, zod(forgotPasswordSchema));

	return { form };
};

/**
 * Handles the forgot password action.
 *
 * @param request - The HTTP request object.
 * @param locals - The local variables object containing the Supabase instance.
 * @returns A promise that resolves to an object with the result of the action.
 */
export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = await superValidate(formData, zod(forgotPasswordSchema));
		if (!form.valid) {
			console.error('Invalid data', form);
			return fail(400, { error: 'Invalid data', form });
		}

		const { email } = form.data;

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: PUBLIC_SITE_URL + '/auth?reset'
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
		} else {
			return {
				message: 'Reset link sent to email',
				form
			};
		}
	}
};
