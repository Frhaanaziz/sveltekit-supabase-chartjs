import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getUser } }) => {
	const user = await getUser();
	if (!user) {
		console.error('User not found');
		return fail(404, { error: 'User not found' });
	}

	return user;
};

export const actions: Actions = {
	save: async ({ request, locals: { supabase } }) => {
		const form_data = await request.formData();
		const user_name = form_data.get('user_name');

		const res = await supabase.auth.updateUser({
			data: { name: user_name }
		});
		if (res.error) console.error(res.error);
	}
};
