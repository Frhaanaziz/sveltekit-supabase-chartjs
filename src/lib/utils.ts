import type { AuthSession, Session, User } from '@supabase/supabase-js';
import type { Organization, ProfileWithOrg } from '$types';
import { supabaseAdminClient } from './server/supabase';

export const userColor = (role: string) => {
	if (role === 'admin') return 'stroke-warning';
	if (role === 'super') return 'stroke-accent';
	return '';
};

export const isAdmin = (role: string) => {
	if (['admin', 'super'].includes(role)) return true;
	else return false;
};

export const isSuper = (role: string) => {
	if (['super'].includes(role)) return true;
	else return false;
};

export const orgIdToName = (orgs: Organization[], id: Organization['id']) => {
	const result = orgs.find((e) => e.id === id);
	return result?.name;
};

export const myUser = (session: Session | null) => {
	return session?.user ?? null;
};

export const myOrg = (session: Session | null) => {
	return session?.user.app_metadata.org ?? null;
};

export const myRole = (session: Session | null) => {
	return session?.user.app_metadata.role ?? 'user';
};

export const imSuper = (user: User | null | undefined) => {
	if (['super'].includes(user?.app_metadata.role)) return true;
	else return false;
};

export const imAdmin = (user: User | null | undefined) => {
	if (['super', 'admin'].includes(user?.app_metadata.role)) return true;
	else return false;
};

export const roleSuper = (session: AuthSession) => {
	if (['super'].includes(session.user.app_metadata.role)) return true;
	else return false;
};

export const roleAdmin = (session: AuthSession) => {
	if (['super', 'admin'].includes(session.user.app_metadata.role)) return true;
	else return false;
};

export function calculatePagination({
	page,
	take,
	totalRow
}: {
	page: number;
	take: number;
	totalRow: number;
}) {
	const savePage = page < 1 ? 1 : page;
	const rowsPerPage = take;
	const totalPages = Math.ceil(totalRow / rowsPerPage) || 1;
	const isFirstPage = savePage === 1;
	const isLastPage = savePage >= totalPages;
	const previousPage = isFirstPage ? 1 : savePage - 1;
	const nextPage = isLastPage ? totalPages : savePage + 1;

	return {
		currentPage: page,
		isFirstPage,
		isLastPage,
		previousPage,
		nextPage,
		rowsPerPage,
		totalPages,
		totalRow,
		savePage
	};
}

export async function getProfilesPagination({
	page,
	take,
	search
}: {
	page: number;
	take: number;
	search: string;
}) {
	const { count: totalRow, error } = await supabaseAdminClient
		.from('profiles')
		.select('*', { count: 'exact', head: true });
	if (totalRow === null || error) {
		console.error('Failed to get count', error);
		return { error: 'Failed to get count' };
	}

	const { savePage, ...restUtils } = calculatePagination({ page, take, totalRow });

	const rangeFrom = (savePage - 1) * restUtils.rowsPerPage;
	const rangeTo = savePage * restUtils.rowsPerPage - 1;

	let profiles;
	if (search) {
		const profilesRes = await supabaseAdminClient
			.from('profiles')
			.select('*, org_id(*)')
			.range(rangeFrom, rangeTo)
			.textSearch('name', `'${search}'`);
		if (!profilesRes.data) return { error: 'Failed to get profiles' };
		profiles = profilesRes.data;
	} else {
		const profilesRes = await supabaseAdminClient
			.from('profiles')
			.select('*, org_id(*)')
			.range(rangeFrom, rangeTo);
		if (!profilesRes.data) return { error: 'Failed to get profiles' };
		profiles = profilesRes.data;
	}

	return {
		...restUtils,
		content: profiles as unknown as ProfileWithOrg[]
	};
}

export async function getOrgsPaginated({ page, take }: { page: number; take: number }) {
	const { count: totalRow, error } = await supabaseAdminClient
		.from('orgs')
		.select('*', { count: 'exact', head: true });
	if (totalRow === null || error) {
		console.error('Failed to get count', error);
		return { error: 'Failed to get count' };
	}

	const { savePage, ...restUtils } = calculatePagination({ page, take, totalRow });

	const rangeFrom = (savePage - 1) * restUtils.rowsPerPage;
	const rangeTo = savePage * restUtils.rowsPerPage - 1;

	const profilesRes = await supabaseAdminClient
		.from('orgs')
		.select('*, created_by(*)')
		.range(rangeFrom, rangeTo);
	if (!profilesRes.data) return { error: 'Failed to get profiles' };

	return {
		...restUtils,
		content: profilesRes.data
	};
}
