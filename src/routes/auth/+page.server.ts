import { PUBLIC_SITE_URL } from '$env/static/public';
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getUser } }) => {
	const user = await getUser();
	if (user) redirect(303, '/dashboard');
};

export const actions: Actions = {
	reset: async ({ request, locals: { supabase } }) => {
		const form_data = await request.formData();
		const password = form_data.get('password') as string;

		const { error } = await supabase.auth.updateUser({
			password
		});

		if (error) {
			if (error instanceof AuthApiError) {
				return fail(400, {
					error: error.message
				});
			}
			return fail(500, {
				error: 'Server error. Try again later.'
			});
		}

		redirect(303, '/dashboard');
	},

	signout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		redirect(303, '/');
	}
};
