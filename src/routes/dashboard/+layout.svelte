<script lang="ts">
	import DashboardLayout from '$components/dashboard/layout/DashboardLayout.svelte';
	import { onMount, setContext } from 'svelte';
	import { themeChange } from 'theme-change';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

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
