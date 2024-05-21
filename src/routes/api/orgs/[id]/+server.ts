import { supabaseAdminClient } from '$lib/server/supabase.js';
import { json } from '@sveltejs/kit';

export async function DELETE({ params }) {
	const { id } = params;

	const res = await supabaseAdminClient.from('orgs').delete().eq('id', id);
	if (res.error) {
		console.error('Error deleting organization', res.error);
		return json({ error: 'Error deleting organization' }, { status: 500 });
	}

	return json({ success: true }, { status: 200 });
}
