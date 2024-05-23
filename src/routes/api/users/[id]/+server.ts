import { supabaseAdminClient } from '$lib/server/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function DELETE({ params }) {
	const { id } = params;

	const res = await supabaseAdminClient.auth.admin.deleteUser(id);
	if (res.error) {
		console.error('Error deleting user', res.error);
		error(500, 'Error deleting user');
	}

	return json({ success: true }, { status: 200 });
}
