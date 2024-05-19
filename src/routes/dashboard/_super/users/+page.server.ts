import { supabaseAdminClient as supabaseClient } from '$lib/server/supabase';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const { data: users, error: e } = await supabaseClient.auth.admin.listUsers();
	if (e) throw error(500, e.message);

	return { users };
}
