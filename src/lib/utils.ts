import type { AuthSession, Session, User } from '@supabase/supabase-js';
import type { Organization, ProfileWithOrg } from '$types';

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

export function formatDateWithTime(date: Date | string | number): string {
	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	}).format(new Date(date));
}

export function getRelativeTimeString(date: Date | number | string): string {
	// Allow dates or times to be passed
	const timeMs =
		typeof date === 'number'
			? date
			: typeof date === 'string'
				? new Date(date).getTime()
				: date.getTime();

	// Get the amount of seconds between the given date and now
	const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

	// Array reprsenting one minute, hour, day, week, month, etc in seconds
	const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

	// Array equivalent to the above but in the string representation of the units
	const units: Intl.RelativeTimeFormatUnit[] = [
		'second',
		'minute',
		'hour',
		'day',
		'week',
		'month',
		'year'
	];

	// Grab the ideal cutoff unit
	const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));

	// Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
	// is one day in seconds, so we can divide our seconds by this to get the # of days
	const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

	// Intl.RelativeTimeFormat do its magic
	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	return rtf.format(Math.floor(deltaSeconds / (divisor || 1)), units[unitIndex] ?? 'second');
}

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
