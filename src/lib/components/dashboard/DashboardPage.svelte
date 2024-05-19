<script lang="ts">
	export let pathname: string = '/';

	const breadcrumbs = pathname
		.split('/')
		.filter(Boolean)
		.map((name, i, a) => ({
			name,
			path: '/' + a.slice(0, i + 1).join('/')
		}));
</script>

<div class="flex flex-col h-full">
	{#if $$slots.title}
		<div class="flex items-center mb-6">
			<span class="text-xl flex-1 font-semibold">
				<slot name="title" />
			</span>

			<div class="text-sm breadcrumbs">
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
