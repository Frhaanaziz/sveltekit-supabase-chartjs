import { PUBLIC_SITE_URL } from '$env/static/public';
import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (session?.user) {
		throw redirect(303, '/dashboard');
	}
};

export const actions: Actions = {
	signin: async ({ request, locals: { supabase } }) => {
		const form_data = await request.formData();
		const email = form_data.get('email') as string;
		const password = form_data.get('password') as string;
		const to = form_data.get('to') as string;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: error.message,
					values: {
						email
					}
				});
			}
			return fail(500, {
				error: 'Server error. Try again later.',
				values: {
					email
				}
			});
		}

		if (to) {
			throw redirect(303, to);
		} else {
			throw redirect(303, '/dashboard');
		}
	},

	signup: async ({ request, locals: { supabase } }) => {
		const form_data = await request.formData();
		const email = form_data.get('email') as string;
		const password = form_data.get('password') as string;

		const { error, data } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			if (error instanceof AuthApiError) {
				return fail(400, {
					error: error.message,
					values: {
						email
					}
				});
			}
			return fail(500, {
				error: 'Server error. Try again later.'
			});
		}

		if (data.user) {
			const user = data.user;
			await supabase.from('profiles').insert([{ id: user.id, email, name: 'New User' }]);
		}

		throw redirect(303, '/dashboard/startup');
	},

	forgot: async ({ request, locals: { supabase } }) => {
		const form_data = await request.formData();
		const email = form_data.get('email') as string;

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: PUBLIC_SITE_URL + '/auth?reset'
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
		} else {
			return {
				message: 'Reset link sent to email'
			};
		}
	},

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

		throw redirect(303, '/dashboard');
	},

	signout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		throw redirect(303, '/');
	}
};
