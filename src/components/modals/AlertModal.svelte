<script lang="ts">
	export let onContinue: () => void;
	export let id: string | number;

	let isModalOpen = false;
</script>

<slot />

<input type="checkbox" id={`alert_modal-${id}`} class="modal-toggle" bind:checked={isModalOpen} />
<div class="modal" role="dialog" class:modal-open={isModalOpen}>
	<div class="modal-box block">
		<button
			class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
			on:click={() => (isModalOpen = false)}>✕</button
		>

		<span class="text-xl font-semibold">Are you absolutely sure?</span>
		<p class="text-wrap mt-5 mb-8">
			This action cannot be undone. This will permanently delete the item and remove the associated
			data from our servers.
		</p>

		<div class="flex items-center justify-end gap-5">
			<button class="btn btn-ghost" on:click|preventDefault={() => (isModalOpen = false)}
				>Cancel</button
			>
			<button
				class="btn btn-error"
				on:click={() => {
					onContinue?.();
					isModalOpen = false;
				}}>Continue</button
			>
		</div>
	</div>

	<label class="modal-backdrop" for={`alert_modal-${id}`}>Close</label>
</div>
