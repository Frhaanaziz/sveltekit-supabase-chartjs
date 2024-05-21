import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (!session) throw redirect(308, '/auth');

	return { session };
};
