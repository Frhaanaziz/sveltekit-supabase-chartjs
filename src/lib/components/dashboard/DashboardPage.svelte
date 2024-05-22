<script lang="ts">
	export let pathname: string = '/';

	const breadcrumbs = pathname
		.split('/')
		.filter(Boolean)
		.map((name, i, a) => ({
			name: name.length > 20 ? '...' : name,
			path: '/' + a.slice(0, i + 1).join('/')
		}));
</script>

<div class="flex flex-col h-full">
	{#if $$slots.title}
		<div class="flex justify-between items-center mb-6">
			<slot name="title" />

			<div class="text-sm breadcrumbs sm:block hidden">
				<ul>
					{#each breadcrumbs as { name, path }, i}
						<li>
							<a href={path} class="capitalize">{name}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

	<slot name="content" />
</div>
