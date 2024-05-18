<script lang="ts">
	import { page } from '$app/stores';
	import { Toaster } from 'svelte-french-toast';
	import '../app.postcss';
</script>

<svelte:head>
	<title>{$page.url.hostname}</title>
	<link rel="icon" type="image/x-icon" href={`/${$page.url.hostname}/favicon.ico`} />
</svelte:head>

<slot />
<Toaster position={'top-center'} />
