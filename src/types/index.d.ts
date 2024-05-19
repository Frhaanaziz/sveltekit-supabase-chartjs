import type * as Icons from 'svelte-feather-icons';
import { Tables } from './supabase';

export type Organization = Tables<'orgs'>;
export type Profiles = Tables<'profiles'>;
export type Navigation = {
	name: string;
	items: {
		title: string;
		href: string;
		// icon: keyof typeof Icons;
		Icon: (typeof Icons)[keyof typeof Icons];
	}[];
};
