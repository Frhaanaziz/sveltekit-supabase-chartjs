import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/**
 * Loads the user data for the dashboard page on the server side.
 *
 * @param {Object} params - The parameters object.
 * @param {Function} params.locals.getUser - The function to get the user data.
 * @returns {Promise<Object>} - A promise that resolves to the user data if the user is authorized, or rejects with an error if unauthorized.
 */
export const load: PageServerLoad = async ({ locals: { getUser } }) => {
	const user = await getUser();
	if (!user) return fail(401, { error: 'Unauthorized' });

	return user;
};

/**
 * Save action for the dashboard startup page.
 * @param request - The HTTP request object.
 * @param locals - The local variables object containing Supabase and getUser function.
 * @returns A promise that resolves to an object indicating the success or failure of the save action.
 */
export const actions: Actions = {
	save: async ({ request, locals: { supabase, getUser } }) => {
		const user = await getUser();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const form_data = await request.formData();
		const org = String(form_data.get('org')?.toString());

		const orgRes = await supabase
			.from('orgs')
			.upsert({ name: org, created_by: user.id })
			.select('id')
			.single();
		if (orgRes.error) {
			if (orgRes.error.code == '23505')
				return fail(400, { error: 'Organization name already exists!' });
			else return fail(400, { error: orgRes.error.details });
		}

		const userRes = await supabase.auth.admin.updateUserById(user.id, {
			app_metadata: { org: { id: orgRes.data.id, name: org }, role: 'admin' }
		});
		if (userRes.error) {
			console.error('Failed to update user', userRes.error);
			return fail(400, { error: userRes.error.message });
		}

		// REFRESH SESSION
		await supabase.auth.refreshSession();

		return { success: 'Organization created succesfully' };
	}
};
