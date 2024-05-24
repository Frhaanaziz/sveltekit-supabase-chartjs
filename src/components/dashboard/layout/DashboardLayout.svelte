<script lang="ts">
	import { HomeIcon, Share2Icon, UsersIcon } from 'svelte-feather-icons';
	import DashboardHeader from './DashboardHeader.svelte';
	import DashboardSidebar from './DashboardSidebar.svelte';
	import { getContext } from 'svelte';
	import type { User } from '@supabase/supabase-js';
	import { imAdmin, imSuper } from '$lib/utils';

	const user = getContext('user') as User;

	let navigations = [];
	const userNavigation = {
		name: 'Main',
		items: [
			{
				title: 'Dashboard',
				Icon: HomeIcon,
				href: '/dashboard'
			}
		]
	};
	const adminNavigation = {
		name: 'Admin User',
		items: [
			{
				title: 'Users',
				Icon: UsersIcon,
				href: '/dashboard/_admin/users'
			}
		]
	};
	const superNavigation = {
		name: 'Super User',
		items: [
			{
				title: 'Organizations',
				Icon: Share2Icon,
				href: '/dashboard/_super/orgs'
			}
		]
	};
	if (imSuper(user)) {
		navigations = [userNavigation, adminNavigation, superNavigation];
	} else if (imAdmin(user)) {
		navigations = [userNavigation, adminNavigation];
	} else {
		navigations = [userNavigation];
	}
</script>

<div class="drawer">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

	<div class="drawer-content">
		<!-- Static sidebar for desktop -->
		<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
			<DashboardSidebar {navigations} />
		</div>

		<!-- Content right -->
		<div class="lg:pl-72">
			<!-- Header -->
			<DashboardHeader />

			<main class="py-10 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] bg-base-200">
				<slot />

				<!-- {#if $navigating}
					<div class="flex h-full items-center justify-center min-h-[calc(100vh-4rem)]">
						<Jumper size="120" unit="px" duration="1s" color="#000" />
					</div>
				{:else}
					<slot />
				{/if} -->
			</main>
		</div>
	</div>

	<div class="drawer-side">
		<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay" />
		<div class="w-64 min-h-full bg-base-200">
			<DashboardSidebar {navigations} />
		</div>
	</div>
</div>
