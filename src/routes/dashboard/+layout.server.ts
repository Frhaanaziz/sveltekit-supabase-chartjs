import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getUser } }) => {
	const user = await getUser();
	if (!user) redirect(308, '/auth');

	return { user };
};
