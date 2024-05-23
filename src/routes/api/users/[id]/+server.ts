import { supabaseAdminClient } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';

export async function DELETE({ params }) {
	const { id } = params;

	const profileRes = await supabaseAdminClient.from('profiles').delete().eq('id', id);
	if (profileRes.error) {
		console.error('Error deleting profile', profileRes.error);
		return json({ error: 'Error deleting profile' }, { status: 500 });
	}

	const res = await supabaseAdminClient.auth.admin.deleteUser(id);
	if (res.error) {
		console.error('Error deleting user', res.error);
		return json({ error: 'Error deleting user' }, { status: 500 });
	}

	return json({ success: true }, { status: 200 });
}
