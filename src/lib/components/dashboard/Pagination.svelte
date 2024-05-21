<script lang="ts">
	export let currentPage: number,
		isFirstPage: boolean,
		isLastPage: boolean,
		nextPage: number,
		previousPage: number,
		totalPages: number,
		pathname: string;

	function createQueryString(page: string) {
		const params = new URLSearchParams();
		params.append('page', page);
		return params.toString();
	}
</script>

<div class="flex items-center justify-between">
	<p class="font-semibold">Page {currentPage} of {totalPages}</p>

	<div class="join">
		<a
			class="join-item btn btn-sm btn-square"
			class:btn-disabled={isFirstPage}
			href={`${pathname}?${createQueryString(previousPage.toString())}`}>«</a
		>
		<button class="join-item btn btn-sm no-animation">Page {currentPage}</button>
		<a
			class="join-item btn btn-sm btn-square"
			class:btn-disabled={isLastPage}
			href={`${pathname}?${createQueryString(nextPage.toString())}`}>»</a
		>
	</div>
</div>
