import type { Actions, PageServerLoad } from './$types';
import { supabaseAdminClient as supabaseClient } from '$lib/server/supabase';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createUserSchema } from '$lib/validators/user';
import type { ProfileWithOrg } from '$types';
import { calculatePagination } from '$lib/utils';

/**
 * Retrieves paginated profiles with optional search functionality.
 *
 * @param {Object} options - The options for pagination and search.
 * @param {number} options.page - The current page number.
 * @param {number} options.take - The number of profiles to retrieve per page.
 * @param {string} options.search - The search query to filter profiles by name.
 * @returns {Promise<Object>} - The paginated profiles and pagination metadata.
 */
async function getProfilesPagination({
	page,
	take,
	search
}: {
	page: number;
	take: number;
	search: string;
}) {
	const { count: totalRow, error } = await supabaseClient
		.from('profiles')
		.select('*', { count: 'exact', head: true });
	if (totalRow === null || error) {
		console.error('Failed to get count', error);
		return { error: 'Failed to get count' };
	}

	const { savePage, ...restUtils } = calculatePagination({ page, take, totalRow });

	const rangeFrom = (savePage - 1) * restUtils.rowsPerPage;
	const rangeTo = savePage * restUtils.rowsPerPage - 1;

	let profiles;
	if (search) {
		const profilesRes = await supabaseClient
			.from('profiles')
			.select('*, org_id(*)')
			.range(rangeFrom, rangeTo)
			.textSearch('name', `'${search}'`)
			.order('created_at', { ascending: false });
		if (!profilesRes.data) return { error: 'Failed to get profiles' };
		profiles = profilesRes.data;
	} else {
		const profilesRes = await supabaseClient
			.from('profiles')
			.select('*, org_id(*)')
			.range(rangeFrom, rangeTo)
			.order('created_at', { ascending: false });
		if (!profilesRes.data) return { error: 'Failed to get profiles' };
		profiles = profilesRes.data;
	}

	return {
		...restUtils,
		content: profiles as unknown as ProfileWithOrg[]
	};
}

/**
 * Loads the data required for the dashboard admin users page.
 * @param {PageServerEvent} event - The server event object.
 * @returns {Promise<PageServerLoadResult>} The result of loading the data.
 */
export const load: PageServerLoad = async (event) => {
	const {
		url: { searchParams },
		locals: { supabase }
	} = event;
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 10;
	const search = searchParams.get('search') || '';
	const profilesData = await getProfilesPagination({ page, take, search });
	if (typeof profilesData === 'object' && 'error' in profilesData)
		return fail(400, { error: 'Failed to get profiles' });

	const orgsRes = await supabase.from('orgs').select('id,name');
	if (!orgsRes.data) {
		console.error('No orgs found', orgsRes.error);
		return fail(400, { error: 'No orgs found' });
	}
	const orgs = orgsRes.data;

	const form = await superValidate(event, zod(createUserSchema));

	return { profilesData, orgs, form };
};

/**
 * Actions object containing functions for creating and deleting users.
 */
export const actions: Actions = {
	/**
	 * Creates a new user.
	 * @param request - The request object containing form data.
	 * @returns An object indicating the success or failure of the user creation, along with the form data.
	 */
	createUser: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = await superValidate(formData, zod(createUserSchema));
		if (!form.valid) {
			console.error('Invalid data', form);
			return fail(400, { error: 'Invalid data', form });
		}

		const { name, password, email, org_id, role } = form.data;

		const { data: org } = await supabaseClient.from('orgs').select().eq('id', org_id).single();
		if (!org) return fail(400, { error: 'Invalid org', form });

		const createUserRes = await supabaseClient.auth.admin.createUser({
			email,
			password,
			app_metadata: { name, role, org },
			email_confirm: true
		});
		if (createUserRes.error) {
			console.error('Failed to create user', createUserRes.error);
			return fail(400, { error: createUserRes.error.message, form });
		}

		const createProfileRes = await supabaseClient
			.from('profiles')
			.insert({ id: createUserRes.data.user.id, email, name, org_id, role });
		if (createProfileRes.error) {
			console.error('Failed to create user profile', createProfileRes.error);
			return fail(400, { error: createProfileRes.error.message, form });
		}

		return { success: 'User created succesfully', form };
	},

	/**
	 * Deletes a user.
	 * @param request - The request object containing form data.
	 * @returns An object indicating the success or failure of the user deletion.
	 */
	delete: async ({ request }) => {
		const form_data = await request.formData();
		const id = form_data.get('id')?.toString();

		if (id) {
			const res = await supabaseClient.auth.admin.deleteUser(id);
			if (res.error) {
				return fail(400, { error: res.error.message });
			}
		} else {
			return fail(400, { error: 'Invalid data' });
		}

		return { success: 'User deleted succesfully' };
	}
};
