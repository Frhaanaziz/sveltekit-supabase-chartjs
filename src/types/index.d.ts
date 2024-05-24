import type * as Icons from 'svelte-feather-icons';
import { Tables } from './supabase';

export type Organization = Tables<'orgs'>;
export type Profile = Tables<'profiles'>;
export type ProfileWithOrg = Profile & { org_id: Organization | null };
export type Navigation = {
	name: string;
	items: {
		title: string;
		href: string;
		// icon: keyof typeof Icons;
		Icon: (typeof Icons)[keyof typeof Icons];
	}[];
};

/**
 * Represents a set of pagination utilities.
 */
export type PaginatedUtils = {
	currentPage: number;
	isFirstPage: boolean;
	isLastPage: boolean;
	previousPage: number;
	nextPage: number;
	rowsPerPage: number;
	totalPages: number;
	totalRow: number;
};
export type PaginatedProfiles = PaginatedUtils & { content: ProfileWithOrg[] };
