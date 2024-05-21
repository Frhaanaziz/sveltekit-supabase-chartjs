<script lang="ts">
	import type { z } from 'zod';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import FormField from './FormField.svelte';
	import toast from 'svelte-french-toast';
	import { createEventDispatcher } from 'svelte';
	import { invalidate } from '$app/navigation';
	import type { createOrganizationSchema } from '$lib/validators/organization';
	import type { ActionData } from '../../../routes/dashboard/_super/orgs/$types';

	type CreateOrgType = z.infer<typeof createOrganizationSchema>;

	export let formAction: ActionData;
	export let superForm: SuperForm<CreateOrgType>;

	const { form, errors, enhance, reset, submitting } = superForm;

	const dispatch = createEventDispatcher();

	function handleSuccess() {
		reset();
		dispatch('closeModal');
		toast.success('Organization created successfully');
		invalidate('/dashboard/_super/orgs');
	}

	$: {
		if (formAction?.error) toast.error(formAction.error);
		if (formAction?.success) handleSuccess();
	}
</script>

<form method="POST" action="?/createOrg" use:enhance class="space-y-5">
	<FormField label="Name" error={$errors.name}>
		<input
			name="name"
			placeholder="Enter organization name"
			class="input input-bordered"
			bind:value={$form.name}
		/>
	</FormField>

	<div class="flex justify-end pt-2 gap-5">
		<button
			class="btn btn-error"
			class:btn-disabled={$submitting}
			on:click|preventDefault={() => dispatch('closeModal')}>Cancel</button
		>

		<button type="submit" class:btn-disabled={$submitting} class="btn"> Create</button>
	</div>
</form>
