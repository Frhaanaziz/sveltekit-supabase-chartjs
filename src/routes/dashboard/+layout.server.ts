import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

/**
 * Loads the data for the dashboard layout on the server side.
 * @param {LayoutServerLoadParams} params - The parameters for the server load function.
 * @returns {Promise<LayoutServerLoadResult>} The result of the server load function.
 */
export const load: LayoutServerLoad = async ({ locals: { getUser } }) => {
	const user = await getUser();
	if (!user) redirect(308, '/auth/login');

	return { user };
};
