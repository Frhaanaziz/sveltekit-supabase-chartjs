import type { Actions, PageServerLoad } from './$types';
import { supabaseAdminClient as supabaseClient } from '$lib/server/supabase';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createUserSchema } from '$lib/validators/user';
import type { ProfileWithOrg } from '$types';

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

	const savePage = page < 1 ? 1 : page;
	const rowsPerPage = take;
	const totalPages = Math.ceil(totalRow / rowsPerPage) || 1;
	const isFirstPage = savePage === 1;
	const isLastPage = savePage >= totalPages;
	const previousPage = isFirstPage ? 1 : savePage - 1;
	const nextPage = isLastPage ? totalPages : savePage + 1;

	const rangeFrom = (savePage - 1) * rowsPerPage;
	const rangeTo = savePage * rowsPerPage - 1;

	let profiles;
	if (search) {
		const profilesRes = await supabaseClient
			.from('profiles')
			.select('*, org_id(*)')
			.range(rangeFrom, rangeTo)
			.textSearch('name', `'${search}'`);
		if (!profilesRes.data) return { error: 'Failed to get profiles' };
		profiles = profilesRes.data;
	} else {
		const profilesRes = await supabaseClient
			.from('profiles')
			.select('*, org_id(*)')
			.range(rangeFrom, rangeTo);
		if (!profilesRes.data) return { error: 'Failed to get profiles' };
		profiles = profilesRes.data;
	}

	return {
		currentPage: page,
		isFirstPage,
		isLastPage,
		previousPage,
		nextPage,
		rowsPerPage,
		totalPages,
		totalRow,
		content: profiles as unknown as ProfileWithOrg[]
	};
}

export const load: PageServerLoad = async (event) => {
	const {
		url: { searchParams },
		locals: { supabase, getSession }
	} = event;
	const session = await getSession();
	if (!session) return fail(401, { error: 'Unauthorized' });

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

export const actions: Actions = {
	createUser: async ({ request, locals: { getSession } }) => {
		const session = await getSession();
		if (!session) return fail(401, { error: 'Unauthorized' });

		const formData = Object.fromEntries(await request.formData());
		const form = await superValidate(formData, zod(createUserSchema));
		if (!form.valid) {
			console.error('Invalid data', form);
			return fail(400, { error: 'Invalid data', form });
		}

		const { name, password, email, org_id, role } = form.data;

		const { data: org } = await supabaseClient.from('orgs').select().eq('id', org_id).single();
		if (!org) return fail(400, { error: 'Invalid org' });

		const createUserRes = await supabaseClient.auth.admin.createUser({
			email,
			password,
			app_metadata: { name, role, org },
			email_confirm: true
		});
		if (createUserRes.error) {
			console.error('Failed to create user', createUserRes.error);
			return fail(400, { error: createUserRes.error.message });
		}

		const createProfileRes = await supabaseClient
			.from('profiles')
			.insert({ id: createUserRes.data.user.id, email, name, org_id, role });
		if (createProfileRes.error) {
			console.error('Failed to create user profile', createProfileRes.error);
			return fail(400, { error: createProfileRes.error.message });
		}

		return { success: 'User created succesfully', form };
	},

	delete: async ({ request }) => {
		const form_data = await request.formData();
		const id = form_data.get('id')?.toString();

		// TODO PREVENT DELETING USERS FROM OTHER ORGS

		if (id) {
			const res = await supabaseClient.auth.admin.deleteUser(id);
			if (res.error) {
				// console.log(res)
				return fail(400, { error: res.error.message });
			}
		} else {
			return fail(400, { error: 'Invalid data' });
		}

		return { success: 'User deleted succesfully' };
	}
};
