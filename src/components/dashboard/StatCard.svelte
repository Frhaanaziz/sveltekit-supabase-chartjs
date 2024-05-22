<script lang="ts">
	import { ArrowDownIcon, ArrowUpIcon } from 'svelte-feather-icons';

	export let type: string;
	export let amount: string;
	export let percentage: number;
	export let weekAmount: string;
</script>

<div class="bg-base-100 p-5 rounded shadow relative">
	<div class="bg-base-300 p-2 absolute top-4 right-4 rounded">
		<slot name="icon" />
	</div>
	<p class="text-sm text-zinc-500 font-medium">{type}</p>
	<div class="flex items-center gap-2 mt-3">
		<p class="text-2xl font-semibold">{amount}</p>
		{#if percentage > 0}
			<div class="bg-green-100/80 p-1.5 rounded-full flex items-center gap-1 text-green-600">
				<ArrowUpIcon class="h-3.5 w-3.5" />
				<span class="text-xs font-semibold"> {percentage}%</span>
			</div>
		{:else if percentage < 0}
			<div class="bg-red-100/80 p-1.5 rounded-full flex items-center gap-1 text-red-600">
				<ArrowDownIcon class="h-3.5 w-3.5" />
				<span class="text-xs font-semibold">{percentage}%</span>
			</div>
		{/if}
	</div>
	<p class="text-sm text-zinc-500 mt-2">
		{#if weekAmount.includes('+')}
			<span class="text-green-600 font-semibold">{weekAmount} </span>
		{:else}
			<span class="text-red-600 font-semibold">{weekAmount} </span>
		{/if}
		than past week
	</p>
</div>
