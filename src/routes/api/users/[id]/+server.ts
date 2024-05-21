import { supabaseAdminClient } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';

export async function DELETE({ params }) {
	const { id } = params;

	const res = await supabaseAdminClient.auth.admin.deleteUser(id);
	if (res.error) {
		console.error('Error deleting user', res.error);
		return json({ error: 'Error deleting user' }, { status: 500 });
	}

	return json({ success: true }, { status: 200 });
}
