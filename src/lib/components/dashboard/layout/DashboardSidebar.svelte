<script lang="ts">
	import type { Navigation } from '$types';
	import { SettingsIcon } from 'svelte-feather-icons';

	export let navigations: Navigation[] = [];
</script>

<div class="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 border-r">
	<div class="flex justify-center h-16 items-center">
		<p class="text-2xl font-semibold text-primary">Pipeline</p>
	</div>
	<nav class="flex flex-1 flex-col">
		<ul role="list" class="flex flex-1 flex-col gap-y-7">
			{#each navigations as { name, items }}
				{#if name === 'Main'}
					<li>
						<ul role="list" class="-mx-2 space-y-1">
							{#each items as { title, Icon, href }}
								<li>
									<a
										{href}
										class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-base-200 transition"
									>
										<Icon class="h-6 w-6 shrink-0" strokeWidth={1.5} />
										{title}
									</a>
								</li>
							{/each}
						</ul>
					</li>
				{:else}
					<li>
						<div class="text-xs font-semibold leading-6">{name}</div>
						<ul role="list" class="-mx-2 mt-2 space-y-1">
							{#each items as { title, Icon, href }}
								<li>
									<a
										{href}
										class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-base-200 transition"
									>
										<Icon class="h-6 w-6 shrink-0" strokeWidth={1.5} />
										{title}
									</a>
								</li>
							{/each}
						</ul>
					</li>
				{/if}
			{/each}

			<li class="mt-auto">
				<a
					href="/dashboard/settings"
					class="-mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold items-center hover:bg-base-200"
				>
					<SettingsIcon class="h-5 w-5 shrink-0" />
					Settings
				</a>
			</li>
		</ul>
	</nav>
</div>
