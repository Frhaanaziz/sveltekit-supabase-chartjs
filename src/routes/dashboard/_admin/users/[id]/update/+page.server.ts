import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { updateUserSchema } from '$lib/validators/user';
import { supabaseAdminClient } from '$lib/server/supabase';

export const load: PageServerLoad = async (event) => {
	const {
		params: { id: userId },
		locals: { supabase }
	} = event;

	const [orgsRes, profileRes] = await Promise.all([
		supabase.from('orgs').select('id,name'),
		supabase.from('profiles').select().eq('id', userId).single()
	]);
	if (!orgsRes.data) {
		console.error('No orgs found', orgsRes.error);
		return fail(400, { error: 'No orgs found' });
	}
	if (!profileRes.data) {
		console.error('No profile found', profileRes.error);
		return fail(400, { error: 'No profile found' });
	}

	const orgs = orgsRes.data;
	const profile = profileRes.data;

	const form = await superValidate(
		{
			...profile,
			org_id: profile.org_id ?? undefined
		},
		zod(updateUserSchema)
	);

	return { orgs, form, profile };
};

export const actions: Actions = {
	updateUser: async ({ request, locals: { getSession, supabase } }) => {
		const session = await getSession();
		if (!session) return fail(401, { error: 'Unauthorized' });

		const formData = Object.fromEntries(await request.formData());
		const form = await superValidate(formData, zod(updateUserSchema));
		if (!form.valid) {
			console.error('Invalid data', form);
			return fail(400, { error: 'Invalid data', form });
		}

		const { id, email, org_id, role, name } = form.data;

		const { data: org } = await supabase.from('orgs').select().eq('id', org_id).single();
		if (!org) return fail(400, { error: 'Invalid org', form });

		const [updateUserRes, updateProfileRes] = await Promise.all([
			supabaseAdminClient.auth.admin.updateUserById(id, {
				email,
				app_metadata: { name, org, role }
			}),
			supabase.from('profiles').update(form.data).eq('id', id)
		]);
		if (updateUserRes.error) {
			console.error('Failed to update user', updateUserRes.error);
			return fail(400, { error: updateUserRes.error.message, form });
		}
		if (updateProfileRes.error) {
			console.error('Failed to update user profile', updateProfileRes.error);
			return fail(400, { error: updateProfileRes.error.message, form });
		}

		await supabase.auth.refreshSession();

		return { success: 'User updated succesfully', form };
	}
};
