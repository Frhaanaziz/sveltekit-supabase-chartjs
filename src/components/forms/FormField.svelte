<script lang="ts">
	export let error: string[] | undefined;
	export let label: string;
</script>

<label class="form-control">
	<div class="label">
		<span class="label-text">{label}</span>
	</div>

	<slot />

	{#if error}
		<div class="label">
			<span class="label-text-alt text-error">{error}</span>
		</div>
	{/if}
</label>
