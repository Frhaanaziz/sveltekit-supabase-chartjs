<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { SearchIcon } from 'svelte-feather-icons';

	export let pathname: string;

	let search: string = '';
	let debouncedSearch: string;

	let debouncedSearchTimeout: NodeJS.Timeout;

	function debounceSearch(search: string) {
		clearTimeout(debouncedSearchTimeout);
		debouncedSearchTimeout = setTimeout(() => {
			debouncedSearch = search;
		}, 500);
	}

	function createQueryString(page: string) {
		const params = new URLSearchParams();
		params.append('search', page);
		return params.toString();
	}

	$: debounceSearch(search);
	$: if (debouncedSearch !== undefined) {
		goto(`${pathname}?${createQueryString(debouncedSearch)}`, {
			keepFocus: true,
			noScroll: true,
			invalidateAll: true,
			replaceState: true
		});
	}
</script>

<label class="input input-bordered flex items-center gap-2 rounded h-9 px-2">
	<SearchIcon class="w-4 h-4 opacity-70" />
	<!-- svelte-ignore a11y-autofocus -->
	<input placeholder="Search" class="focus-visible:outline-none" bind:value={search} />
</label>
