<script lang="ts">
	import { TrashIcon } from 'svelte-feather-icons';

	export let onContinue: () => void;

	let isModalOpen = false;
</script>

<slot />

<input type="checkbox" id="alert_modal" class="modal-toggle" bind:checked={isModalOpen} />
<div class="modal" role="dialog" class:modal-open={isModalOpen}>
	<div class="modal-box block">
		<form method="alert_modal">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>

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
				on:click|preventDefault={() => {
					onContinue();
					isModalOpen = false;
				}}>Continue</button
			>
		</div>
	</div>

	<label class="modal-backdrop" for="alert_modal">Close</label>
</div>
