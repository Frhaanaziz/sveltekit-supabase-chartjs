import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { updateOrganizationSchema } from '$lib/validators/organization';

/**
 * Loads the data for the page.
 *
 * @param event - The event object containing the parameters and locals.
 * @returns An object containing the loaded organization data and form data.
 */
export const load: PageServerLoad = async (event) => {
	const {
		params: { id: orgId },
		locals: { supabase }
	} = event;

	const orgsRes = await supabase.from('orgs').select().eq('id', orgId).single();
	if (!orgsRes.data) {
		console.error('No orgs found', orgsRes.error);
		return fail(400, { error: 'No orgs found' });
	}

	const orgs = orgsRes.data;

	const form = await superValidate(orgs, zod(updateOrganizationSchema));

	return { orgs, form };
};

/**
 * Updates an organization.
 * @param request - The HTTP request object.
 * @param locals.supabase - The Supabase client object.
 * @returns An object containing the result of the update operation.
 */
export const actions: Actions = {
	updateOrg: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = await superValidate(formData, zod(updateOrganizationSchema));
		if (!form.valid) {
			console.error('Invalid data', form);
			return fail(400, { error: 'Invalid data', form });
		}

		const { id } = form.data;
		const updateOrgRes = await supabase.from('orgs').update(form.data).eq('id', id);
		if (updateOrgRes.error) {
			if (updateOrgRes.error.code == '23505')
				return fail(400, { error: 'Organization name already exists', form });
			console.error('Failed to update organization', updateOrgRes.error);
			return fail(400, { error: updateOrgRes.error.message, form });
		}
		await supabase.auth.refreshSession();

		return { success: `Organization updated succesfully`, form };
	}
};
