import { PUBLIC_DEMO_MODE } from '$env/static/public';
import { imSuper } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (imSuper(session?.user ?? null)) {
		// GET ALL ORGS AND THEIR PROFILES
		const res = await supabase.from('orgs').select('*, profiles(*)');

		if (res.data) return { orgs: res.data };
	}
};

export const actions: Actions = {
	create: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();

		const name = formData.get('name')?.toString();
		if (!name) return fail(400, { error: 'Invalid organization name' });

		const res = await supabase.from('orgs').upsert({ name, created_by: session.user.id }).single();

		if (res.error) {
			console.error('Failed to create organization', res.error);
			return fail(400, { error: res.error.message });
		}

		return { success: `Organization ${name} created succesfully` };
	},

	delete: async ({ request, locals: { supabase } }) => {
		if (PUBLIC_DEMO_MODE) return fail(403, { error: 'Forbidden in demo mode' });

		const form_data = await request.formData();
		const id = form_data.get('id')?.toString();
		if (!id) return fail(400, { error: 'Invalid organization id' });

		const res = await supabase.from('orgs').delete().eq('id', id);

		if (res.error) return fail(400, { error: res.error.message });

		return { success: 'Organization deleted succesfully' };
	}
};
