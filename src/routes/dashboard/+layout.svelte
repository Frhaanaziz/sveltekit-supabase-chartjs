<script lang="ts">
	import DashboardLayout from '$lib/components/dashboard/layout/DashboardLayout.svelte';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});
</script>

<DashboardLayout>
	<slot />
</DashboardLayout>
