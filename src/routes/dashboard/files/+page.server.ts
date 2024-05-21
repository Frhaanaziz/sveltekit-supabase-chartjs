import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getUser } }) => {
	const user = await getUser();
	if (!user) return fail(401, { error: 'Unauthorized' });

	const res = await supabase.storage.from('TEST').list(user.app_metadata.org.name, {
		sortBy: { column: 'name', order: 'asc' }
	});

	if (res.error) fail(400, { error: 'something went wrong!' });

	const files = res.data?.filter((x) => x.id);
	return { files };
};
