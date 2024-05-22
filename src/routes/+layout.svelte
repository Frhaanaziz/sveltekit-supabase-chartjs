<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import '../app.postcss';
</script>

<svelte:head>
	<title>Pipeline</title>
</svelte:head>

<Toaster position={'top-center'} />
<slot />
