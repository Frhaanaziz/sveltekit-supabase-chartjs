<script lang="ts">
	/**
	 * The layout component for the dashboard route.
	 *
	 * @module routes/dashboard/+layout
	 * @param {Object} data - The data object containing user information.
	 * @throws {Error} Throws an error if no user data is provided to the layout.
	 */
	import DashboardLayout from '$components/dashboard/layout/DashboardLayout.svelte';
	import { onMount, setContext } from 'svelte';
	import { themeChange } from 'theme-change';

	export let data;

	const user = data.user;
	if (!user) throw new Error('No user data provided to layout');

	setContext('user', user);

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});
</script>

<DashboardLayout>
	<slot />
</DashboardLayout>
