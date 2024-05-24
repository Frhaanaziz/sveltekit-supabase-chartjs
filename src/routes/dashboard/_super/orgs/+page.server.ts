import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createOrganizationSchema } from '$lib/validators/organization';
import { supabaseAdminClient } from '$lib/server/supabase';
import { calculatePagination } from '$lib/utils';

/**
 * Retrieves paginated organizations from the database.
 * @param {Object} options - The options for pagination.
 * @param {number} options.page - The page number to retrieve.
 * @param {number} options.take - The number of records to retrieve per page.
 * @returns {Promise<Object>} - The paginated organizations.
 */
async function getOrgsPaginated({ page, take }: { page: number; take: number }) {
	const { count: totalRow, error } = await supabaseAdminClient
		.from('orgs')
		.select('*', { count: 'exact', head: true });
	if (totalRow === null || error) {
		console.error('Failed to get count', error);
		return { error: 'Failed to get count' };
	}

	const { savePage, ...restUtils } = calculatePagination({ page, take, totalRow });

	const rangeFrom = (savePage - 1) * restUtils.rowsPerPage;
	const rangeTo = savePage * restUtils.rowsPerPage - 1;

	const profilesRes = await supabaseAdminClient
		.from('orgs')
		.select('*, created_by(*)')
		.range(rangeFrom, rangeTo)
		.order('created_at', { ascending: false });
	if (!profilesRes.data) return { error: 'Failed to get profiles' };

	return {
		...restUtils,
		content: profilesRes.data
	};
}

/**
 * Loads the data for the page server route.
 * @param {import('@sveltejs/kit').LoadInput} event - The load event object.
 * @returns {Promise<{ orgsData: any, form: any }>} The loaded data, including orgsData and form.
 */
export const load: PageServerLoad = async (event) => {
	const {
		url: { searchParams }
	} = event;
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 10;
	const orgsData = await getOrgsPaginated({ page, take });
	if (typeof orgsData === 'object' && 'error' in orgsData)
		return fail(400, { error: 'Failed to get orgs' });

	const form = await superValidate(event, zod(createOrganizationSchema));

	return { orgsData, form };
};

/**
 * Actions object containing functions for creating and deleting organizations.
 */
export const actions: Actions = {
	/**
	 * Creates a new organization.
	 * @param request - The HTTP request object.
	 * @param locals - The local variables object containing Supabase and getUser functions.
	 * @returns A promise that resolves to an object with the success message and form data, or an error message.
	 */
	createOrg: async ({ request, locals: { supabase, getUser } }) => {
		const user = await getUser();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = Object.fromEntries(await request.formData());
		const form = await superValidate(formData, zod(createOrganizationSchema));
		if (!form.valid) {
			console.error('Invalid data', form);
			return fail(400, { error: 'Invalid data', form });
		}

		const { name } = form.data;
		const res = await supabase.from('orgs').insert({ name, created_by: user.id });
		if (res.error) {
			if (res.error.code === '23505')
				return fail(400, { error: 'Organization name already exists', form });

			console.error('Failed to create organization', res.error);
			return fail(400, { error: res.error.message, form });
		}

		return { success: `Organization ${name} created succesfully`, form };
	},

	/**
	 * Deletes an organization.
	 * @param request - The HTTP request object.
	 * @param locals - The local variables object containing Supabase.
	 * @returns A promise that resolves to an object with the success message, or an error message.
	 */
	delete: async ({ request, locals: { supabase } }) => {
		const form_data = await request.formData();
		const id = form_data.get('id')?.toString();
		if (!id) return fail(400, { error: 'Invalid organization id' });

		const res = await supabase.from('orgs').delete().eq('id', id);

		if (res.error) return fail(400, { error: res.error.message });

		return { success: 'Organization deleted succesfully' };
	}
};
